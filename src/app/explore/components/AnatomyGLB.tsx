'use client';

import { useRef, useEffect, useMemo, useState, Suspense, Component, type ReactNode } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGenesisStore, type SystemId } from '../store';

/* ─── Mesh-name → body-system classification ────────────────────────── */

const SYSTEM_PATTERNS: [SystemId, RegExp][] = [
  ['muscular', /muscle|muscul|bicep|tricep|deltoid|pector|quadricep|hamstring|gastrocnem|soleus|tendon|ligament|fascia|glute|rectus|oblique|trapez|latissimus|rhomboid|serratus|teres|sartorius|gracilis|adduct|abduct|flexor|extensor|pronator|supinator|brachialis|plantaris|tibialis|peroneus|psoas|inteross/i],
  ['nervous', /nerve|nerv|neural|cerebr|brain|spinal.?cord|ganglion|plexus|sciatic|median|ulnar.?n|radial.?n|femoral.?n|tibial.?n|vagus|optic|trigeminal/i],
  ['circulatory', /artery|arter|vein|vena|vessel|aorta|capillar|coronary|carotid|jugular|subclavian|brachial.?a|radial.?a|ulnar.?a|iliac|femoral.?a|popliteal|saphenous|portal|pulmonary/i],
  ['lymphatic', /lymph|node/i],
];

function classifyMesh(name: string): SystemId | null {
  for (const [system, pattern] of SYSTEM_PATTERNS) {
    if (pattern.test(name)) return system;
  }
  return null;
}

/* ─── Material helpers ──────────────────────────────────────────────── */

function applyMeshState(mesh: THREE.Mesh, visible: boolean, xray: boolean) {
  mesh.visible = visible;
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  for (const mat of mats) {
    const m = mat as THREE.MeshStandardMaterial;
    if (!m.isMeshStandardMaterial) continue;
    if (xray && visible) {
      m.transparent = true;
      m.opacity = 0.25;
      m.wireframe = true;
    } else {
      m.transparent = false;
      m.opacity = 1.0;
      m.wireframe = false;
    }
  }
}

/* ─── Single model layer (suspends until GLB is loaded) ─────────────── */

function ModelLayer({
  path,
  defaultSystem,
  activeSystems,
  xrayMode,
  onBounds,
}: {
  path: string;
  defaultSystem: SystemId;
  activeSystems: Set<SystemId>;
  xrayMode: boolean;
  onBounds?: (box: THREE.Box3) => void;
}) {
  const { scene } = useGLTF(path);

  const { cloned, systemMap } = useMemo(() => {
    const c = scene.clone(true);
    const map = new Map<string, SystemId>();

    c.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      // Isolate materials so per-instance mutations don't leak
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map((m) => m.clone())
        : mesh.material.clone();

      const system = classifyMesh(child.name) ?? defaultSystem;
      map.set(child.uuid, system);
      console.log(`[GENESIS GLB] ${path.split('/').pop()} → "${child.name}" → ${system}`);
    });

    return { cloned: c, systemMap: map };
  }, [scene, path, defaultSystem]);

  // Report bounding box to parent (for skeleton alignment)
  useEffect(() => {
    if (onBounds) {
      onBounds(new THREE.Box3().setFromObject(cloned));
    }
  }, [cloned, onBounds]);

  // Toggle visibility + X-ray per active systems
  useEffect(() => {
    cloned.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const system = systemMap.get(child.uuid) ?? defaultSystem;
      applyMeshState(child as THREE.Mesh, activeSystems.has(system), xrayMode);
    });
  }, [cloned, systemMap, activeSystems, xrayMode, defaultSystem]);

  return <primitive object={cloned} />;
}

/* ─── 3D loading indicator ──────────────────────────────────────────── */

function ModelLoading() {
  return (
    <Html center>
      <div
        style={{
          color: '#00E5FF',
          fontFamily: 'monospace',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          textShadow: '0 0 10px #00E5FF',
        }}
      >
        Loading anatomy…
      </div>
    </Html>
  );
}

/* ─── Error boundary — falls back to nothing (procedural geometry takes over) */

export class GLBErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('[GENESIS] GLB model load failed, using procedural fallback:', error.message);
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

/* ─── Main component ────────────────────────────────────────────────── */

export default function AnatomyGLB() {
  const activeSystems = useGenesisStore((s) => s.activeSystems);
  const xrayMode = useGenesisStore((s) => s.xrayMode);
  const zoomLevel = useGenesisStore((s) => s.zoomLevel);
  const selectedOrgan = useGenesisStore((s) => s.selectedOrgan);
  const groupRef = useRef<THREE.Group>(null);
  const [transform, setTransform] = useState<{
    scale: number;
    pos: [number, number, number];
  } | null>(null);

  // Compute global transform from skeleton bounding box
  const handleSkeletonBounds = useMemo(
    () => (box: THREE.Box3) => {
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      // Target body: feet at y ≈ −0.65, head top at y ≈ 2.2 → height 2.85, midY 0.775
      const targetHeight = 2.85;
      const scale = targetHeight / (size.y || 1);
      const midY = 0.775;

      setTransform({
        scale,
        pos: [-center.x * scale, midY - center.y * scale, -center.z * scale],
      });

      console.log('[GENESIS] Model transform computed:', {
        scale: scale.toFixed(6),
        modelSize: `${size.x.toFixed(1)} × ${size.y.toFixed(1)} × ${size.z.toFixed(1)}`,
        modelCenter: `${center.x.toFixed(1)}, ${center.y.toFixed(1)}, ${center.z.toFixed(1)}`,
      });
    },
    [],
  );

  // Detail models load on zoom
  const showLimbs = zoomLevel !== 'body';
  const showSkull = selectedOrgan === 'brain' || selectedOrgan === 'eyes';
  const showHand = selectedOrgan === 'hand';

  return (
    <group
      ref={groupRef}
      scale={transform ? transform.scale : 1}
      position={transform ? transform.pos : [0, 0, 0]}
    >
      {/* ── Base skeleton (always loaded) ── */}
      <Suspense fallback={<ModelLoading />}>
        <ModelLayer
          path="/models/anatomy/skeleton/overview-skeleton.glb"
          defaultSystem="skeletal"
          activeSystems={activeSystems}
          xrayMode={xrayMode}
          onBounds={handleSkeletonBounds}
        />
      </Suspense>

      {/* ── Limb detail (muscles / nerves / vessels) ── */}
      {showLimbs && (
        <>
          <Suspense fallback={null}>
            <ModelLayer
              path="/models/anatomy/upper-limb/upper-limb.glb"
              defaultSystem="muscular"
              activeSystems={activeSystems}
              xrayMode={xrayMode}
            />
          </Suspense>
          <Suspense fallback={null}>
            <ModelLayer
              path="/models/anatomy/lower-limb/lower-limb.glb"
              defaultSystem="muscular"
              activeSystems={activeSystems}
              xrayMode={xrayMode}
            />
          </Suspense>
        </>
      )}

      {/* ── Skull detail ── */}
      {showSkull && (
        <Suspense fallback={null}>
          <ModelLayer
            path="/models/anatomy/skull/overview-colored-skull.glb"
            defaultSystem="skeletal"
            activeSystems={activeSystems}
            xrayMode={xrayMode}
          />
        </Suspense>
      )}

      {/* ── Hand detail ── */}
      {showHand && (
        <Suspense fallback={null}>
          <ModelLayer
            path="/models/anatomy/hand/hand.glb"
            defaultSystem="skeletal"
            activeSystems={activeSystems}
            xrayMode={xrayMode}
          />
        </Suspense>
      )}
    </group>
  );
}

/* ── Preload critical models ── */
useGLTF.preload('/models/anatomy/skeleton/overview-skeleton.glb');
// Background-preload limbs so they're ready when user zooms
useGLTF.preload('/models/anatomy/upper-limb/upper-limb.glb');
useGLTF.preload('/models/anatomy/lower-limb/lower-limb.glb');

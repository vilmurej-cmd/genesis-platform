'use client';

import { useRef, useEffect, useMemo, useState, Suspense, Component, type ReactNode } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGenesisStore, type SystemId } from '../store';

/* ─── Root-group-name → body-system classification ──────────────────── */
/* AnatomyTOOL models organize meshes under named root groups like       */
/* "Arm - muscles", "Bones", "Nerves", etc. We classify based on the    */
/* ROOT GROUP name, not individual mesh names.                           */

type MeshClass = SystemId | 'hide';

function classifyRootGroup(groupName: string): MeshClass {
  const n = groupName.toLowerCase();
  if (n.includes('overlay')) return 'hide';
  if (n.includes('muscle')) return 'muscular';
  if (n.includes('nerve')) return 'nervous';
  if (n.includes('arter')) return 'circulatory';
  if (n.includes('vein')) return 'circulatory';
  if (n.includes('fascia')) return 'muscular';
  if (n.includes('bone') || n.includes('cartilage')) return 'skeletal';
  if (n.includes('ligament') || n.includes('capsule')) return 'skeletal';
  if (n.includes('bursae') || n.includes('synovia')) return 'skeletal';
  return 'skeletal';
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

/* ─── Skeleton layer (always loaded — bones only) ───────────────────── */

function SkeletonLayer({
  activeSystems,
  xrayMode,
  onBounds,
}: {
  activeSystems: Set<SystemId>;
  xrayMode: boolean;
  onBounds: (box: THREE.Box3) => void;
}) {
  const { scene } = useGLTF('/models/anatomy/skeleton/overview-skeleton.glb');

  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map((m) => m.clone())
        : mesh.material.clone();
    });
    return c;
  }, [scene]);

  // Report bounds for global transform calculation
  useEffect(() => {
    onBounds(new THREE.Box3().setFromObject(cloned));
  }, [cloned, onBounds]);

  // All skeleton meshes are controlled by the "skeletal" toggle
  useEffect(() => {
    const visible = activeSystems.has('skeletal');
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        applyMeshState(child as THREE.Mesh, visible, xrayMode);
      }
    });
  }, [cloned, activeSystems, xrayMode]);

  return <primitive object={cloned} />;
}

/* ─── Regional detail layer (soft tissue — bones hidden) ────────────── */
/* Loads a regional model (upper-limb, lower-limb, hand) and hides all  */
/* bone/cartilage groups to avoid overlapping with the skeleton layer.   */
/* Only shows soft tissue: muscles, nerves, arteries, veins, fascia.    */

function RegionalLayer({
  path,
  activeSystems,
  xrayMode,
}: {
  path: string;
  activeSystems: Set<SystemId>;
  xrayMode: boolean;
}) {
  const { scene } = useGLTF(path);

  // Clone scene + classify each mesh by its root group ancestor
  const { cloned, meshClassMap } = useMemo(() => {
    const c = scene.clone(true);
    const map = new Map<string, MeshClass>();

    // Walk each root child group and classify all descendant meshes
    for (const rootChild of c.children) {
      const system = classifyRootGroup(rootChild.name);
      console.log(`[GENESIS GLB] ${path.split('/').pop()} root group: "${rootChild.name}" → ${system}`);

      rootChild.traverse((child) => {
        if (!(child as THREE.Mesh).isMesh) return;
        const mesh = child as THREE.Mesh;
        mesh.material = Array.isArray(mesh.material)
          ? mesh.material.map((m) => m.clone())
          : mesh.material.clone();
        map.set(child.uuid, system);
      });
    }

    return { cloned: c, meshClassMap: map };
  }, [scene, path]);

  // Toggle visibility: bones are ALWAYS hidden (skeleton layer has them),
  // soft tissue shown based on system toggles
  useEffect(() => {
    cloned.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const cls = meshClassMap.get(child.uuid) ?? 'skeletal';

      if (cls === 'hide' || cls === 'skeletal') {
        // Hide bones/cartilages/overlays — skeleton layer already shows them
        child.visible = false;
      } else {
        // Soft tissue — controlled by system toggle
        applyMeshState(child as THREE.Mesh, activeSystems.has(cls), xrayMode);
      }
    });
  }, [cloned, meshClassMap, activeSystems, xrayMode]);

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

/* ─── Error boundary — falls back to nothing (procedural takes over) ── */

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
  const groupRef = useRef<THREE.Group>(null);
  const [transform, setTransform] = useState<{
    scale: number;
    pos: [number, number, number];
  } | null>(null);

  // Compute global transform from skeleton bounding box.
  // All AnatomyTOOL models share the same coordinate space, so one
  // transform (derived from the skeleton) aligns everything.
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

      console.log('[GENESIS] Model transform:', {
        scale: scale.toFixed(4),
        modelSize: `${size.x.toFixed(3)} × ${size.y.toFixed(3)} × ${size.z.toFixed(3)}`,
      });
    },
    [],
  );

  // Regional soft-tissue detail loads when zoomed past body level
  const showRegionalDetail = zoomLevel !== 'body';

  return (
    <group
      ref={groupRef}
      scale={transform ? transform.scale : 1}
      position={transform ? transform.pos : [0, 0, 0]}
    >
      {/* ── Base skeleton (always loaded, clean bone geometry) ── */}
      <Suspense fallback={<ModelLoading />}>
        <SkeletonLayer
          activeSystems={activeSystems}
          xrayMode={xrayMode}
          onBounds={handleSkeletonBounds}
        />
      </Suspense>

      {/* ── Regional soft tissue (muscles, nerves, vessels) ──
          Only loads when zoomed past body level.
          Bone groups are hidden — the skeleton layer provides them.
          System toggles control which tissue types are visible. */}
      {showRegionalDetail && (
        <>
          <Suspense fallback={null}>
            <RegionalLayer
              path="/models/anatomy/upper-limb/upper-limb.glb"
              activeSystems={activeSystems}
              xrayMode={xrayMode}
            />
          </Suspense>
          <Suspense fallback={null}>
            <RegionalLayer
              path="/models/anatomy/lower-limb/lower-limb.glb"
              activeSystems={activeSystems}
              xrayMode={xrayMode}
            />
          </Suspense>
          <Suspense fallback={null}>
            <RegionalLayer
              path="/models/anatomy/hand/hand.glb"
              activeSystems={activeSystems}
              xrayMode={xrayMode}
            />
          </Suspense>
        </>
      )}
    </group>
  );
}

/* ── Preload skeleton immediately, limbs in background ── */
useGLTF.preload('/models/anatomy/skeleton/overview-skeleton.glb');
useGLTF.preload('/models/anatomy/upper-limb/upper-limb.glb');
useGLTF.preload('/models/anatomy/lower-limb/lower-limb.glb');
useGLTF.preload('/models/anatomy/hand/hand.glb');

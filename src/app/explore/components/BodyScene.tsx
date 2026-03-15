'use client';

import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useGenesisStore } from '../store';
import HumanBody from './HumanBody';
import CellScene from './micro/CellScene';

/* Ambient particle field — floating particles in the void */
function AmbientParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 200;
  const dummy = new THREE.Object3D();

  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
      );
      dummy.scale.setScalar(0.005 + Math.random() * 0.01);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      meshRef.current.getMatrixAt(i, dummy.matrix);
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
      dummy.position.y += Math.sin(t * 0.3 + i * 0.1) * 0.0002;
      dummy.position.x += Math.cos(t * 0.2 + i * 0.15) * 0.0001;
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={1} transparent opacity={0.3} />
    </instancedMesh>
  );
}

/* Camera controller that responds to zoom level changes */
function CameraController() {
  const controlsRef = useRef<any>(null);
  const zoomLevel = useGenesisStore((s) => s.zoomLevel);
  const autoRotate = useGenesisStore((s) => s.autoRotate);
  const selectedOrgan = useGenesisStore((s) => s.selectedOrgan);
  const { camera } = useThree();

  useEffect(() => {
    if (!controlsRef.current) return;

    const targets: Record<string, { pos: [number, number, number]; target: [number, number, number] }> = {
      body: { pos: [0, 1.2, 3.5], target: [0, 1.2, 0] },
      region: { pos: [0, 1.4, 2.0], target: [0, 1.4, 0] },
      organ: { pos: [0, 1.35, 1.2], target: [0, 1.35, 0] },
      tissue: { pos: [0, 1.35, 0.5], target: [0, 1.35, 0] },
      cell: { pos: [0, 0, 6], target: [0, 0, 0] },
    };

    // Override for specific organs
    if (selectedOrgan && zoomLevel === 'organ') {
      const organPositions: Record<string, { pos: [number, number, number]; target: [number, number, number] }> = {
        heart: { pos: [0.3, 1.35, 0.8], target: [0, 1.35, 0.05] },
        brain: { pos: [0.3, 2.1, 0.7], target: [0, 1.98, 0] },
        lungs: { pos: [0, 1.4, 1.0], target: [0, 1.38, 0.02] },
        liver: { pos: [0.4, 1.2, 0.8], target: [0.1, 1.2, 0.05] },
        kidneys: { pos: [0, 1.05, 0.8], target: [0, 1.04, -0.02] },
        stomach: { pos: [-0.2, 1.15, 0.8], target: [-0.06, 1.15, 0.04] },
        pancreas: { pos: [0.2, 1.08, 0.6], target: [0, 1.08, 0.02] },
      };
      const override = organPositions[selectedOrgan];
      if (override) {
        animateCamera(camera, controlsRef.current, override.pos, override.target);
        return;
      }
    }

    const t = targets[zoomLevel] || targets.body;
    animateCamera(camera, controlsRef.current, t.pos, t.target);
  }, [zoomLevel, selectedOrgan, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom
      enablePan
      enableRotate
      minDistance={0.3}
      maxDistance={12}
      autoRotate={autoRotate && zoomLevel === 'body'}
      autoRotateSpeed={0.5}
      target={[0, 1.2, 0]}
      maxPolarAngle={Math.PI * 0.85}
      minPolarAngle={Math.PI * 0.15}
    />
  );
}

function animateCamera(
  camera: THREE.Camera,
  controls: any,
  targetPos: [number, number, number],
  lookAt: [number, number, number],
) {
  const startPos = camera.position.clone();
  const startTarget = controls.target.clone();
  const endPos = new THREE.Vector3(...targetPos);
  const endTarget = new THREE.Vector3(...lookAt);
  let t = 0;

  const animate = () => {
    t += 0.03;
    if (t > 1) t = 1;
    const ease = 1 - Math.pow(1 - t, 3); // Ease-out cubic
    camera.position.lerpVectors(startPos, endPos, ease);
    controls.target.lerpVectors(startTarget, endTarget, ease);
    controls.update();
    if (t < 1) requestAnimationFrame(animate);
  };
  animate();
}

export default function BodyScene() {
  const zoomLevel = useGenesisStore((s) => s.zoomLevel);

  return (
    <Canvas
      camera={{ position: [0, 1.2, 3.5], fov: 50, near: 0.01, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: '#030712' }}
      dpr={[1, 2]}
    >
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} color="#FFFFFF" />
      <directionalLight position={[-3, 2, -3]} intensity={0.3} color="#00E5FF" />
      <pointLight position={[0, 1.35, 2]} intensity={0.4} color="#00E5FF" distance={5} />
      <pointLight position={[0, 1.35, -2]} intensity={0.2} color="#FF00E5" distance={5} />

      {/* Stars background */}
      <Stars radius={15} depth={30} count={3000} factor={2} saturation={0.5} fade speed={0.5} />

      {/* Ambient particles */}
      <AmbientParticles />

      {/* Camera controls */}
      <CameraController />

      <Suspense fallback={null}>
        {/* Main body */}
        <HumanBody />

        {/* Cell scene — only when zoom is at cell level */}
        <CellScene visible={zoomLevel === 'cell'} />
      </Suspense>
    </Canvas>
  );
}

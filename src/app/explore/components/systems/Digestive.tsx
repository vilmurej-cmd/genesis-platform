'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Digestive({ visible, isPaused, animationSpeed = 1, onSelectOrgan }: {
  visible: boolean;
  isPaused?: boolean;
  animationSpeed?: number;
  onSelectOrgan?: (organ: string) => void;
}) {
  const intestineRef = useRef<THREE.Mesh>(null);

  // Peristalsis wave — subtle vertex displacement would need a shader,
  // so we simulate with a gentle scale oscillation
  useFrame(({ clock }) => {
    if (isPaused || !intestineRef.current) return;
    const t = clock.getElapsedTime() * animationSpeed;
    const wave = Math.sin(t * 2) * 0.02;
    intestineRef.current.scale.set(1 + wave, 1 - wave * 0.5, 1 + wave);
  });

  // Esophagus path
  const esophagus = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 1.72, 0.0),
    new THREE.Vector3(0, 1.6, -0.01),
    new THREE.Vector3(0, 1.45, -0.02),
    new THREE.Vector3(-0.02, 1.3, -0.01),
    new THREE.Vector3(-0.04, 1.2, 0.02),
  ]), []);

  // Small intestine — winding path
  const smallIntestine = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.02, 1.05, 0.04),
    new THREE.Vector3(0.05, 1.0, 0.05),
    new THREE.Vector3(-0.05, 0.95, 0.05),
    new THREE.Vector3(0.06, 0.9, 0.04),
    new THREE.Vector3(-0.06, 0.85, 0.05),
    new THREE.Vector3(0.05, 0.8, 0.04),
    new THREE.Vector3(-0.05, 0.75, 0.05),
    new THREE.Vector3(0.04, 0.7, 0.04),
    new THREE.Vector3(-0.04, 0.65, 0.05),
    new THREE.Vector3(0.03, 0.6, 0.04),
  ]), []);

  // Large intestine — ascending, transverse, descending, sigmoid
  const largeIntestine = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.12, 0.55, 0.03),
    new THREE.Vector3(0.14, 0.7, 0.03),
    new THREE.Vector3(0.14, 0.85, 0.03),
    new THREE.Vector3(0.13, 1.0, 0.03),
    new THREE.Vector3(0.06, 1.05, 0.03),
    new THREE.Vector3(-0.06, 1.05, 0.03),
    new THREE.Vector3(-0.13, 1.0, 0.03),
    new THREE.Vector3(-0.14, 0.85, 0.03),
    new THREE.Vector3(-0.14, 0.7, 0.03),
    new THREE.Vector3(-0.12, 0.58, 0.03),
    new THREE.Vector3(-0.08, 0.52, 0.04),
    new THREE.Vector3(0, 0.48, 0.04),
  ]), []);

  return (
    <group visible={visible}>
      {/* Esophagus */}
      <mesh>
        <tubeGeometry args={[esophagus, 16, 0.012, 8, false]} />
        <meshStandardMaterial color="#8B6914" emissive="#66BB6A" emissiveIntensity={0.15} transparent opacity={0.6} />
      </mesh>

      {/* Stomach */}
      <mesh
        position={[-0.06, 1.15, 0.04]}
        rotation={[0, 0, 0.3]}
        onClick={(e) => { e.stopPropagation(); onSelectOrgan?.('stomach'); }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'default'; }}
      >
        <sphereGeometry args={[0.08, 12, 10]} />
        <meshStandardMaterial
          color="#8B6914"
          emissive="#66BB6A"
          emissiveIntensity={0.2}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Liver */}
      <mesh
        position={[0.1, 1.2, 0.05]}
        onClick={(e) => { e.stopPropagation(); onSelectOrgan?.('liver'); }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'default'; }}
      >
        <sphereGeometry args={[0.1, 12, 10]} />
        <meshStandardMaterial
          color="#8B4513"
          emissive="#66BB6A"
          emissiveIntensity={0.1}
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* Gallbladder */}
      <mesh position={[0.12, 1.12, 0.08]}>
        <sphereGeometry args={[0.025, 8, 6]} />
        <meshStandardMaterial color="#2E8B57" emissive="#66BB6A" emissiveIntensity={0.3} transparent opacity={0.5} />
      </mesh>

      {/* Pancreas */}
      <mesh
        position={[0, 1.08, 0.02]}
        rotation={[0, 0, 0.1]}
        onClick={(e) => { e.stopPropagation(); onSelectOrgan?.('pancreas'); }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'default'; }}
      >
        <capsuleGeometry args={[0.015, 0.12, 6, 8]} />
        <meshStandardMaterial color="#E8B94A" emissive="#FFCC00" emissiveIntensity={0.2} transparent opacity={0.5} />
      </mesh>

      {/* Small intestine */}
      <mesh ref={intestineRef}>
        <tubeGeometry args={[smallIntestine, 48, 0.015, 8, false]} />
        <meshStandardMaterial
          color="#CC9966"
          emissive="#66BB6A"
          emissiveIntensity={0.1}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Large intestine */}
      <mesh>
        <tubeGeometry args={[largeIntestine, 32, 0.025, 8, false]} />
        <meshStandardMaterial
          color="#8B7355"
          emissive="#66BB6A"
          emissiveIntensity={0.1}
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* Spleen */}
      <mesh position={[-0.16, 1.15, -0.02]}>
        <sphereGeometry args={[0.04, 10, 8]} />
        <meshStandardMaterial color="#8B2252" emissive="#CC3366" emissiveIntensity={0.2} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

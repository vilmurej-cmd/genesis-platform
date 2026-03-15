'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* Endocrine system — glands with subtle hormone particle emissions */
const GLANDS = [
  { name: 'Hypothalamus', pos: [0, 1.95, 0.0] as const, r: 0.015 },
  { name: 'Pituitary', pos: [0, 1.9, 0.02] as const, r: 0.012 },
  { name: 'Pineal', pos: [0, 1.98, -0.04] as const, r: 0.01 },
  { name: 'Thyroid', pos: [0, 1.72, 0.04] as const, r: 0.025 },
  { name: 'Parathyroid L', pos: [-0.02, 1.72, -0.02] as const, r: 0.008 },
  { name: 'Parathyroid R', pos: [0.02, 1.72, -0.02] as const, r: 0.008 },
  { name: 'Thymus', pos: [0, 1.55, 0.06] as const, r: 0.03 },
  { name: 'Left Adrenal', pos: [-0.1, 1.12, -0.01] as const, r: 0.015 },
  { name: 'Right Adrenal', pos: [0.1, 1.1, -0.01] as const, r: 0.015 },
  { name: 'Pancreas', pos: [0, 1.08, 0.02] as const, r: 0.02 },
  { name: 'Left Ovary/Testis', pos: [-0.08, 0.48, 0.04] as const, r: 0.018 },
  { name: 'Right Ovary/Testis', pos: [0.08, 0.48, 0.04] as const, r: 0.018 },
];

export default function Endocrine({ visible, isPaused }: { visible: boolean; isPaused?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  // Pulse glands gently
  useFrame(({ clock }) => {
    if (isPaused || !groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh) {
        const pulse = 1 + Math.sin(t * 2 + i * 0.7) * 0.08;
        child.scale.setScalar(pulse);
      }
    });
  });

  return (
    <group ref={groupRef} visible={visible}>
      {GLANDS.map((g) => (
        <mesh key={g.name} position={[g.pos[0], g.pos[1], g.pos[2]]}>
          <sphereGeometry args={[g.r, 10, 8]} />
          <meshStandardMaterial
            color="#AB47BC"
            emissive="#AB47BC"
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

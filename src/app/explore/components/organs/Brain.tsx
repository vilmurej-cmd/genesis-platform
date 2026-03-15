'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Brain({ visible, isPaused, onSelect }: {
  visible: boolean;
  isPaused?: boolean;
  onSelect?: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (isPaused || !pulseRef.current) return;
    const t = clock.getElapsedTime();
    const pulse = Math.sin(t * 3) * 0.3 + 0.7;
    (pulseRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse * 0.4;
  });

  return (
    <group
      ref={groupRef}
      visible={visible}
      position={[0, 1.98, 0]}
      onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'default'; }}
    >
      {/* Cerebrum — two hemispheres */}
      <mesh position={[-0.06, 0.02, 0]}>
        <sphereGeometry args={[0.11, 16, 14]} />
        <meshStandardMaterial color="#E8B4B8" emissive="#FFD700" emissiveIntensity={0.15} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0.06, 0.02, 0]}>
        <sphereGeometry args={[0.11, 16, 14]} />
        <meshStandardMaterial color="#E8B4B8" emissive="#FFD700" emissiveIntensity={0.15} transparent opacity={0.6} />
      </mesh>

      {/* Central fissure — gap between hemispheres */}
      <mesh position={[0, 0.05, 0]}>
        <planeGeometry args={[0.002, 0.18]} />
        <meshStandardMaterial color="#CC8888" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Cerebellum — lower back */}
      <mesh position={[0, -0.06, -0.06]}>
        <sphereGeometry args={[0.065, 12, 10]} />
        <meshStandardMaterial color="#D4A0A0" emissive="#FFD700" emissiveIntensity={0.1} transparent opacity={0.6} />
      </mesh>

      {/* Brain stem */}
      <mesh position={[0, -0.1, -0.02]}>
        <cylinderGeometry args={[0.02, 0.025, 0.06, 8]} />
        <meshStandardMaterial color="#CCAAAA" emissive="#FFD700" emissiveIntensity={0.1} transparent opacity={0.6} />
      </mesh>

      {/* Neural activity glow */}
      <mesh ref={pulseRef} position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.14, 12, 10]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={0.3}
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>

      {/* Sulci lines (brain wrinkle indicators) */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const r = 0.1;
        return (
          <mesh key={`sulcus-${i}`} position={[Math.cos(angle) * r, 0.04 + Math.sin(i) * 0.02, Math.sin(angle) * r * 0.5]}>
            <sphereGeometry args={[0.003, 4, 4]} />
            <meshStandardMaterial color="#C89090" />
          </mesh>
        );
      })}
    </group>
  );
}

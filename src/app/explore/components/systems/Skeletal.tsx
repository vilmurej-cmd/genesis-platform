'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* Skeletal system — bones as cylindrical/spherical meshes */
export default function Skeletal({ visible }: { visible: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  const bones = useMemo(() => [
    // Spine — 5 vertebral segments
    { pos: [0, 1.6, -0.05] as const, scale: [0.12, 0.25, 0.1] as const, rot: 0 },
    { pos: [0, 1.35, -0.05] as const, scale: [0.13, 0.25, 0.1] as const, rot: 0 },
    { pos: [0, 1.1, -0.05] as const, scale: [0.14, 0.25, 0.1] as const, rot: 0 },
    { pos: [0, 0.85, -0.05] as const, scale: [0.15, 0.25, 0.1] as const, rot: 0 },
    { pos: [0, 0.6, -0.05] as const, scale: [0.16, 0.2, 0.12] as const, rot: 0 },
    // Skull
    { pos: [0, 2.0, 0] as const, scale: [0.2, 0.22, 0.22] as const, rot: 0, type: 'sphere' as const },
    // Pelvis
    { pos: [0, 0.45, 0] as const, scale: [0.3, 0.15, 0.15] as const, rot: 0 },
    // Ribcage (simplified — 6 curved ribs per side)
    ...Array.from({ length: 6 }, (_, i) => ({
      pos: [-0.18, 1.55 - i * 0.07, 0] as const,
      scale: [0.25, 0.02, 0.12] as const,
      rot: 0.15,
    })),
    ...Array.from({ length: 6 }, (_, i) => ({
      pos: [0.18, 1.55 - i * 0.07, 0] as const,
      scale: [0.25, 0.02, 0.12] as const,
      rot: -0.15,
    })),
    // Clavicles
    { pos: [-0.2, 1.68, 0.02] as const, scale: [0.2, 0.025, 0.025] as const, rot: 0.1 },
    { pos: [0.2, 1.68, 0.02] as const, scale: [0.2, 0.025, 0.025] as const, rot: -0.1 },
    // Scapulae
    { pos: [-0.25, 1.55, -0.08] as const, scale: [0.1, 0.14, 0.02] as const, rot: 0 },
    { pos: [0.25, 1.55, -0.08] as const, scale: [0.1, 0.14, 0.02] as const, rot: 0 },
  ], []);

  // Limb bones — upper arm, forearm, thigh, shin (as cylinders)
  const limbs = useMemo(() => [
    // Left arm: humerus, radius/ulna
    { start: [-0.35, 1.6, 0], end: [-0.4, 1.2, 0.05], r: 0.022 },
    { start: [-0.4, 1.2, 0.05], end: [-0.42, 0.85, 0.1], r: 0.018 },
    // Right arm
    { start: [0.35, 1.6, 0], end: [0.4, 1.2, 0.05], r: 0.022 },
    { start: [0.4, 1.2, 0.05], end: [0.42, 0.85, 0.1], r: 0.018 },
    // Left leg: femur, tibia
    { start: [-0.15, 0.42, 0], end: [-0.18, -0.1, 0.02], r: 0.03 },
    { start: [-0.18, -0.1, 0.02], end: [-0.18, -0.65, 0.04], r: 0.024 },
    // Right leg
    { start: [0.15, 0.42, 0], end: [0.18, -0.1, 0.02], r: 0.03 },
    { start: [0.18, -0.1, 0.02], end: [0.18, -0.65, 0.04], r: 0.024 },
  ], []);

  return (
    <group ref={groupRef} visible={visible}>
      {/* Flat/rounded bones */}
      {bones.map((b, i) => (
        <mesh key={`bone-${i}`} position={[b.pos[0], b.pos[1], b.pos[2]]} rotation={[0, 0, b.rot]}>
          {(b as any).type === 'sphere' ? (
            <sphereGeometry args={[b.scale[0], 16, 12]} />
          ) : (
            <boxGeometry args={[b.scale[0], b.scale[1], b.scale[2]]} />
          )}
          <meshStandardMaterial
            color="#F5F5DC"
            emissive="#F5F5DC"
            emissiveIntensity={0.15}
            transparent
            opacity={0.85}
            roughness={0.6}
          />
        </mesh>
      ))}

      {/* Long bones as cylinders */}
      {limbs.map((l, i) => {
        const s = new THREE.Vector3(...l.start);
        const e = new THREE.Vector3(...l.end);
        const mid = s.clone().add(e).multiplyScalar(0.5);
        const dir = e.clone().sub(s);
        const len = dir.length();
        dir.normalize();
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        return (
          <mesh key={`limb-${i}`} position={mid} quaternion={quat}>
            <cylinderGeometry args={[l.r, l.r, len, 8]} />
            <meshStandardMaterial
              color="#F5F5DC"
              emissive="#F5F5DC"
              emissiveIntensity={0.15}
              transparent
              opacity={0.85}
              roughness={0.6}
            />
          </mesh>
        );
      })}

      {/* Joints — small spheres at connection points */}
      {[
        [-0.35, 1.62, 0], [0.35, 1.62, 0],    // Shoulders
        [-0.4, 1.2, 0.05], [0.4, 1.2, 0.05],   // Elbows
        [-0.15, 0.42, 0], [0.15, 0.42, 0],      // Hips
        [-0.18, -0.1, 0.02], [0.18, -0.1, 0.02], // Knees
        [-0.18, -0.65, 0.04], [0.18, -0.65, 0.04], // Ankles
      ].map((p, i) => (
        <mesh key={`joint-${i}`} position={p as [number, number, number]}>
          <sphereGeometry args={[0.03, 8, 6]} />
          <meshStandardMaterial color="#E8E0C8" emissive="#F5F5DC" emissiveIntensity={0.2} />
        </mesh>
      ))}
    </group>
  );
}

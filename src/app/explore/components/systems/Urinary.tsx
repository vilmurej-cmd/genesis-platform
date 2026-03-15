'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

export default function Urinary({ visible }: { visible: boolean }) {
  const ureterL = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.1, 1.05, -0.02),
    new THREE.Vector3(-0.1, 0.9, 0.0),
    new THREE.Vector3(-0.08, 0.7, 0.02),
    new THREE.Vector3(-0.04, 0.55, 0.04),
  ]), []);

  const ureterR = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.1, 1.05, -0.02),
    new THREE.Vector3(0.1, 0.9, 0.0),
    new THREE.Vector3(0.08, 0.7, 0.02),
    new THREE.Vector3(0.04, 0.55, 0.04),
  ]), []);

  const urethra = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.5, 0.06),
    new THREE.Vector3(0, 0.42, 0.08),
    new THREE.Vector3(0, 0.35, 0.1),
  ]), []);

  return (
    <group visible={visible}>
      {/* Kidneys */}
      <mesh position={[-0.1, 1.05, -0.02]}>
        <capsuleGeometry args={[0.03, 0.04, 8, 10]} />
        <meshStandardMaterial color="#FFEE58" emissive="#FFEE58" emissiveIntensity={0.25} transparent opacity={0.55} />
      </mesh>
      <mesh position={[0.1, 1.03, -0.02]}>
        <capsuleGeometry args={[0.03, 0.04, 8, 10]} />
        <meshStandardMaterial color="#FFEE58" emissive="#FFEE58" emissiveIntensity={0.25} transparent opacity={0.55} />
      </mesh>

      {/* Adrenal glands */}
      <mesh position={[-0.1, 1.12, -0.01]}>
        <sphereGeometry args={[0.015, 8, 6]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.4} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0.1, 1.1, -0.01]}>
        <sphereGeometry args={[0.015, 8, 6]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.4} transparent opacity={0.6} />
      </mesh>

      {/* Ureters */}
      {[ureterL, ureterR].map((c, i) => (
        <mesh key={`ureter-${i}`}>
          <tubeGeometry args={[c, 16, 0.005, 6, false]} />
          <meshStandardMaterial color="#FFEE58" emissive="#FFEE58" emissiveIntensity={0.15} transparent opacity={0.5} />
        </mesh>
      ))}

      {/* Bladder */}
      <mesh position={[0, 0.5, 0.06]}>
        <sphereGeometry args={[0.05, 12, 10]} />
        <meshStandardMaterial color="#FFEE58" emissive="#FFEE58" emissiveIntensity={0.2} transparent opacity={0.4} />
      </mesh>

      {/* Urethra */}
      <mesh>
        <tubeGeometry args={[urethra, 8, 0.004, 6, false]} />
        <meshStandardMaterial color="#FFEE58" emissive="#FFEE58" emissiveIntensity={0.15} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

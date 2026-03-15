'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

export default function Reproductive({ visible }: { visible: boolean }) {
  // Uterus/prostate area + connecting tubes
  const leftTube = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.02, 0.52, 0.05),
    new THREE.Vector3(-0.06, 0.54, 0.04),
    new THREE.Vector3(-0.08, 0.52, 0.04),
  ]), []);

  const rightTube = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.02, 0.52, 0.05),
    new THREE.Vector3(0.06, 0.54, 0.04),
    new THREE.Vector3(0.08, 0.52, 0.04),
  ]), []);

  return (
    <group visible={visible}>
      {/* Central reproductive organ */}
      <mesh position={[0, 0.5, 0.05]}>
        <sphereGeometry args={[0.035, 10, 8]} />
        <meshStandardMaterial color="#F48FB1" emissive="#F48FB1" emissiveIntensity={0.3} transparent opacity={0.5} />
      </mesh>

      {/* Fallopian tubes / vas deferens */}
      {[leftTube, rightTube].map((c, i) => (
        <mesh key={`tube-${i}`}>
          <tubeGeometry args={[c, 10, 0.004, 6, false]} />
          <meshStandardMaterial color="#F48FB1" emissive="#F48FB1" emissiveIntensity={0.2} transparent opacity={0.5} />
        </mesh>
      ))}

      {/* Gonads */}
      <mesh position={[-0.08, 0.52, 0.04]}>
        <sphereGeometry args={[0.018, 8, 6]} />
        <meshStandardMaterial color="#F48FB1" emissive="#F48FB1" emissiveIntensity={0.4} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0.08, 0.52, 0.04]}>
        <sphereGeometry args={[0.018, 8, 6]} />
        <meshStandardMaterial color="#F48FB1" emissive="#F48FB1" emissiveIntensity={0.4} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

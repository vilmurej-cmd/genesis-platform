'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

const LYMPH_NODES = [
  // Cervical
  { pos: [-0.08, 1.75, 0.03], r: 0.01 },
  { pos: [0.08, 1.75, 0.03], r: 0.01 },
  // Axillary
  { pos: [-0.28, 1.55, 0.02], r: 0.012 },
  { pos: [0.28, 1.55, 0.02], r: 0.012 },
  // Mediastinal
  { pos: [0, 1.45, 0.02], r: 0.01 },
  // Inguinal
  { pos: [-0.12, 0.42, 0.05], r: 0.012 },
  { pos: [0.12, 0.42, 0.05], r: 0.012 },
  // Popliteal
  { pos: [-0.18, -0.1, -0.03], r: 0.008 },
  { pos: [0.18, -0.1, -0.03], r: 0.008 },
  // Mesenteric
  { pos: [-0.04, 0.9, 0.04], r: 0.01 },
  { pos: [0.04, 0.85, 0.04], r: 0.01 },
];

export default function Lymphatic({ visible }: { visible: boolean }) {
  // Lymphatic vessels — thin green paths connecting nodes
  const vessels = useMemo(() => [
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.08, 1.75, 0.03),
      new THREE.Vector3(-0.15, 1.65, 0.03),
      new THREE.Vector3(-0.28, 1.55, 0.02),
    ]),
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.08, 1.75, 0.03),
      new THREE.Vector3(0.15, 1.65, 0.03),
      new THREE.Vector3(0.28, 1.55, 0.02),
    ]),
    // Thoracic duct — main lymphatic vessel
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.45, 0.02),
      new THREE.Vector3(-0.02, 1.3, 0.0),
      new THREE.Vector3(-0.03, 1.1, -0.01),
      new THREE.Vector3(-0.04, 0.9, 0.04),
      new THREE.Vector3(-0.06, 0.7, 0.04),
      new THREE.Vector3(-0.08, 0.55, 0.04),
      new THREE.Vector3(-0.12, 0.42, 0.05),
    ]),
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.45, 0.02),
      new THREE.Vector3(0.02, 1.3, 0.0),
      new THREE.Vector3(0.03, 1.1, -0.01),
      new THREE.Vector3(0.04, 0.85, 0.04),
      new THREE.Vector3(0.08, 0.65, 0.04),
      new THREE.Vector3(0.12, 0.42, 0.05),
    ]),
    // Legs
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.12, 0.42, 0.05),
      new THREE.Vector3(-0.15, 0.2, 0.03),
      new THREE.Vector3(-0.18, -0.1, -0.03),
    ]),
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.12, 0.42, 0.05),
      new THREE.Vector3(0.15, 0.2, 0.03),
      new THREE.Vector3(0.18, -0.1, -0.03),
    ]),
  ], []);

  return (
    <group visible={visible}>
      {/* Lymph nodes */}
      {LYMPH_NODES.map((n, i) => (
        <mesh key={`ln-${i}`} position={n.pos as [number, number, number]}>
          <sphereGeometry args={[n.r, 8, 6]} />
          <meshStandardMaterial color="#81C784" emissive="#81C784" emissiveIntensity={0.5} transparent opacity={0.6} />
        </mesh>
      ))}

      {/* Lymphatic vessels */}
      {vessels.map((c, i) => (
        <mesh key={`lv-${i}`}>
          <tubeGeometry args={[c, 16, 0.004, 6, false]} />
          <meshStandardMaterial color="#81C784" emissive="#81C784" emissiveIntensity={0.2} transparent opacity={0.4} />
        </mesh>
      ))}

      {/* Spleen (part of lymphatic system too) */}
      <mesh position={[-0.16, 1.15, -0.02]}>
        <sphereGeometry args={[0.04, 10, 8]} />
        <meshStandardMaterial color="#66BB6A" emissive="#81C784" emissiveIntensity={0.3} transparent opacity={0.5} />
      </mesh>

      {/* Tonsils */}
      <mesh position={[-0.04, 1.78, 0.04]}>
        <sphereGeometry args={[0.008, 6, 4]} />
        <meshStandardMaterial color="#81C784" emissive="#81C784" emissiveIntensity={0.4} transparent opacity={0.5} />
      </mesh>
      <mesh position={[0.04, 1.78, 0.04]}>
        <sphereGeometry args={[0.008, 6, 4]} />
        <meshStandardMaterial color="#81C784" emissive="#81C784" emissiveIntensity={0.4} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

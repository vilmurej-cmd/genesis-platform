'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Respiratory({ visible, isPaused, animationSpeed = 1 }: {
  visible: boolean;
  isPaused?: boolean;
  animationSpeed?: number;
}) {
  const leftLungRef = useRef<THREE.Mesh>(null);
  const rightLungRef = useRef<THREE.Mesh>(null);
  const diaphragmRef = useRef<THREE.Mesh>(null);

  // Breathing animation — 16 breaths per minute
  useFrame(({ clock }) => {
    if (isPaused) return;
    const t = clock.getElapsedTime() * animationSpeed;
    const breath = Math.sin(t * 1.675) * 0.5 + 0.5; // 0→1→0 at ~16/min

    if (leftLungRef.current) {
      leftLungRef.current.scale.set(1 + breath * 0.08, 1 + breath * 0.06, 1 + breath * 0.1);
    }
    if (rightLungRef.current) {
      rightLungRef.current.scale.set(1 + breath * 0.08, 1 + breath * 0.06, 1 + breath * 0.1);
    }
    if (diaphragmRef.current) {
      diaphragmRef.current.position.y = 1.08 - breath * 0.04;
    }
  });

  // Trachea + bronchi
  const tracheaPath = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 1.78, 0.02),
    new THREE.Vector3(0, 1.7, 0.02),
    new THREE.Vector3(0, 1.6, 0.02),
    new THREE.Vector3(0, 1.5, 0.02),
  ]), []);

  const leftBronchus = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 1.5, 0.02),
    new THREE.Vector3(-0.06, 1.47, 0.02),
    new THREE.Vector3(-0.12, 1.44, 0.01),
    new THREE.Vector3(-0.16, 1.42, 0.0),
  ]), []);

  const rightBronchus = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 1.5, 0.02),
    new THREE.Vector3(0.06, 1.47, 0.02),
    new THREE.Vector3(0.14, 1.44, 0.01),
    new THREE.Vector3(0.18, 1.42, 0.0),
  ]), []);

  // Sub-bronchi for detail
  const subBronchi = useMemo(() => [
    // Left lung branches
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.16, 1.42, 0.0),
      new THREE.Vector3(-0.18, 1.38, 0.02),
      new THREE.Vector3(-0.2, 1.32, 0.01),
    ]),
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.16, 1.42, 0.0),
      new THREE.Vector3(-0.2, 1.4, -0.01),
      new THREE.Vector3(-0.22, 1.35, -0.02),
    ]),
    // Right lung branches
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.18, 1.42, 0.0),
      new THREE.Vector3(0.2, 1.38, 0.02),
      new THREE.Vector3(0.23, 1.32, 0.01),
    ]),
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.18, 1.42, 0.0),
      new THREE.Vector3(0.22, 1.4, -0.01),
      new THREE.Vector3(0.25, 1.35, -0.02),
    ]),
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.18, 1.42, 0.0),
      new THREE.Vector3(0.21, 1.44, 0.01),
      new THREE.Vector3(0.24, 1.4, 0.0),
    ]),
  ], []);

  return (
    <group visible={visible}>
      {/* Trachea */}
      <mesh>
        <tubeGeometry args={[tracheaPath, 16, 0.015, 8, false]} />
        <meshStandardMaterial color="#87CEEB" emissive="#87CEEB" emissiveIntensity={0.3} transparent opacity={0.7} />
      </mesh>

      {/* Main bronchi */}
      {[leftBronchus, rightBronchus].map((curve, i) => (
        <mesh key={`bronchus-${i}`}>
          <tubeGeometry args={[curve, 12, 0.01, 8, false]} />
          <meshStandardMaterial color="#87CEEB" emissive="#87CEEB" emissiveIntensity={0.3} transparent opacity={0.6} />
        </mesh>
      ))}

      {/* Sub-bronchi */}
      {subBronchi.map((curve, i) => (
        <mesh key={`sub-${i}`}>
          <tubeGeometry args={[curve, 8, 0.005, 6, false]} />
          <meshStandardMaterial color="#87CEEB" emissive="#87CEEB" emissiveIntensity={0.2} transparent opacity={0.5} />
        </mesh>
      ))}

      {/* Left lung */}
      <mesh ref={leftLungRef} position={[-0.17, 1.38, 0.02]}>
        <sphereGeometry args={[0.12, 16, 12]} />
        <meshStandardMaterial
          color="#B3D9E8"
          emissive="#87CEEB"
          emissiveIntensity={0.15}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Right lung (slightly larger) */}
      <mesh ref={rightLungRef} position={[0.19, 1.38, 0.02]}>
        <sphereGeometry args={[0.14, 16, 12]} />
        <meshStandardMaterial
          color="#B3D9E8"
          emissive="#87CEEB"
          emissiveIntensity={0.15}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Diaphragm */}
      <mesh ref={diaphragmRef} position={[0, 1.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.28, 24]} />
        <meshStandardMaterial
          color="#CC8888"
          emissive="#CC6666"
          emissiveIntensity={0.1}
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

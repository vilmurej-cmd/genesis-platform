'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* Detailed heart — 4 chambers, beating animation, valve flaps */
export default function Heart({ visible, isPaused, animationSpeed = 1, onSelect }: {
  visible: boolean;
  isPaused?: boolean;
  animationSpeed?: number;
  onSelect?: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const leftAtriumRef = useRef<THREE.Mesh>(null);
  const rightAtriumRef = useRef<THREE.Mesh>(null);
  const leftVentricleRef = useRef<THREE.Mesh>(null);
  const rightVentricleRef = useRef<THREE.Mesh>(null);

  // Heartbeat at ~72 BPM = 1.2 Hz
  useFrame(({ clock }) => {
    if (isPaused || !groupRef.current) return;
    const t = clock.getElapsedTime() * animationSpeed;
    const beat = Math.pow(Math.sin(t * 3.77) * 0.5 + 0.5, 3); // Sharp pulse

    // Whole heart scale
    const s = 1 + beat * 0.08;
    groupRef.current.scale.set(s, s, s);

    // Glow pulse
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3 + beat * 0.7;
      (glowRef.current.material as THREE.MeshStandardMaterial).opacity = 0.15 + beat * 0.15;
    }

    // Chamber-specific contractions (atria then ventricles)
    const atrialPhase = Math.pow(Math.sin(t * 3.77 + 0.3) * 0.5 + 0.5, 3);
    const ventPhase = Math.pow(Math.sin(t * 3.77 - 0.2) * 0.5 + 0.5, 3);

    if (leftAtriumRef.current) {
      const as = 1 - atrialPhase * 0.1;
      leftAtriumRef.current.scale.set(as, as, as);
    }
    if (rightAtriumRef.current) {
      const as = 1 - atrialPhase * 0.1;
      rightAtriumRef.current.scale.set(as, as, as);
    }
    if (leftVentricleRef.current) {
      const vs = 1 - ventPhase * 0.12;
      leftVentricleRef.current.scale.set(vs, vs, vs);
    }
    if (rightVentricleRef.current) {
      const vs = 1 - ventPhase * 0.12;
      rightVentricleRef.current.scale.set(vs, vs, vs);
    }
  });

  // Coronary arteries
  const coronaryL = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.01, 0.03, 0.04),
    new THREE.Vector3(-0.04, 0.01, 0.04),
    new THREE.Vector3(-0.05, -0.02, 0.03),
    new THREE.Vector3(-0.04, -0.05, 0.02),
  ]), []);

  const coronaryR = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.01, 0.03, 0.04),
    new THREE.Vector3(0.04, 0.01, 0.03),
    new THREE.Vector3(0.05, -0.02, 0.02),
    new THREE.Vector3(0.03, -0.05, 0.01),
  ]), []);

  return (
    <group
      ref={groupRef}
      visible={visible}
      position={[0, 1.35, 0.05]}
      onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'default'; }}
    >
      {/* Heart outer shell */}
      <mesh>
        <sphereGeometry args={[0.065, 16, 12]} />
        <meshStandardMaterial
          color="#CC2222"
          emissive="#FF0000"
          emissiveIntensity={0.3}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Four chambers */}
      {/* Right atrium */}
      <mesh ref={rightAtriumRef} position={[0.025, 0.025, 0]}>
        <sphereGeometry args={[0.025, 10, 8]} />
        <meshStandardMaterial color="#AA3333" emissive="#FF4444" emissiveIntensity={0.4} transparent opacity={0.7} />
      </mesh>

      {/* Left atrium */}
      <mesh ref={leftAtriumRef} position={[-0.025, 0.025, 0]}>
        <sphereGeometry args={[0.025, 10, 8]} />
        <meshStandardMaterial color="#CC2222" emissive="#FF2222" emissiveIntensity={0.4} transparent opacity={0.7} />
      </mesh>

      {/* Right ventricle */}
      <mesh ref={rightVentricleRef} position={[0.025, -0.02, 0.01]}>
        <sphereGeometry args={[0.028, 10, 8]} />
        <meshStandardMaterial color="#992222" emissive="#FF3333" emissiveIntensity={0.3} transparent opacity={0.7} />
      </mesh>

      {/* Left ventricle (thicker wall) */}
      <mesh ref={leftVentricleRef} position={[-0.025, -0.02, 0.01]}>
        <sphereGeometry args={[0.03, 10, 8]} />
        <meshStandardMaterial color="#BB2222" emissive="#FF2222" emissiveIntensity={0.3} transparent opacity={0.7} />
      </mesh>

      {/* Septum — dividing wall */}
      <mesh position={[0, 0, 0.01]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.002, 0.08]} />
        <meshStandardMaterial color="#882222" transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>

      {/* Aorta exit */}
      <mesh position={[0.01, 0.06, 0.01]}>
        <cylinderGeometry args={[0.012, 0.015, 0.03, 8]} />
        <meshStandardMaterial color="#CC3333" emissive="#FF2222" emissiveIntensity={0.3} transparent opacity={0.6} />
      </mesh>

      {/* Pulmonary artery */}
      <mesh position={[-0.02, 0.06, 0.015]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.01, 0.012, 0.025, 8]} />
        <meshStandardMaterial color="#5555AA" emissive="#4444CC" emissiveIntensity={0.3} transparent opacity={0.6} />
      </mesh>

      {/* Coronary arteries */}
      {[coronaryL, coronaryR].map((c, i) => (
        <mesh key={`coronary-${i}`}>
          <tubeGeometry args={[c, 12, 0.003, 6, false]} />
          <meshStandardMaterial color="#FF6666" emissive="#FF4444" emissiveIntensity={0.5} transparent opacity={0.7} />
        </mesh>
      ))}

      {/* Glow sphere — pulsing light */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.09, 16, 12]} />
        <meshStandardMaterial
          color="#FF0000"
          emissive="#FF0000"
          emissiveIntensity={0.3}
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

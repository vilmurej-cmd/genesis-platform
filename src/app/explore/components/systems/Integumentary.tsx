'use client';

import { useRef } from 'react';
import * as THREE from 'three';

/* Integumentary — semi-transparent skin silhouette */
export default function Integumentary({ visible, xrayMode }: { visible: boolean; xrayMode?: boolean }) {
  const skinRef = useRef<THREE.Group>(null);

  const opacity = xrayMode ? 0.05 : 0.18;
  const wireframe = xrayMode;

  return (
    <group ref={skinRef} visible={visible}>
      {/* Head */}
      <mesh position={[0, 1.95, 0.02]}>
        <sphereGeometry args={[0.2, 24, 18]} />
        <meshStandardMaterial
          color="#FFCCBC"
          emissive="#FFCCBC"
          emissiveIntensity={0.05}
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
          wireframe={wireframe}
          depthWrite={false}
        />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.73, 0.01]}>
        <cylinderGeometry args={[0.06, 0.08, 0.12, 16]} />
        <meshStandardMaterial
          color="#FFCCBC"
          emissive="#FFCCBC"
          emissiveIntensity={0.05}
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
          wireframe={wireframe}
          depthWrite={false}
        />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1.3, 0.0]}>
        <capsuleGeometry args={[0.2, 0.5, 16, 20]} />
        <meshStandardMaterial
          color="#FFCCBC"
          emissive="#FFCCBC"
          emissiveIntensity={0.05}
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
          wireframe={wireframe}
          depthWrite={false}
        />
      </mesh>

      {/* Pelvis/Hips */}
      <mesh position={[0, 0.5, 0.0]}>
        <sphereGeometry args={[0.2, 16, 12]} />
        <meshStandardMaterial
          color="#FFCCBC"
          emissive="#FFCCBC"
          emissiveIntensity={0.05}
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
          wireframe={wireframe}
          depthWrite={false}
        />
      </mesh>

      {/* Left arm */}
      {[[[-0.38, 1.45, 0.03], 0.045, 0.35] as const, [[-0.41, 1.0, 0.08], 0.035, 0.3] as const].map(([pos, r, h], i) => (
        <mesh key={`la-${i}`} position={pos as unknown as [number, number, number]}>
          <capsuleGeometry args={[r, h, 8, 12]} />
          <meshStandardMaterial color="#FFCCBC" emissive="#FFCCBC" emissiveIntensity={0.05} transparent opacity={opacity} side={THREE.DoubleSide} wireframe={wireframe} depthWrite={false} />
        </mesh>
      ))}

      {/* Right arm */}
      {[[[0.38, 1.45, 0.03], 0.045, 0.35] as const, [[0.41, 1.0, 0.08], 0.035, 0.3] as const].map(([pos, r, h], i) => (
        <mesh key={`ra-${i}`} position={pos as unknown as [number, number, number]}>
          <capsuleGeometry args={[r, h, 8, 12]} />
          <meshStandardMaterial color="#FFCCBC" emissive="#FFCCBC" emissiveIntensity={0.05} transparent opacity={opacity} side={THREE.DoubleSide} wireframe={wireframe} depthWrite={false} />
        </mesh>
      ))}

      {/* Left leg */}
      {[[[-0.16, 0.15, 0.01], 0.06, 0.45] as const, [[-0.18, -0.4, 0.02], 0.045, 0.4] as const].map(([pos, r, h], i) => (
        <mesh key={`ll-${i}`} position={pos as unknown as [number, number, number]}>
          <capsuleGeometry args={[r, h, 8, 12]} />
          <meshStandardMaterial color="#FFCCBC" emissive="#FFCCBC" emissiveIntensity={0.05} transparent opacity={opacity} side={THREE.DoubleSide} wireframe={wireframe} depthWrite={false} />
        </mesh>
      ))}

      {/* Right leg */}
      {[[[0.16, 0.15, 0.01], 0.06, 0.45] as const, [[0.18, -0.4, 0.02], 0.045, 0.4] as const].map(([pos, r, h], i) => (
        <mesh key={`rl-${i}`} position={pos as unknown as [number, number, number]}>
          <capsuleGeometry args={[r, h, 8, 12]} />
          <meshStandardMaterial color="#FFCCBC" emissive="#FFCCBC" emissiveIntensity={0.05} transparent opacity={opacity} side={THREE.DoubleSide} wireframe={wireframe} depthWrite={false} />
        </mesh>
      ))}

      {/* Hands — simple spheres */}
      <mesh position={[-0.42, 0.82, 0.1]}>
        <sphereGeometry args={[0.03, 8, 6]} />
        <meshStandardMaterial color="#FFCCBC" transparent opacity={opacity} wireframe={wireframe} depthWrite={false} />
      </mesh>
      <mesh position={[0.42, 0.82, 0.1]}>
        <sphereGeometry args={[0.03, 8, 6]} />
        <meshStandardMaterial color="#FFCCBC" transparent opacity={opacity} wireframe={wireframe} depthWrite={false} />
      </mesh>

      {/* Feet */}
      <mesh position={[-0.18, -0.67, 0.06]} rotation={[0.4, 0, 0]}>
        <capsuleGeometry args={[0.025, 0.06, 6, 8]} />
        <meshStandardMaterial color="#FFCCBC" transparent opacity={opacity} wireframe={wireframe} depthWrite={false} />
      </mesh>
      <mesh position={[0.18, -0.67, 0.06]} rotation={[0.4, 0, 0]}>
        <capsuleGeometry args={[0.025, 0.06, 6, 8]} />
        <meshStandardMaterial color="#FFCCBC" transparent opacity={opacity} wireframe={wireframe} depthWrite={false} />
      </mesh>
    </group>
  );
}

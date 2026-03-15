'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MuscleGroup {
  name: string;
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
  shape: 'capsule' | 'box' | 'sphere';
}

export default function Muscular({ visible }: { visible: boolean }) {
  const [contracted, setContracted] = useState<string | null>(null);

  const muscles = useMemo<MuscleGroup[]>(() => [
    // Chest — pectorals
    { name: 'Left Pectoral', position: [-0.12, 1.52, 0.06], scale: [0.1, 0.08, 0.04], shape: 'box' },
    { name: 'Right Pectoral', position: [0.12, 1.52, 0.06], scale: [0.1, 0.08, 0.04], shape: 'box' },

    // Shoulders — deltoids
    { name: 'Left Deltoid', position: [-0.3, 1.62, 0.02], scale: [0.015, 0.06, 0.015], shape: 'capsule' },
    { name: 'Right Deltoid', position: [0.3, 1.62, 0.02], scale: [0.015, 0.06, 0.015], shape: 'capsule' },

    // Arms — biceps
    { name: 'Left Bicep', position: [-0.36, 1.45, 0.04], scale: [0.012, 0.08, 0.012], shape: 'capsule' },
    { name: 'Right Bicep', position: [0.36, 1.45, 0.04], scale: [0.012, 0.08, 0.012], shape: 'capsule' },

    // Arms — triceps
    { name: 'Left Tricep', position: [-0.37, 1.42, -0.02], scale: [0.012, 0.07, 0.012], shape: 'capsule' },
    { name: 'Right Tricep', position: [0.37, 1.42, -0.02], scale: [0.012, 0.07, 0.012], shape: 'capsule' },

    // Forearms
    { name: 'Left Forearm', position: [-0.4, 1.1, 0.06], scale: [0.01, 0.08, 0.01], shape: 'capsule' },
    { name: 'Right Forearm', position: [0.4, 1.1, 0.06], scale: [0.01, 0.08, 0.01], shape: 'capsule' },

    // Abs — rectus abdominis
    { name: 'Abs', position: [0, 1.1, 0.06], scale: [0.1, 0.2, 0.03], shape: 'box' },

    // Obliques
    { name: 'Left Oblique', position: [-0.13, 1.05, 0.04], scale: [0.05, 0.15, 0.03], rotation: [0, 0, 0.15], shape: 'box' },
    { name: 'Right Oblique', position: [0.13, 1.05, 0.04], scale: [0.05, 0.15, 0.03], rotation: [0, 0, -0.15], shape: 'box' },

    // Back — trapezius
    { name: 'Trapezius', position: [0, 1.6, -0.08], scale: [0.18, 0.12, 0.03], shape: 'box' },

    // Lats
    { name: 'Left Lat', position: [-0.15, 1.3, -0.06], scale: [0.08, 0.15, 0.03], shape: 'box' },
    { name: 'Right Lat', position: [0.15, 1.3, -0.06], scale: [0.08, 0.15, 0.03], shape: 'box' },

    // Glutes
    { name: 'Left Glute', position: [-0.1, 0.48, -0.06], scale: [0.08, 0.06, 0.05], shape: 'box' },
    { name: 'Right Glute', position: [0.1, 0.48, -0.06], scale: [0.08, 0.06, 0.05], shape: 'box' },

    // Thighs — quadriceps
    { name: 'Left Quad', position: [-0.16, 0.2, 0.04], scale: [0.02, 0.12, 0.02], shape: 'capsule' },
    { name: 'Right Quad', position: [0.16, 0.2, 0.04], scale: [0.02, 0.12, 0.02], shape: 'capsule' },

    // Hamstrings
    { name: 'Left Hamstring', position: [-0.16, 0.2, -0.03], scale: [0.018, 0.12, 0.018], shape: 'capsule' },
    { name: 'Right Hamstring', position: [0.16, 0.2, -0.03], scale: [0.018, 0.12, 0.018], shape: 'capsule' },

    // Calves
    { name: 'Left Calf', position: [-0.18, -0.3, -0.01], scale: [0.015, 0.1, 0.015], shape: 'capsule' },
    { name: 'Right Calf', position: [0.18, -0.3, -0.01], scale: [0.015, 0.1, 0.015], shape: 'capsule' },
  ], []);

  return (
    <group visible={visible}>
      {muscles.map((m) => {
        const isContracted = contracted === m.name;
        const scale = isContracted
          ? [m.scale[0] * 1.2, m.scale[1] * 0.9, m.scale[2] * 1.3] as [number, number, number]
          : m.scale;
        const color = isContracted ? '#FF2222' : '#CC3333';
        const emissiveI = isContracted ? 0.6 : 0.15;

        return (
          <mesh
            key={m.name}
            position={m.position}
            scale={scale}
            rotation={m.rotation || [0, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              setContracted(isContracted ? null : m.name);
              // Auto-release after 500ms
              if (!isContracted) setTimeout(() => setContracted(null), 500);
            }}
            onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'default'; }}
          >
            {m.shape === 'capsule' ? (
              <capsuleGeometry args={[1, 4, 8, 12]} />
            ) : m.shape === 'sphere' ? (
              <sphereGeometry args={[1, 10, 8]} />
            ) : (
              <boxGeometry args={[1, 1, 1]} />
            )}
            <meshStandardMaterial
              color={color}
              emissive="#CC3333"
              emissiveIntensity={emissiveI}
              transparent
              opacity={0.55}
              roughness={0.7}
            />
          </mesh>
        );
      })}
    </group>
  );
}

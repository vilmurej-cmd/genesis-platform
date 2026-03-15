'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGenesisStore, type DiseaseOverlay as DiseaseOverlayType } from '../../store';

/* Maps organ names to approximate 3D positions on the body */
const ORGAN_POSITIONS: Record<string, [number, number, number]> = {
  brain: [0, 1.98, 0],
  heart: [0, 1.35, 0.05],
  lungs: [0, 1.4, 0.02],
  'left lung': [-0.17, 1.38, 0.02],
  'right lung': [0.19, 1.38, 0.02],
  liver: [0.1, 1.2, 0.05],
  stomach: [-0.06, 1.15, 0.04],
  pancreas: [0, 1.08, 0.02],
  kidneys: [0, 1.04, -0.02],
  'left kidney': [-0.1, 1.05, -0.02],
  'right kidney': [0.1, 1.03, -0.02],
  intestines: [0, 0.85, 0.04],
  bladder: [0, 0.5, 0.06],
  spleen: [-0.16, 1.15, -0.02],
  thyroid: [0, 1.72, 0.04],
  spine: [0, 1.1, -0.05],
  eyes: [0, 2.0, 0.1],
  skin: [0, 1.2, 0.15],
  bones: [0, 1.2, 0],
  blood: [0, 1.35, 0],
  nerves: [0, 1.5, -0.04],
};

/* Disease particle effects using instanced mesh */
function DiseaseParticles({ position, type, stage, count = 60 }: {
  position: [number, number, number];
  type: DiseaseOverlayType['type'];
  stage: number;
  count?: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const stageMultiplier = 0.5 + stage * 0.5;

  const particles = useMemo(() =>
    Array.from({ length: count }, () => ({
      offset: [
        (Math.random() - 0.5) * 0.15 * stageMultiplier,
        (Math.random() - 0.5) * 0.15 * stageMultiplier,
        (Math.random() - 0.5) * 0.1 * stageMultiplier,
      ] as [number, number, number],
      speed: 0.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      scale: 0.003 + Math.random() * 0.005 * stageMultiplier,
    })),
  [count, stageMultiplier]);

  const color = useMemo(() => {
    switch (type) {
      case 'cancer': return '#440044';
      case 'infection': return '#66CC00';
      case 'inflammation': return '#FF4400';
      case 'circulatory': return '#880000';
      case 'neurological': return '#FFAA00';
      case 'metabolic': return '#FFD700';
      case 'respiratory': return '#444444';
      case 'autoimmune': return '#FF00FF';
      default: return '#FF4444';
    }
  }, [type]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      let x = position[0] + p.offset[0];
      let y = position[1] + p.offset[1];
      let z = position[2] + p.offset[2];

      if (type === 'infection') {
        // Spreading outward
        const spread = Math.sin(t * p.speed + p.phase) * 0.02 * stageMultiplier;
        x += spread;
        y += spread * 0.5;
        z += spread;
      } else if (type === 'cancer') {
        // Irregular clustering
        const cluster = Math.sin(t * 0.5 + p.phase) * 0.01;
        x += cluster;
        y += cluster;
      } else if (type === 'metabolic') {
        // Drifting particles (glucose in blood)
        y += Math.sin(t * p.speed + p.phase) * 0.03;
        x += Math.cos(t * p.speed * 0.7 + p.phase) * 0.01;
      } else {
        // Generic pulsing
        const pulse = Math.sin(t * p.speed + p.phase) * 0.01;
        x += pulse;
        y += pulse;
      }

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 4]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1}
        transparent
        opacity={0.7}
      />
    </instancedMesh>
  );
}

/* Organ highlight glow */
function OrganGlow({ position, stage }: { position: [number, number, number]; stage: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const intensity = 0.3 + stage * 0.3;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const pulse = Math.sin(clock.getElapsedTime() * 3) * 0.3 + 0.7;
    (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity * pulse;
    (ref.current.material as THREE.MeshStandardMaterial).opacity = (0.1 + stage * 0.08) * pulse;
    ref.current.scale.setScalar(0.08 + stage * 0.03);
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[1, 12, 8]} />
      <meshStandardMaterial
        color="#FF4400"
        emissive="#FF2200"
        emissiveIntensity={intensity}
        transparent
        opacity={0.15}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function DiseaseOverlayComponent() {
  const disease = useGenesisStore((s) => s.activeDisease);
  const stage = useGenesisStore((s) => s.diseaseStage);

  if (!disease) return null;

  const affectedPositions = disease.affectedOrgans
    .map((o) => {
      const key = o.toLowerCase();
      const pos = ORGAN_POSITIONS[key] ||
        Object.entries(ORGAN_POSITIONS).find(([k]) => key.includes(k) || k.includes(key))?.[1];
      return pos ? { organ: o, position: pos as [number, number, number] } : null;
    })
    .filter(Boolean) as { organ: string; position: [number, number, number] }[];

  return (
    <group>
      {affectedPositions.map(({ organ, position }) => (
        <group key={organ}>
          <OrganGlow position={position} stage={stage} />
          <DiseaseParticles
            position={position}
            type={disease.type}
            stage={stage}
            count={30 + stage * 20}
          />
        </group>
      ))}
    </group>
  );
}

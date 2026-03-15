'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGenesisStore } from '../../store';

/* Medication particle — enters at mouth, travels to target organ */
function MedicationParticle({ targetPos, onComplete }: {
  targetPos: [number, number, number];
  onComplete: () => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.InstancedMesh>(null);
  const [t, setT] = useState(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const path = useMemo(() => {
    const mouthPos = new THREE.Vector3(0, 1.78, 0.1);
    const esophagus = new THREE.Vector3(0, 1.6, 0.04);
    const stomach = new THREE.Vector3(-0.04, 1.2, 0.04);
    const target = new THREE.Vector3(...targetPos);

    return [mouthPos, esophagus, stomach, target];
  }, [targetPos]);

  const trailPositions = useRef<THREE.Vector3[]>([]);

  useFrame((_, delta) => {
    setT(prev => {
      const next = prev + delta * 0.3;
      if (next >= 1) {
        onComplete();
        return 1;
      }

      if (ref.current) {
        const idx = next * (path.length - 1);
        const a = Math.floor(idx);
        const b = Math.min(a + 1, path.length - 1);
        const frac = idx - a;
        const pos = path[a].clone().lerp(path[b], frac);
        ref.current.position.copy(pos);

        // Trail
        trailPositions.current.push(pos.clone());
        if (trailPositions.current.length > 20) trailPositions.current.shift();

        if (trailRef.current) {
          trailPositions.current.forEach((tp, i) => {
            dummy.position.copy(tp);
            dummy.scale.setScalar(0.003 * (i / trailPositions.current.length));
            dummy.updateMatrix();
            trailRef.current!.setMatrixAt(i, dummy.matrix);
          });
          trailRef.current.instanceMatrix.needsUpdate = true;
        }
      }
      return next;
    });
  });

  if (t >= 1) return null;

  return (
    <group>
      {/* The pill */}
      <mesh ref={ref}>
        <capsuleGeometry args={[0.008, 0.015, 6, 8]} />
        <meshStandardMaterial color="#00FF94" emissive="#00FF94" emissiveIntensity={1.5} />
      </mesh>

      {/* Trail */}
      <instancedMesh ref={trailRef} args={[undefined, undefined, 20]}>
        <sphereGeometry args={[1, 4, 4]} />
        <meshStandardMaterial color="#00FF94" emissive="#00FF94" emissiveIntensity={1} transparent opacity={0.4} />
      </instancedMesh>
    </group>
  );
}

/* Healing particles — burst at target when medication arrives */
function HealingBurst({ position, active }: { position: [number, number, number]; active: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const [startTime, setStartTime] = useState(0);
  const count = 40;

  const particles = useMemo(() =>
    Array.from({ length: count }, () => ({
      dir: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
      ).normalize(),
      speed: 0.5 + Math.random() * 1,
      scale: 0.003 + Math.random() * 0.005,
    })),
  []);

  useEffect(() => {
    if (active) setStartTime(performance.now());
  }, [active]);

  useFrame(() => {
    if (!meshRef.current || !active) return;
    const elapsed = (performance.now() - startTime) / 1000;
    if (elapsed > 2) return;

    particles.forEach((p, i) => {
      const dist = elapsed * p.speed * 0.1;
      dummy.position.set(
        position[0] + p.dir.x * dist,
        position[1] + p.dir.y * dist,
        position[2] + p.dir.z * dist,
      );
      const fade = Math.max(0, 1 - elapsed / 2);
      dummy.scale.setScalar(p.scale * fade);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 4]} />
      <meshStandardMaterial color="#00FF94" emissive="#00FF94" emissiveIntensity={2} transparent opacity={0.6} />
    </instancedMesh>
  );
}

const ORGAN_POSITIONS: Record<string, [number, number, number]> = {
  heart: [0, 1.35, 0.05],
  brain: [0, 1.98, 0],
  lungs: [0, 1.4, 0.02],
  liver: [0.1, 1.2, 0.05],
  kidneys: [0, 1.04, -0.02],
  stomach: [-0.06, 1.15, 0.04],
  pancreas: [0, 1.08, 0.02],
  intestines: [0, 0.85, 0.04],
};

export default function TreatmentAnimationSystem() {
  const treatments = useGenesisStore((s) => s.appliedTreatments);
  const [activeAnimations, setActiveAnimations] = useState<number[]>([]);
  const [healingBursts, setHealingBursts] = useState<number[]>([]);

  // Trigger animation when new treatment is applied
  useEffect(() => {
    if (treatments.length > 0) {
      const latestIdx = treatments.length - 1;
      if (!activeAnimations.includes(latestIdx)) {
        setActiveAnimations(prev => [...prev, latestIdx]);
      }
    }
  }, [treatments.length]);

  return (
    <group>
      {activeAnimations.map((idx) => {
        const treatment = treatments[idx];
        if (!treatment) return null;
        const targetPos = ORGAN_POSITIONS[treatment.targetOrgan] || [0, 1.2, 0];

        return (
          <MedicationParticle
            key={`med-${idx}`}
            targetPos={targetPos}
            onComplete={() => {
              setActiveAnimations(prev => prev.filter(i => i !== idx));
              setHealingBursts(prev => [...prev, idx]);
              // Clear healing burst after 2s
              setTimeout(() => setHealingBursts(prev => prev.filter(i => i !== idx)), 2500);
            }}
          />
        );
      })}

      {healingBursts.map((idx) => {
        const treatment = treatments[idx];
        if (!treatment) return null;
        const targetPos = ORGAN_POSITIONS[treatment.targetOrgan] || [0, 1.2, 0];
        return <HealingBurst key={`heal-${idx}`} position={targetPos} active />;
      })}
    </group>
  );
}

'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
type ExtraMode = 'comparison' | 'aging' | 'exercise' | 'injury' | null;

/* ── Aging Simulation ── */
function AgingOverlay({ age }: { age: number }) {
  const groupRef = useRef<THREE.Group>(null);

  // Age affects: bone density (whiteness/size), muscle mass, skin opacity, organ health
  const ageFactor = age / 100; // 0-1

  // Age spots / wrinkles shown as darkened patches on skin
  const ageSpots = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      pos: [
        (Math.random() - 0.5) * 0.4,
        1.2 + (Math.random() - 0.5) * 1.2,
        0.1 + Math.random() * 0.05,
      ] as [number, number, number],
      scale: 0.005 + Math.random() * 0.01,
    })),
  []);

  // Spine curvature (kyphosis) increases with age
  const spineCurve = ageFactor > 0.6 ? (ageFactor - 0.6) * 0.15 : 0;

  return (
    <group ref={groupRef}>
      {/* Overall body posture — slight forward lean with age */}
      <group rotation={[spineCurve, 0, 0]} position={[0, -spineCurve * 0.3, 0]}>
        {/* Height reduction indicator (subtle) */}
        <group scale={[1, 1 - ageFactor * 0.05, 1]}>
          {/* Bone density visualization — dimming bones with age */}
          {ageFactor > 0.4 && (
            <mesh position={[0, 1.2, 0]}>
              <sphereGeometry args={[0.5, 8, 6]} />
              <meshStandardMaterial
                color="#FF6644"
                emissive="#FF4400"
                emissiveIntensity={0.1}
                transparent
                opacity={Math.max(0, (ageFactor - 0.4) * 0.08)}
                depthWrite={false}
              />
            </mesh>
          )}
        </group>
      </group>

      {/* Age spots visible after age 50+ */}
      {ageFactor > 0.5 && ageSpots.slice(0, Math.floor((ageFactor - 0.5) * 24)).map((spot, i) => (
        <mesh key={`agespot-${i}`} position={spot.pos}>
          <sphereGeometry args={[spot.scale * (1 + ageFactor), 4, 4]} />
          <meshStandardMaterial color="#8B6914" transparent opacity={0.3 * ageFactor} />
        </mesh>
      ))}

      {/* Age label */}
      <Html position={[0.4, 2.3, 0]} center style={{ pointerEvents: 'none' }}>
        <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-yellow-500/20">
          <span className="text-[11px] font-bold" style={{ color: age > 70 ? '#FF6644' : age > 40 ? '#FFD700' : '#00FF94' }}>
            Age {age}
          </span>
          <span className="text-[9px] text-white/30 ml-1.5">
            {age < 18 ? 'Developing' : age < 30 ? 'Peak' : age < 50 ? 'Mature' : age < 70 ? 'Senior' : 'Elderly'}
          </span>
        </div>
      </Html>
    </group>
  );
}

/* ── Exercise Simulation ── */
function ExerciseOverlay({ intensity }: { intensity: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const sweatRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const factor = intensity / 100;

  // Sweat particles
  const sweatParticles = useMemo(() =>
    Array.from({ length: 30 }, () => ({
      pos: [
        (Math.random() - 0.5) * 0.3,
        1.6 + Math.random() * 0.6,
        0.12 + Math.random() * 0.05,
      ] as [number, number, number],
      speed: 0.3 + Math.random() * 0.5,
      phase: Math.random(),
    })),
  []);

  useFrame(({ clock }) => {
    if (!sweatRef.current || factor < 0.3) return;
    const t = clock.getElapsedTime();
    const visibleCount = Math.floor(factor * 30);
    sweatParticles.forEach((p, i) => {
      if (i >= visibleCount) {
        dummy.scale.setScalar(0);
      } else {
        const drift = ((t * p.speed + p.phase) % 1) * 0.15;
        dummy.position.set(p.pos[0], p.pos[1] - drift, p.pos[2]);
        dummy.scale.setScalar(0.003);
      }
      dummy.updateMatrix();
      sweatRef.current!.setMatrixAt(i, dummy.matrix);
    });
    sweatRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      {/* Heart rate glow — intensifies with exercise */}
      <mesh position={[0, 1.35, 0.05]}>
        <sphereGeometry args={[0.1, 8, 6]} />
        <meshStandardMaterial
          color="#FF2222"
          emissive="#FF0000"
          emissiveIntensity={0.3 + factor * 1.5}
          transparent
          opacity={0.1 + factor * 0.2}
          depthWrite={false}
        />
      </mesh>

      {/* Muscle activation glow */}
      {factor > 0.2 && (
        <>
          {/* Quads */}
          <mesh position={[-0.16, 0.2, 0.04]}>
            <capsuleGeometry args={[0.025, 0.12, 6, 8]} />
            <meshStandardMaterial color="#FF4400" emissive="#FF2200" emissiveIntensity={factor * 0.8} transparent opacity={factor * 0.15} depthWrite={false} />
          </mesh>
          <mesh position={[0.16, 0.2, 0.04]}>
            <capsuleGeometry args={[0.025, 0.12, 6, 8]} />
            <meshStandardMaterial color="#FF4400" emissive="#FF2200" emissiveIntensity={factor * 0.8} transparent opacity={factor * 0.15} depthWrite={false} />
          </mesh>
          {/* Calves */}
          <mesh position={[-0.18, -0.3, -0.01]}>
            <capsuleGeometry args={[0.02, 0.1, 6, 8]} />
            <meshStandardMaterial color="#FF4400" emissive="#FF2200" emissiveIntensity={factor * 0.6} transparent opacity={factor * 0.12} depthWrite={false} />
          </mesh>
          <mesh position={[0.18, -0.3, -0.01]}>
            <capsuleGeometry args={[0.02, 0.1, 6, 8]} />
            <meshStandardMaterial color="#FF4400" emissive="#FF2200" emissiveIntensity={factor * 0.6} transparent opacity={factor * 0.12} depthWrite={false} />
          </mesh>
        </>
      )}

      {/* Lung expansion increase */}
      {factor > 0.15 && (
        <>
          <mesh position={[-0.17, 1.38, 0.02]}>
            <sphereGeometry args={[0.13 + factor * 0.03, 8, 6]} />
            <meshStandardMaterial color="#87CEEB" emissive="#00AAFF" emissiveIntensity={factor * 0.4} transparent opacity={factor * 0.1} depthWrite={false} />
          </mesh>
          <mesh position={[0.19, 1.38, 0.02]}>
            <sphereGeometry args={[0.15 + factor * 0.03, 8, 6]} />
            <meshStandardMaterial color="#87CEEB" emissive="#00AAFF" emissiveIntensity={factor * 0.4} transparent opacity={factor * 0.1} depthWrite={false} />
          </mesh>
        </>
      )}

      {/* Sweat particles */}
      <instancedMesh ref={sweatRef} args={[undefined, undefined, 30]}>
        <sphereGeometry args={[1, 4, 4]} />
        <meshStandardMaterial color="#88CCFF" emissive="#66AAFF" emissiveIntensity={0.5} transparent opacity={0.4} />
      </instancedMesh>

      {/* Exercise stats label */}
      <Html position={[0.4, 2.3, 0]} center style={{ pointerEvents: 'none' }}>
        <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-green-500/20 space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-white/30">HR</span>
            <span className="text-[11px] font-bold text-red-400">{Math.round(60 + factor * 140)} BPM</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-white/30">O₂</span>
            <span className="text-[11px] font-bold text-cyan-400">{Math.round(250 + factor * 2750)} mL/min</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-white/30">CAL</span>
            <span className="text-[11px] font-bold text-yellow-400">{Math.round(factor * 15)} kcal/min</span>
          </div>
        </div>
      </Html>
    </group>
  );
}

/* ── Injury Visualization ── */
function InjuryOverlay({ type }: { type: string }) {
  const groupRef = useRef<THREE.Group>(null);

  const injuryConfig: Record<string, {
    position: [number, number, number];
    label: string;
    description: string;
  }> = {
    fracture: {
      position: [-0.18, -0.1, 0.02],
      label: 'Tibial Fracture',
      description: 'Complete transverse fracture of the tibial shaft',
    },
    concussion: {
      position: [0, 1.98, 0],
      label: 'Concussion',
      description: 'Traumatic brain injury from impact force',
    },
    'torn-acl': {
      position: [-0.18, -0.1, 0.02],
      label: 'Torn ACL',
      description: 'Complete tear of anterior cruciate ligament',
    },
    'herniated-disc': {
      position: [0, 1.1, -0.05],
      label: 'Herniated Disc',
      description: 'L4-L5 disc herniation compressing nerve root',
    },
    'heart-attack': {
      position: [0, 1.35, 0.05],
      label: 'Myocardial Infarction',
      description: 'Acute coronary artery occlusion',
    },
  };

  const config = injuryConfig[type];
  if (!config) return null;

  return (
    <group ref={groupRef}>
      {/* Impact zone — pulsing red */}
      <mesh position={config.position}>
        <sphereGeometry args={[0.06, 12, 8]} />
        <meshStandardMaterial
          color="#FF0000"
          emissive="#FF0000"
          emissiveIntensity={1.5}
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>

      {/* Lightning bolt particles (pain indicator) */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const r = 0.08;
        return (
          <mesh
            key={`pain-${i}`}
            position={[
              config.position[0] + Math.cos(angle) * r,
              config.position[1] + (Math.random() - 0.5) * 0.06,
              config.position[2] + Math.sin(angle) * r,
            ]}
          >
            <sphereGeometry args={[0.004, 4, 4]} />
            <meshStandardMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={3} />
          </mesh>
        );
      })}

      {/* Injury label */}
      <Html position={[config.position[0] + 0.15, config.position[1] + 0.1, config.position[2]]} style={{ pointerEvents: 'none' }}>
        <div className="px-3 py-2 rounded-lg bg-black/70 backdrop-blur-sm border border-red-500/30 max-w-48">
          <p className="text-[11px] font-bold text-red-400">{config.label}</p>
          <p className="text-[9px] text-white/40 mt-0.5">{config.description}</p>
        </div>
      </Html>
    </group>
  );
}

/* ── Comparison Mode ── */
function ComparisonOverlay({ type }: { type: string }) {
  const configs: Record<string, {
    rightLabel: string;
    leftLabel: string;
    effects: { organ: string; position: [number, number, number]; damage: string }[];
  }> = {
    smoker: {
      leftLabel: 'Healthy',
      rightLabel: 'Smoker (20yr)',
      effects: [
        { organ: 'Lungs', position: [0.19, 1.38, 0.02], damage: 'Tar deposits, emphysema' },
        { organ: 'Heart', position: [0, 1.35, 0.05], damage: 'Atherosclerosis' },
        { organ: 'Throat', position: [0, 1.72, 0.04], damage: 'Chronic irritation' },
      ],
    },
    athlete: {
      leftLabel: 'Sedentary',
      rightLabel: 'Athlete',
      effects: [
        { organ: 'Heart', position: [0, 1.35, 0.05], damage: 'Enlarged, efficient' },
        { organ: 'Lungs', position: [0, 1.4, 0.02], damage: 'Greater capacity' },
        { organ: 'Muscles', position: [0, 1.1, 0.06], damage: 'Hypertrophy, more mitochondria' },
      ],
    },
    pregnant: {
      leftLabel: 'Normal',
      rightLabel: '3rd Trimester',
      effects: [
        { organ: 'Uterus', position: [0, 0.7, 0.08], damage: 'Expanded, fetal development' },
        { organ: 'Heart', position: [0, 1.35, 0.05], damage: '50% more blood volume' },
        { organ: 'Kidneys', position: [0, 1.04, -0.02], damage: 'Increased filtration rate' },
      ],
    },
  };

  const config = configs[type];
  if (!config) return null;

  const isPositive = type === 'athlete' || type === 'pregnant';
  const color = isPositive ? '#00FF94' : '#FF4400';

  return (
    <group>
      {/* Comparison divider label */}
      <Html position={[0, 2.4, 0]} center style={{ pointerEvents: 'none' }}>
        <div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-sm border border-white/10">
          <span className="text-[10px] text-green-400 font-bold">{config.leftLabel}</span>
          <span className="text-white/20">vs</span>
          <span className="text-[10px] font-bold" style={{ color }}>{config.rightLabel}</span>
        </div>
      </Html>

      {/* Affected organ highlights */}
      {config.effects.map((effect) => (
        <group key={effect.organ}>
          <mesh position={effect.position}>
            <sphereGeometry args={[0.06, 10, 8]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.8}
              transparent
              opacity={0.2}
              depthWrite={false}
            />
          </mesh>
          <Html position={[effect.position[0] + 0.12, effect.position[1], effect.position[2]]} style={{ pointerEvents: 'none' }}>
            <div className="px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm border border-white/10 max-w-40">
              <p className="text-[9px] font-bold" style={{ color }}>{effect.organ}</p>
              <p className="text-[8px] text-white/30">{effect.damage}</p>
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}

/* ── Main Simulation Effects Component ── */
export default function SimulationEffects({
  mode,
  agingAge,
  exerciseIntensity,
  comparisonType,
  injuryType,
}: {
  mode: ExtraMode;
  agingAge: number;
  exerciseIntensity: number;
  comparisonType: string;
  injuryType: string;
}) {
  if (!mode) return null;

  return (
    <group>
      {mode === 'aging' && <AgingOverlay age={agingAge} />}
      {mode === 'exercise' && <ExerciseOverlay intensity={exerciseIntensity} />}
      {mode === 'injury' && <InjuryOverlay type={injuryType} />}
      {mode === 'comparison' && <ComparisonOverlay type={comparisonType} />}
    </group>
  );
}

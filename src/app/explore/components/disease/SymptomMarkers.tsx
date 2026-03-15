'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGenesisStore } from '../../store';

/* Maps common symptoms to body positions and visual effects */
const SYMPTOM_MAP: Record<string, {
  position: [number, number, number];
  label: string;
  icon: string;
}> = {
  headache: { position: [0.15, 2.15, 0.1], label: 'Headache', icon: '🧠' },
  fatigue: { position: [0.25, 1.3, 0.2], label: 'Fatigue', icon: '😴' },
  'chest pain': { position: [0.2, 1.4, 0.15], label: 'Chest Pain', icon: '💔' },
  'shortness of breath': { position: [-0.22, 1.45, 0.15], label: 'Dyspnea', icon: '🫁' },
  nausea: { position: [-0.15, 1.15, 0.12], label: 'Nausea', icon: '🤢' },
  'joint pain': { position: [0.35, 1.15, 0.1], label: 'Joint Pain', icon: '🦴' },
  'blurred vision': { position: [0.12, 2.05, 0.15], label: 'Vision Changes', icon: '👁' },
  swelling: { position: [-0.18, -0.2, 0.1], label: 'Edema', icon: '💧' },
  numbness: { position: [0.42, 0.95, 0.1], label: 'Numbness', icon: '⚡' },
  'weight loss': { position: [0, 1.05, 0.15], label: 'Weight Loss', icon: '⬇️' },
  fever: { position: [0, 2.2, 0], label: 'Fever', icon: '🌡' },
  cough: { position: [0, 1.72, 0.08], label: 'Cough', icon: '😷' },
  'frequent urination': { position: [0, 0.5, 0.12], label: 'Polyuria', icon: '🚽' },
  thirst: { position: [0, 1.8, 0.1], label: 'Polydipsia', icon: '💧' },
  'memory loss': { position: [-0.12, 2.1, 0.08], label: 'Memory Loss', icon: '🧩' },
  tremor: { position: [-0.42, 0.9, 0.12], label: 'Tremor', icon: '🤲' },
};

/* Maps disease types to their common symptoms */
const DISEASE_SYMPTOMS: Record<string, string[]> = {
  metabolic: ['fatigue', 'frequent urination', 'thirst', 'blurred vision', 'weight loss', 'numbness'],
  cancer: ['fatigue', 'weight loss', 'fever'],
  circulatory: ['chest pain', 'shortness of breath', 'fatigue', 'swelling'],
  respiratory: ['shortness of breath', 'cough', 'chest pain', 'fatigue'],
  neurological: ['headache', 'memory loss', 'tremor', 'numbness', 'blurred vision'],
  infection: ['fever', 'fatigue', 'headache', 'nausea'],
  inflammation: ['joint pain', 'swelling', 'fatigue', 'fever'],
  autoimmune: ['fatigue', 'joint pain', 'fever', 'swelling'],
  generic: ['fatigue'],
};

function SymptomLabel({ position, label, icon }: {
  position: [number, number, number];
  label: string;
  icon: string;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.sin(t * 2 + position[0] * 5) * 0.01;
  });

  return (
    <group ref={ref} position={position}>
      {/* Connecting line to body */}
      <mesh position={[-position[0] * 0.3, -0.02, -position[2] * 0.3]}>
        <cylinderGeometry args={[0.001, 0.001, 0.06, 4]} />
        <meshStandardMaterial color="#FF444488" transparent opacity={0.4} />
      </mesh>

      {/* Floating label */}
      <Html center distanceFactor={3} style={{ pointerEvents: 'none' }}>
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-red-500/20 whitespace-nowrap">
          <span className="text-[10px]">{icon}</span>
          <span className="text-[10px] text-red-300 font-medium">{label}</span>
        </div>
      </Html>
    </group>
  );
}

export default function SymptomMarkers() {
  const disease = useGenesisStore((s) => s.activeDisease);
  const stage = useGenesisStore((s) => s.diseaseStage);

  if (!disease) return null;

  const symptoms = DISEASE_SYMPTOMS[disease.type] || DISEASE_SYMPTOMS.generic;
  // Show more symptoms as disease progresses
  const visibleCount = Math.min(symptoms.length, 2 + stage * 2);
  const visibleSymptoms = symptoms.slice(0, visibleCount);

  return (
    <group>
      {visibleSymptoms.map((symptom) => {
        const data = SYMPTOM_MAP[symptom];
        if (!data) return null;
        return (
          <SymptomLabel
            key={symptom}
            position={data.position}
            label={data.label}
            icon={data.icon}
          />
        );
      })}
    </group>
  );
}

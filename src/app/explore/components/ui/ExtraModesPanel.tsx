'use client';

import { useState } from 'react';
import { useGenesisStore } from '../../store';
import {
  Timer,
  Dumbbell,
  SplitSquareHorizontal,
  Bone,
  Baby,
  Cigarette,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const COMPARISON_TYPES = [
  { id: 'smoker', label: 'Healthy vs Smoker', icon: Cigarette },
  { id: 'athlete', label: 'Sedentary vs Athlete', icon: Dumbbell },
  { id: 'pregnant', label: 'Normal vs Pregnant', icon: Baby },
];

const INJURY_TYPES = [
  { id: 'fracture', label: 'Bone Fracture' },
  { id: 'concussion', label: 'Concussion' },
  { id: 'torn-acl', label: 'Torn ACL' },
  { id: 'herniated-disc', label: 'Herniated Disc' },
  { id: 'heart-attack', label: 'Heart Attack' },
];

export default function ExtraModesPanel() {
  const [expanded, setExpanded] = useState(false);
  const simulationMode = useGenesisStore((s) => s.simulationMode);
  const setSimulationMode = useGenesisStore((s) => s.setSimulationMode);
  const agingAge = useGenesisStore((s) => s.agingAge);
  const setAgingAge = useGenesisStore((s) => s.setAgingAge);
  const exerciseIntensity = useGenesisStore((s) => s.exerciseIntensity);
  const setExerciseIntensity = useGenesisStore((s) => s.setExerciseIntensity);
  const comparisonType = useGenesisStore((s) => s.comparisonType);
  const setComparisonType = useGenesisStore((s) => s.setComparisonType);
  const injuryType = useGenesisStore((s) => s.injuryType);
  const setInjuryType = useGenesisStore((s) => s.setInjuryType);

  const modes = [
    { id: 'comparison' as const, label: 'Compare', icon: SplitSquareHorizontal, color: '#00E5FF' },
    { id: 'aging' as const, label: 'Aging', icon: Timer, color: '#FFD700' },
    { id: 'exercise' as const, label: 'Exercise', icon: Dumbbell, color: '#00FF94' },
    { id: 'injury' as const, label: 'Injury', icon: Bone, color: '#FF4444' },
  ];

  return (
    <div className="absolute right-4 top-16 z-20 w-52">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/5 transition-colors"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Simulations</span>
          {expanded ? <ChevronUp size={12} className="text-white/30" /> : <ChevronDown size={12} className="text-white/30" />}
        </button>

        {expanded && (
          <div className="px-3 pb-3 space-y-2">
            {/* Mode toggles */}
            <div className="flex flex-wrap gap-1">
              {modes.map((m) => {
                const Icon = m.icon;
                const active = simulationMode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSimulationMode(active ? null : m.id)}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] transition-all ${
                      active
                        ? 'border bg-white/10'
                        : 'text-white/40 hover:text-white/60 hover:bg-white/5'
                    }`}
                    style={active ? { color: m.color, borderColor: m.color + '40' } : {}}
                  >
                    <Icon size={11} />
                    {m.label}
                  </button>
                );
              })}
            </div>

            {/* Mode-specific controls */}
            {simulationMode === 'aging' && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/30">Age</span>
                  <span className="text-xs font-bold" style={{ color: agingAge > 70 ? '#FF6644' : agingAge > 40 ? '#FFD700' : '#00FF94' }}>
                    {agingAge} years
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={agingAge}
                  onChange={(e) => setAgingAge(Number(e.target.value))}
                  className="w-full h-1 rounded-full appearance-none bg-white/10 cursor-pointer"
                  style={{ accentColor: '#FFD700' }}
                />
                <div className="flex justify-between text-[8px] text-white/20">
                  <span>Birth</span>
                  <span>25</span>
                  <span>50</span>
                  <span>75</span>
                  <span>100</span>
                </div>
              </div>
            )}

            {simulationMode === 'exercise' && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/30">Intensity</span>
                  <span className="text-xs font-bold" style={{ color: exerciseIntensity > 75 ? '#FF4444' : exerciseIntensity > 40 ? '#FFD700' : '#00FF94' }}>
                    {exerciseIntensity > 75 ? 'Sprint' : exerciseIntensity > 40 ? 'Run' : exerciseIntensity > 15 ? 'Walk' : 'Rest'}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={exerciseIntensity}
                  onChange={(e) => setExerciseIntensity(Number(e.target.value))}
                  className="w-full h-1 rounded-full appearance-none bg-white/10 cursor-pointer"
                  style={{ accentColor: '#00FF94' }}
                />
              </div>
            )}

            {simulationMode === 'comparison' && (
              <div className="space-y-1 pt-1">
                {COMPARISON_TYPES.map((c) => {
                  const Icon = c.icon;
                  const active = comparisonType === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setComparisonType(c.id)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] transition-all ${
                        active ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-white/40 hover:bg-white/5'
                      }`}
                    >
                      <Icon size={11} />
                      {c.label}
                    </button>
                  );
                })}
              </div>
            )}

            {simulationMode === 'injury' && (
              <div className="space-y-1 pt-1">
                {INJURY_TYPES.map((inj) => {
                  const active = injuryType === inj.id;
                  return (
                    <button
                      key={inj.id}
                      onClick={() => setInjuryType(inj.id)}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-[10px] transition-all ${
                        active ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'text-white/40 hover:bg-white/5'
                      }`}
                    >
                      {inj.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

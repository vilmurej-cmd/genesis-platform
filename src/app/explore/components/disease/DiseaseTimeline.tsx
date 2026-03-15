'use client';

import { useGenesisStore } from '../../store';

export default function DiseaseTimeline() {
  const disease = useGenesisStore((s) => s.activeDisease);
  const stage = useGenesisStore((s) => s.diseaseStage);
  const setStage = useGenesisStore((s) => s.setDiseaseStage);
  const setActiveDisease = useGenesisStore((s) => s.setActiveDisease);

  if (!disease) return null;

  const stages = disease.stages;
  const maxStage = stages.length - 1;

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl px-4">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
        {/* Disease name + close */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-sm font-bold text-white">{disease.name}</h4>
            <p className="text-[10px] text-white/40 uppercase tracking-wider">Disease Progression</p>
          </div>
          <button
            onClick={() => setActiveDisease(null)}
            className="text-[10px] px-2 py-1 rounded-lg border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20"
          >
            Clear
          </button>
        </div>

        {/* Timeline scrubber */}
        <div className="relative">
          {/* Track */}
          <div className="h-1 bg-white/10 rounded-full relative">
            {/* Fill */}
            <div
              className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
              style={{
                width: `${maxStage > 0 ? (stage / maxStage) * 100 : 0}%`,
                background: `linear-gradient(90deg, #00E5FF, ${stage > maxStage * 0.5 ? '#FF4400' : '#FFD700'}, #FF0044)`,
              }}
            />
          </div>

          {/* Stage markers */}
          <input
            type="range"
            min={0}
            max={maxStage}
            value={stage}
            onChange={(e) => setStage(Number(e.target.value))}
            className="absolute top-0 left-0 w-full h-1 opacity-0 cursor-pointer"
          />

          {/* Labels */}
          <div className="flex justify-between mt-2">
            {stages.map((s, i) => (
              <button
                key={i}
                onClick={() => setStage(i)}
                className={`text-center transition-all ${i === stage ? 'scale-105' : ''}`}
                style={{ width: `${100 / stages.length}%` }}
              >
                <div
                  className={`w-3 h-3 rounded-full mx-auto mb-1 border-2 transition-all ${
                    i === stage
                      ? 'border-cyan-400 bg-cyan-400 shadow-[0_0_8px_rgba(0,229,255,0.5)]'
                      : i < stage
                      ? 'border-white/30 bg-white/20'
                      : 'border-white/15 bg-transparent'
                  }`}
                />
                <span className={`text-[10px] block ${i === stage ? 'text-white font-bold' : 'text-white/30'}`}>
                  {s.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Current stage description */}
        {stages[stage] && (
          <div className="mt-3 px-2 py-2 rounded-lg bg-white/5 border border-white/5">
            <p className="text-xs text-white/50 leading-relaxed">{stages[stage].description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

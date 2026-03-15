'use client';

import { useGenesisStore } from '../../store';
import { Heart } from 'lucide-react';

export default function HealthMeter() {
  const healthScore = useGenesisStore((s) => s.healthScore);
  const disease = useGenesisStore((s) => s.activeDisease);
  const treatments = useGenesisStore((s) => s.appliedTreatments);

  if (!disease) return null;

  const getStatus = (score: number) => {
    if (score >= 85) return { label: 'HEALTHY', color: '#00FF94' };
    if (score >= 65) return { label: 'RECOVERING', color: '#00E5FF' };
    if (score >= 45) return { label: 'AFFECTED', color: '#FFD700' };
    if (score >= 25) return { label: 'CRITICAL', color: '#FF6600' };
    return { label: 'TERMINAL', color: '#FF0044' };
  };

  const status = getStatus(healthScore);

  return (
    <div className="absolute right-4 bottom-24 z-20 w-16">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex flex-col items-center">
        <Heart size={14} style={{ color: status.color }} className="mb-2" />

        {/* Vertical gauge */}
        <div className="w-3 h-40 rounded-full bg-white/5 border border-white/10 relative overflow-hidden">
          <div
            className="absolute bottom-0 left-0 w-full rounded-full transition-all duration-500"
            style={{
              height: `${healthScore}%`,
              background: `linear-gradient(to top, ${status.color}, ${status.color}88)`,
              boxShadow: `0 0 8px ${status.color}40`,
            }}
          />

          {/* Tick marks */}
          {[25, 50, 75].map((tick) => (
            <div
              key={tick}
              className="absolute left-0 w-full border-t border-white/10"
              style={{ bottom: `${tick}%` }}
            />
          ))}
        </div>

        {/* Score */}
        <span className="text-sm font-bold mt-2" style={{ color: status.color }}>
          {Math.round(healthScore)}
        </span>
        <span className="text-[8px] font-bold uppercase tracking-wider text-white/30 mt-0.5">
          {status.label}
        </span>

        {/* Treatment count */}
        {treatments.length > 0 && (
          <div className="mt-2 text-[9px] text-white/30 text-center">
            {treatments.length} treatment{treatments.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}

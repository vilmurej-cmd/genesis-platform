'use client';

import { useGenesisStore, type ZoomLevel } from '../../store';
import { ChevronRight } from 'lucide-react';

const LEVELS: { id: ZoomLevel; label: string }[] = [
  { id: 'body', label: 'BODY' },
  { id: 'region', label: 'REGION' },
  { id: 'organ', label: 'ORGAN' },
  { id: 'tissue', label: 'TISSUE' },
  { id: 'cell', label: 'CELL' },
];

export default function ZoomIndicator() {
  const zoomLevel = useGenesisStore((s) => s.zoomLevel);
  const selectedOrgan = useGenesisStore((s) => s.selectedOrgan);
  const setZoomLevel = useGenesisStore((s) => s.setZoomLevel);
  const selectOrgan = useGenesisStore((s) => s.selectOrgan);

  const activeIdx = LEVELS.findIndex((l) => l.id === zoomLevel);

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 flex items-center gap-1">
        {LEVELS.map((level, i) => {
          const isActive = i === activeIdx;
          const isPast = i < activeIdx;
          const isFuture = i > activeIdx;

          return (
            <div key={level.id} className="flex items-center gap-1">
              <button
                onClick={() => {
                  setZoomLevel(level.id);
                  if (level.id === 'body') selectOrgan(null);
                }}
                className={`text-[10px] font-mono px-2 py-0.5 rounded transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : isPast
                    ? 'text-white/50 hover:text-white/70'
                    : 'text-white/20'
                }`}
              >
                {level.label}
                {level.id === 'organ' && selectedOrgan && isActive && (
                  <span className="ml-1 text-white/40">({selectedOrgan})</span>
                )}
              </button>
              {i < LEVELS.length - 1 && (
                <ChevronRight size={10} className={isPast ? 'text-white/30' : 'text-white/10'} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

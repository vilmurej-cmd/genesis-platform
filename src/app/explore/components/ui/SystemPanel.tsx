'use client';

import { useEffect } from 'react';
import { useGenesisStore, SYSTEM_META, type SystemId } from '../../store';
import { Eye, EyeOff, Scan, Pause, Play, Volume2, VolumeX } from 'lucide-react';

export default function SystemPanel() {
  const activeSystems = useGenesisStore((s) => s.activeSystems);
  const toggleSystem = useGenesisStore((s) => s.toggleSystem);
  const showAll = useGenesisStore((s) => s.showAllSystems);
  const hideAll = useGenesisStore((s) => s.hideAllSystems);
  const xrayMode = useGenesisStore((s) => s.xrayMode);
  const toggleXray = useGenesisStore((s) => s.toggleXrayMode);
  const isPaused = useGenesisStore((s) => s.isPaused);
  const togglePause = useGenesisStore((s) => s.togglePause);
  const soundEnabled = useGenesisStore((s) => s.soundEnabled);
  const toggleSound = useGenesisStore((s) => s.toggleSound);
  const animationSpeed = useGenesisStore((s) => s.animationSpeed);
  const setSpeed = useGenesisStore((s) => s.setAnimationSpeed);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const key = e.key.toUpperCase();
      const system = (Object.entries(SYSTEM_META) as [SystemId, typeof SYSTEM_META[SystemId]][])
        .find(([, meta]) => meta.shortcut === key);
      if (system) {
        e.preventDefault();
        toggleSystem(system[0]);
      }
      if (key === 'X') { e.preventDefault(); toggleXray(); }
      if (key === ' ') { e.preventDefault(); togglePause(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleSystem, toggleXray, togglePause]);

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 max-h-[85vh] overflow-y-auto scrollbar-hide">
      {/* System toggles */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 space-y-1.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Systems</span>
          <div className="flex gap-1">
            <button onClick={showAll} className="text-[9px] text-white/40 hover:text-white/70 px-1">ALL</button>
            <button onClick={hideAll} className="text-[9px] text-white/40 hover:text-white/70 px-1">NONE</button>
          </div>
        </div>

        {(Object.entries(SYSTEM_META) as [SystemId, typeof SYSTEM_META[SystemId]][]).map(([id, meta]) => {
          const active = activeSystems.has(id);
          return (
            <button
              key={id}
              onClick={() => toggleSystem(id)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all group hover:bg-white/5"
            >
              <div
                className="w-2.5 h-2.5 rounded-full transition-all"
                style={{
                  backgroundColor: active ? meta.color : 'transparent',
                  border: `1.5px solid ${meta.color}`,
                  boxShadow: active ? `0 0 6px ${meta.color}60` : 'none',
                }}
              />
              <span className={`text-xs flex-1 text-left transition-colors ${active ? 'text-white/90' : 'text-white/30'}`}>
                {meta.label}
              </span>
              <span className="text-[9px] text-white/20 font-mono">{meta.shortcut}</span>
            </button>
          );
        })}
      </div>

      {/* Mode controls */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 space-y-2">
        {/* X-Ray */}
        <button
          onClick={toggleXray}
          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all hover:bg-white/5 ${xrayMode ? 'text-cyan-400' : 'text-white/40'}`}
        >
          <Scan size={14} />
          <span className="text-xs flex-1 text-left">X-Ray</span>
          <span className="text-[9px] font-mono">X</span>
        </button>

        {/* Pause/Play */}
        <button
          onClick={togglePause}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all hover:bg-white/5 text-white/40"
        >
          {isPaused ? <Play size={14} /> : <Pause size={14} />}
          <span className="text-xs flex-1 text-left">{isPaused ? 'Play' : 'Pause'}</span>
          <span className="text-[9px] font-mono">⎵</span>
        </button>

        {/* Sound */}
        <button
          onClick={toggleSound}
          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all hover:bg-white/5 ${soundEnabled ? 'text-green-400' : 'text-white/40'}`}
        >
          {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          <span className="text-xs flex-1 text-left">Sound</span>
        </button>

        {/* Speed */}
        <div className="flex items-center gap-1 px-2">
          <span className="text-[10px] text-white/30">Speed</span>
          {[0.5, 1, 2].map((sp) => (
            <button
              key={sp}
              onClick={() => setSpeed(sp)}
              className={`text-[10px] px-1.5 py-0.5 rounded ${animationSpeed === sp ? 'bg-white/10 text-white/80' : 'text-white/30 hover:text-white/50'}`}
            >
              {sp}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

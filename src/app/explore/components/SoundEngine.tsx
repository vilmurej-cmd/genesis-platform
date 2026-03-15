'use client';

import { useEffect, useRef } from 'react';
import { useGenesisStore } from '../store';

/* Heartbeat + breathing sounds via Web Audio API oscillators */
export default function SoundEngine() {
  const soundEnabled = useGenesisStore((s) => s.soundEnabled);
  const isPaused = useGenesisStore((s) => s.isPaused);
  const animationSpeed = useGenesisStore((s) => s.animationSpeed);
  const zoomLevel = useGenesisStore((s) => s.zoomLevel);

  const ctxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!soundEnabled || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (ctxRef.current && ctxRef.current.state !== 'closed') {
        ctxRef.current.close().catch(() => {});
        ctxRef.current = null;
      }
      return;
    }

    try {
      const ctx = new AudioContext();
      ctxRef.current = ctx;

      // Heartbeat — dual-pulse "lub-dub" via short oscillator bursts
      const heartbeatInterval = (60 / 72 / animationSpeed) * 1000; // ms per beat

      const playHeartbeat = () => {
        if (ctx.state === 'closed') return;

        // "Lub" — lower frequency
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.value = zoomLevel === 'organ' ? 60 : 40;
        gain1.gain.setValueAtTime(0, ctx.currentTime);
        gain1.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.02);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc1.connect(gain1).connect(ctx.destination);
        osc1.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 0.15);

        // "Dub" — slightly higher, delayed
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.value = zoomLevel === 'organ' ? 50 : 35;
        gain2.gain.setValueAtTime(0, ctx.currentTime + 0.12);
        gain2.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.14);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
        osc2.connect(gain2).connect(ctx.destination);
        osc2.start(ctx.currentTime + 0.12);
        osc2.stop(ctx.currentTime + 0.28);
      };

      // Play immediately and on interval
      playHeartbeat();
      intervalRef.current = setInterval(playHeartbeat, heartbeatInterval);
    } catch {
      // AudioContext not available
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (ctxRef.current && ctxRef.current.state !== 'closed') {
        ctxRef.current.close().catch(() => {});
      }
    };
  }, [soundEnabled, isPaused, animationSpeed, zoomLevel]);

  return null;
}

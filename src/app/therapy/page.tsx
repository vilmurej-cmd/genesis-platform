'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Play,
  Square,
  Volume2,
  Music,
  Brain,
  Wind,
  Palette,
  Timer,
  AlertTriangle,
  Waves,
  Activity,
  Circle,
} from 'lucide-react';

/* ── Types ──────────────────────────────────────────────── */
type WaveformType = 'sine' | 'square' | 'triangle';

interface FrequencyPreset {
  hz: number;
  name: string;
  description: string;
  chakra: string;
  chakraColor: string;
}

interface BinauralPreset {
  name: string;
  rangeLabel: string;
  baseFreq: number;
  beatFreq: number;
  brainState: string;
  benefits: string[];
}

interface BreathingPattern {
  name: string;
  description: string;
  phases: { label: string; duration: number }[];
  cycles: number;
}

interface ColorTherapy {
  name: string;
  hex: string;
  chakra: string;
  properties: string;
}

/* ── Frequency Presets ──────────────────────────────────── */
const FREQUENCIES: FrequencyPreset[] = [
  { hz: 396, name: 'Liberation from Fear', description: 'Associated with releasing guilt and fear. This Solfeggio frequency is believed to help turn grief into joy and liberate the mind from negative thought patterns.', chakra: 'Root', chakraColor: '#FF3366' },
  { hz: 432, name: 'Universal Healing', description: 'Known as Verdi\'s A, this frequency is mathematically consistent with the patterns of the universe. Said to promote natural healing, reduce anxiety, and create a sense of peace and well-being.', chakra: 'Heart', chakraColor: '#00FF94' },
  { hz: 528, name: 'DNA Repair / Love', description: 'Called the "Love Frequency" or "Miracle Tone." Used in molecular biology to repair DNA. Associated with transformation, miracles, and deep healing at the cellular level.', chakra: 'Solar Plexus', chakraColor: '#FFD700' },
  { hz: 639, name: 'Connecting Relationships', description: 'Enhances communication, understanding, tolerance, and love. Used for balancing relationships, family connections, and dealing with relationship problems.', chakra: 'Heart', chakraColor: '#00FF94' },
  { hz: 741, name: 'Awakening Intuition', description: 'Linked to the throat chakra and self-expression. Said to cleanse cells of toxins, help with problem solving, and awaken intuition. Associated with pure expression.', chakra: 'Throat', chakraColor: '#00E5FF' },
  { hz: 852, name: 'Spiritual Order', description: 'Connected to the third eye chakra. Associated with returning to spiritual order, awakening intuition, and raising consciousness to a higher plane of awareness.', chakra: 'Third Eye', chakraColor: '#9945FF' },
];

/* ── Binaural Beat Presets ──────────────────────────────── */
const BINAURAL_PRESETS: BinauralPreset[] = [
  {
    name: 'Deep Sleep',
    rangeLabel: 'Delta (1-4 Hz)',
    baseFreq: 200,
    beatFreq: 2,
    brainState: 'Delta waves \u2014 deep dreamless sleep, unconscious body recovery',
    benefits: ['Profound physical rest', 'Growth hormone release', 'Immune system restoration', 'Deep unconscious processing'],
  },
  {
    name: 'Meditation',
    rangeLabel: 'Theta (4-8 Hz)',
    baseFreq: 200,
    beatFreq: 6,
    brainState: 'Theta waves \u2014 deep meditation, creativity, REM sleep',
    benefits: ['Deep meditative states', 'Enhanced creativity', 'Emotional processing', 'Subconscious access'],
  },
  {
    name: 'Relaxation',
    rangeLabel: 'Alpha (8-12 Hz)',
    baseFreq: 200,
    beatFreq: 10,
    brainState: 'Alpha waves \u2014 relaxed alertness, calm awareness',
    benefits: ['Stress reduction', 'Calm focus', 'Mind-body integration', 'Reduced anxiety'],
  },
  {
    name: 'Focus',
    rangeLabel: 'Beta (12-30 Hz)',
    baseFreq: 200,
    beatFreq: 18,
    brainState: 'Beta waves \u2014 active concentration, analytical thinking',
    benefits: ['Enhanced concentration', 'Active problem solving', 'Alert awareness', 'Mental endurance'],
  },
];

/* ── Breathing Patterns ─────────────────────────────────── */
const BREATHING_PATTERNS: BreathingPattern[] = [
  {
    name: '4-7-8 Relaxation',
    description: 'Developed by Dr. Andrew Weil, this pattern activates the parasympathetic nervous system. The extended exhale triggers the relaxation response.',
    phases: [
      { label: 'Inhale', duration: 4 },
      { label: 'Hold', duration: 7 },
      { label: 'Exhale', duration: 8 },
    ],
    cycles: 4,
  },
  {
    name: 'Box Breathing (4-4-4-4)',
    description: 'Used by Navy SEALs and first responders for stress management. Equal durations create a balanced, grounding rhythm.',
    phases: [
      { label: 'Inhale', duration: 4 },
      { label: 'Hold', duration: 4 },
      { label: 'Exhale', duration: 4 },
      { label: 'Hold', duration: 4 },
    ],
    cycles: 6,
  },
  {
    name: 'Wim Hof Method',
    description: 'A controlled hyperventilation technique followed by breath retention. Increases oxygen levels, reduces CO2, and activates the autonomic nervous system.',
    phases: [
      { label: 'Power Inhale', duration: 2 },
      { label: 'Let Go', duration: 2 },
    ],
    cycles: 30,
  },
];

/* ── Color Therapy ──────────────────────────────────────── */
const COLORS: ColorTherapy[] = [
  { name: 'Red', hex: '#FF3366', chakra: 'Root (Muladhara)', properties: 'Grounding, vitality, courage, physical energy. Stimulates circulation and adrenal function.' },
  { name: 'Orange', hex: '#FF9933', chakra: 'Sacral (Svadhisthana)', properties: 'Creativity, emotional balance, joy, sensuality. Supports reproductive and digestive systems.' },
  { name: 'Yellow', hex: '#FFD700', chakra: 'Solar Plexus (Manipura)', properties: 'Confidence, personal power, mental clarity, optimism. Stimulates intellect and nervous system.' },
  { name: 'Green', hex: '#00FF94', chakra: 'Heart (Anahata)', properties: 'Love, harmony, balance, renewal. Promotes healing, reduces inflammation, calms the nervous system.' },
  { name: 'Blue', hex: '#0066FF', chakra: 'Throat (Vishuddha)', properties: 'Communication, truth, peace, serenity. Reduces blood pressure, calms the mind, promotes restful sleep.' },
  { name: 'Indigo', hex: '#4A00E0', chakra: 'Third Eye (Ajna)', properties: 'Intuition, perception, inner wisdom. Deepens awareness, supports pineal gland, enhances visualization.' },
  { name: 'Violet', hex: '#9945FF', chakra: 'Crown (Sahasrara)', properties: 'Spiritual connection, transcendence, divine awareness. Calms the nervous system, promotes meditation.' },
];

/* ── Component ──────────────────────────────────────────── */
export default function TherapyPage() {
  const [activeSection, setActiveSection] = useState<'frequencies' | 'binaural' | 'breathing' | 'color'>('frequencies');

  // Audio state
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [playingFreq, setPlayingFreq] = useState<number | null>(null);
  const [volume, setVolume] = useState(0.3);
  const [waveform, setWaveform] = useState<WaveformType>('sine');

  // Binaural state
  const binauralOscLRef = useRef<OscillatorNode | null>(null);
  const binauralOscRRef = useRef<OscillatorNode | null>(null);
  const binauralGainLRef = useRef<GainNode | null>(null);
  const binauralGainRRef = useRef<GainNode | null>(null);
  const binauralMergerRef = useRef<ChannelMergerNode | null>(null);
  const [playingBinaural, setPlayingBinaural] = useState<string | null>(null);

  // Breathing state
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPattern, setBreathingPattern] = useState<BreathingPattern | null>(null);
  const [breathPhase, setBreathPhase] = useState(0);
  const [breathCycle, setBreathCycle] = useState(0);
  const [breathTimer, setBreathTimer] = useState(0);
  const [breathElapsed, setBreathElapsed] = useState(0);
  const breathIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breathTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Color therapy state
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const colorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Audio helpers ──────────────────────────────────── */
  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const stopFrequency = useCallback(() => {
    try {
      oscillatorRef.current?.stop();
    } catch { /* already stopped */ }
    oscillatorRef.current?.disconnect();
    gainNodeRef.current?.disconnect();
    oscillatorRef.current = null;
    gainNodeRef.current = null;
    setPlayingFreq(null);
  }, []);

  const stopBinaural = useCallback(() => {
    try { binauralOscLRef.current?.stop(); } catch { /* */ }
    try { binauralOscRRef.current?.stop(); } catch { /* */ }
    binauralOscLRef.current?.disconnect();
    binauralOscRRef.current?.disconnect();
    binauralGainLRef.current?.disconnect();
    binauralGainRRef.current?.disconnect();
    binauralMergerRef.current?.disconnect();
    binauralOscLRef.current = null;
    binauralOscRRef.current = null;
    binauralGainLRef.current = null;
    binauralGainRRef.current = null;
    binauralMergerRef.current = null;
    setPlayingBinaural(null);
  }, []);

  const playFrequency = useCallback((hz: number) => {
    if (playingFreq === hz) {
      stopFrequency();
      return;
    }
    stopFrequency();
    stopBinaural();

    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = waveform;
    osc.frequency.setValueAtTime(hz, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    oscillatorRef.current = osc;
    gainNodeRef.current = gain;
    setPlayingFreq(hz);
  }, [playingFreq, waveform, volume, getAudioCtx, stopFrequency, stopBinaural]);

  const playBinaural = useCallback((preset: BinauralPreset) => {
    if (playingBinaural === preset.name) {
      stopBinaural();
      return;
    }
    stopBinaural();
    stopFrequency();

    const ctx = getAudioCtx();
    const merger = ctx.createChannelMerger(2);

    const oscL = ctx.createOscillator();
    const oscR = ctx.createOscillator();
    oscL.type = 'sine';
    oscR.type = 'sine';
    oscL.frequency.setValueAtTime(preset.baseFreq, ctx.currentTime);
    oscR.frequency.setValueAtTime(preset.baseFreq + preset.beatFreq, ctx.currentTime);

    const gainL = ctx.createGain();
    const gainR = ctx.createGain();
    gainL.gain.setValueAtTime(volume, ctx.currentTime);
    gainR.gain.setValueAtTime(volume, ctx.currentTime);

    oscL.connect(gainL);
    oscR.connect(gainR);
    gainL.connect(merger, 0, 0);
    gainR.connect(merger, 0, 1);
    merger.connect(ctx.destination);

    oscL.start();
    oscR.start();

    binauralOscLRef.current = oscL;
    binauralOscRRef.current = oscR;
    binauralGainLRef.current = gainL;
    binauralGainRRef.current = gainR;
    binauralMergerRef.current = merger;
    setPlayingBinaural(preset.name);
  }, [playingBinaural, volume, getAudioCtx, stopBinaural, stopFrequency]);

  // Update volume for active audio
  useEffect(() => {
    const t = audioCtxRef.current?.currentTime || 0;
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, t);
    }
    if (binauralGainLRef.current) {
      binauralGainLRef.current.gain.setValueAtTime(volume, t);
    }
    if (binauralGainRRef.current) {
      binauralGainRRef.current.gain.setValueAtTime(volume, t);
    }
  }, [volume]);

  // Update waveform for frequency player
  useEffect(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.type = waveform;
    }
  }, [waveform]);

  /* ── Breathing helpers ──────────────────────────────── */
  const stopBreathing = useCallback(() => {
    if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
    if (breathTimerRef.current) clearInterval(breathTimerRef.current);
    breathIntervalRef.current = null;
    breathTimerRef.current = null;
    setBreathingActive(false);
    setBreathPhase(0);
    setBreathCycle(0);
    setBreathTimer(0);
    setBreathElapsed(0);
  }, []);

  const startBreathing = useCallback((pattern: BreathingPattern) => {
    stopBreathing();
    setBreathingPattern(pattern);
    setBreathingActive(true);
    setBreathPhase(0);
    setBreathCycle(0);
    setBreathElapsed(0);

    let currentPhase = 0;
    let currentCycle = 0;
    let phaseRemaining = pattern.phases[0].duration;

    setBreathTimer(pattern.phases[0].duration);

    breathTimerRef.current = setInterval(() => {
      setBreathElapsed((prev) => prev + 1);
    }, 1000);

    breathIntervalRef.current = setInterval(() => {
      phaseRemaining -= 1;
      setBreathTimer(phaseRemaining);

      if (phaseRemaining <= 0) {
        currentPhase += 1;
        if (currentPhase >= pattern.phases.length) {
          currentPhase = 0;
          currentCycle += 1;
          if (currentCycle >= pattern.cycles) {
            if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
            if (breathTimerRef.current) clearInterval(breathTimerRef.current);
            setBreathingActive(false);
            return;
          }
          setBreathCycle(currentCycle);
        }
        setBreathPhase(currentPhase);
        phaseRemaining = pattern.phases[currentPhase].duration;
        setBreathTimer(phaseRemaining);
      }
    }, 1000);
  }, [stopBreathing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try { oscillatorRef.current?.stop(); } catch { /* */ }
      try { binauralOscLRef.current?.stop(); } catch { /* */ }
      try { binauralOscRRef.current?.stop(); } catch { /* */ }
      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
      if (breathTimerRef.current) clearInterval(breathTimerRef.current);
      if (colorTimeoutRef.current) clearTimeout(colorTimeoutRef.current);
    };
  }, []);

  /* ── Color therapy ──────────────────────────────────── */
  const flashColor = (hex: string) => {
    if (colorTimeoutRef.current) clearTimeout(colorTimeoutRef.current);
    setActiveColor(hex);
    colorTimeoutRef.current = setTimeout(() => setActiveColor(null), 5000);
  };

  /* ── Breathing circle scale ─────────────────────────── */
  const getBreathScale = () => {
    if (!breathingActive || !breathingPattern) return 1;
    const phase = breathingPattern.phases[breathPhase];
    if (!phase) return 1;
    const lbl = phase.label.toLowerCase();
    if (lbl.includes('inhale') || lbl.includes('power')) return 1.6;
    if (lbl.includes('exhale') || lbl.includes('let go')) return 0.6;
    return 1.2;
  };

  const sections = [
    { id: 'frequencies' as const, label: 'Frequencies', icon: Music },
    { id: 'binaural' as const, label: 'Binaural Beats', icon: Brain },
    { id: 'breathing' as const, label: 'Breathing', icon: Wind },
    { id: 'color' as const, label: 'Color Therapy', icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-bg-void text-text-primary font-body relative">
      {/* Color therapy fullscreen overlay */}
      {activeColor && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center cursor-pointer transition-opacity duration-500"
          style={{ backgroundColor: activeColor + 'DD' }}
          onClick={() => { setActiveColor(null); if (colorTimeoutRef.current) clearTimeout(colorTimeoutRef.current); }}
        >
          <div className="text-center">
            <p className="text-white text-2xl font-heading font-bold mb-2">
              {COLORS.find((c) => c.hex === activeColor)?.name} Light
            </p>
            <p className="text-white/60 text-sm mb-1">
              {COLORS.find((c) => c.hex === activeColor)?.chakra}
            </p>
            <p className="text-white/40 text-xs mt-4">Tap anywhere to dismiss (auto-closes in 5s)</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-blue-500/20 bg-bg-void/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-text-muted hover:text-text-secondary transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                <Waves className="w-5 h-5 text-genesis-blue" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-xl tracking-wide" style={{ color: '#0066FF' }}>
                  THERAPY
                </h1>
                <p className="text-xs text-text-muted">Sound, Light &amp; Frequency Healing</p>
              </div>
            </div>
          </div>
          {/* Volume control */}
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-text-muted" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-genesis-blue [&::-webkit-slider-thumb]:rounded-full"
            />
            <span className="text-[10px] text-text-muted font-mono w-8">{Math.round(volume * 100)}%</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Section Navigation */}
        <div className="flex gap-1 bg-bg-surface rounded-lg p-1 border border-blue-500/10 mb-8">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`flex-1 py-2.5 px-3 rounded-md text-sm font-heading font-medium transition-all flex items-center justify-center gap-2 ${
                  activeSection === sec.id
                    ? 'bg-blue-500/15 text-genesis-blue border border-blue-500/30'
                    : 'text-text-muted hover:text-text-secondary border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Frequencies ────────────────────────────────── */}
        {activeSection === 'frequencies' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-2xl" style={{ color: '#0066FF' }}>
                Healing Frequencies
              </h2>
              {/* Waveform selector */}
              <div className="flex items-center gap-1 bg-bg-surface rounded-lg p-1 border border-blue-500/10">
                {(['sine', 'square', 'triangle'] as WaveformType[]).map((wf) => (
                  <button
                    key={wf}
                    onClick={() => setWaveform(wf)}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all capitalize ${
                      waveform === wf
                        ? 'bg-blue-500/15 text-genesis-blue border border-blue-500/30'
                        : 'text-text-muted hover:text-text-secondary border border-transparent'
                    }`}
                  >
                    {wf}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FREQUENCIES.map((freq) => {
                const isPlaying = playingFreq === freq.hz;
                return (
                  <div
                    key={freq.hz}
                    className={`rounded-xl border transition-all ${
                      isPlaying
                        ? 'border-blue-500/40 bg-blue-500/5 shadow-[0_0_20px_rgba(0,102,255,0.1)]'
                        : 'border-white/8 bg-bg-card/60 hover:border-white/15'
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="font-mono text-2xl font-bold" style={{ color: '#0066FF' }}>
                            {freq.hz}
                          </span>
                          <span className="text-text-muted text-sm ml-1">Hz</span>
                        </div>
                        <button
                          onClick={() => playFrequency(freq.hz)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isPlaying
                              ? 'bg-genesis-blue text-white shadow-[0_0_15px_rgba(0,102,255,0.4)]'
                              : 'bg-blue-500/10 border border-blue-500/30 text-genesis-blue hover:bg-blue-500/20'
                          }`}
                        >
                          {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </button>
                      </div>
                      <h3 className="font-heading font-semibold text-sm text-text-primary mb-2">{freq.name}</h3>
                      <p className="text-xs text-text-secondary leading-relaxed mb-3">{freq.description}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: freq.chakraColor }} />
                        <span className="text-[10px] text-text-muted">{freq.chakra} Chakra</span>
                      </div>
                      {isPlaying && (
                        <div className="mt-3 flex items-center gap-2">
                          <Activity className="w-3 h-3 text-genesis-blue animate-pulse" />
                          <span className="text-[10px] text-genesis-blue font-mono">Playing {waveform} wave</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Binaural Beats ─────────────────────────────── */}
        {activeSection === 'binaural' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-heading font-bold text-2xl mb-2" style={{ color: '#0066FF' }}>
                Binaural Beats
              </h2>
              <p className="text-text-secondary text-sm mb-6">
                Binaural beats work by playing two slightly different frequencies in each ear. Your brain perceives the difference as a rhythmic pulse, entraining brainwaves to match. <strong className="text-text-primary">Headphones required</strong> for the binaural effect.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BINAURAL_PRESETS.map((preset) => {
                const isPlaying = playingBinaural === preset.name;
                return (
                  <div
                    key={preset.name}
                    className={`rounded-xl border transition-all ${
                      isPlaying
                        ? 'border-blue-500/40 bg-blue-500/5 shadow-[0_0_20px_rgba(0,102,255,0.1)]'
                        : 'border-white/8 bg-bg-card/60 hover:border-white/15'
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-heading font-bold text-lg text-text-primary">{preset.name}</h3>
                          <span className="text-xs font-mono text-genesis-blue">{preset.rangeLabel}</span>
                        </div>
                        <button
                          onClick={() => playBinaural(preset)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isPlaying
                              ? 'bg-genesis-blue text-white shadow-[0_0_15px_rgba(0,102,255,0.4)]'
                              : 'bg-blue-500/10 border border-blue-500/30 text-genesis-blue hover:bg-blue-500/20'
                          }`}
                        >
                          {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </button>
                      </div>
                      <p className="text-xs text-text-secondary mb-3">{preset.brainState}</p>
                      {isPlaying && (
                        <div className="mb-3 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                          <div className="flex items-center justify-between text-[10px] font-mono text-genesis-blue">
                            <span>L: {preset.baseFreq} Hz</span>
                            <span>R: {preset.baseFreq + preset.beatFreq} Hz</span>
                            <span>Beat: {preset.beatFreq} Hz</span>
                          </div>
                        </div>
                      )}
                      <ul className="space-y-1">
                        {preset.benefits.map((b, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-text-muted">
                            <span className="text-genesis-blue mt-0.5 shrink-0">&bull;</span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Breathing Guide ────────────────────────────── */}
        {activeSection === 'breathing' && (
          <div className="space-y-6">
            <h2 className="font-heading font-bold text-2xl mb-6" style={{ color: '#0066FF' }}>
              Breathing Guide
            </h2>

            {/* Pattern selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
              {BREATHING_PATTERNS.map((pattern) => (
                <button
                  key={pattern.name}
                  onClick={() => {
                    if (breathingActive && breathingPattern?.name === pattern.name) {
                      stopBreathing();
                    } else {
                      startBreathing(pattern);
                    }
                  }}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    breathingPattern?.name === pattern.name && breathingActive
                      ? 'border-blue-500/40 bg-blue-500/5'
                      : 'border-white/8 bg-bg-card/60 hover:border-white/15'
                  }`}
                >
                  <h3 className="font-heading font-semibold text-sm text-text-primary mb-1">{pattern.name}</h3>
                  <p className="text-xs text-text-muted line-clamp-2">{pattern.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] font-mono text-genesis-blue">
                      {pattern.phases.map((p) => p.duration).join('-')}s
                    </span>
                    <span className="text-[10px] text-text-muted">&middot; {pattern.cycles} cycles</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Breathing visualizer */}
            <div className="flex flex-col items-center py-12">
              <div className="relative mb-8">
                <div
                  className="w-48 h-48 rounded-full flex items-center justify-center"
                  style={{
                    transform: `scale(${getBreathScale()})`,
                    transitionDuration: breathingActive && breathingPattern
                      ? `${breathingPattern.phases[breathPhase]?.duration || 1}s`
                      : '0.3s',
                    transitionTimingFunction: 'ease-in-out',
                    transitionProperty: 'transform',
                    background: breathingActive
                      ? 'radial-gradient(circle, rgba(0,102,255,0.15) 0%, rgba(0,102,255,0.05) 50%, transparent 70%)'
                      : 'radial-gradient(circle, rgba(0,102,255,0.08) 0%, transparent 70%)',
                    border: breathingActive ? '2px solid rgba(0,102,255,0.3)' : '2px solid rgba(0,102,255,0.1)',
                    boxShadow: breathingActive ? '0 0 40px rgba(0,102,255,0.15), inset 0 0 40px rgba(0,102,255,0.05)' : 'none',
                  }}
                >
                  <div className="text-center">
                    {breathingActive && breathingPattern ? (
                      <>
                        <p className="font-heading font-bold text-xl" style={{ color: '#0066FF' }}>
                          {breathingPattern.phases[breathPhase]?.label || 'Done'}
                        </p>
                        <p className="font-mono text-3xl font-bold text-text-primary mt-1">{breathTimer}</p>
                      </>
                    ) : (
                      <>
                        <Circle className="w-8 h-8 text-genesis-blue mx-auto mb-2 opacity-40" />
                        <p className="text-sm text-text-muted">Select a pattern</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {breathingActive && breathingPattern && (
                <div className="text-center space-y-2">
                  <p className="text-sm text-text-secondary">
                    Cycle {breathCycle + 1} of {breathingPattern.cycles}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Timer className="w-3 h-3" />
                    <span className="font-mono">
                      {Math.floor(breathElapsed / 60)}:{String(breathElapsed % 60).padStart(2, '0')}
                    </span>
                  </div>
                  <button
                    onClick={stopBreathing}
                    className="mt-4 px-4 py-2 rounded-lg text-sm border border-red-500/30 text-genesis-red hover:bg-red-500/10 transition-colors"
                  >
                    Stop
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Color Therapy ──────────────────────────────── */}
        {activeSection === 'color' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-heading font-bold text-2xl mb-2" style={{ color: '#0066FF' }}>
                Color Therapy (Chromotherapy)
              </h2>
              <p className="text-text-secondary text-sm mb-6">
                Each color corresponds to a specific frequency of visible light and is associated with particular chakras and healing properties. Click a color to immerse your screen in that frequency.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => flashColor(color.hex)}
                  className="group text-left rounded-xl border border-white/8 bg-bg-card/60 hover:border-white/15 transition-all overflow-hidden"
                >
                  <div
                    className="h-16 w-full relative"
                    style={{
                      background: `linear-gradient(135deg, ${color.hex}40, ${color.hex}15)`,
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: `linear-gradient(135deg, ${color.hex}60, ${color.hex}25)` }}
                    />
                    <div className="absolute bottom-2 right-3">
                      <div
                        className="w-8 h-8 rounded-full border-2"
                        style={{
                          backgroundColor: color.hex,
                          borderColor: `${color.hex}CC`,
                          boxShadow: `0 0 15px ${color.hex}50`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-bold text-sm mb-1" style={{ color: color.hex }}>
                      {color.name}
                    </h3>
                    <p className="text-[10px] text-text-muted mb-2">{color.chakra}</p>
                    <p className="text-xs text-text-secondary leading-relaxed">{color.properties}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 rounded-xl border border-blue-500/15 bg-blue-500/5 p-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-genesis-blue shrink-0 mt-0.5" />
          <p className="text-text-muted text-xs leading-relaxed">
            These therapies are for relaxation and exploration. They are not medical treatments. Sound therapy, color therapy, and breathing exercises are complementary practices and should not replace professional medical care. If you have epilepsy or are sensitive to specific frequencies or flashing colors, use caution. Consult a healthcare provider for any medical concerns.
          </p>
        </div>
      </main>
    </div>
  );
}

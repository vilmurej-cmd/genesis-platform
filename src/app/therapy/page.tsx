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
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';

/* ── Types ──────────────────────────────────────────────── */
type WaveformType = 'sine' | 'square' | 'triangle';

interface FrequencyPreset {
  hz: number;
  name: string;
  description: string;
  chakra: string;
  chakraColor: string;
  isHighlighted?: boolean;
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
  purpose: string;
}

/* ── Frequency Presets — arranged in circle ──────────────── */
const FREQUENCIES: FrequencyPreset[] = [
  { hz: 396, name: 'Liberating Guilt', description: 'Releases guilt and fear. Turns grief into joy and liberates the mind from negative thought patterns.', chakra: 'Root', chakraColor: '#FF3366' },
  { hz: 417, name: 'Undoing Situations', description: 'Facilitates change and helps undo situations that have negative outcomes. Clears traumatic experiences.', chakra: 'Sacral', chakraColor: '#FF9933' },
  { hz: 528, name: 'Transformation', description: 'Called the "Love Frequency" or "Miracle Tone." Used in molecular biology to repair DNA. Deep healing at the cellular level.', chakra: 'Solar Plexus', chakraColor: '#FFD700', isHighlighted: true },
  { hz: 639, name: 'Connecting', description: 'Enhances communication, understanding, tolerance, and love. Balances relationships and family connections.', chakra: 'Heart', chakraColor: '#00FF94' },
  { hz: 741, name: 'Expression', description: 'Linked to self-expression and solutions. Cleanses cells of toxins, helps with problem solving, and awakens intuition.', chakra: 'Throat', chakraColor: '#00E5FF' },
  { hz: 852, name: 'Spiritual Order', description: 'Connected to the third eye. Awakens intuition, raises consciousness to a higher plane of awareness.', chakra: 'Third Eye', chakraColor: '#6633CC' },
  { hz: 963, name: 'Divine Consciousness', description: 'Connected to the crown chakra and the pineal gland. Enables direct experience of the divine and spiritual transcendence.', chakra: 'Crown', chakraColor: '#9945FF' },
];

/* ── Binaural Beat Presets ──────────────────────────────── */
const BINAURAL_PRESETS: BinauralPreset[] = [
  {
    name: 'Deep Sleep',
    rangeLabel: 'Delta (1-4 Hz)',
    baseFreq: 200,
    beatFreq: 2,
    brainState: 'Delta waves — deep dreamless sleep, unconscious body recovery',
    benefits: ['Profound physical rest', 'Growth hormone release', 'Immune system restoration', 'Deep unconscious processing'],
  },
  {
    name: 'Meditation',
    rangeLabel: 'Theta (4-8 Hz)',
    baseFreq: 200,
    beatFreq: 6,
    brainState: 'Theta waves — deep meditation, creativity, REM sleep',
    benefits: ['Deep meditative states', 'Enhanced creativity', 'Emotional processing', 'Subconscious access'],
  },
  {
    name: 'Relaxation',
    rangeLabel: 'Alpha (8-12 Hz)',
    baseFreq: 200,
    beatFreq: 10,
    brainState: 'Alpha waves — relaxed alertness, calm awareness',
    benefits: ['Stress reduction', 'Calm focus', 'Mind-body integration', 'Reduced anxiety'],
  },
  {
    name: 'Focus',
    rangeLabel: 'Beta (12-30 Hz)',
    baseFreq: 200,
    beatFreq: 18,
    brainState: 'Beta waves — active concentration, analytical thinking',
    benefits: ['Enhanced concentration', 'Active problem solving', 'Alert awareness', 'Mental endurance'],
  },
];

/* ── Breathing Patterns ─────────────────────────────────── */
const BREATHING_PATTERNS: BreathingPattern[] = [
  {
    name: '4-7-8 Relaxation',
    description: 'Developed by Dr. Andrew Weil, this pattern activates the parasympathetic nervous system. The extended exhale triggers the relaxation response.',
    phases: [
      { label: 'Breathe in', duration: 4 },
      { label: 'Hold', duration: 7 },
      { label: 'Breathe out', duration: 8 },
    ],
    cycles: 4,
  },
  {
    name: 'Box Breathing (4-4-4-4)',
    description: 'Used by Navy SEALs and first responders for stress management. Equal durations create a balanced, grounding rhythm.',
    phases: [
      { label: 'Breathe in', duration: 4 },
      { label: 'Hold', duration: 4 },
      { label: 'Breathe out', duration: 4 },
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
  { name: 'Blue', hex: '#0066FF', chakra: 'Throat (Vishuddha)', properties: 'Communication, truth, peace, serenity. Reduces blood pressure, calms the mind, promotes restful sleep.', purpose: 'Alertness & Calm' },
  { name: 'Red', hex: '#FF3366', chakra: 'Root (Muladhara)', properties: 'Grounding, vitality, courage, physical energy. Stimulates circulation and adrenal function.', purpose: 'Relaxation & Warmth' },
  { name: 'Green', hex: '#00FF94', chakra: 'Heart (Anahata)', properties: 'Love, harmony, balance, renewal. Promotes healing, reduces inflammation, calms the nervous system.', purpose: 'Balance & Healing' },
  { name: 'Amber', hex: '#FF9933', chakra: 'Sacral (Svadhisthana)', properties: 'Creativity, emotional balance, joy, warmth. Supports mood and combats seasonal affective patterns.', purpose: 'Relaxation & Warmth' },
  { name: 'Violet', hex: '#9945FF', chakra: 'Crown (Sahasrara)', properties: 'Spiritual connection, transcendence, divine awareness. Calms the nervous system, promotes meditation.', purpose: 'Meditation' },
  { name: 'Gold', hex: '#FFD700', chakra: 'Solar Plexus (Manipura)', properties: 'Confidence, personal power, mental clarity, optimism. Stimulates intellect and nervous system.', purpose: 'Mental Clarity' },
  { name: 'Indigo', hex: '#4A00E0', chakra: 'Third Eye (Ajna)', properties: 'Intuition, perception, inner wisdom. Deepens awareness, supports pineal gland, enhances visualization.', purpose: 'Intuition' },
];

/* ── Session Duration Options ─────────────────────────────── */
const SESSION_DURATIONS = [
  { label: '2 min', seconds: 120 },
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
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

  // Ambient sound for breathing
  const ambientNoiseRef = useRef<OscillatorNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const ambientFilterRef = useRef<BiquadFilterNode | null>(null);

  // Color therapy state
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [colorIntensity, setColorIntensity] = useState(0.85);
  const [colorDuration, setColorDuration] = useState(300);
  const [colorTimeRemaining, setColorTimeRemaining] = useState(0);
  const colorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const colorIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Breathing session duration
  const [breathSessionDuration, setBreathSessionDuration] = useState(120);

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
    try { oscillatorRef.current?.stop(); } catch { /* */ }
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
    if (playingFreq === hz) { stopFrequency(); return; }
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

  const playBinauralPreset = useCallback((preset: BinauralPreset) => {
    if (playingBinaural === preset.name) { stopBinaural(); return; }
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

  useEffect(() => {
    const t = audioCtxRef.current?.currentTime || 0;
    if (gainNodeRef.current) gainNodeRef.current.gain.setValueAtTime(volume, t);
    if (binauralGainLRef.current) binauralGainLRef.current.gain.setValueAtTime(volume, t);
    if (binauralGainRRef.current) binauralGainRRef.current.gain.setValueAtTime(volume, t);
  }, [volume]);

  useEffect(() => {
    if (oscillatorRef.current) oscillatorRef.current.type = waveform;
  }, [waveform]);

  /* ── Ambient ocean sound (Web Audio noise) ─────────── */
  const startAmbient = useCallback(() => {
    try {
      const ctx = getAudioCtx();
      // White noise via oscillator approximation
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(60, ctx.currentTime);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, ctx.currentTime);
      filter.Q.setValueAtTime(1, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      ambientNoiseRef.current = osc;
      ambientGainRef.current = gain;
      ambientFilterRef.current = filter;
    } catch { /* */ }
  }, [getAudioCtx]);

  const stopAmbient = useCallback(() => {
    try { ambientNoiseRef.current?.stop(); } catch { /* */ }
    ambientNoiseRef.current?.disconnect();
    ambientGainRef.current?.disconnect();
    ambientFilterRef.current?.disconnect();
    ambientNoiseRef.current = null;
    ambientGainRef.current = null;
    ambientFilterRef.current = null;
  }, []);

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
    stopAmbient();
  }, [stopAmbient]);

  const startBreathing = useCallback((pattern: BreathingPattern) => {
    stopBreathing();
    setBreathingPattern(pattern);
    setBreathingActive(true);
    setBreathPhase(0);
    setBreathCycle(0);
    setBreathElapsed(0);
    startAmbient();

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
            // Play completion bell
            try {
              const ctx = getAudioCtx();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(523, ctx.currentTime);
              gain.gain.setValueAtTime(0.15, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start();
              osc.stop(ctx.currentTime + 1.5);
            } catch { /* */ }
            return;
          }
          setBreathCycle(currentCycle);
        }
        setBreathPhase(currentPhase);
        phaseRemaining = pattern.phases[currentPhase].duration;
        setBreathTimer(phaseRemaining);
      }
    }, 1000);
  }, [stopBreathing, startAmbient, getAudioCtx]);

  useEffect(() => {
    return () => {
      try { oscillatorRef.current?.stop(); } catch { /* */ }
      try { binauralOscLRef.current?.stop(); } catch { /* */ }
      try { binauralOscRRef.current?.stop(); } catch { /* */ }
      try { ambientNoiseRef.current?.stop(); } catch { /* */ }
      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
      if (breathTimerRef.current) clearInterval(breathTimerRef.current);
      if (colorTimeoutRef.current) clearTimeout(colorTimeoutRef.current);
      if (colorIntervalRef.current) clearInterval(colorIntervalRef.current);
    };
  }, []);

  /* ── Color therapy ──────────────────────────────────── */
  const startColorTherapy = (hex: string) => {
    if (colorTimeoutRef.current) clearTimeout(colorTimeoutRef.current);
    if (colorIntervalRef.current) clearInterval(colorIntervalRef.current);
    setActiveColor(hex);
    setColorTimeRemaining(colorDuration);

    colorIntervalRef.current = setInterval(() => {
      setColorTimeRemaining(prev => {
        if (prev <= 1) {
          setActiveColor(null);
          if (colorIntervalRef.current) clearInterval(colorIntervalRef.current);
          // Play gentle bell
          try {
            const ctx = getAudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 1);
          } catch { /* */ }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopColorTherapy = () => {
    setActiveColor(null);
    if (colorTimeoutRef.current) clearTimeout(colorTimeoutRef.current);
    if (colorIntervalRef.current) clearInterval(colorIntervalRef.current);
  };

  /* ── Breathing circle ─────────────────────────────── */
  const getBreathScale = () => {
    if (!breathingActive || !breathingPattern) return 1;
    const phase = breathingPattern.phases[breathPhase];
    if (!phase) return 1;
    const lbl = phase.label.toLowerCase();
    if (lbl.includes('in') || lbl.includes('power')) return 1.6;
    if (lbl.includes('out') || lbl.includes('let go')) return 0.6;
    return 1.2;
  };

  const getBreathColor = () => {
    if (!breathingActive || !breathingPattern) return '#0066FF';
    const phase = breathingPattern.phases[breathPhase];
    if (!phase) return '#0066FF';
    const lbl = phase.label.toLowerCase();
    if (lbl.includes('in') || lbl.includes('power')) return '#00E5FF'; // Cool blue
    if (lbl.includes('out') || lbl.includes('let go')) return '#FFD700'; // Warm gold
    return '#0066FF';
  };

  const sections = [
    { id: 'frequencies' as const, label: 'Frequencies', icon: Music },
    { id: 'binaural' as const, label: 'Binaural Beats', icon: Brain },
    { id: 'breathing' as const, label: 'Breathing', icon: Wind },
    { id: 'color' as const, label: 'Light Therapy', icon: Palette },
  ];

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-bg-void text-text-primary font-body relative">
      {/* Color therapy fullscreen overlay */}
      {activeColor && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center cursor-pointer transition-all duration-1000"
          style={{ backgroundColor: activeColor + Math.round(colorIntensity * 255).toString(16).padStart(2, '0') }}
          onClick={stopColorTherapy}
        >
          <div className="text-center">
            <p className="text-white text-3xl font-heading font-bold mb-2">
              {COLORS.find((c) => c.hex === activeColor)?.name} Light
            </p>
            <p className="text-white/60 text-sm mb-1">
              {COLORS.find((c) => c.hex === activeColor)?.chakra}
            </p>
            <p className="text-white/80 font-mono text-4xl font-bold mt-4">
              {formatTime(colorTimeRemaining)}
            </p>
            <p className="text-white/30 text-xs mt-6">Best used in a dark room. Tap anywhere to stop.</p>

            {/* Intensity control in overlay */}
            <div className="mt-8 flex items-center gap-3 justify-center">
              <Moon className="w-4 h-4 text-white/40" />
              <input
                type="range"
                min="0.3"
                max="1"
                step="0.05"
                value={colorIntensity}
                onChange={(e) => setColorIntensity(parseFloat(e.target.value))}
                onClick={(e) => e.stopPropagation()}
                className="w-32 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
              />
              <Sun className="w-4 h-4 text-white/40" />
            </div>
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
                  THERAPY SUITE
                </h1>
                <p className="text-xs text-text-muted">Sound, Light &amp; Frequency Healing</p>
              </div>
            </div>
          </div>
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
        <div className="flex gap-1 bg-bg-surface rounded-xl p-1 border border-blue-500/10 mb-8">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-heading font-medium transition-all flex items-center justify-center gap-2 ${
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

        {/* ── Frequencies — Glowing Orbs in Circle ────────── */}
        {activeSection === 'frequencies' && (
          <div className="space-y-8">
            <div className="text-center mb-4">
              <h2 className="font-heading font-bold text-2xl mb-2" style={{ color: '#0066FF' }}>
                Solfeggio Frequencies
              </h2>
              <p className="text-text-secondary text-sm">Select a frequency orb to begin healing</p>
            </div>

            {/* Waveform selector */}
            <div className="flex items-center justify-center gap-1 mb-6">
              <span className="text-[10px] text-text-muted font-mono mr-2">WAVE</span>
              {(['sine', 'square', 'triangle'] as WaveformType[]).map((wf) => (
                <button
                  key={wf}
                  onClick={() => setWaveform(wf)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all capitalize ${
                    waveform === wf
                      ? 'bg-blue-500/15 text-genesis-blue border border-blue-500/30'
                      : 'text-text-muted hover:text-text-secondary border border-transparent'
                  }`}
                >
                  {wf}
                </button>
              ))}
            </div>

            {/* Orbs arranged in a circle */}
            <div className="relative mx-auto" style={{ width: 420, height: 420 }}>
              {/* Center label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <Sparkles className="w-6 h-6 text-genesis-blue/30 mx-auto mb-1" />
                  <p className="text-[10px] text-text-muted font-mono">SOLFEGGIO</p>
                </div>
              </div>

              {FREQUENCIES.map((freq, i) => {
                const angle = (i / FREQUENCIES.length) * Math.PI * 2 - Math.PI / 2;
                const radius = 160;
                const x = Math.cos(angle) * radius + 210 - 40;
                const y = Math.sin(angle) * radius + 210 - 40;
                const isPlaying = playingFreq === freq.hz;

                return (
                  <button
                    key={freq.hz}
                    onClick={() => playFrequency(freq.hz)}
                    className="absolute w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all duration-500 hover:scale-110"
                    style={{
                      left: x,
                      top: y,
                      backgroundColor: isPlaying ? freq.chakraColor + '30' : freq.chakraColor + '12',
                      border: `2px solid ${isPlaying ? freq.chakraColor + '80' : freq.chakraColor + '30'}`,
                      boxShadow: isPlaying
                        ? `0 0 25px ${freq.chakraColor}50, 0 0 50px ${freq.chakraColor}20, inset 0 0 20px ${freq.chakraColor}15`
                        : freq.isHighlighted
                        ? `0 0 15px ${freq.chakraColor}20`
                        : 'none',
                      animation: isPlaying ? 'pulse-glow 2s ease-in-out infinite' : 'none',
                    }}
                    title={`${freq.hz} Hz — ${freq.name}`}
                  >
                    <span className="font-mono text-sm font-bold" style={{ color: freq.chakraColor }}>
                      {freq.hz}
                    </span>
                    <span className="text-[8px] text-text-muted mt-0.5">Hz</span>
                    {isPlaying && (
                      <>
                        {/* Pulse rings */}
                        <div className="absolute inset-0 rounded-full animate-ping" style={{
                          border: `1px solid ${freq.chakraColor}30`,
                          animationDuration: '2s',
                        }} />
                        <div className="absolute -inset-2 rounded-full animate-ping" style={{
                          border: `1px solid ${freq.chakraColor}15`,
                          animationDuration: '3s',
                        }} />
                      </>
                    )}
                    {freq.isHighlighted && !isPlaying && (
                      <span className="absolute -bottom-5 text-[8px] font-heading font-semibold" style={{ color: freq.chakraColor }}>
                        LOVE
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Currently playing info */}
            {playingFreq && (
              <div className="max-w-md mx-auto rounded-xl border border-blue-500/20 bg-bg-surface p-5 text-center">
                {(() => {
                  const freq = FREQUENCIES.find(f => f.hz === playingFreq);
                  if (!freq) return null;
                  return (
                    <>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: freq.chakraColor }} />
                        <span className="font-heading font-bold text-lg" style={{ color: freq.chakraColor }}>
                          {freq.hz} Hz — {freq.name}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary mb-2">{freq.description}</p>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: freq.chakraColor }} />
                        <span className="text-[10px] text-text-muted">{freq.chakra} Chakra</span>
                        <span className="text-[10px] text-text-muted mx-1">&middot;</span>
                        <Activity className="w-3 h-3 text-genesis-blue" />
                        <span className="text-[10px] text-genesis-blue font-mono">{waveform} wave</span>
                      </div>
                      <button
                        onClick={() => stopFrequency()}
                        className="mt-3 px-4 py-1.5 rounded-lg text-xs font-heading border border-red-500/30 text-genesis-red hover:bg-red-500/10 transition-colors"
                      >
                        Stop
                      </button>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Background visualization hint */}
            {playingFreq && (
              <div className="fixed inset-0 pointer-events-none z-0 transition-all duration-1000" style={{
                background: `radial-gradient(ellipse at 50% 50%, ${FREQUENCIES.find(f => f.hz === playingFreq)?.chakraColor}08 0%, transparent 60%)`,
              }} />
            )}
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
                Two slightly different frequencies in each ear. Your brain perceives the difference as a rhythmic pulse, entraining brainwaves to match. <strong className="text-text-primary">Headphones required.</strong>
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
                          onClick={() => playBinauralPreset(preset)}
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

        {/* ── Breathing Guide — Full-screen circle ─────────── */}
        {activeSection === 'breathing' && (
          <div className="space-y-6">
            <h2 className="font-heading font-bold text-2xl mb-2 text-center" style={{ color: '#0066FF' }}>
              Guided Breathing
            </h2>

            {/* Pattern selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
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

            {/* Full-screen breathing circle */}
            <div className="flex flex-col items-center py-16 relative">
              {/* Background color shift */}
              {breathingActive && (
                <div className="absolute inset-0 pointer-events-none transition-all duration-1000 rounded-3xl" style={{
                  background: `radial-gradient(circle at 50% 40%, ${getBreathColor()}08 0%, transparent 60%)`,
                }} />
              )}

              <div className="relative mb-10">
                <div
                  className="w-56 h-56 sm:w-72 sm:h-72 rounded-full flex items-center justify-center"
                  style={{
                    transform: `scale(${getBreathScale()})`,
                    transitionDuration: breathingActive && breathingPattern
                      ? `${breathingPattern.phases[breathPhase]?.duration || 1}s`
                      : '0.3s',
                    transitionTimingFunction: 'ease-in-out',
                    transitionProperty: 'transform',
                    background: breathingActive
                      ? `radial-gradient(circle, ${getBreathColor()}20 0%, ${getBreathColor()}08 50%, transparent 70%)`
                      : 'radial-gradient(circle, rgba(0,102,255,0.08) 0%, transparent 70%)',
                    border: breathingActive ? `2px solid ${getBreathColor()}40` : '2px solid rgba(0,102,255,0.1)',
                    boxShadow: breathingActive ? `0 0 60px ${getBreathColor()}20, inset 0 0 40px ${getBreathColor()}08` : 'none',
                  }}
                >
                  <div className="text-center">
                    {breathingActive && breathingPattern ? (
                      <>
                        <p className="font-heading font-bold text-2xl sm:text-3xl" style={{ color: getBreathColor() }}>
                          {breathingPattern.phases[breathPhase]?.label || 'Complete'}
                        </p>
                        <p className="font-mono text-5xl sm:text-6xl font-bold text-text-primary mt-2">{breathTimer}</p>
                        {/* Guided counting */}
                        <p className="text-text-muted text-sm mt-2 font-mono">
                          {breathingPattern.phases[breathPhase]?.label.toLowerCase().includes('in') && `... ${breathingPattern.phases[breathPhase].duration - breathTimer + 1} ...`}
                          {breathingPattern.phases[breathPhase]?.label.toLowerCase().includes('hold') && `... ${breathingPattern.phases[breathPhase].duration - breathTimer + 1} ...`}
                          {breathingPattern.phases[breathPhase]?.label.toLowerCase().includes('out') && `... ${breathingPattern.phases[breathPhase].duration - breathTimer + 1} ...`}
                        </p>
                      </>
                    ) : (
                      <>
                        <Circle className="w-10 h-10 text-genesis-blue mx-auto mb-3 opacity-40" />
                        <p className="text-sm text-text-muted">Select a pattern to begin</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Outer breathing ring */}
                {breathingActive && (
                  <div
                    className="absolute -inset-4 rounded-full border transition-all"
                    style={{
                      borderColor: `${getBreathColor()}15`,
                      transform: `scale(${getBreathScale() * 0.95})`,
                      transitionDuration: breathingActive && breathingPattern
                        ? `${breathingPattern.phases[breathPhase]?.duration || 1}s`
                        : '0.3s',
                      transitionTimingFunction: 'ease-in-out',
                    }}
                  />
                )}
              </div>

              {breathingActive && breathingPattern && (
                <div className="text-center space-y-3 relative z-10">
                  <p className="text-text-secondary text-sm">
                    Cycle {breathCycle + 1} of {breathingPattern.cycles}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-text-muted justify-center">
                    <Timer className="w-3 h-3" />
                    <span className="font-mono">
                      {Math.floor(breathElapsed / 60)}:{String(breathElapsed % 60).padStart(2, '0')}
                    </span>
                  </div>
                  <button
                    onClick={stopBreathing}
                    className="mt-4 px-6 py-2.5 rounded-xl text-sm font-heading font-semibold border border-red-500/30 text-genesis-red hover:bg-red-500/10 transition-colors"
                  >
                    Stop
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Light Therapy (Color) ────────────────────────── */}
        {activeSection === 'color' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-heading font-bold text-2xl mb-2" style={{ color: '#0066FF' }}>
                Light Therapy
              </h2>
              <p className="text-text-secondary text-sm mb-2">
                Immerse your screen in therapeutic colors. Each color corresponds to a specific frequency of visible light.
              </p>
              <p className="text-text-muted text-xs italic">Best used in a dark room for maximum effect.</p>
            </div>

            {/* Duration and intensity controls */}
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-text-muted" />
                <span className="text-xs text-text-muted">Duration:</span>
                <div className="flex gap-1">
                  {SESSION_DURATIONS.map(d => (
                    <button
                      key={d.seconds}
                      onClick={() => setColorDuration(d.seconds)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                        colorDuration === d.seconds
                          ? 'bg-blue-500/15 text-genesis-blue border border-blue-500/30'
                          : 'text-text-muted border border-transparent hover:text-text-secondary'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Moon className="w-3.5 h-3.5 text-text-muted" />
                <input
                  type="range"
                  min="0.3"
                  max="1"
                  step="0.05"
                  value={colorIntensity}
                  onChange={(e) => setColorIntensity(parseFloat(e.target.value))}
                  className="w-24 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-genesis-blue [&::-webkit-slider-thumb]:rounded-full"
                />
                <Sun className="w-3.5 h-3.5 text-text-muted" />
                <span className="text-[10px] text-text-muted font-mono">{Math.round(colorIntensity * 100)}%</span>
              </div>
            </div>

            {/* Color panels — full-width cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => startColorTherapy(color.hex)}
                  className="group text-left rounded-xl border border-white/8 bg-bg-card/60 hover:border-white/15 transition-all overflow-hidden hover:scale-[1.02]"
                >
                  {/* Color preview panel */}
                  <div
                    className="h-24 w-full relative"
                    style={{
                      background: `linear-gradient(135deg, ${color.hex}50, ${color.hex}20)`,
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `linear-gradient(135deg, ${color.hex}70, ${color.hex}35)` }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-1 rounded-full backdrop-blur-sm" style={{
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        color: 'rgba(255,255,255,0.8)',
                      }}>
                        {color.purpose}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                      <Play className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                      <div
                        className="w-10 h-10 rounded-full border-2 shadow-lg"
                        style={{
                          backgroundColor: color.hex,
                          borderColor: `${color.hex}CC`,
                          boxShadow: `0 0 20px ${color.hex}50`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-bold text-sm mb-1" style={{ color: color.hex }}>
                      {color.name} Light
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

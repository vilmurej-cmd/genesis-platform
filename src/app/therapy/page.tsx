'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, Sun, Wind, Zap, Play, Square, Timer, Waves } from 'lucide-react';

/* ── Solfeggio Frequencies ────────────────────────── */
const SOLFEGGIO = [
  { hz: 174, name: 'Foundation', description: 'Pain reduction, sense of security. Acts as a natural anesthetic, reducing physical and energetic pain.', color: '#FF3366' },
  { hz: 285, name: 'Restoration', description: 'Tissue regeneration, cellular repair. Influences the energy field to restore tissues to their original form.', color: '#FF6633' },
  { hz: 396, name: 'Liberation', description: 'Release fear and guilt. Helps turn grief into joy and liberates from deeply rooted fears.', color: '#FF9933' },
  { hz: 417, name: 'Transformation', description: 'Facilitate change, undo negative patterns. Cleanses traumatic experiences and clears destructive influences.', color: '#FFD700' },
  { hz: 432, name: 'Universal', description: 'Natural tuning, cosmic harmony. Mathematically consistent with the patterns of the universe and nature.', color: '#00FF94' },
  { hz: 528, name: 'Miracle', description: 'DNA repair, transformation. Known as the "Love Frequency" — associated with DNA repair and miracles.', color: '#00E5FF' },
  { hz: 639, name: 'Connection', description: 'Harmonize relationships, communication. Enables creation of harmonious interpersonal relationships.', color: '#0066FF' },
  { hz: 741, name: 'Expression', description: 'Awakening intuition, self-expression. Cleans cells of toxins and electromagnetic radiation exposure.', color: '#4A00E0' },
  { hz: 852, name: 'Intuition', description: 'Spiritual order, awakening. Returns to spiritual harmony and raises awareness.', color: '#9945FF' },
  { hz: 963, name: 'Transcendence', description: 'Divine consciousness, oneness. Awakens the perfect state of being, connected to the infinite.', color: '#FF00E5' },
];

/* ── Binaural Beats ───────────────────────────────── */
const BINAURAL = [
  { name: 'Delta', range: '0.5 - 4 Hz', description: 'Deep dreamless sleep, healing, regeneration. The slowest brain wave frequency associated with deep restoration.', brainState: 'Deep Sleep / Healing', color: '#9945FF' },
  { name: 'Theta', range: '4 - 7 Hz', description: 'Meditation, creativity, REM sleep. The twilight state between waking and sleeping where insights emerge.', brainState: 'Meditation / Creativity', color: '#0066FF' },
  { name: 'Alpha', range: '8 - 13 Hz', description: 'Relaxed alertness, calm focus, flow state. The bridge between conscious thinking and the subconscious mind.', brainState: 'Relaxed Focus / Flow', color: '#00E5FF' },
  { name: 'Beta', range: '14 - 30 Hz', description: 'Active thinking, concentration, alertness. Normal waking consciousness and reasoning, active conversations.', brainState: 'Active Thinking / Alert', color: '#00FF94' },
  { name: 'Gamma', range: '30 - 100 Hz', description: 'Peak awareness, higher perception, insight. Associated with bursts of insight and high-level information processing.', brainState: 'Peak Awareness / Insight', color: '#FFD700' },
];

/* ── Light Therapy Wavelengths ────────────────────── */
const LIGHT_RANGES = [
  { min: 380, max: 450, name: 'Violet / Blue', color: '#6B3FA0', uses: ['Acne treatment (kills P. acnes bacteria)', 'Circadian rhythm regulation', 'Seasonal affective disorder (SAD)', 'Antimicrobial photodynamic therapy'], depth: 'Surface (1-2mm)', evidence: 4 },
  { min: 450, max: 520, name: 'Blue / Green', color: '#00A8A8', uses: ['Pain management', 'Migraine prevention and relief', 'Neonatal jaundice treatment', 'Mood regulation'], depth: 'Shallow (2-3mm)', evidence: 3 },
  { min: 520, max: 570, name: 'Green', color: '#00CC66', uses: ['Pain reduction', 'Migraine relief', 'Reduced sensitivity to light', 'Calming effect on nervous system'], depth: 'Moderate (3-5mm)', evidence: 3 },
  { min: 570, max: 620, name: 'Yellow / Orange', color: '#FF9933', uses: ['Mood enhancement', 'Vitamin D synthesis (UV adjacent)', 'Skin rejuvenation', 'Lymphatic stimulation'], depth: 'Moderate (5-8mm)', evidence: 2 },
  { min: 620, max: 660, name: 'Red', color: '#CC3333', uses: ['Skin healing and collagen production', 'Inflammation reduction', 'Wound healing acceleration', 'Joint pain relief'], depth: 'Deep (8-10mm)', evidence: 5 },
  { min: 660, max: 780, name: 'Deep Red / NIR', color: '#8B0000', uses: ['Deep tissue repair', 'Brain health (transcranial PBM)', 'Muscle recovery', 'Mitochondrial function enhancement'], depth: 'Very Deep (10-40mm)', evidence: 4 },
];

/* ── Breathing Exercises ──────────────────────────── */
const BREATHING_EXERCISES = [
  {
    name: 'Box Breathing',
    pattern: [
      { phase: 'Breathe In', duration: 4 },
      { phase: 'Hold', duration: 4 },
      { phase: 'Breathe Out', duration: 4 },
      { phase: 'Hold', duration: 4 },
    ],
    description: 'A technique used by Navy SEALs and first responders. Equal-length phases create calm, controlled breathing that activates the parasympathetic nervous system.',
    benefits: ['Reduces cortisol and stress hormones', 'Effective for anxiety and PTSD', 'Improves focus under pressure', 'Lowers blood pressure'],
    color: '#00E5FF',
  },
  {
    name: '4-7-8 Breathing',
    pattern: [
      { phase: 'Breathe In', duration: 4 },
      { phase: 'Hold', duration: 7 },
      { phase: 'Breathe Out', duration: 8 },
    ],
    description: 'Developed by Dr. Andrew Weil, based on pranayama. The extended exhale triggers a powerful parasympathetic response, making it one of the most effective techniques for falling asleep.',
    benefits: ['Natural tranquilizer for the nervous system', 'Effective for insomnia and sleep onset', 'Reduces anxiety within minutes', 'Can lower heart rate rapidly'],
    color: '#9945FF',
  },
  {
    name: 'Wim Hof Method',
    pattern: [
      { phase: 'Power Breathe', duration: 2 },
      { phase: 'Power Breathe', duration: 2 },
      { phase: 'Power Breathe', duration: 2 },
      { phase: 'Hold (exhale)', duration: 15 },
      { phase: 'Recovery Breath', duration: 3 },
    ],
    description: 'Controlled hyperventilation followed by breath retention. This technique alters blood pH, releases adrenaline, and has been shown in clinical studies to voluntarily influence the immune system.',
    benefits: ['Demonstrated immune system modulation', 'Increases adrenaline and anti-inflammatory markers', 'Improves cold tolerance', 'Enhances energy and mental clarity'],
    color: '#FF3366',
  },
  {
    name: 'Alternate Nostril',
    pattern: [
      { phase: 'Left In', duration: 4 },
      { phase: 'Hold', duration: 2 },
      { phase: 'Right Out', duration: 4 },
      { phase: 'Right In', duration: 4 },
      { phase: 'Hold', duration: 2 },
      { phase: 'Left Out', duration: 4 },
    ],
    description: 'An ancient pranayama technique (Nadi Shodhana) that alternates breathing between nostrils. It balances the autonomic nervous system and harmonizes left and right brain hemispheres.',
    benefits: ['Balances sympathetic and parasympathetic systems', 'Harmonizes brain hemisphere activity', 'Reduces anxiety and promotes calm', 'Improves cardiovascular function'],
    color: '#FFD700',
  },
];

/* ── Sound Wave Visualization ─────────────────────── */
function SoundWave({ color, isPlaying }: { color: string; isPlaying: boolean }) {
  return (
    <div className="flex items-center justify-center gap-[3px] h-12">
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={i}
          className="w-1 rounded-full transition-all"
          style={{
            backgroundColor: color,
            opacity: isPlaying ? 0.7 : 0.15,
            height: isPlaying ? undefined : '4px',
            animation: isPlaying
              ? `soundWave 0.${4 + (i % 5)}s ease-in-out infinite alternate`
              : 'none',
            animationDelay: isPlaying ? `${i * 0.05}s` : '0s',
          }}
        />
      ))}
      <style>{`
        @keyframes soundWave {
          0% { height: 4px; }
          100% { height: ${24 + Math.random() * 20}px; }
        }
      `}</style>
    </div>
  );
}

/* ── Breathing Circle ─────────────────────────────── */
function BreathingCircle({
  exercise,
  isActive,
  onStop,
}: {
  exercise: typeof BREATHING_EXERCISES[0];
  isActive: boolean;
  onStop: () => void;
}) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(exercise.pattern[0].duration);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const elapsedRef = useRef<NodeJS.Timeout | null>(null);

  const currentPhase = exercise.pattern[phaseIndex];
  const isInhale = currentPhase.phase.toLowerCase().includes('in') || currentPhase.phase.toLowerCase().includes('power');
  const isHold = currentPhase.phase.toLowerCase().includes('hold');
  const maxDuration = Math.max(...exercise.pattern.map((p) => p.duration));
  const circleScale = isHold
    ? (phaseIndex > 0 && exercise.pattern[phaseIndex - 1].phase.toLowerCase().includes('in') ? 1 : 0.5)
    : isInhale
    ? 0.5 + 0.5 * (1 - countdown / currentPhase.duration)
    : 1 - 0.5 * (1 - countdown / currentPhase.duration);

  useEffect(() => {
    if (!isActive) return;

    setPhaseIndex(0);
    setCountdown(exercise.pattern[0].duration);
    setElapsed(0);

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setPhaseIndex((pi) => {
            const next = (pi + 1) % exercise.pattern.length;
            setCountdown(exercise.pattern[next].duration);
            return next;
          });
          return 1;
        }
        return prev - 1;
      });
    }, 1000);

    elapsedRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (elapsedRef.current) clearInterval(elapsedRef.current);
    };
  }, [isActive, exercise]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Circle */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full transition-transform duration-1000 ease-in-out"
          style={{
            backgroundColor: `${exercise.color}10`,
            border: `2px solid ${exercise.color}40`,
            boxShadow: `0 0 30px ${exercise.color}20, inset 0 0 30px ${exercise.color}10`,
            transform: `scale(${circleScale})`,
          }}
        />
        <div className="relative text-center z-10">
          <p className="font-heading font-bold text-lg" style={{ color: exercise.color }}>
            {currentPhase.phase}
          </p>
          <p className="font-mono text-3xl text-text-primary">{countdown}s</p>
        </div>
      </div>

      {/* Timer */}
      <div className="flex items-center gap-2 text-text-muted text-sm">
        <Timer className="w-4 h-4" />
        <span className="font-mono">{formatTime(elapsed)}</span>
      </div>

      {/* Stop */}
      <button
        onClick={onStop}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-heading font-semibold border transition-all"
        style={{
          color: exercise.color,
          borderColor: `${exercise.color}30`,
          backgroundColor: `${exercise.color}08`,
        }}
      >
        <Square className="w-4 h-4" />
        Stop
      </button>
    </div>
  );
}

/* ── Evidence Rating ──────────────────────────────── */
function EvidenceRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full border ${
            i < rating ? 'bg-genesis-cyan border-genesis-cyan/60' : 'bg-transparent border-white/15'
          }`}
        />
      ))}
      <span className="text-[10px] text-text-muted ml-1">{rating}/5</span>
    </div>
  );
}

/* ── Main Component ───────────────────────────────── */
export default function TherapyPage() {
  const [playingFreq, setPlayingFreq] = useState<number | null>(null);
  const [playingBinaural, setPlayingBinaural] = useState<string | null>(null);
  const [duration, setDuration] = useState(15);
  const [freqTimer, setFreqTimer] = useState(0);
  const [wavelength, setWavelength] = useState(620);
  const [activeBreathing, setActiveBreathing] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentLightRange = LIGHT_RANGES.find(
    (r) => wavelength >= r.min && wavelength < r.max
  ) || LIGHT_RANGES[LIGHT_RANGES.length - 1];

  // Frequency playback timer
  useEffect(() => {
    if (playingFreq !== null || playingBinaural !== null) {
      setFreqTimer(0);
      timerRef.current = setInterval(() => {
        setFreqTimer((prev) => {
          if (prev + 1 >= duration * 60) {
            setPlayingFreq(null);
            setPlayingBinaural(null);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setFreqTimer(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playingFreq, playingBinaural, duration]);

  const formatTimer = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const toggleFreq = (hz: number) => {
    if (playingFreq === hz) {
      setPlayingFreq(null);
      setPlayingBinaural(null);
    } else {
      setPlayingFreq(hz);
      setPlayingBinaural(null);
    }
  };

  const toggleBinaural = (name: string) => {
    if (playingBinaural === name) {
      setPlayingBinaural(null);
      setPlayingFreq(null);
    } else {
      setPlayingBinaural(name);
      setPlayingFreq(null);
    }
  };

  // Interpolate wavelength → CSS color
  const wavelengthToCSS = (nm: number): string => {
    if (nm < 420) return `hsl(${270 + (nm - 380) * 0.75}, 80%, 50%)`;
    if (nm < 490) return `hsl(${240 - (nm - 420) * 2.5}, 80%, 50%)`;
    if (nm < 530) return `hsl(${180 - (nm - 490)}, 80%, 50%)`;
    if (nm < 570) return `hsl(${120 - (nm - 530) * 1.5}, 80%, 50%)`;
    if (nm < 620) return `hsl(${60 - (nm - 570) * 0.6}, 90%, 50%)`;
    if (nm < 680) return `hsl(${30 - (nm - 620) * 0.5}, 90%, 45%)`;
    return `hsl(0, 80%, ${40 - (nm - 680) * 0.1}%)`;
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-genesis-blue/10 border border-genesis-blue/30 flex items-center justify-center">
              <Volume2 className="w-7 h-7 text-genesis-blue" />
            </div>
          </div>
          <h1 className="font-heading font-black text-5xl sm:text-6xl tracking-tight mb-4">
            <span className="text-genesis-blue" style={{ textShadow: '0 0 20px rgba(0,102,255,0.5), 0 0 40px rgba(0,102,255,0.2)' }}>
              Sound, Light & Frequency
            </span>
            <br />
            <span className="text-text-primary text-3xl sm:text-4xl font-light">Healing</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Explore the therapeutic potential of sound frequencies, light wavelengths, and breathing patterns.
          </p>
        </div>
      </section>

      {/* ── Section 1: Sound Therapy Studio ────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex items-center gap-3 mb-6">
          <Waves className="w-6 h-6 text-genesis-cyan" />
          <h2 className="font-heading font-bold text-2xl text-text-primary">Sound Therapy Studio</h2>
        </div>

        {/* Duration Selector */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-sm text-text-muted">Duration:</span>
          {[5, 15, 30, 60].map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`px-4 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all border ${
                duration === d
                  ? 'border-genesis-cyan/40 bg-genesis-cyan/10 text-genesis-cyan'
                  : 'border-white/8 bg-white/[0.02] text-text-muted hover:border-white/15'
              }`}
            >
              {d} min
            </button>
          ))}
          {(playingFreq !== null || playingBinaural !== null) && (
            <span className="ml-auto text-sm font-mono text-genesis-cyan">
              {formatTimer(freqTimer)} / {duration}:00
            </span>
          )}
        </div>

        {/* Solfeggio Frequencies */}
        <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-text-secondary mb-4">
          Solfeggio Frequencies
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-10">
          {SOLFEGGIO.map((freq) => {
            const isPlaying = playingFreq === freq.hz;
            return (
              <div
                key={freq.hz}
                className={`rounded-2xl border p-4 transition-all duration-500 ${
                  isPlaying ? 'border-white/20 bg-bg-surface' : 'border-white/8 bg-bg-card/60 hover:border-white/15'
                }`}
              >
                <div className="text-center mb-2">
                  <p className="font-heading font-black text-2xl" style={{ color: freq.color }}>
                    {freq.hz}
                  </p>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">Hz</p>
                </div>
                <p className="font-heading font-semibold text-xs text-text-primary text-center mb-1">{freq.name}</p>
                <p className="text-text-muted text-[10px] leading-relaxed text-center mb-3">{freq.description}</p>

                {isPlaying && <SoundWave color={freq.color} isPlaying={true} />}

                <button
                  onClick={() => toggleFreq(freq.hz)}
                  className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-heading font-semibold transition-all border"
                  style={{
                    color: freq.color,
                    borderColor: isPlaying ? `${freq.color}40` : `${freq.color}20`,
                    backgroundColor: isPlaying ? `${freq.color}15` : `${freq.color}05`,
                  }}
                >
                  {isPlaying ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  {isPlaying ? 'Stop' : 'Play'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Binaural Beats */}
        <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-text-secondary mb-4">
          Binaural Beats
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {BINAURAL.map((beat) => {
            const isPlaying = playingBinaural === beat.name;
            return (
              <div
                key={beat.name}
                className={`rounded-2xl border p-5 transition-all duration-500 ${
                  isPlaying ? 'border-white/20 bg-bg-surface' : 'border-white/8 bg-bg-card/60 hover:border-white/15'
                }`}
              >
                <h4 className="font-heading font-bold text-lg mb-0.5" style={{ color: beat.color }}>
                  {beat.name}
                </h4>
                <p className="font-mono text-xs text-text-muted mb-2">{beat.range}</p>
                <p className="text-text-muted text-[11px] leading-relaxed mb-2">{beat.description}</p>
                <p className="text-[10px] mb-3">
                  <span className="text-text-muted">Brain state: </span>
                  <span className="text-text-secondary">{beat.brainState}</span>
                </p>

                {isPlaying && <SoundWave color={beat.color} isPlaying={true} />}

                <button
                  onClick={() => toggleBinaural(beat.name)}
                  className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-heading font-semibold transition-all border"
                  style={{
                    color: beat.color,
                    borderColor: isPlaying ? `${beat.color}40` : `${beat.color}20`,
                    backgroundColor: isPlaying ? `${beat.color}15` : `${beat.color}05`,
                  }}
                >
                  {isPlaying ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  {isPlaying ? 'Stop' : 'Play'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Section 2: Light Therapy Guide ─────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex items-center gap-3 mb-6">
          <Sun className="w-6 h-6 text-genesis-gold" />
          <h2 className="font-heading font-bold text-2xl text-text-primary">Light Therapy Guide</h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-bg-surface p-8">
          {/* Wavelength Slider */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm text-text-secondary font-heading font-semibold">
                Wavelength:{' '}
                <span style={{ color: wavelengthToCSS(wavelength) }} className="font-mono">
                  {wavelength} nm
                </span>
              </label>
              <span className="text-sm font-heading font-semibold" style={{ color: currentLightRange.color }}>
                {currentLightRange.name}
              </span>
            </div>
            <div className="relative">
              <div
                className="absolute inset-0 h-3 rounded-full"
                style={{
                  background: 'linear-gradient(to right, #6B3FA0, #0066FF, #00A8A8, #00CC66, #FFD700, #FF6633, #CC3333, #8B0000)',
                }}
              />
              <input
                type="range"
                min={380}
                max={780}
                value={wavelength}
                onChange={(e) => setWavelength(Number(e.target.value))}
                className="relative w-full h-3 bg-transparent rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,255,255,0.5)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white/60"
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-text-muted font-mono">380 nm (UV)</span>
              <span className="text-[10px] text-text-muted font-mono">780 nm (IR)</span>
            </div>
          </div>

          {/* Current wavelength info */}
          <div
            className="rounded-xl p-6 border"
            style={{
              borderColor: `${currentLightRange.color}30`,
              backgroundColor: `${currentLightRange.color}08`,
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-heading font-bold text-xl" style={{ color: currentLightRange.color }}>
                  {currentLightRange.name}
                </h3>
                <p className="text-text-muted text-xs font-mono">{currentLightRange.min} - {currentLightRange.max} nm</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Penetration Depth</p>
                <p className="text-sm font-heading font-semibold text-text-secondary">{currentLightRange.depth}</p>
              </div>
            </div>

            <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-text-secondary mb-3">
              Therapeutic Applications
            </h4>
            <ul className="space-y-1.5 mb-4">
              {currentLightRange.uses.map((use, i) => (
                <li key={i} className="text-text-muted text-sm flex items-start gap-2">
                  <span style={{ color: currentLightRange.color }} className="mt-0.5 flex-shrink-0">&bull;</span>
                  {use}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-text-muted uppercase tracking-wider">Evidence:</span>
              <EvidenceRating rating={currentLightRange.evidence} />
            </div>

            {/* Penetration depth indicator */}
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Penetration Depth Indicator</p>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((wavelength - 380) / 400) * 100}%`,
                    backgroundColor: currentLightRange.color,
                    boxShadow: `0 0 10px ${currentLightRange.color}40`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-text-muted">Surface</span>
                <span className="text-[10px] text-text-muted">Deep Tissue (40mm+)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Breathing Therapy ───────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex items-center gap-3 mb-6">
          <Wind className="w-6 h-6 text-genesis-green" />
          <h2 className="font-heading font-bold text-2xl text-text-primary">Breathing Therapy</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BREATHING_EXERCISES.map((exercise) => {
            const isActive = activeBreathing === exercise.name;
            return (
              <div
                key={exercise.name}
                className={`rounded-2xl border transition-all duration-500 ${
                  isActive ? 'border-white/20 bg-bg-surface' : 'border-white/8 bg-bg-card/60'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${exercise.color}12`, border: `1px solid ${exercise.color}25` }}
                    >
                      <Wind className="w-5 h-5" style={{ color: exercise.color }} />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg" style={{ color: exercise.color }}>
                        {exercise.name}
                      </h3>
                      <p className="text-text-muted text-[10px] font-mono">
                        Pattern: {exercise.pattern.map((p) => `${p.duration}s`).join(' - ')}
                      </p>
                    </div>
                  </div>

                  <p className="text-text-muted text-sm leading-relaxed mb-4">{exercise.description}</p>

                  <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-text-secondary mb-2">
                    Benefits
                  </h4>
                  <ul className="space-y-1 mb-4">
                    {exercise.benefits.map((b, i) => (
                      <li key={i} className="text-text-muted text-xs flex items-start gap-2">
                        <span style={{ color: exercise.color }} className="mt-0.5 flex-shrink-0">&bull;</span>
                        {b}
                      </li>
                    ))}
                  </ul>

                  {!isActive && (
                    <button
                      onClick={() => setActiveBreathing(exercise.name)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-heading font-semibold transition-all border"
                      style={{
                        color: exercise.color,
                        borderColor: `${exercise.color}30`,
                        backgroundColor: `${exercise.color}08`,
                      }}
                    >
                      <Play className="w-4 h-4" />
                      Start
                    </button>
                  )}

                  {isActive && (
                    <BreathingCircle
                      exercise={exercise}
                      isActive={true}
                      onStop={() => setActiveBreathing(null)}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Section 4: Grounding / Earthing ────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-6 h-6 text-genesis-gold" />
          <h2 className="font-heading font-bold text-2xl text-text-primary">Grounding / Earthing</h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-bg-surface p-8">
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Grounding (also called earthing) involves direct physical contact with the Earth&apos;s surface electrons by walking barefoot, lying on the ground, or using conductive systems. The theory posits that the Earth&apos;s surface carries a negative electrical charge, and direct contact allows free electrons to transfer into the body, neutralizing free radicals and reducing chronic inflammation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-genesis-gold mb-3">
                Research Findings
              </h4>
              <ul className="space-y-1.5">
                <li className="text-text-muted text-sm flex items-start gap-2">
                  <span className="text-genesis-gold mt-0.5 flex-shrink-0">&bull;</span>
                  Reduced blood viscosity and improved circulation (Chevalier et al., 2013)
                </li>
                <li className="text-text-muted text-sm flex items-start gap-2">
                  <span className="text-genesis-gold mt-0.5 flex-shrink-0">&bull;</span>
                  Decreased cortisol levels and improved sleep (Ghaly & Teplitz, 2004)
                </li>
                <li className="text-text-muted text-sm flex items-start gap-2">
                  <span className="text-genesis-gold mt-0.5 flex-shrink-0">&bull;</span>
                  Reduced inflammatory markers after grounding sessions
                </li>
                <li className="text-text-muted text-sm flex items-start gap-2">
                  <span className="text-genesis-gold mt-0.5 flex-shrink-0">&bull;</span>
                  Improved autonomic nervous system balance (HRV studies)
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-text-secondary mb-3">
                How to Practice
              </h4>
              <ul className="space-y-1.5">
                <li className="text-text-muted text-sm flex items-start gap-2">
                  <span className="text-genesis-green mt-0.5 flex-shrink-0">&bull;</span>
                  Walk barefoot on grass, sand, soil, or natural stone for 20-30 minutes
                </li>
                <li className="text-text-muted text-sm flex items-start gap-2">
                  <span className="text-genesis-green mt-0.5 flex-shrink-0">&bull;</span>
                  Swim in natural bodies of water (lakes, oceans)
                </li>
                <li className="text-text-muted text-sm flex items-start gap-2">
                  <span className="text-genesis-green mt-0.5 flex-shrink-0">&bull;</span>
                  Use grounding mats or sheets connected to the ground port of an electrical outlet
                </li>
                <li className="text-text-muted text-sm flex items-start gap-2">
                  <span className="text-genesis-green mt-0.5 flex-shrink-0">&bull;</span>
                  Garden with bare hands in direct contact with soil
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[10px] text-text-muted uppercase tracking-wider">Evidence:</span>
            <EvidenceRating rating={2} />
            <span className="text-[10px] text-text-muted ml-2">Promising preliminary research; more large-scale studies needed</span>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-genesis-blue/15 bg-genesis-blue/5 p-6 text-center">
          <p className="text-text-muted text-xs leading-relaxed">
            <span className="font-heading font-bold text-text-secondary">Therapy Disclaimer:</span> The sound frequencies, light therapy information, and breathing exercises presented on this page are for educational and experimental purposes only. They are not intended to diagnose, treat, cure, or prevent any medical condition. Sound and light therapy should complement, not replace, professional medical treatment. If you have epilepsy, photosensitivity, respiratory conditions, or any other health concerns, consult a qualified healthcare provider before engaging with these tools. GENESIS is an educational platform and does not make medical claims.
          </p>
        </div>
      </section>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Dna,
  Bug,
  FlaskConical,
  BookOpen,
  Microscope,
  Leaf,
  Volume2,
  ArrowRight,
  Sparkles,
  Heart,
  Stethoscope,
  GraduationCap,
  Users,
  Atom,
} from 'lucide-react';

/* ══════════════════════════════════════════════════════════════
   STAR FIELD — deep space particle background
   ══════════════════════════════════════════════════════════════ */
function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const stars: { x: number; y: number; size: number; speed: number; opacity: number; twinkleSpeed: number; twinkleOffset: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create stars
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.15 + 0.02,
        opacity: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 1;

      for (const star of stars) {
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = canvas.height;
          star.x = Math.random() * canvas.width;
        }

        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

/* ══════════════════════════════════════════════════════════════
   CONSTELLATION BODY — glowing dot-connected human silhouette
   ══════════════════════════════════════════════════════════════ */
function ConstellationBody() {
  const [signalPos, setSignalPos] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSignalPos((p) => (p + 1) % 100);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  // Constellation points (x, y) defining human form
  const bodyPoints = [
    // Head
    [100, 18], [92, 22], [108, 22], [88, 30], [112, 30], [92, 38], [108, 38], [100, 42],
    // Neck
    [100, 50], [97, 55], [103, 55],
    // Shoulders
    [75, 65], [85, 62], [100, 60], [115, 62], [125, 65],
    // Arms left
    [68, 75], [60, 90], [55, 105], [50, 120], [45, 135], [42, 145],
    // Arms right
    [132, 75], [140, 90], [145, 105], [150, 120], [155, 135], [158, 145],
    // Chest
    [85, 75], [100, 72], [115, 75], [90, 88], [110, 88],
    // Core
    [88, 100], [100, 98], [112, 100], [90, 115], [100, 112], [110, 115],
    // Hips
    [85, 130], [95, 132], [105, 132], [115, 130],
    // Left leg
    [88, 145], [86, 160], [84, 175], [82, 195], [80, 210], [78, 225], [76, 240], [75, 250],
    // Right leg
    [112, 145], [114, 160], [116, 175], [118, 195], [120, 210], [122, 225], [124, 240], [125, 250],
    // Feet
    [70, 255], [80, 258], [120, 255], [130, 258],
  ];

  // Connections (line segments between point indices)
  const connections = [
    // Head circle
    [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 7], [6, 7],
    // Neck
    [7, 8], [8, 9], [8, 10],
    // Shoulders
    [9, 12], [10, 14], [11, 12], [12, 13], [13, 14], [14, 15],
    // Arms left
    [11, 16], [16, 17], [17, 18], [18, 19], [19, 20], [20, 21],
    // Arms right
    [15, 22], [22, 23], [23, 24], [24, 25], [25, 26], [26, 27],
    // Chest
    [12, 28], [13, 29], [14, 30], [28, 31], [30, 32],
    // Core
    [31, 33], [29, 34], [32, 35], [33, 36], [34, 37], [35, 38],
    // Hips
    [36, 39], [37, 40], [37, 41], [38, 42],
    // Legs
    [39, 43], [43, 44], [44, 45], [45, 46], [46, 47], [47, 48], [48, 49], [49, 50],
    [42, 51], [51, 52], [52, 53], [53, 54], [54, 55], [55, 56], [56, 57], [57, 58],
    // Feet
    [50, 59], [50, 60], [58, 61], [58, 62],
    // Spine
    [8, 13], [13, 29], [29, 34], [34, 37], [37, 40], [37, 41],
  ];

  // Neural pathway for signal
  const neuralPath = [0, 7, 8, 13, 29, 34, 37, 40, 43, 44, 45, 46, 47];
  const signalIdx = Math.floor((signalPos / 100) * neuralPath.length);
  const signalPoint = bodyPoints[neuralPath[Math.min(signalIdx, neuralPath.length - 1)]];

  return (
    <div className="relative w-72 h-[360px] mx-auto mb-10">
      <svg viewBox="0 0 200 270" className="w-full h-full">
        <defs>
          <filter id="dotGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="strongGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="signalGrad">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="1" />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Connection lines */}
        {connections.map(([a, b], i) => (
          <line
            key={`line-${i}`}
            x1={bodyPoints[a][0]}
            y1={bodyPoints[a][1]}
            x2={bodyPoints[b][0]}
            y2={bodyPoints[b][1]}
            stroke="rgba(0, 229, 255, 0.12)"
            strokeWidth="0.5"
          />
        ))}

        {/* Body dots */}
        {bodyPoints.map(([x, y], i) => {
          // Organs glow brighter
          const isHeart = i === 31; // Left chest
          const isBrain = i === 0;  // Top of head
          const isCore = i === 34;  // Center torso

          const baseOpacity = isHeart || isBrain || isCore ? 0.9 : 0.4 + Math.random() * 0.3;
          const size = isHeart || isBrain || isCore ? 2.5 : 1 + Math.random() * 1;
          const color = isHeart ? '#FF3366' : isBrain ? '#FFD700' : isCore ? '#00FF94' : '#00E5FF';

          return (
            <circle
              key={`dot-${i}`}
              cx={x}
              cy={y}
              r={size}
              fill={color}
              opacity={baseOpacity}
              filter="url(#dotGlow)"
            >
              {(isHeart || isBrain || isCore) && (
                <animate
                  attributeName="opacity"
                  values={`${baseOpacity * 0.6};${baseOpacity};${baseOpacity * 0.6}`}
                  dur={isHeart ? '0.83s' : '3s'}
                  repeatCount="indefinite"
                />
              )}
              {isHeart && (
                <animate
                  attributeName="r"
                  values="2;3.5;2"
                  dur="0.83s"
                  repeatCount="indefinite"
                />
              )}
            </circle>
          );
        })}

        {/* Neural signal traveling */}
        {signalPoint && (
          <circle
            cx={signalPoint[0]}
            cy={signalPoint[1]}
            r="4"
            fill="url(#signalGrad)"
            filter="url(#strongGlow)"
          >
            <animate attributeName="r" values="3;6;3" dur="0.5s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Heart pulse ring */}
        <circle cx={bodyPoints[31][0]} cy={bodyPoints[31][1]} r="5" fill="none" stroke="#FF3366" strokeWidth="0.5" opacity="0.3">
          <animate attributeName="r" values="5;12;5" dur="1.66s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="1.66s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SUBTITLE FADE-IN
   ══════════════════════════════════════════════════════════════ */
function AnimatedSubtitle() {
  const words = ['Explore.', 'Understand.', 'Heal.'];
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const timers = words.map((_, i) =>
      setTimeout(() => setVisibleCount(i + 1), 800 + i * 600)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <p className="text-lg sm:text-xl text-text-secondary font-heading font-light tracking-wider mb-14">
      {words.map((word, i) => (
        <span
          key={word}
          className="inline-block mx-1.5 transition-all duration-700"
          style={{
            opacity: i < visibleCount ? 1 : 0,
            transform: i < visibleCount ? 'translateY(0)' : 'translateY(8px)',
          }}
        >
          {word}
        </span>
      ))}
    </p>
  );
}

/* ══════════════════════════════════════════════════════════════
   ANIMATED COUNTER (count up on scroll)
   ══════════════════════════════════════════════════════════════ */
function AnimatedStat({ value, label }: { value: string; label: string }) {
  const [display, setDisplay] = useState('0');
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const num = parseInt(value.replace(/[^0-9]/g, ''));
          if (isNaN(num) || value === '∞') {
            setDisplay(value);
            return;
          }
          let current = 0;
          const step = Math.max(1, Math.floor(num / 50));
          const interval = setInterval(() => {
            current += step;
            if (current >= num) {
              setDisplay(value);
              clearInterval(interval);
            } else {
              setDisplay(current.toLocaleString() + (value.includes('+') ? '+' : ''));
            }
          }, 25);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl sm:text-4xl font-heading font-bold text-genesis-cyan glow-cyan">{display}</div>
      <p className="text-text-muted text-sm mt-1">{label}</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   FEATURE CARDS
   ══════════════════════════════════════════════════════════════ */
const FEATURES = [
  {
    href: '/explore',
    icon: Dna,
    title: '3D Body Atlas',
    desc: '11 systems. Zoom from skin to cell.',
    color: '#00E5FF',
    glow: 'box-glow-cyan',
  },
  {
    href: '/pathology',
    icon: Bug,
    title: 'Disease Simulator',
    desc: 'Watch diseases attack. Watch cures heal.',
    color: '#FF00E5',
    glow: 'box-glow-magenta',
  },
  {
    href: '/lab',
    icon: FlaskConical,
    title: 'Cure Lab',
    desc: 'Discover drug combinations. Play Mastermind against disease.',
    color: '#FFD700',
    glow: 'box-glow-gold',
  },
  {
    href: '/learn',
    icon: BookOpen,
    title: 'Medical Academy',
    desc: '97 lessons. 7 courses. CPR to physician level.',
    color: '#00FF94',
    glow: 'box-glow-green',
  },
  {
    href: '/forensics',
    icon: Microscope,
    title: 'Forensic Lab',
    desc: 'Solve cases. Analyze evidence. Think like a pathologist.',
    color: '#FF3366',
    glow: '',
  },
  {
    href: '/therapy',
    icon: Volume2,
    title: 'Therapy Suite',
    desc: 'Sound healing. Breathing exercises. Light therapy.',
    color: '#0066FF',
    glow: '',
  },
];

/* ══════════════════════════════════════════════════════════════
   STATS
   ══════════════════════════════════════════════════════════════ */
const STATS = [
  { value: '11', label: 'Body Systems' },
  { value: '97', label: 'Medical Lessons' },
  { value: '7', label: 'Courses' },
  { value: '11', label: 'Simulation Modes' },
];

/* ══════════════════════════════════════════════════════════════
   DEPTH LEVELS (How Deep Can You Go?)
   ══════════════════════════════════════════════════════════════ */
const DEPTH_LEVELS = [
  { level: 'BODY', desc: 'You see the full human form', color: '#00E5FF' },
  { level: 'REGION', desc: 'You see the torso, the head, the limbs', color: '#0099CC' },
  { level: 'ORGAN', desc: 'You see the heart beating, lungs breathing', color: '#FF00E5' },
  { level: 'TISSUE', desc: 'You see muscle fibers, alveoli clusters', color: '#9945FF' },
  { level: 'CELL', desc: 'You see mitochondria producing energy, DNA unwinding', color: '#00FF94' },
];

/* ══════════════════════════════════════════════════════════════
   USE CASES
   ══════════════════════════════════════════════════════════════ */
const USE_CASES = [
  {
    icon: Stethoscope,
    title: 'Medical students studying anatomy',
    color: '#00E5FF',
  },
  {
    icon: Users,
    title: 'Parents explaining the body to their kids',
    color: '#FF00E5',
  },
  {
    icon: Atom,
    title: 'Curious minds exploring how we work',
    color: '#00FF94',
  },
];

/* ══════════════════════════════════════════════════════════════
   DEPTH CARD — glows on scroll
   ══════════════════════════════════════════════════════════════ */
function DepthCard({ level, desc, color, index }: { level: string; desc: string; color: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative">
      {index > 0 && (
        <div className="flex justify-center py-2">
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-px h-4 bg-white/10" />
            <ArrowRight className="w-4 h-4 text-white/20 rotate-90" />
          </div>
        </div>
      )}
      <div
        className="rounded-xl border p-5 transition-all duration-700 backdrop-blur-sm"
        style={{
          borderColor: visible ? `${color}40` : 'rgba(255,255,255,0.05)',
          background: visible ? `linear-gradient(135deg, ${color}08, ${color}03)` : 'rgba(10,14,26,0.5)',
          boxShadow: visible ? `0 0 30px ${color}15, inset 0 0 20px ${color}05` : 'none',
          opacity: visible ? 1 : 0.3,
          transform: visible ? `scale(${1 + index * 0.01})` : 'scale(0.98)',
        }}
      >
        <div className="flex items-center gap-4">
          <span
            className="font-heading font-black text-xl sm:text-2xl tracking-widest"
            style={{ color: visible ? color : 'rgba(255,255,255,0.2)' }}
          >
            {level}
          </span>
          <span className="text-text-secondary text-sm">{desc}</span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ENTER GENESIS GATE
   ══════════════════════════════════════════════════════════════ */
function EnterGate({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] bg-bg-void flex flex-col items-center justify-center">
      <StarField />
      <div className="relative z-10 text-center">
        <h1 className="font-heading font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight mb-4">
          <span className="text-genesis-cyan glow-cyan">GENESIS</span>
        </h1>
        <p className="text-text-muted text-base mb-12">The Human Body Discovery Engine</p>
        <button
          onClick={onEnter}
          className="group relative px-10 py-4 rounded-2xl font-heading font-bold text-lg tracking-wider transition-all duration-500 hover:scale-105 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(0,229,255,0.05))',
            border: '1px solid rgba(0,229,255,0.4)',
            color: '#00E5FF',
            boxShadow: '0 0 30px rgba(0,229,255,0.15), 0 0 60px rgba(0,229,255,0.05)',
          }}
        >
          <Heart className="w-5 h-5 inline-block mr-2 animate-pulse" />
          Enter GENESIS
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ boxShadow: '0 0 40px rgba(0,229,255,0.3), 0 0 80px rgba(0,229,255,0.1)' }}
          />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   HOMEPAGE
   ══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const [entered, setEntered] = useState(false);
  const [heartbeatPlayed, setHeartbeatPlayed] = useState(false);

  const playHeartbeat = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const playBeat = (time: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(55, time);
        osc.frequency.exponentialRampToValueAtTime(35, time + 0.1);
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.25);
      };
      // lub-dub, lub-dub
      playBeat(ctx.currentTime + 0.1);
      playBeat(ctx.currentTime + 0.25);
      playBeat(ctx.currentTime + 0.9);
      playBeat(ctx.currentTime + 1.05);
    } catch {
      // Audio not supported
    }
  }, []);

  const handleEnter = () => {
    if (!heartbeatPlayed) {
      playHeartbeat();
      setHeartbeatPlayed(true);
    }
    setEntered(true);
  };

  if (!entered) {
    return <EnterGate onEnter={handleEnter} />;
  }

  return (
    <div className="min-h-screen pt-16 relative">
      <StarField />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-[85vh] px-4 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,229,255,0.06)_0%,_transparent_60%)]" />

        <div className="relative z-10 text-center">
          <ConstellationBody />

          <h1 className="font-heading font-black text-6xl sm:text-7xl lg:text-8xl tracking-tight mb-3">
            <span className="text-genesis-cyan glow-cyan">GENESIS</span>
          </h1>
          <p className="text-xl sm:text-2xl text-text-primary font-heading font-light mb-1">
            The Human Body Discovery Engine
          </p>
          <AnimatedSubtitle />

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/explore"
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-heading font-semibold transition-all duration-300 hover:scale-105 box-glow-cyan"
              style={{
                background: 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(0,229,255,0.08))',
                border: '1px solid rgba(0,229,255,0.4)',
                color: '#00E5FF',
              }}
            >
              Explore the Body
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-heading font-semibold transition-all duration-300 hover:scale-105"
              style={{
                border: '1px solid rgba(0,255,148,0.3)',
                color: '#00FF94',
              }}
            >
              Start Learning
              <BookOpen className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Feature Showcase ──────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="font-heading font-bold text-3xl sm:text-4xl text-center text-text-primary mb-4">
          Everything inside you, explored.
        </h2>
        <p className="text-text-secondary text-center max-w-2xl mx-auto mb-14">
          Six powerful tools to explore, understand, and interact with the human body like never before.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.href} href={feature.href}>
                <div
                  className={`group relative rounded-2xl border border-white/8 bg-bg-card/80 backdrop-blur-sm p-7 transition-all duration-500 hover:scale-[1.03] hover:border-white/15 cursor-pointer h-full ${feature.glow}`}
                  style={{
                    ['--hover-glow' as string]: `0 0 30px ${feature.color}20`,
                  }}
                >
                  {/* Hover particle burst effect */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${feature.color}08, transparent 70%)`,
                    }}
                  />

                  <div className="relative z-10">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: `${feature.color}12`,
                        border: `1px solid ${feature.color}25`,
                      }}
                    >
                      <Icon className="w-7 h-7" style={{ color: feature.color }} />
                    </div>
                    <h3
                      className="font-heading font-bold text-lg mb-2 transition-colors"
                      style={{ color: feature.color }}
                    >
                      {feature.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{feature.desc}</p>
                    <ArrowRight
                      className="w-4 h-4 mt-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                      style={{ color: feature.color }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Stats Bar ──────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative">
          {/* Bioluminescent accent line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-genesis-cyan/30 to-transparent" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-bg-card/50 border border-white/5 rounded-xl p-6">
                <AnimatedStat value={stat.value} label={stat.label} />
              </div>
            ))}
          </div>
          {/* Bottom accent */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-genesis-magenta/20 to-transparent" />
        </div>
        {/* Solfeggio note */}
        <p className="text-center text-text-muted text-sm mt-8 flex items-center justify-center gap-2">
          <Volume2 className="w-4 h-4 text-genesis-blue" />
          Real Solfeggio Frequencies &amp; Binaural Beats
        </p>
      </section>

      {/* ── How Deep Can You Go? ───────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="font-heading font-bold text-3xl sm:text-4xl text-center text-text-primary mb-4">
          How Deep Can You Go?
        </h2>
        <p className="text-text-secondary text-center max-w-xl mx-auto mb-12">
          Dive through every layer of the human body — from the full silhouette down to individual organelles.
        </p>

        <div className="space-y-0">
          {DEPTH_LEVELS.map((level, i) => (
            <DepthCard key={level.level} {...level} index={i} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/atlas"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-heading font-semibold text-sm transition-all hover:scale-105 box-glow-cyan"
            style={{
              background: 'linear-gradient(135deg, rgba(0,229,255,0.12), rgba(0,229,255,0.04))',
              border: '1px solid rgba(0,229,255,0.3)',
              color: '#00E5FF',
            }}
          >
            Enter the 3D Atlas
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Testimonial / Impact ───────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <Sparkles className="w-6 h-6 text-genesis-gold mx-auto mb-4 opacity-60" />
          <blockquote className="text-xl sm:text-2xl text-text-primary font-heading font-light italic leading-relaxed mb-12">
            &ldquo;Built for everyone who ever wanted to understand the body they live in.&rdquo;
          </blockquote>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {USE_CASES.map((uc) => {
            const Icon = uc.icon;
            return (
              <div
                key={uc.title}
                className="rounded-xl border border-white/8 bg-bg-card/60 backdrop-blur-sm p-6 text-center transition-all hover:border-white/15"
              >
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{
                    backgroundColor: `${uc.color}12`,
                    border: `1px solid ${uc.color}25`,
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color: uc.color }} />
                </div>
                <p className="text-text-secondary text-sm">{uc.title}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Quote ──────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <blockquote className="text-lg sm:text-xl text-text-secondary font-heading font-light italic leading-relaxed">
          &ldquo;The next breakthrough might not come from a billion-dollar lab. It might come from a curious mind with the right tools.&rdquo;
        </blockquote>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="font-heading font-bold text-3xl sm:text-4xl text-text-primary mb-4">
          Begin your exploration.
        </h2>
        <p className="text-text-secondary text-lg max-w-xl mx-auto mb-8">
          Eleven body systems. Thousands of conditions. Millions of compound combinations. One engine to explore them all.
        </p>
        <Link
          href="/atlas"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-genesis-cyan/10 border border-genesis-cyan/30 hover:bg-genesis-cyan/20 text-genesis-cyan font-heading font-semibold rounded-xl transition-all box-glow-cyan hover:scale-105"
        >
          Enter the Atlas
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
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
} from 'lucide-react';

const PORTALS = [
  { href: '/explore', icon: Dna, label: 'EXPLORE', desc: '3D Human Body Engine', color: '#00E5FF', glow: 'box-glow-cyan' },
  { href: '/pathology', icon: Bug, label: 'PATHOLOGY', desc: 'Visualize any disease', color: '#FF00E5', glow: 'box-glow-magenta' },
  { href: '/lab', icon: FlaskConical, label: 'LAB', desc: 'Craft the cure', color: '#FFD700', glow: 'box-glow-gold' },
];

const SECONDARY = [
  { href: '/learn', icon: BookOpen, label: 'LEARN', desc: 'Medical school in your browser', color: '#00FF94' },
  { href: '/forensics', icon: Microscope, label: 'FORENSICS', desc: 'Forensic pathology mode', color: '#FF3366' },
  { href: '/holistic', icon: Leaf, label: 'HOLISTIC', desc: 'Beyond Western medicine', color: '#9945FF' },
  { href: '/therapy', icon: Volume2, label: 'THERAPY', desc: 'Sound, light & frequency healing', color: '#0066FF' },
];

const STATS = [
  { value: '11', label: 'Body Systems' },
  { value: '1,000+', label: 'Conditions' },
  { value: '5,000+', label: 'Compounds' },
  { value: '∞', label: 'Possibilities' },
];

/* ── Particle field ─────────────────────────────── */
function ParticleField() {
  const [particles] = useState(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      opacity: 0.1 + Math.random() * 0.3,
      duration: 15 + Math.random() * 25,
      delay: Math.random() * 10,
      color: ['#00E5FF', '#FF00E5', '#00FF94', '#FFD700'][Math.floor(Math.random() * 4)],
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            filter: `blur(${p.size > 2 ? 1 : 0}px)`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Body silhouette SVG ────────────────────────── */
function BodySilhouette() {
  return (
    <div className="relative w-64 h-96 mx-auto mb-12 animate-breathe">
      <svg viewBox="0 0 200 350" className="w-full h-full">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#FF00E5" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00FF94" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Head */}
        <circle cx="100" cy="35" r="22" fill="none" stroke="url(#bodyGrad)" strokeWidth="1.5" filter="url(#glow)" opacity="0.8" />
        {/* Neck */}
        <line x1="100" y1="57" x2="100" y2="70" stroke="#00E5FF" strokeWidth="1" opacity="0.5" />
        {/* Torso */}
        <path d="M 70 70 Q 65 120 68 180 L 80 180 Q 100 185 120 180 L 132 180 Q 135 120 130 70 Z" fill="none" stroke="url(#bodyGrad)" strokeWidth="1.5" filter="url(#glow)" opacity="0.6" />
        {/* Arms */}
        <path d="M 70 75 Q 45 100 35 150 Q 30 165 40 170" fill="none" stroke="#00E5FF" strokeWidth="1" opacity="0.4" />
        <path d="M 130 75 Q 155 100 165 150 Q 170 165 160 170" fill="none" stroke="#00E5FF" strokeWidth="1" opacity="0.4" />
        {/* Legs */}
        <path d="M 80 180 Q 75 230 70 290 Q 68 310 75 320" fill="none" stroke="#FF00E5" strokeWidth="1" opacity="0.4" />
        <path d="M 120 180 Q 125 230 130 290 Q 132 310 125 320" fill="none" stroke="#FF00E5" strokeWidth="1" opacity="0.4" />

        {/* Heart pulse */}
        <circle cx="105" cy="105" r="6" fill="#FF3366" opacity="0.6" filter="url(#glow)">
          <animate attributeName="r" values="5;7;5" dur="0.83s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="0.83s" repeatCount="indefinite" />
        </circle>
        {/* Brain glow */}
        <circle cx="100" cy="30" r="8" fill="#FFD700" opacity="0.15" filter="url(#glow)">
          <animate attributeName="opacity" values="0.1;0.3;0.1" dur="3s" repeatCount="indefinite" />
        </circle>
        {/* Spine — nervous system */}
        <line x1="100" y1="57" x2="100" y2="180" stroke="#FFD700" strokeWidth="0.8" opacity="0.3" strokeDasharray="3 3">
          <animate attributeName="strokeDashoffset" values="0;6" dur="1.5s" repeatCount="indefinite" />
        </line>
        {/* Lung breathing */}
        <ellipse cx="88" cy="110" rx="12" ry="18" fill="none" stroke="#66CCFF" strokeWidth="0.8" opacity="0.3">
          <animate attributeName="ry" values="16;20;16" dur="4s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="112" cy="110" rx="12" ry="18" fill="none" stroke="#66CCFF" strokeWidth="0.8" opacity="0.3">
          <animate attributeName="ry" values="16;20;16" dur="4s" repeatCount="indefinite" />
        </ellipse>
        {/* Circulatory dots */}
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx="0" cy="0" r="1.5" fill="#FF3366" opacity="0.6">
            <animateMotion
              path="M 105 105 Q 100 80 90 70 Q 70 60 50 100 Q 40 140 60 160 Q 80 180 100 180 Q 120 180 140 160 Q 160 140 150 100 Q 130 60 110 70 Q 100 80 105 105"
              dur={`${4 + i * 0.5}s`}
              begin={`${i * 0.8}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>
    </div>
  );
}

/* ── Animated counter ───────────────────────────── */
function AnimatedStat({ value, label }: { value: string; label: string }) {
  const [display, setDisplay] = useState(value);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const num = parseInt(value.replace(/[^0-9]/g, ''));
    if (isNaN(num) || value === '∞') {
      setDisplay(value);
      return;
    }
    let current = 0;
    const step = Math.max(1, Math.floor(num / 40));
    const interval = setInterval(() => {
      current += step;
      if (current >= num) {
        setDisplay(value);
        clearInterval(interval);
      } else {
        setDisplay(current.toLocaleString() + (value.includes('+') ? '+' : ''));
      }
    }, 30);
    return () => clearInterval(interval);
  }, [visible, value]);

  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-heading font-bold text-genesis-cyan glow-cyan">{display}</div>
      <p className="text-text-muted text-sm mt-1">{label}</p>
    </div>
  );
}

/* ── Homepage ───────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="min-h-screen pt-16 relative">
      <ParticleField />

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-[85vh] px-4 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,229,255,0.06)_0%,_transparent_60%)]" />

        <div className="relative z-10 text-center">
          <BodySilhouette />

          <h1 className="font-heading font-black text-6xl sm:text-7xl lg:text-8xl tracking-tight mb-3">
            <span className="text-genesis-cyan glow-cyan">GENESIS</span>
          </h1>
          <p className="text-xl sm:text-2xl text-text-primary font-heading font-light mb-2">
            Understand the body. Decode disease. Discover the cure.
          </p>
          <p className="text-text-muted text-base mb-16">
            The Human Body Discovery Engine
          </p>

          {/* Three main portals */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-12 max-w-3xl mx-auto">
            {PORTALS.map((portal) => {
              const Icon = portal.icon;
              return (
                <Link key={portal.href} href={portal.href} className="w-full sm:w-auto">
                  <div
                    className={`group relative rounded-2xl border border-white/10 bg-bg-card backdrop-blur-sm p-8 text-center transition-all duration-500 hover:scale-105 cursor-pointer ${portal.glow} hover:border-white/20`}
                    style={{ minWidth: 200 }}
                  >
                    <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: `${portal.color}15`, border: `1px solid ${portal.color}30` }}>
                      <Icon className="w-8 h-8" style={{ color: portal.color }} />
                    </div>
                    <h3 className="font-heading font-bold text-xl tracking-wider mb-1" style={{ color: portal.color }}>
                      {portal.label}
                    </h3>
                    <p className="text-text-secondary text-sm">{portal.desc}</p>
                    <ArrowRight className="w-5 h-5 mx-auto mt-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: portal.color }} />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Secondary portals */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-20">
            {SECONDARY.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <div className="group rounded-xl border border-white/5 bg-bg-card/50 backdrop-blur-sm p-4 text-center transition-all hover:border-white/15 hover:bg-bg-card/80 cursor-pointer">
                    <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: item.color }} />
                    <h4 className="font-heading font-semibold text-sm tracking-wider mb-0.5" style={{ color: item.color }}>
                      {item.label}
                    </h4>
                    <p className="text-text-muted text-[11px] leading-tight">{item.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-bg-card/50 border border-white/5 rounded-xl p-6">
              <AnimatedStat value={stat.value} label={stat.label} />
            </div>
          ))}
        </div>
      </section>

      {/* Quote */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Sparkles className="w-6 h-6 text-genesis-gold mx-auto mb-4 opacity-60" />
        <blockquote className="text-xl sm:text-2xl text-text-primary font-heading font-light italic leading-relaxed">
          &ldquo;The next breakthrough might not come from a billion-dollar lab. It might come from a curious mind with the right tools.&rdquo;
        </blockquote>
        <p className="text-text-muted text-sm mt-6">A Vilmure Ventures Company</p>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="font-heading font-bold text-3xl sm:text-4xl text-text-primary mb-4">
          Begin your exploration.
        </h2>
        <p className="text-text-secondary text-lg max-w-xl mx-auto mb-8">
          Eleven body systems. Thousands of conditions. Millions of compound combinations. One engine to explore them all.
        </p>
        <Link
          href="/atlas"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-genesis-cyan/10 border border-genesis-cyan/30 hover:bg-genesis-cyan/20 text-genesis-cyan font-heading font-semibold rounded-xl transition-all box-glow-cyan"
        >
          Enter the Atlas
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  );
}

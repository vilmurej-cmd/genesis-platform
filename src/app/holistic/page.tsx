'use client';

import { useState } from 'react';
import { Leaf, Circle, Heart, Wind, Eye, Sparkles } from 'lucide-react';

/* ── Evidence Rating Component ────────────────────── */
function EvidenceRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full border ${
            i < rating
              ? 'bg-genesis-violet border-genesis-violet/60'
              : 'bg-transparent border-white/15'
          }`}
        />
      ))}
      <span className="text-[10px] text-text-muted ml-1">{rating}/{max}</span>
    </div>
  );
}

/* ── Data ─────────────────────────────────────────── */
const MEDICINE_SYSTEMS = [
  {
    name: 'Traditional Chinese Medicine',
    description:
      'A 3,000-year-old medical system originating in China that views the body as an interconnected system of energy (Qi) flowing through meridians. TCM emphasizes balance between Yin and Yang forces and uses herbal formulas, acupuncture, cupping, and Tai Chi to restore harmony. It treats the whole person rather than isolated symptoms, considering emotional and environmental factors.',
    principles: [
      'Qi (vital energy) flows through 12 primary meridians',
      'Balance of Yin (cool, passive) and Yang (hot, active) forces',
      'Five Element Theory connects organs, emotions, seasons, and tastes',
    ],
    evidence: 3,
    color: '#FF3366',
  },
  {
    name: 'Ayurveda',
    description:
      'India\'s ancient "Science of Life" dating back over 5,000 years. Ayurveda classifies individuals by their dominant dosha (constitutional type) and prescribes personalized dietary, herbal, and lifestyle interventions. It emphasizes prevention through daily routines (dinacharya), seasonal adaptation, and detoxification protocols (Panchakarma). Modern research is investigating many Ayurvedic herbs.',
    principles: [
      'Three doshas: Vata (air/space), Pitta (fire/water), Kapha (earth/water)',
      'Agni (digestive fire) is central to health and disease',
      'Treatment is individualized based on constitutional type and imbalance',
    ],
    evidence: 3,
    color: '#FF9933',
  },
  {
    name: 'Naturopathy',
    description:
      'A Western-originated system of medicine that emphasizes the body\'s inherent ability to heal itself (vis medicatrix naturae). Naturopathic doctors use a combination of modern diagnostics with natural therapeutics including clinical nutrition, botanical medicine, hydrotherapy, and counseling. It focuses on identifying and treating root causes rather than suppressing symptoms.',
    principles: [
      'First, do no harm (primum non nocere) — use least invasive therapies first',
      'Identify and treat the cause (tolle causam) — not just symptoms',
      'Doctor as teacher (docere) — educate patients in self-care and prevention',
    ],
    evidence: 3,
    color: '#00FF94',
  },
];

const CHAKRAS = [
  { name: 'Crown', sanskrit: 'Sahasrara', color: '#9945FF', y: 25, location: 'Top of head', organs: 'Brain, nervous system, pineal gland' },
  { name: 'Third Eye', sanskrit: 'Ajna', color: '#4A00E0', y: 55, location: 'Between eyebrows', organs: 'Eyes, pituitary gland, sinuses' },
  { name: 'Throat', sanskrit: 'Vishuddha', color: '#00E5FF', y: 100, location: 'Throat', organs: 'Thyroid, throat, mouth, ears' },
  { name: 'Heart', sanskrit: 'Anahata', color: '#00FF94', y: 140, location: 'Center of chest', organs: 'Heart, lungs, thymus gland' },
  { name: 'Solar Plexus', sanskrit: 'Manipura', color: '#FFD700', y: 175, location: 'Upper abdomen', organs: 'Stomach, liver, pancreas, adrenals' },
  { name: 'Sacral', sanskrit: 'Svadhisthana', color: '#FF9933', y: 210, location: 'Lower abdomen', organs: 'Reproductive organs, kidneys, bladder' },
  { name: 'Root', sanskrit: 'Muladhara', color: '#FF3366', y: 250, location: 'Base of spine', organs: 'Spine, legs, feet, immune system' },
];

const MIND_BODY = [
  {
    name: 'Meditation',
    icon: Eye,
    description: 'The practice of focused attention or open awareness to cultivate mental clarity, emotional calm, and present-moment awareness. Thousands of studies have documented neurological and physiological changes from regular practice.',
    effects: [
      'Reduces cortisol and inflammatory markers',
      'Increases gray matter density in prefrontal cortex and hippocampus',
      'Activates parasympathetic nervous system',
      'Improves attention span and working memory',
    ],
    evidence: 5,
    color: '#9945FF',
  },
  {
    name: 'Breathwork',
    icon: Wind,
    description: 'Conscious manipulation of breathing patterns to influence autonomic nervous system function, emotional state, and physiological processes. Different techniques produce different effects, from calming to energizing.',
    effects: [
      'Activates vagus nerve (parasympathetic response)',
      'Alters blood CO2 levels affecting pH and neural excitability',
      'Reduces blood pressure and heart rate',
      'Can induce altered states of consciousness (holotropic breathwork)',
    ],
    evidence: 4,
    color: '#00E5FF',
  },
  {
    name: 'Yoga',
    icon: Heart,
    description: 'An ancient Indian practice combining physical postures (asanas), breathing techniques (pranayama), and meditation. Modern research supports benefits for flexibility, strength, stress reduction, and mental health.',
    effects: [
      'Increases GABA levels (similar to anti-anxiety medication)',
      'Improves heart rate variability',
      'Reduces inflammatory markers (IL-6, CRP)',
      'Enhances proprioception and balance',
    ],
    evidence: 4,
    color: '#FF9933',
  },
  {
    name: 'Visualization',
    icon: Sparkles,
    description: 'The practice of creating detailed mental images to influence physiological and psychological states. Used in sports psychology, pain management, and rehabilitation with growing evidence for effectiveness.',
    effects: [
      'Activates similar brain regions as actual physical practice',
      'Can modulate immune function and pain perception',
      'Improves motor skill acquisition and rehabilitation outcomes',
      'Reduces pre-surgical anxiety and post-operative pain',
    ],
    evidence: 3,
    color: '#FFD700',
  },
];

/* ── Component ───────────────────────────────────── */
export default function HolisticPage() {
  const [expandedSystem, setExpandedSystem] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-genesis-violet/10 border border-genesis-violet/30 flex items-center justify-center">
              <Leaf className="w-7 h-7 text-genesis-violet" />
            </div>
          </div>
          <h1 className="font-heading font-black text-5xl sm:text-6xl tracking-tight mb-4">
            <span className="text-genesis-violet" style={{ textShadow: '0 0 20px rgba(153,69,255,0.5), 0 0 40px rgba(153,69,255,0.2)' }}>
              Beyond Western Medicine
            </span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-6">
            Explore healing traditions spanning millennia and cultures. Each system offers unique insights into the nature of health, disease, and the human experience.
          </p>
          <div className="inline-block px-4 py-2 rounded-xl border border-genesis-violet/20 bg-genesis-violet/5 text-xs text-text-muted">
            Evidence ratings reflect the current state of scientific research, not the validity of lived experience.
          </div>
        </div>
      </section>

      {/* Section 1: Traditional Medicine Systems */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <h2 className="font-heading font-bold text-2xl text-text-primary mb-8">Traditional Medicine Systems</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {MEDICINE_SYSTEMS.map((sys) => {
            const isExpanded = expandedSystem === sys.name;
            return (
              <div
                key={sys.name}
                className={`rounded-2xl border transition-all duration-500 ${
                  isExpanded
                    ? 'border-white/20 bg-bg-surface lg:col-span-3'
                    : 'border-white/8 bg-bg-card/60 hover:border-white/15'
                }`}
              >
                <div className="p-6 cursor-pointer" onClick={() => setExpandedSystem(isExpanded ? null : sys.name)}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sys.color }} />
                    <h3 className="font-heading font-bold text-lg" style={{ color: sys.color }}>
                      {sys.name}
                    </h3>
                  </div>
                  <p className="text-text-muted text-sm leading-relaxed mb-4">{sys.description}</p>

                  <div className="mb-4">
                    <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-text-secondary mb-2">
                      Key Principles
                    </h4>
                    <ul className="space-y-1.5">
                      {sys.principles.map((p, i) => (
                        <li key={i} className="text-text-muted text-xs flex items-start gap-2">
                          <span style={{ color: sys.color }} className="mt-0.5 flex-shrink-0">&bull;</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-text-muted uppercase tracking-wider">Evidence:</span>
                    <EvidenceRating rating={sys.evidence} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 2: Energy Medicine — Chakras */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <h2 className="font-heading font-bold text-2xl text-text-primary mb-2">Energy Medicine</h2>
        <p className="text-text-muted text-sm mb-8">
          The chakra system describes seven primary energy centers along the spine, each associated with specific organs, emotions, and states of consciousness.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* SVG Body with Chakras */}
          <div className="flex justify-center">
            <div className="relative">
              <svg viewBox="0 0 200 320" className="w-64 h-96">
                <defs>
                  <filter id="chakra-glow">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Body outline */}
                <circle cx="100" cy="35" r="22" fill="none" stroke="rgba(153,69,255,0.3)" strokeWidth="1" />
                <line x1="100" y1="57" x2="100" y2="70" stroke="rgba(153,69,255,0.2)" strokeWidth="1" />
                <path d="M 70 70 Q 65 120 68 180 L 80 180 Q 100 185 120 180 L 132 180 Q 135 120 130 70 Z" fill="none" stroke="rgba(153,69,255,0.2)" strokeWidth="1" />
                <path d="M 70 75 Q 45 100 35 150 Q 30 165 40 170" fill="none" stroke="rgba(153,69,255,0.15)" strokeWidth="1" />
                <path d="M 130 75 Q 155 100 165 150 Q 170 165 160 170" fill="none" stroke="rgba(153,69,255,0.15)" strokeWidth="1" />
                <path d="M 80 180 Q 75 230 70 290 Q 68 310 75 320" fill="none" stroke="rgba(153,69,255,0.15)" strokeWidth="1" />
                <path d="M 120 180 Q 125 230 130 290 Q 132 310 125 320" fill="none" stroke="rgba(153,69,255,0.15)" strokeWidth="1" />

                {/* Central energy channel */}
                <line x1="100" y1="25" x2="100" y2="260" stroke="rgba(153,69,255,0.15)" strokeWidth="1" strokeDasharray="3 3">
                  <animate attributeName="strokeDashoffset" values="0;6" dur="2s" repeatCount="indefinite" />
                </line>

                {/* Chakra dots */}
                {CHAKRAS.map((chakra) => (
                  <g key={chakra.name}>
                    <circle cx="100" cy={chakra.y} r="10" fill={chakra.color} opacity="0.15" filter="url(#chakra-glow)">
                      <animate attributeName="r" values="8;12;8" dur="3s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.1;0.25;0.1" dur="3s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="100" cy={chakra.y} r="5" fill={chakra.color} opacity="0.8" filter="url(#chakra-glow)" />
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Chakra Details */}
          <div className="space-y-3">
            {CHAKRAS.map((chakra) => (
              <div
                key={chakra.name}
                className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-bg-card/40 hover:border-white/10 transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0 mt-0.5"
                  style={{
                    backgroundColor: `${chakra.color}20`,
                    border: `2px solid ${chakra.color}`,
                    boxShadow: `0 0 10px ${chakra.color}30`,
                  }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-heading font-bold text-sm" style={{ color: chakra.color }}>
                      {chakra.name}
                    </h4>
                    <span className="text-[10px] text-text-muted font-mono">({chakra.sanskrit})</span>
                  </div>
                  <p className="text-text-muted text-xs">
                    <span className="text-text-secondary">Location:</span> {chakra.location}
                  </p>
                  <p className="text-text-muted text-xs">
                    <span className="text-text-secondary">Organs:</span> {chakra.organs}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Mind-Body Connection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="font-heading font-bold text-2xl text-text-primary mb-2">Mind-Body Connection</h2>
        <p className="text-text-muted text-sm mb-8">
          Practices that leverage the bidirectional relationship between mental states and physiological processes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MIND_BODY.map((practice) => {
            const Icon = practice.icon;
            return (
              <div
                key={practice.name}
                className="rounded-2xl border border-white/8 bg-bg-card/60 p-6 hover:border-white/15 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${practice.color}12`, border: `1px solid ${practice.color}25` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: practice.color }} />
                  </div>
                  <h3 className="font-heading font-bold text-lg" style={{ color: practice.color }}>
                    {practice.name}
                  </h3>
                </div>

                <p className="text-text-muted text-sm leading-relaxed mb-4">{practice.description}</p>

                <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-text-secondary mb-2">
                  Measurable Effects
                </h4>
                <ul className="space-y-1.5 mb-4">
                  {practice.effects.map((effect, i) => (
                    <li key={i} className="text-text-muted text-xs flex items-start gap-2">
                      <span style={{ color: practice.color }} className="mt-0.5 flex-shrink-0">&bull;</span>
                      {effect}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-text-muted uppercase tracking-wider">Evidence:</span>
                  <EvidenceRating rating={practice.evidence} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-genesis-violet/15 bg-genesis-violet/5 p-6 text-center">
          <p className="text-text-muted text-xs leading-relaxed">
            GENESIS presents holistic and alternative medicine systems for educational exploration. Evidence ratings reflect peer-reviewed research as of 2026. These practices should complement, not replace, conventional medical care. Always consult a qualified healthcare provider before making health decisions.
          </p>
        </div>
      </section>
    </div>
  );
}

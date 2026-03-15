'use client';

import { useState, useEffect } from 'react';
import {
  BookOpen,
  Clock,
  Award,
  ChevronDown,
  ChevronRight,
  Star,
  Beaker,
  Brain,
  Heart,
  Skull,
  Pill,
  Leaf,
  Microscope,
} from 'lucide-react';

/* ── Course Data ──────────────────────────────────── */
const COURSES = [
  {
    id: 'anatomy-101',
    title: 'Anatomy 101',
    subtitle: 'Introduction to Body Systems',
    description:
      'Begin your journey through the human body with a comprehensive overview of all 11 organ systems. Build a foundational understanding of how the body is structured and organized.',
    lessons: 12,
    hours: 8,
    color: '#00E5FF',
    icon: Heart,
    lessons_list: [
      'Introduction to Human Anatomy',
      'Anatomical Terminology & Planes',
      'The Skeletal System',
      'The Muscular System',
      'The Nervous System Overview',
      'The Cardiovascular System',
      'The Respiratory System',
      'The Digestive System',
      'The Endocrine System',
      'The Lymphatic & Immune System',
      'The Urinary System',
      'The Reproductive System',
    ],
  },
  {
    id: 'anatomy-201',
    title: 'Anatomy 201',
    subtitle: 'Detailed System Exploration',
    description:
      'Dive deeper into each organ system with detailed anatomical structures, regional anatomy, and clinical correlations. Master the complexity of human form and function.',
    lessons: 18,
    hours: 14,
    color: '#00E5FF',
    icon: Microscope,
    lessons_list: [
      'The Skull & Cranial Bones',
      'The Vertebral Column',
      'Upper Extremity Bones & Joints',
      'Lower Extremity Bones & Joints',
      'Superficial & Deep Muscles of the Back',
      'Muscles of the Upper Limb',
      'Muscles of the Lower Limb',
      'The Heart: Chambers & Valves',
      'Arterial System: Major Arteries',
      'Venous System: Major Veins',
      'The Brain: Lobes & Functions',
      'Spinal Cord & Peripheral Nerves',
      'Cranial Nerves (I-XII)',
      'The Lungs: Lobes & Bronchial Tree',
      'The GI Tract: Mouth to Anus',
      'The Liver, Pancreas & Gallbladder',
      'The Kidneys & Nephron Structure',
      'Regional Anatomy: Cross-Sections',
    ],
  },
  {
    id: 'physiology',
    title: 'Physiology',
    subtitle: 'How the Body Works',
    description:
      'Understand the dynamic processes that keep the body alive. From cellular respiration to neural signaling, explore the mechanisms that drive every heartbeat and thought.',
    lessons: 15,
    hours: 12,
    color: '#00FF94',
    icon: Brain,
    lessons_list: [
      'Cell Physiology & Membrane Transport',
      'Homeostasis & Feedback Loops',
      'Action Potentials & Nerve Signaling',
      'Muscle Contraction Mechanics',
      'Cardiac Electrophysiology',
      'Blood Pressure Regulation',
      'Gas Exchange & Respiration',
      'Digestion & Nutrient Absorption',
      'Renal Filtration & Urine Formation',
      'Hormonal Regulation & Endocrine Axes',
      'Immune Response: Innate & Adaptive',
      'Thermoregulation',
      'Acid-Base Balance',
      'Reproductive Physiology',
      'Exercise Physiology & Adaptation',
    ],
  },
  {
    id: 'pathology',
    title: 'Pathology',
    subtitle: 'How Disease Develops',
    description:
      'Explore the mechanisms of disease from cellular injury to systemic failure. Learn how normal physiology goes wrong and how the body responds to pathological insults.',
    lessons: 14,
    hours: 11,
    color: '#FF00E5',
    icon: Beaker,
    lessons_list: [
      'Cell Injury & Death',
      'Inflammation: Acute & Chronic',
      'Tissue Repair & Regeneration',
      'Hemodynamic Disorders',
      'Genetic Disorders & Mutations',
      'Neoplasia: Benign & Malignant',
      'Infectious Disease Mechanisms',
      'Autoimmune Disorders',
      'Cardiovascular Pathology',
      'Pulmonary Pathology',
      'Hepatic & GI Pathology',
      'Renal Pathology',
      'Neuropathology',
      'Endocrine Pathology',
    ],
  },
  {
    id: 'pharmacology',
    title: 'Pharmacology',
    subtitle: 'How Drugs Work',
    description:
      'Master the principles of drug action, from receptor binding to therapeutic outcomes. Understand pharmacokinetics, pharmacodynamics, and the major drug classes.',
    lessons: 16,
    hours: 13,
    color: '#FFD700',
    icon: Pill,
    lessons_list: [
      'Pharmacokinetics: ADME',
      'Pharmacodynamics: Receptors & Dose-Response',
      'Drug Interactions & Adverse Effects',
      'Autonomic Nervous System Drugs',
      'Cardiovascular Drugs',
      'Antihypertensives & Diuretics',
      'CNS Drugs: Anxiolytics & Antidepressants',
      'Analgesics: Opioids & NSAIDs',
      'Antibiotics & Antimicrobials',
      'Antiviral & Antifungal Agents',
      'Anticancer & Immunosuppressants',
      'Endocrine Pharmacology',
      'GI Pharmacology',
      'Respiratory Pharmacology',
      'Anesthetics: Local & General',
      'Pharmacogenomics & Personalized Medicine',
    ],
  },
  {
    id: 'forensic-pathology',
    title: 'Forensic Pathology',
    subtitle: 'Understanding Death and Trauma',
    description:
      'Enter the world of forensic medicine. Learn to analyze post-mortem changes, determine cause and manner of death, and understand the science behind criminal investigations.',
    lessons: 10,
    hours: 7,
    color: '#FF3366',
    icon: Skull,
    lessons_list: [
      'Introduction to Forensic Pathology',
      'Time of Death Estimation',
      'Post-Mortem Changes & Decomposition',
      'Blunt Force Trauma',
      'Sharp Force Injuries',
      'Gunshot Wound Analysis',
      'Asphyxia & Drowning',
      'Toxicology & Poisoning',
      'Burns & Electrical Injuries',
      'The Autopsy: Procedure & Reporting',
    ],
  },
  {
    id: 'holistic-medicine',
    title: 'Holistic Medicine',
    subtitle: 'Ancient and Alternative Approaches',
    description:
      'Explore healing traditions from around the world. From Traditional Chinese Medicine to Ayurveda, examine the philosophies and practices that complement modern medicine.',
    lessons: 12,
    hours: 9,
    color: '#9945FF',
    icon: Leaf,
    lessons_list: [
      'Introduction to Holistic Medicine',
      'Traditional Chinese Medicine: Foundations',
      'Acupuncture & Meridians',
      'Ayurveda: Doshas & Balance',
      'Herbal Medicine & Phytotherapy',
      'Naturopathic Principles',
      'Mind-Body Medicine',
      'Energy Healing Modalities',
      'Sound & Frequency Therapy',
      'Nutrition as Medicine',
      'Integrative Medicine: East Meets West',
      'Evidence-Based Evaluation of CAM',
    ],
  },
];

const BADGE_LEVELS = [
  { name: 'Apprentice', experiments: 50, color: '#8BA4CC' },
  { name: 'Researcher', experiments: 200, color: '#00E5FF' },
  { name: 'Scientist', experiments: 500, color: '#00FF94' },
  { name: 'Pioneer', experiments: 1000, color: '#FFD700' },
  { name: 'Mastermind', experiments: 5000, color: '#FF00E5' },
];

/* ── Component ───────────────────────────────────── */
export default function LearnPage() {
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    const stored = localStorage.getItem('genesis-learn-progress');
    if (stored) setProgress(JSON.parse(stored));
  }, []);

  const totalCompleted = Object.values(progress).reduce((s, v) => s + v, 0);
  const currentBadge =
    [...BADGE_LEVELS].reverse().find((b) => totalCompleted >= b.experiments) || null;

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-genesis-green/10 border border-genesis-green/30 flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-genesis-green" />
            </div>
          </div>
          <h1 className="font-heading font-black text-5xl sm:text-6xl lg:text-7xl tracking-tight mb-4">
            <span className="text-genesis-green glow-green">Medical School</span>
            <br />
            <span className="text-text-primary text-3xl sm:text-4xl font-light">in Your Browser</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Seven comprehensive courses spanning anatomy, physiology, pathology, pharmacology, forensics, and holistic medicine. Learn at your own pace.
          </p>
        </div>
      </section>

      {/* Curriculum Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <h2 className="font-heading font-bold text-2xl text-text-primary mb-8">Curriculum</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {COURSES.map((course) => {
            const Icon = course.icon;
            const isExpanded = expandedCourse === course.id;
            const courseProgress = progress[course.id] || 0;
            const pct = Math.round((courseProgress / course.lessons) * 100);

            return (
              <div
                key={course.id}
                className={`rounded-2xl border transition-all duration-500 ${
                  isExpanded
                    ? 'border-white/20 bg-bg-surface col-span-1 md:col-span-2 xl:col-span-3'
                    : 'border-white/8 bg-bg-card/60 hover:border-white/15 hover:bg-bg-card/80'
                }`}
              >
                {/* Card Header */}
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedCourse(isExpanded ? null : course.id)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${course.color}12`, border: `1px solid ${course.color}25` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: course.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-heading font-bold text-lg" style={{ color: course.color }}>
                          {course.title}
                        </h3>
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-text-muted flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-text-muted flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-text-secondary text-sm font-medium mb-2">{course.subtitle}</p>
                      <p className="text-text-muted text-sm leading-relaxed mb-4">{course.description}</p>

                      <div className="flex items-center gap-4 text-xs text-text-muted mb-3">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          {course.lessons} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          ~{course.hours} hours
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: course.color,
                            boxShadow: pct > 0 ? `0 0 8px ${course.color}60` : 'none',
                          }}
                        />
                      </div>
                      <p className="text-[11px] text-text-muted mt-1">{pct}% complete</p>
                    </div>
                  </div>

                  {!isExpanded && (
                    <button
                      className="mt-4 w-full py-2.5 rounded-xl text-sm font-heading font-semibold transition-all border"
                      style={{
                        color: course.color,
                        borderColor: `${course.color}30`,
                        backgroundColor: `${course.color}08`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCourse(course.id);
                      }}
                    >
                      {pct > 0 ? 'Continue Course' : 'Start Course'}
                    </button>
                  )}
                </div>

                {/* Expanded Lesson List */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-white/5 pt-4">
                    <h4 className="font-heading font-semibold text-sm text-text-secondary uppercase tracking-wider mb-4">
                      Lesson Plan
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {course.lessons_list.map((lesson, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                        >
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold"
                            style={{
                              backgroundColor: i < courseProgress ? `${course.color}20` : 'rgba(255,255,255,0.03)',
                              color: i < courseProgress ? course.color : '#4A6080',
                              border: `1px solid ${i < courseProgress ? `${course.color}40` : 'rgba(255,255,255,0.05)'}`,
                            }}
                          >
                            {i + 1}
                          </div>
                          <span className={`text-sm ${i < courseProgress ? 'text-text-primary' : 'text-text-muted'}`}>
                            {lesson}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button
                      className="mt-6 px-8 py-3 rounded-xl text-sm font-heading font-semibold transition-all border"
                      style={{
                        color: course.color,
                        borderColor: `${course.color}40`,
                        backgroundColor: `${course.color}10`,
                      }}
                    >
                      {pct > 0 ? 'Continue Learning' : 'Begin Course'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Researcher Badge Levels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <h2 className="font-heading font-bold text-2xl text-text-primary mb-2">Researcher Badges</h2>
        <p className="text-text-muted text-sm mb-8">
          Complete experiments across all courses to earn your badge. Current progress: {totalCompleted} experiments.
        </p>
        <div className="flex flex-wrap gap-4">
          {BADGE_LEVELS.map((badge) => {
            const earned = totalCompleted >= badge.experiments;
            return (
              <div
                key={badge.name}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all ${
                  earned
                    ? 'border-white/15 bg-bg-card/80'
                    : 'border-white/5 bg-bg-card/30 opacity-50'
                }`}
              >
                <Star
                  className="w-5 h-5"
                  style={{ color: earned ? badge.color : '#2a3a55' }}
                  fill={earned ? badge.color : 'none'}
                />
                <div>
                  <p className="text-sm font-heading font-semibold" style={{ color: earned ? badge.color : '#4A6080' }}>
                    {badge.name}
                  </p>
                  <p className="text-[11px] text-text-muted">{badge.experiments.toLocaleString()} experiments</p>
                </div>
              </div>
            );
          })}
        </div>
        {currentBadge && (
          <p className="text-sm text-text-secondary mt-4">
            Current rank:{' '}
            <span className="font-heading font-bold" style={{ color: currentBadge.color }}>
              {currentBadge.name}
            </span>
          </p>
        )}
      </section>

      {/* Certificates */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading font-bold text-2xl text-text-primary mb-2">Certificates</h2>
        <p className="text-text-muted text-sm mb-8">
          Complete all lessons in a course to earn your certificate of completion.
        </p>
        <div className="rounded-2xl border border-white/5 bg-bg-card/30 p-12 text-center">
          <Award className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-30" />
          <p className="text-text-muted text-sm">No certificates earned yet.</p>
          <p className="text-text-muted text-xs mt-2">Complete your first course to earn a certificate.</p>
        </div>
      </section>
    </div>
  );
}

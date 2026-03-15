'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
  CheckCircle,
  ArrowLeft,
  Loader2,
  X,
  Sparkles,
} from 'lucide-react';

/* ── Types ───────────────────────────────────────── */
interface LessonSection {
  heading: string;
  content: string;
  keyPoints: string[];
}

interface LessonContent {
  title: string;
  sections: LessonSection[];
  summary: string;
  quiz: { question: string; options: string[]; correctIndex: number; explanation: string }[];
}

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
  { name: 'Apprentice', experiments: 5, color: '#8BA4CC' },
  { name: 'Researcher', experiments: 15, color: '#00E5FF' },
  { name: 'Scientist', experiments: 30, color: '#00FF94' },
  { name: 'Pioneer', experiments: 60, color: '#FFD700' },
  { name: 'Mastermind', experiments: 97, color: '#FF00E5' },
];

/* ── localStorage helpers ─────────────────────────── */
function getCompletedLessons(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  const stored = localStorage.getItem('genesis-learn-completed');
  return stored ? new Set(JSON.parse(stored)) : new Set();
}

function setCompletedLessons(completed: Set<string>) {
  localStorage.setItem('genesis-learn-completed', JSON.stringify([...completed]));
}

function lessonKey(courseId: string, lessonIndex: number) {
  return `${courseId}:${lessonIndex}`;
}

/* ── Component ───────────────────────────────────── */
export default function LearnPage() {
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [activeLesson, setActiveLesson] = useState<{ courseId: string; lessonIndex: number } | null>(null);
  const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [justCompleted, setJustCompleted] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const lessonRef = useRef<HTMLDivElement>(null);

  // Load from localStorage
  useEffect(() => {
    setCompleted(getCompletedLessons());
  }, []);

  // Count completed per course
  const getCourseProgress = useCallback(
    (courseId: string, total: number) => {
      let count = 0;
      for (let i = 0; i < total; i++) {
        if (completed.has(lessonKey(courseId, i))) count++;
      }
      return count;
    },
    [completed]
  );

  const totalCompleted = completed.size;

  const currentBadge =
    [...BADGE_LEVELS].reverse().find((b) => totalCompleted >= b.experiments) || null;

  // Open a lesson
  const openLesson = useCallback(
    async (courseId: string, lessonIndex: number) => {
      const course = COURSES.find((c) => c.id === courseId);
      if (!course) return;

      setActiveLesson({ courseId, lessonIndex });
      setLessonContent(null);
      setIsLoading(true);
      setQuizAnswers({});
      setQuizSubmitted(false);

      // Scroll to lesson viewer
      setTimeout(() => lessonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);

      try {
        const res = await fetch('/api/learn/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lessonTitle: course.lessons_list[lessonIndex],
            courseTitle: course.title,
            courseContext: course.lessons_list.join(', '),
            lessonIndex,
            totalLessons: course.lessons_list.length,
          }),
        });
        if (!res.ok) throw new Error('Failed to generate lesson');
        const data = await res.json();
        setLessonContent(data);
      } catch (err) {
        console.error('Lesson load error:', err);
        // Minimal fallback
        setLessonContent({
          title: course.lessons_list[lessonIndex],
          sections: [
            {
              heading: 'Lesson Content',
              content: `This lesson on **${course.lessons_list[lessonIndex]}** is part of the ${course.title} curriculum. Content generation encountered an issue — please try again in a moment.`,
              keyPoints: ['Content temporarily unavailable'],
            },
          ],
          summary: 'Please retry loading this lesson.',
          quiz: [],
        });
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Complete a lesson
  const completeLesson = useCallback(() => {
    if (!activeLesson) return;
    const key = lessonKey(activeLesson.courseId, activeLesson.lessonIndex);
    const next = new Set(completed);
    next.add(key);
    setCompleted(next);
    setCompletedLessons(next);
    setJustCompleted(key);
    setTimeout(() => setJustCompleted(null), 2000);
  }, [activeLesson, completed]);

  // Begin Course — find first incomplete lesson and open it
  const beginCourse = useCallback(
    (courseId: string) => {
      const course = COURSES.find((c) => c.id === courseId);
      if (!course) return;
      setExpandedCourse(courseId);

      // Find first incomplete lesson
      let target = 0;
      for (let i = 0; i < course.lessons_list.length; i++) {
        if (!completed.has(lessonKey(courseId, i))) {
          target = i;
          break;
        }
        if (i === course.lessons_list.length - 1) target = i; // all complete, open last
      }
      openLesson(courseId, target);
    },
    [completed, openLesson]
  );

  // Navigate to next/prev lesson
  const goToLesson = useCallback(
    (direction: 'next' | 'prev') => {
      if (!activeLesson) return;
      const course = COURSES.find((c) => c.id === activeLesson.courseId);
      if (!course) return;
      const newIndex = activeLesson.lessonIndex + (direction === 'next' ? 1 : -1);
      if (newIndex >= 0 && newIndex < course.lessons_list.length) {
        openLesson(activeLesson.courseId, newIndex);
      }
    },
    [activeLesson, openLesson]
  );

  // Close lesson viewer
  const closeLesson = useCallback(() => {
    setActiveLesson(null);
    setLessonContent(null);
    setQuizAnswers({});
    setQuizSubmitted(false);
  }, []);

  const activeCourse = activeLesson ? COURSES.find((c) => c.id === activeLesson.courseId) : null;

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
            Seven comprehensive courses spanning anatomy, physiology, pathology, pharmacology, forensics, and holistic
            medicine. Learn at your own pace.
          </p>
          {totalCompleted > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <CheckCircle className="w-4 h-4 text-[#00FF94]" />
              <span className="text-sm text-text-secondary">
                {totalCompleted} lesson{totalCompleted !== 1 ? 's' : ''} completed
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ── LESSON VIEWER ────────────────────────────── */}
      {activeLesson && (
        <section ref={lessonRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div
            className="rounded-2xl border bg-white/[0.03] backdrop-blur-xl overflow-hidden"
            style={{ borderColor: `${activeCourse?.color || '#00E5FF'}30` }}
          >
            {/* Lesson Header */}
            <div
              className="px-6 py-5 border-b border-white/5 flex items-center justify-between"
              style={{ background: `linear-gradient(135deg, ${activeCourse?.color || '#00E5FF'}08, transparent)` }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={closeLesson}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 text-text-secondary" />
                </button>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wider" style={{ color: activeCourse?.color }}>
                    {activeCourse?.title} — Lesson {activeLesson.lessonIndex + 1} of{' '}
                    {activeCourse?.lessons_list.length}
                  </p>
                  <h2 className="text-lg font-heading font-bold text-text-primary truncate">
                    {activeCourse?.lessons_list[activeLesson.lessonIndex]}
                  </h2>
                </div>
              </div>
              <button
                onClick={closeLesson}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 text-text-muted" />
              </button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="px-6 py-20 text-center">
                <div className="inline-flex flex-col items-center gap-4">
                  <div className="relative">
                    <Loader2
                      className="w-10 h-10 animate-spin"
                      style={{ color: activeCourse?.color || '#00E5FF' }}
                    />
                    <Sparkles
                      className="w-5 h-5 absolute -top-1 -right-1 animate-pulse"
                      style={{ color: activeCourse?.color || '#00E5FF' }}
                    />
                  </div>
                  <div>
                    <p className="text-text-primary font-heading font-semibold">Generating lesson content...</p>
                    <p className="text-text-muted text-sm mt-1">AI is preparing your lesson with GPT-4o</p>
                  </div>
                  {/* Skeleton lines */}
                  <div className="w-full max-w-md space-y-3 mt-6">
                    {[80, 60, 90, 45, 70].map((w, i) => (
                      <div
                        key={i}
                        className="h-3 rounded-full animate-pulse"
                        style={{
                          width: `${w}%`,
                          backgroundColor: `${activeCourse?.color || '#00E5FF'}15`,
                          animationDelay: `${i * 150}ms`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Lesson Content */}
            {lessonContent && !isLoading && (
              <div className="px-6 py-6 space-y-8">
                {/* Sections */}
                {lessonContent.sections.map((section, si) => (
                  <div key={si}>
                    <h3
                      className="text-xl font-heading font-bold mb-3"
                      style={{ color: activeCourse?.color || '#00E5FF' }}
                    >
                      {section.heading}
                    </h3>
                    <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-line mb-4">
                      {section.content.split(/(\*\*.*?\*\*)/).map((part, pi) =>
                        part.startsWith('**') && part.endsWith('**') ? (
                          <strong key={pi} className="text-text-primary font-semibold">
                            {part.slice(2, -2)}
                          </strong>
                        ) : (
                          <span key={pi}>{part}</span>
                        )
                      )}
                    </div>

                    {/* Key Points */}
                    {section.keyPoints.length > 0 && (
                      <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                        <p className="text-xs font-heading font-semibold uppercase tracking-wider text-text-muted mb-2">
                          Key Points
                        </p>
                        <ul className="space-y-1.5">
                          {section.keyPoints.map((kp, ki) => (
                            <li key={ki} className="flex items-start gap-2 text-sm text-text-secondary">
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: activeCourse?.color || '#00E5FF' }} />
                              {kp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}

                {/* Summary */}
                {lessonContent.summary && (
                  <div
                    className="rounded-xl p-4 border"
                    style={{
                      backgroundColor: `${activeCourse?.color || '#00E5FF'}08`,
                      borderColor: `${activeCourse?.color || '#00E5FF'}20`,
                    }}
                  >
                    <p className="text-xs font-heading font-semibold uppercase tracking-wider mb-2" style={{ color: activeCourse?.color }}>
                      Summary
                    </p>
                    <p className="text-sm text-text-secondary leading-relaxed">{lessonContent.summary}</p>
                  </div>
                )}

                {/* Quiz */}
                {lessonContent.quiz.length > 0 && (
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                    <h3 className="text-lg font-heading font-bold text-text-primary mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" style={{ color: activeCourse?.color }} />
                      Knowledge Check
                    </h3>
                    <div className="space-y-5">
                      {lessonContent.quiz.map((q, qi) => (
                        <div key={qi} className="space-y-2">
                          <p className="text-sm font-medium text-text-primary">
                            {qi + 1}. {q.question}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.options.map((opt, oi) => {
                              const selected = quizAnswers[qi] === oi;
                              const isCorrect = oi === q.correctIndex;
                              const showResult = quizSubmitted;

                              let borderColor = 'rgba(255,255,255,0.05)';
                              let bgColor = 'rgba(255,255,255,0.02)';
                              let textColor = '#94a3b8';

                              if (selected && !showResult) {
                                borderColor = `${activeCourse?.color || '#00E5FF'}60`;
                                bgColor = `${activeCourse?.color || '#00E5FF'}10`;
                                textColor = '#e2e8f0';
                              }
                              if (showResult && isCorrect) {
                                borderColor = '#00FF9460';
                                bgColor = '#00FF9410';
                                textColor = '#00FF94';
                              }
                              if (showResult && selected && !isCorrect) {
                                borderColor = '#FF336660';
                                bgColor = '#FF336610';
                                textColor = '#FF3366';
                              }

                              return (
                                <button
                                  key={oi}
                                  disabled={quizSubmitted}
                                  onClick={() => setQuizAnswers((prev) => ({ ...prev, [qi]: oi }))}
                                  className="text-left px-3 py-2.5 rounded-lg border text-sm transition-all"
                                  style={{ borderColor, backgroundColor: bgColor, color: textColor }}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                          {quizSubmitted && (
                            <p className="text-xs text-text-muted mt-1 pl-1">{q.explanation}</p>
                          )}
                        </div>
                      ))}
                    </div>
                    {!quizSubmitted && (
                      <button
                        onClick={() => setQuizSubmitted(true)}
                        disabled={Object.keys(quizAnswers).length < lessonContent.quiz.length}
                        className="mt-4 px-6 py-2.5 rounded-xl text-sm font-heading font-semibold transition-all border disabled:opacity-30"
                        style={{
                          color: activeCourse?.color,
                          borderColor: `${activeCourse?.color}40`,
                          backgroundColor: `${activeCourse?.color}10`,
                        }}
                      >
                        Check Answers
                      </button>
                    )}
                    {quizSubmitted && (
                      <p className="mt-3 text-sm text-text-secondary">
                        Score:{' '}
                        <span className="font-bold" style={{ color: activeCourse?.color }}>
                          {lessonContent.quiz.filter((q, i) => quizAnswers[i] === q.correctIndex).length}/
                          {lessonContent.quiz.length}
                        </span>
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    {activeLesson.lessonIndex > 0 && (
                      <button
                        onClick={() => goToLesson('prev')}
                        className="px-4 py-2.5 rounded-xl text-sm font-heading font-semibold text-text-secondary bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                      >
                        ← Previous
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {!completed.has(lessonKey(activeLesson.courseId, activeLesson.lessonIndex)) ? (
                      <button
                        onClick={completeLesson}
                        className="px-6 py-2.5 rounded-xl text-sm font-heading font-bold transition-all relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${activeCourse?.color || '#00E5FF'}, ${activeCourse?.color || '#00E5FF'}CC)`,
                          color: '#030712',
                          boxShadow: `0 0 20px ${activeCourse?.color || '#00E5FF'}30`,
                        }}
                      >
                        Complete Lesson ✓
                      </button>
                    ) : (
                      <span className="flex items-center gap-2 px-4 py-2.5 text-sm font-heading font-semibold text-[#00FF94]">
                        <CheckCircle className="w-4 h-4" />
                        Completed
                      </span>
                    )}
                    {activeLesson.lessonIndex < (activeCourse?.lessons_list.length || 1) - 1 && (
                      <button
                        onClick={() => goToLesson('next')}
                        className="px-4 py-2.5 rounded-xl text-sm font-heading font-semibold transition-all border"
                        style={{
                          color: activeCourse?.color,
                          borderColor: `${activeCourse?.color}40`,
                          backgroundColor: `${activeCourse?.color}10`,
                        }}
                      >
                        Next →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Course Complete Banner ────────────────────── */}
      {justCompleted && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="px-6 py-3 rounded-full bg-[#00FF94]/10 border border-[#00FF94]/30 backdrop-blur-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-[#00FF94]" />
            <span className="text-sm font-heading font-bold text-[#00FF94]">Lesson Complete!</span>
          </div>
        </div>
      )}

      {/* Curriculum Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <h2 className="font-heading font-bold text-2xl text-text-primary mb-8">Curriculum</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {COURSES.map((course) => {
            const Icon = course.icon;
            const isExpanded = expandedCourse === course.id;
            const courseProgress = getCourseProgress(course.id, course.lessons_list.length);
            const pct = Math.round((courseProgress / course.lessons_list.length) * 100);
            const allComplete = courseProgress === course.lessons_list.length;

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
                      style={{
                        backgroundColor: `${course.color}12`,
                        border: `1px solid ${course.color}25`,
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: course.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-heading font-bold text-lg flex items-center gap-2" style={{ color: course.color }}>
                          {course.title}
                          {allComplete && <CheckCircle className="w-4 h-4 text-[#00FF94]" />}
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
                          {course.lessons_list.length} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          ~{course.hours} hours
                        </span>
                        {courseProgress > 0 && (
                          <span className="flex items-center gap-1 text-[#00FF94]">
                            <CheckCircle className="w-3.5 h-3.5" />
                            {courseProgress}/{course.lessons_list.length}
                          </span>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: allComplete ? '#00FF94' : course.color,
                            boxShadow: pct > 0 ? `0 0 8px ${allComplete ? '#00FF94' : course.color}60` : 'none',
                          }}
                        />
                      </div>
                      <p className="text-[11px] text-text-muted mt-1">
                        {allComplete ? '🎉 Course complete!' : `${pct}% complete`}
                      </p>
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
                        beginCourse(course.id);
                      }}
                    >
                      {allComplete ? 'Review Course' : pct > 0 ? 'Continue Course' : 'Start Course'}
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
                      {course.lessons_list.map((lesson, i) => {
                        const isComplete = completed.has(lessonKey(course.id, i));
                        const isActive =
                          activeLesson?.courseId === course.id && activeLesson?.lessonIndex === i;

                        return (
                          <button
                            key={i}
                            onClick={() => openLesson(course.id, i)}
                            className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                              isActive
                                ? 'border-opacity-60 bg-opacity-10'
                                : isComplete
                                ? 'hover:border-white/15'
                                : 'hover:border-white/10 hover:bg-white/[0.03]'
                            }`}
                            style={{
                              borderColor: isActive
                                ? `${course.color}60`
                                : isComplete
                                ? '#00FF9430'
                                : 'rgba(255,255,255,0.05)',
                              backgroundColor: isActive
                                ? `${course.color}10`
                                : isComplete
                                ? '#00FF9408'
                                : 'rgba(255,255,255,0.01)',
                              boxShadow: isActive ? `0 0 12px ${course.color}15` : 'none',
                            }}
                          >
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold"
                              style={{
                                backgroundColor: isComplete
                                  ? '#00FF9420'
                                  : isActive
                                  ? `${course.color}20`
                                  : 'rgba(255,255,255,0.03)',
                                color: isComplete
                                  ? '#00FF94'
                                  : isActive
                                  ? course.color
                                  : '#4A6080',
                                border: `1px solid ${
                                  isComplete
                                    ? '#00FF9440'
                                    : isActive
                                    ? `${course.color}40`
                                    : 'rgba(255,255,255,0.05)'
                                }`,
                              }}
                            >
                              {isComplete ? '✓' : i + 1}
                            </div>
                            <span
                              className={`text-sm ${
                                isComplete
                                  ? 'text-[#00FF94]/80'
                                  : isActive
                                  ? 'text-text-primary'
                                  : 'text-text-muted'
                              }`}
                            >
                              {lesson}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <button
                      className="mt-6 px-8 py-3 rounded-xl text-sm font-heading font-semibold transition-all border"
                      style={{
                        color: course.color,
                        borderColor: `${course.color}40`,
                        backgroundColor: `${course.color}10`,
                      }}
                      onClick={() => beginCourse(course.id)}
                    >
                      {allComplete ? 'Review Course' : pct > 0 ? 'Continue Learning' : 'Begin Course'}
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
          Complete lessons across all courses to earn your badge. Current progress: {totalCompleted} lessons completed.
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
                style={earned ? { boxShadow: `0 0 12px ${badge.color}20` } : {}}
              >
                <Star
                  className="w-5 h-5"
                  style={{ color: earned ? badge.color : '#2a3a55' }}
                  fill={earned ? badge.color : 'none'}
                />
                <div>
                  <p
                    className="text-sm font-heading font-semibold"
                    style={{ color: earned ? badge.color : '#4A6080' }}
                  >
                    {badge.name}
                  </p>
                  <p className="text-[11px] text-text-muted">{badge.experiments} lessons</p>
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
        {COURSES.some((c) => getCourseProgress(c.id, c.lessons_list.length) === c.lessons_list.length) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COURSES.filter((c) => getCourseProgress(c.id, c.lessons_list.length) === c.lessons_list.length).map(
              (course) => (
                <div
                  key={course.id}
                  className="rounded-2xl border p-6 text-center"
                  style={{
                    borderColor: `${course.color}30`,
                    background: `linear-gradient(135deg, ${course.color}08, transparent)`,
                  }}
                >
                  <Award className="w-10 h-10 mx-auto mb-3" style={{ color: course.color }} />
                  <p className="font-heading font-bold text-text-primary">{course.title}</p>
                  <p className="text-xs text-text-muted mt-1">Certificate of Completion</p>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/5 bg-bg-card/30 p-12 text-center">
            <Award className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-30" />
            <p className="text-text-muted text-sm">No certificates earned yet.</p>
            <p className="text-text-muted text-xs mt-2">Complete your first course to earn a certificate.</p>
          </div>
        )}
      </section>
    </div>
  );
}

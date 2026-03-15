'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Eye,
  EyeOff,
  ArrowRight,
  Volume2,
  VolumeX,
  Info,
  X,
} from 'lucide-react';

/* ── Body Part Data ──────────────────────────────────────── */
interface BodyPartInfo {
  name: string;
  system: string;
  function: string;
  connected: string[];
  conditions: string[];
}

const BODY_PARTS: Record<string, BodyPartInfo> = {
  brain: {
    name: 'Brain',
    system: 'Nervous',
    function:
      'The command center of the body. Processes sensory information, controls movement, regulates homeostasis, and enables consciousness, memory, emotion, and cognition through ~86 billion neurons.',
    connected: ['Spinal Cord', 'Cranial Nerves', 'Brainstem', 'Cerebellum'],
    conditions: [
      'Alzheimer\'s Disease',
      'Parkinson\'s Disease',
      'Epilepsy',
      'Stroke',
      'Meningitis',
      'Glioblastoma',
    ],
  },
  heart: {
    name: 'Heart',
    system: 'Cardiovascular',
    function:
      'A muscular pump that circulates blood throughout the body. Beats ~100,000 times per day, pumping ~2,000 gallons of blood. Four chambers work in synchronized rhythm to deliver oxygen and nutrients to every cell.',
    connected: ['Aorta', 'Pulmonary Arteries', 'Vena Cava', 'Coronary Arteries'],
    conditions: [
      'Myocardial Infarction',
      'Heart Failure',
      'Arrhythmia',
      'Cardiomyopathy',
      'Valve Disease',
    ],
  },
  left_lung: {
    name: 'Left Lung',
    system: 'Respiratory',
    function:
      'Gas exchange organ with two lobes. Draws in oxygen during inhalation and expels carbon dioxide during exhalation. Contains ~300 million alveoli providing ~70 m\u00B2 of surface area for gas exchange.',
    connected: ['Left Bronchus', 'Pulmonary Veins', 'Diaphragm', 'Trachea'],
    conditions: [
      'Pneumonia',
      'Asthma',
      'Lung Cancer',
      'Pulmonary Embolism',
      'COPD',
    ],
  },
  right_lung: {
    name: 'Right Lung',
    system: 'Respiratory',
    function:
      'Gas exchange organ with three lobes, slightly larger than the left. Handles approximately 55% of total lung capacity. Works with the diaphragm and intercostal muscles to create breathing mechanics.',
    connected: ['Right Bronchus', 'Pulmonary Arteries', 'Diaphragm', 'Trachea'],
    conditions: [
      'Pneumonia',
      'Tuberculosis',
      'Pleural Effusion',
      'Bronchitis',
      'Emphysema',
    ],
  },
  stomach: {
    name: 'Stomach',
    system: 'Digestive',
    function:
      'J-shaped muscular organ that stores food, mixes it with gastric juices (pH 1.5-3.5), and begins protein digestion via pepsin. Can expand to hold ~1 liter. Churning contractions create chyme for intestinal absorption.',
    connected: ['Esophagus', 'Duodenum', 'Vagus Nerve', 'Spleen'],
    conditions: [
      'Gastritis',
      'Peptic Ulcer',
      'Gastric Cancer',
      'GERD',
      'Gastroparesis',
    ],
  },
  liver: {
    name: 'Liver',
    system: 'Digestive',
    function:
      'The body\'s largest internal organ (~1.5 kg). Performs 500+ functions including detoxification, bile production, glycogen storage, protein synthesis, and cholesterol metabolism. Receives 25% of cardiac output.',
    connected: ['Gallbladder', 'Portal Vein', 'Hepatic Artery', 'Bile Duct'],
    conditions: [
      'Hepatitis',
      'Cirrhosis',
      'Fatty Liver Disease',
      'Liver Cancer',
      'Hemochromatosis',
    ],
  },
  left_kidney: {
    name: 'Left Kidney',
    system: 'Urinary',
    function:
      'Filters ~180 liters of blood daily through ~1 million nephrons. Regulates fluid balance, electrolytes, and blood pressure. Produces erythropoietin (EPO) for red blood cell production and activates vitamin D.',
    connected: ['Left Renal Artery', 'Left Ureter', 'Adrenal Gland', 'Aorta'],
    conditions: [
      'Kidney Stones',
      'Chronic Kidney Disease',
      'Renal Cell Carcinoma',
      'Pyelonephritis',
      'Polycystic Kidney Disease',
    ],
  },
  right_kidney: {
    name: 'Right Kidney',
    system: 'Urinary',
    function:
      'Positioned slightly lower than the left due to the liver. Filters waste products (urea, creatinine) from blood, maintains acid-base balance, and regulates blood pressure through the renin-angiotensin system.',
    connected: ['Right Renal Artery', 'Right Ureter', 'Adrenal Gland', 'Vena Cava'],
    conditions: [
      'Kidney Stones',
      'Hydronephrosis',
      'Renal Failure',
      'Glomerulonephritis',
      'UTI',
    ],
  },
  spine: {
    name: 'Spinal Column',
    system: 'Skeletal',
    function:
      '33 vertebrae protecting the spinal cord. Provides structural support, enables flexible movement, and houses nerve pathways connecting the brain to the body. Divided into cervical (7), thoracic (12), lumbar (5), sacral (5), and coccygeal (4) regions.',
    connected: ['Skull', 'Pelvis', 'Ribs', 'Spinal Cord', 'Intervertebral Discs'],
    conditions: [
      'Herniated Disc',
      'Scoliosis',
      'Spinal Stenosis',
      'Osteoporosis',
      'Sciatica',
    ],
  },
  skull: {
    name: 'Skull',
    system: 'Skeletal',
    function:
      'Composed of 22 bones (8 cranial, 14 facial) that protect the brain, house sensory organs, and anchor facial muscles. Fontanelles in infants allow brain growth before fusing into rigid sutures.',
    connected: ['Brain', 'Cervical Spine', 'Jaw (Mandible)', 'Meninges'],
    conditions: [
      'Skull Fracture',
      'Craniosynostosis',
      'Paget\'s Disease',
      'Osteomyelitis',
    ],
  },
};

/* ── System definitions ──────────────────────────────────── */
interface SystemDef {
  label: string;
  color: string;
  description: string;
}

const SYSTEMS: Record<string, SystemDef> = {
  skeletal: { label: 'Skeletal', color: '#E8DCC8', description: '206 bones forming the structural framework' },
  muscular: { label: 'Muscular', color: '#CC3333', description: '600+ muscles enabling movement and stability' },
  nervous: { label: 'Nervous', color: '#FFD700', description: 'Brain, spinal cord, and peripheral nerves' },
  cardiovascular: { label: 'Cardiovascular', color: '#FF3366', description: 'Heart and 60,000 miles of blood vessels' },
  respiratory: { label: 'Respiratory', color: '#66CCFF', description: 'Lungs and airways for gas exchange' },
  digestive: { label: 'Digestive', color: '#FF9933', description: '30-foot tract from mouth to rectum' },
  endocrine: { label: 'Endocrine', color: '#9945FF', description: 'Hormone-producing glands regulating metabolism' },
  lymphatic: { label: 'Lymphatic', color: '#00FF94', description: 'Immune defense and fluid drainage network' },
  urinary: { label: 'Urinary', color: '#FFCC00', description: 'Kidneys and bladder filtering waste' },
  reproductive: { label: 'Reproductive', color: '#FF66B2', description: 'Organs of human reproduction' },
  integumentary: { label: 'Integumentary', color: '#C4A882', description: 'Skin, hair, and nails — the outer barrier' },
};

/* ── SVG Body Component ──────────────────────────────────── */
function InteractiveBody({
  activeSystems,
  gender,
  opacity,
  onPartClick,
  hoveredPart,
  setHoveredPart,
}: {
  activeSystems: Record<string, boolean>;
  gender: 'male' | 'female';
  opacity: number;
  onPartClick: (part: string) => void;
  hoveredPart: string | null;
  setHoveredPart: (part: string | null) => void;
}) {
  const glowId = (id: string) => `glow-${id}`;
  const isHovered = (part: string) => hoveredPart === part;

  return (
    <svg viewBox="0 0 500 800" className="w-full h-full max-w-[500px] mx-auto select-none">
      <defs>
        <filter id="sys-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="sys-glow-strong">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="hover-glow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feFlood floodColor="#00E5FF" floodOpacity="0.4" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="shadow" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="body-outline-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FF00E5" stopOpacity="0.15" />
        </linearGradient>
        {/* Animated dash for nervous system */}
        <style>{`
          @keyframes nerve-pulse { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -20; } }
          @keyframes blood-flow { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -30; } }
          @keyframes breathe-lungs { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
          .nerve-animated { animation: nerve-pulse 1.2s linear infinite; }
          .blood-animated { animation: blood-flow 1.5s linear infinite; }
          .lung-breathe { animation: breathe-lungs 4s ease-in-out infinite; }
          .clickable-part { cursor: pointer; transition: opacity 0.3s, filter 0.3s; }
          .clickable-part:hover { filter: url(#hover-glow); }
        `}</style>
      </defs>

      {/* ── Body Outline (always visible) ── */}
      <g opacity={0.25}>
        {/* Head */}
        <ellipse cx="250" cy="72" rx={gender === 'female' ? 42 : 45} ry="50" fill="none" stroke="url(#body-outline-grad)" strokeWidth="1.5" />
        {/* Neck */}
        <rect x="235" y="120" width="30" height="30" rx="5" fill="none" stroke="url(#body-outline-grad)" strokeWidth="1" />
        {/* Torso */}
        {gender === 'female' ? (
          <path d="M 190 150 Q 175 200 178 280 Q 180 320 195 350 L 200 350 Q 250 360 300 350 L 305 350 Q 320 320 322 280 Q 325 200 310 150 Z"
            fill="none" stroke="url(#body-outline-grad)" strokeWidth="1.5" />
        ) : (
          <path d="M 185 150 Q 178 200 180 280 Q 182 320 195 350 L 200 350 Q 250 360 300 350 L 305 350 Q 318 320 320 280 Q 322 200 315 150 Z"
            fill="none" stroke="url(#body-outline-grad)" strokeWidth="1.5" />
        )}
        {/* Arms */}
        <path d="M 185 155 Q 145 200 120 280 Q 110 310 105 340 Q 100 360 110 370" fill="none" stroke="url(#body-outline-grad)" strokeWidth="1.2" />
        <path d="M 315 155 Q 355 200 380 280 Q 390 310 395 340 Q 400 360 390 370" fill="none" stroke="url(#body-outline-grad)" strokeWidth="1.2" />
        {/* Legs */}
        <path d="M 210 350 Q 200 430 195 520 Q 190 590 185 650 Q 180 700 190 730 Q 195 745 210 748" fill="none" stroke="url(#body-outline-grad)" strokeWidth="1.3" />
        <path d="M 290 350 Q 300 430 305 520 Q 310 590 315 650 Q 320 700 310 730 Q 305 745 290 748" fill="none" stroke="url(#body-outline-grad)" strokeWidth="1.3" />
      </g>

      {/* ── SKELETAL SYSTEM ── */}
      {activeSystems.skeletal && (
        <g opacity={opacity} filter="url(#sys-glow)">
          {/* Skull */}
          <ellipse cx="250" cy="65" rx="35" ry="40" fill="none" stroke="#E8DCC8" strokeWidth="1.5"
            className="clickable-part" onClick={() => onPartClick('skull')}
            onMouseEnter={() => setHoveredPart('skull')} onMouseLeave={() => setHoveredPart(null)}
            style={{ opacity: isHovered('skull') ? 1 : 0.7 }} />
          <path d="M 232 90 Q 250 100 268 90" fill="none" stroke="#E8DCC8" strokeWidth="1" opacity="0.5" />
          {/* Eye sockets */}
          <circle cx="238" cy="60" r="7" fill="none" stroke="#E8DCC8" strokeWidth="0.8" opacity="0.4" />
          <circle cx="262" cy="60" r="7" fill="none" stroke="#E8DCC8" strokeWidth="0.8" opacity="0.4" />
          {/* Spine */}
          <g className="clickable-part" onClick={() => onPartClick('spine')}
            onMouseEnter={() => setHoveredPart('spine')} onMouseLeave={() => setHoveredPart(null)}
            style={{ opacity: isHovered('spine') ? 1 : 0.7 }}>
            {Array.from({ length: 18 }, (_, i) => (
              <rect key={i} x="246" y={130 + i * 12} width="8" height="8" rx="1.5"
                fill="none" stroke="#E8DCC8" strokeWidth="0.8" />
            ))}
          </g>
          {/* Ribs */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={`rib-${i}`} opacity="0.5">
              <path d={`M 248 ${160 + i * 18} Q 220 ${155 + i * 18} ${200 - i * 2} ${165 + i * 18}`}
                fill="none" stroke="#E8DCC8" strokeWidth="0.8" />
              <path d={`M 252 ${160 + i * 18} Q 280 ${155 + i * 18} ${300 + i * 2} ${165 + i * 18}`}
                fill="none" stroke="#E8DCC8" strokeWidth="0.8" />
            </g>
          ))}
          {/* Pelvis */}
          <path d="M 215 340 Q 200 320 210 300 Q 230 310 250 312 Q 270 310 290 300 Q 300 320 285 340"
            fill="none" stroke="#E8DCC8" strokeWidth="1" opacity="0.5" />
          {/* Arm bones */}
          <line x1="185" y1="160" x2="145" y2="250" stroke="#E8DCC8" strokeWidth="0.8" opacity="0.4" />
          <line x1="143" y1="255" x2="115" y2="340" stroke="#E8DCC8" strokeWidth="0.7" opacity="0.4" />
          <line x1="315" y1="160" x2="355" y2="250" stroke="#E8DCC8" strokeWidth="0.8" opacity="0.4" />
          <line x1="357" y1="255" x2="385" y2="340" stroke="#E8DCC8" strokeWidth="0.7" opacity="0.4" />
          {/* Leg bones */}
          <line x1="225" y1="350" x2="200" y2="530" stroke="#E8DCC8" strokeWidth="1" opacity="0.4" />
          <line x1="198" y1="540" x2="190" y2="700" stroke="#E8DCC8" strokeWidth="0.9" opacity="0.4" />
          <line x1="275" y1="350" x2="300" y2="530" stroke="#E8DCC8" strokeWidth="1" opacity="0.4" />
          <line x1="302" y1="540" x2="310" y2="700" stroke="#E8DCC8" strokeWidth="0.9" opacity="0.4" />
        </g>
      )}

      {/* ── CARDIOVASCULAR SYSTEM ── */}
      {activeSystems.cardiovascular && (
        <g opacity={opacity} filter="url(#sys-glow)">
          {/* Heart */}
          <g className="clickable-part" onClick={() => onPartClick('heart')}
            onMouseEnter={() => setHoveredPart('heart')} onMouseLeave={() => setHoveredPart(null)}>
            <path d="M 255 195 Q 240 178 225 185 Q 210 192 215 210 Q 218 225 255 245 Q 292 225 295 210 Q 300 192 285 185 Q 270 178 255 195"
              fill={isHovered('heart') ? '#FF336650' : '#FF336630'} stroke="#FF3366" strokeWidth="2" />
            <animate attributeName="opacity" values="0.7;1;0.7" dur="0.83s" repeatCount="indefinite" />
          </g>
          {/* Aorta */}
          <path d="M 255 195 Q 255 175 255 160 Q 255 145 270 140 Q 285 142 290 155 Q 290 170 280 200"
            fill="none" stroke="#FF3366" strokeWidth="1.5" opacity="0.5" />
          {/* Major vessels down */}
          <path d="M 255 245 L 250 320 Q 248 340 235 350 L 220 440 L 205 580 L 195 700"
            fill="none" stroke="#FF3366" strokeWidth="1" opacity="0.35" strokeDasharray="4 3" className="blood-animated" />
          <path d="M 255 245 L 260 320 Q 262 340 275 350 L 280 440 L 295 580 L 305 700"
            fill="none" stroke="#882244" strokeWidth="1" opacity="0.35" strokeDasharray="4 3" className="blood-animated" />
          {/* Arm vessels */}
          <path d="M 240 180 Q 200 190 160 260 L 120 340" fill="none" stroke="#FF3366" strokeWidth="0.8" opacity="0.3" strokeDasharray="3 3" className="blood-animated" />
          <path d="M 270 180 Q 310 190 340 260 L 380 340" fill="none" stroke="#FF3366" strokeWidth="0.8" opacity="0.3" strokeDasharray="3 3" className="blood-animated" />
          {/* Blood flow dots */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <circle key={`blood-${i}`} r="2.5" fill="#FF3366" opacity="0.7">
              <animateMotion
                path="M 255 245 L 250 320 Q 248 340 235 350 L 220 440 L 205 580 L 195 700 L 205 580 L 220 440 L 235 350 Q 248 340 250 320 L 255 245"
                dur={`${6 + i * 0.8}s`}
                begin={`${i * 1}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>
      )}

      {/* ── NERVOUS SYSTEM ── */}
      {activeSystems.nervous && (
        <g opacity={opacity} filter="url(#sys-glow)">
          {/* Brain */}
          <g className="clickable-part" onClick={() => onPartClick('brain')}
            onMouseEnter={() => setHoveredPart('brain')} onMouseLeave={() => setHoveredPart(null)}>
            <ellipse cx="250" cy="55" rx="28" ry="25" fill={isHovered('brain') ? '#FFD70030' : '#FFD70015'} stroke="#FFD700" strokeWidth="1.5" />
            {/* Brain folds */}
            <path d="M 230 48 Q 240 40 250 48 Q 260 40 270 48" fill="none" stroke="#FFD700" strokeWidth="0.8" opacity="0.5" />
            <path d="M 233 58 Q 245 52 255 58 Q 265 52 267 58" fill="none" stroke="#FFD700" strokeWidth="0.8" opacity="0.5" />
            <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
          </g>
          {/* Spinal cord */}
          <line x1="250" y1="80" x2="250" y2="350" stroke="#FFD700" strokeWidth="2" opacity="0.5"
            strokeDasharray="6 4" className="nerve-animated" />
          {/* Nerve branches */}
          {[160, 200, 240, 280, 320].map((y, i) => (
            <g key={`nerve-${i}`} opacity="0.35">
              <line x1="250" y1={y} x2={180 - i * 5} y2={y + 20 + i * 8} stroke="#FFD700" strokeWidth="0.7" strokeDasharray="3 3" className="nerve-animated" />
              <line x1="250" y1={y} x2={320 + i * 5} y2={y + 20 + i * 8} stroke="#FFD700" strokeWidth="0.7" strokeDasharray="3 3" className="nerve-animated" />
            </g>
          ))}
          {/* Down to legs */}
          <line x1="245" y1="350" x2="210" y2="600" stroke="#FFD700" strokeWidth="0.7" opacity="0.25" strokeDasharray="4 4" className="nerve-animated" />
          <line x1="255" y1="350" x2="290" y2="600" stroke="#FFD700" strokeWidth="0.7" opacity="0.25" strokeDasharray="4 4" className="nerve-animated" />
          {/* Electrical pulse dots */}
          {[0, 1, 2].map((i) => (
            <circle key={`pulse-${i}`} r="3" fill="#FFD700" opacity="0.8">
              <animateMotion
                path="M 250 80 L 250 350"
                dur={`${2 + i * 0.5}s`}
                begin={`${i * 0.7}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>
      )}

      {/* ── RESPIRATORY SYSTEM ── */}
      {activeSystems.respiratory && (
        <g opacity={opacity} filter="url(#sys-glow)">
          {/* Trachea */}
          <rect x="246" y="110" width="8" height="50" rx="3" fill="none" stroke="#66CCFF" strokeWidth="1" opacity="0.5" />
          {/* Bronchi */}
          <path d="M 250 160 Q 230 170 220 180" fill="none" stroke="#66CCFF" strokeWidth="1" opacity="0.4" />
          <path d="M 250 160 Q 270 170 280 180" fill="none" stroke="#66CCFF" strokeWidth="1" opacity="0.4" />
          {/* Left Lung */}
          <g className="clickable-part" onClick={() => onPartClick('left_lung')}
            onMouseEnter={() => setHoveredPart('left_lung')} onMouseLeave={() => setHoveredPart(null)}
            style={{ transformOrigin: '220px 210px' }}>
            <ellipse cx="220" cy="210" rx="30" ry="45" fill={isHovered('left_lung') ? '#66CCFF18' : '#66CCFF08'} stroke="#66CCFF" strokeWidth="1.5" className="lung-breathe" />
            <ellipse cx="220" cy="210" rx="20" ry="32" fill="none" stroke="#66CCFF" strokeWidth="0.5" opacity="0.3" className="lung-breathe" />
          </g>
          {/* Right Lung */}
          <g className="clickable-part" onClick={() => onPartClick('right_lung')}
            onMouseEnter={() => setHoveredPart('right_lung')} onMouseLeave={() => setHoveredPart(null)}
            style={{ transformOrigin: '280px 210px' }}>
            <ellipse cx="280" cy="210" rx="32" ry="48" fill={isHovered('right_lung') ? '#66CCFF18' : '#66CCFF08'} stroke="#66CCFF" strokeWidth="1.5" className="lung-breathe" />
            <ellipse cx="280" cy="210" rx="22" ry="35" fill="none" stroke="#66CCFF" strokeWidth="0.5" opacity="0.3" className="lung-breathe" />
          </g>
          {/* Diaphragm */}
          <path d="M 190 265 Q 250 285 310 265" fill="none" stroke="#66CCFF" strokeWidth="1" opacity="0.3" strokeDasharray="4 2" />
        </g>
      )}

      {/* ── DIGESTIVE SYSTEM ── */}
      {activeSystems.digestive && (
        <g opacity={opacity} filter="url(#sys-glow)">
          {/* Esophagus */}
          <line x1="250" y1="100" x2="250" y2="270" stroke="#FF9933" strokeWidth="1.2" opacity="0.4" />
          {/* Stomach */}
          <g className="clickable-part" onClick={() => onPartClick('stomach')}
            onMouseEnter={() => setHoveredPart('stomach')} onMouseLeave={() => setHoveredPart(null)}>
            <path d="M 240 270 Q 225 265 218 280 Q 210 300 225 315 Q 240 325 260 320 Q 270 315 265 295 Q 262 275 250 270"
              fill={isHovered('stomach') ? '#FF993325' : '#FF993312'} stroke="#FF9933" strokeWidth="1.5" />
          </g>
          {/* Liver */}
          <g className="clickable-part" onClick={() => onPartClick('liver')}
            onMouseEnter={() => setHoveredPart('liver')} onMouseLeave={() => setHoveredPart(null)}>
            <path d="M 270 260 Q 300 255 315 265 Q 320 275 310 285 Q 295 290 275 285 Q 265 280 270 260"
              fill={isHovered('liver') ? '#8B451325' : '#8B451312'} stroke="#CC6633" strokeWidth="1.2" />
          </g>
          {/* Small intestine */}
          <path d="M 245 325 Q 230 340 240 350 Q 260 355 270 345 Q 280 335 265 330 Q 245 335 240 345 Q 238 355 255 360 Q 270 358 275 350"
            fill="none" stroke="#FF9933" strokeWidth="1" opacity="0.35" />
          {/* Large intestine */}
          <path d="M 200 290 L 200 360 Q 200 375 215 375 L 285 375 Q 300 375 300 360 L 300 320"
            fill="none" stroke="#FF9933" strokeWidth="1.5" opacity="0.25" />
        </g>
      )}

      {/* ── MUSCULAR SYSTEM ── */}
      {activeSystems.muscular && (
        <g opacity={opacity * 0.5}>
          {/* Chest muscles */}
          <path d="M 210 160 Q 230 155 250 160 Q 250 180 230 185 Z" fill="#CC333320" stroke="#CC3333" strokeWidth="0.8" opacity="0.5" />
          <path d="M 290 160 Q 270 155 250 160 Q 250 180 270 185 Z" fill="#CC333320" stroke="#CC3333" strokeWidth="0.8" opacity="0.5" />
          {/* Deltoids */}
          <ellipse cx="185" cy="165" rx="15" ry="20" fill="#CC333315" stroke="#CC3333" strokeWidth="0.7" opacity="0.4" />
          <ellipse cx="315" cy="165" rx="15" ry="20" fill="#CC333315" stroke="#CC3333" strokeWidth="0.7" opacity="0.4" />
          {/* Biceps */}
          <ellipse cx="160" cy="220" rx="10" ry="25" fill="#CC333312" stroke="#CC3333" strokeWidth="0.6" opacity="0.35" transform="rotate(-15, 160, 220)" />
          <ellipse cx="340" cy="220" rx="10" ry="25" fill="#CC333312" stroke="#CC3333" strokeWidth="0.6" opacity="0.35" transform="rotate(15, 340, 220)" />
          {/* Abs */}
          {[0, 1, 2].map((i) => (
            <g key={`abs-${i}`}>
              <rect x="237" y={270 + i * 22} width="12" height="16" rx="3" fill="#CC333310" stroke="#CC3333" strokeWidth="0.5" opacity="0.3" />
              <rect x="253" y={270 + i * 22} width="12" height="16" rx="3" fill="#CC333310" stroke="#CC3333" strokeWidth="0.5" opacity="0.3" />
            </g>
          ))}
          {/* Quads */}
          <ellipse cx="220" cy="430" rx="18" ry="50" fill="#CC333310" stroke="#CC3333" strokeWidth="0.6" opacity="0.3" />
          <ellipse cx="280" cy="430" rx="18" ry="50" fill="#CC333310" stroke="#CC3333" strokeWidth="0.6" opacity="0.3" />
          {/* Calves */}
          <ellipse cx="200" cy="620" rx="12" ry="35" fill="#CC333310" stroke="#CC3333" strokeWidth="0.5" opacity="0.25" />
          <ellipse cx="300" cy="620" rx="12" ry="35" fill="#CC333310" stroke="#CC3333" strokeWidth="0.5" opacity="0.25" />
        </g>
      )}

      {/* ── LYMPHATIC SYSTEM ── */}
      {activeSystems.lymphatic && (
        <g opacity={opacity} filter="url(#sys-glow)">
          {/* Lymph nodes */}
          {[
            [235, 115], [265, 115], // cervical
            [195, 170], [305, 170], // axillary
            [250, 290], // abdominal
            [225, 365], [275, 365], // inguinal
          ].map(([cx, cy], i) => (
            <g key={`lymph-${i}`}>
              <circle cx={cx} cy={cy} r="5" fill="#00FF9420" stroke="#00FF94" strokeWidth="1" opacity="0.6">
                <animate attributeName="r" values="4;6;4" dur={`${3 + i * 0.3}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}
          {/* Connecting lines */}
          <path d="M 235 115 L 195 170 L 250 290 L 225 365" fill="none" stroke="#00FF94" strokeWidth="0.6" opacity="0.25" />
          <path d="M 265 115 L 305 170 L 250 290 L 275 365" fill="none" stroke="#00FF94" strokeWidth="0.6" opacity="0.25" />
          {/* Spleen */}
          <ellipse cx="290" cy="275" rx="12" ry="8" fill="#00FF9410" stroke="#00FF94" strokeWidth="0.8" opacity="0.4" />
          {/* Thymus */}
          <ellipse cx="250" cy="155" rx="8" ry="6" fill="#00FF9410" stroke="#00FF94" strokeWidth="0.8" opacity="0.4" />
        </g>
      )}

      {/* ── ENDOCRINE SYSTEM ── */}
      {activeSystems.endocrine && (
        <g opacity={opacity} filter="url(#sys-glow)">
          {/* Pituitary */}
          <circle cx="250" cy="68" r="4" fill="#9945FF25" stroke="#9945FF" strokeWidth="1" opacity="0.7" />
          <text x="250" y="62" fill="#9945FF" fontSize="6" textAnchor="middle" opacity="0.4">Pituitary</text>
          {/* Thyroid */}
          <path d="M 238 118 Q 250 125 262 118" fill="none" stroke="#9945FF" strokeWidth="1.2" opacity="0.5" />
          <circle cx="242" cy="120" r="4" fill="#9945FF15" stroke="#9945FF" strokeWidth="0.8" opacity="0.5" />
          <circle cx="258" cy="120" r="4" fill="#9945FF15" stroke="#9945FF" strokeWidth="0.8" opacity="0.5" />
          {/* Adrenals (on top of kidneys) */}
          <path d="M 208 278 Q 215 272 222 278" fill="#9945FF20" stroke="#9945FF" strokeWidth="0.8" opacity="0.5" />
          <path d="M 278 278 Q 285 272 292 278" fill="#9945FF20" stroke="#9945FF" strokeWidth="0.8" opacity="0.5" />
          {/* Pancreas */}
          <path d="M 235 300 Q 255 295 280 300" fill="none" stroke="#9945FF" strokeWidth="1" opacity="0.4" />
        </g>
      )}

      {/* ── URINARY SYSTEM ── */}
      {activeSystems.urinary && (
        <g opacity={opacity} filter="url(#sys-glow)">
          {/* Left Kidney */}
          <g className="clickable-part" onClick={() => onPartClick('left_kidney')}
            onMouseEnter={() => setHoveredPart('left_kidney')} onMouseLeave={() => setHoveredPart(null)}>
            <ellipse cx="215" cy="290" rx="14" ry="20" fill={isHovered('left_kidney') ? '#FFCC0020' : '#FFCC0010'} stroke="#FFCC00" strokeWidth="1.2" />
          </g>
          {/* Right Kidney */}
          <g className="clickable-part" onClick={() => onPartClick('right_kidney')}
            onMouseEnter={() => setHoveredPart('right_kidney')} onMouseLeave={() => setHoveredPart(null)}>
            <ellipse cx="285" cy="295" rx="14" ry="20" fill={isHovered('right_kidney') ? '#FFCC0020' : '#FFCC0010'} stroke="#FFCC00" strokeWidth="1.2" />
          </g>
          {/* Ureters */}
          <line x1="215" y1="310" x2="240" y2="370" stroke="#FFCC00" strokeWidth="0.8" opacity="0.3" />
          <line x1="285" y1="315" x2="260" y2="370" stroke="#FFCC00" strokeWidth="0.8" opacity="0.3" />
          {/* Bladder */}
          <ellipse cx="250" cy="380" rx="15" ry="12" fill="#FFCC0010" stroke="#FFCC00" strokeWidth="1" opacity="0.4" />
        </g>
      )}

      {/* ── REPRODUCTIVE SYSTEM ── */}
      {activeSystems.reproductive && (
        <g opacity={opacity * 0.6} filter="url(#sys-glow)">
          {gender === 'female' ? (
            <>
              <path d="M 230 350 Q 225 340 235 335 Q 250 332 265 335 Q 275 340 270 350"
                fill="#FF66B210" stroke="#FF66B2" strokeWidth="1" opacity="0.5" />
              <circle cx="225" cy="340" r="6" fill="#FF66B210" stroke="#FF66B2" strokeWidth="0.8" opacity="0.4" />
              <circle cx="275" cy="340" r="6" fill="#FF66B210" stroke="#FF66B2" strokeWidth="0.8" opacity="0.4" />
            </>
          ) : (
            <>
              <ellipse cx="250" cy="380" rx="8" ry="5" fill="#FF66B210" stroke="#FF66B2" strokeWidth="0.8" opacity="0.4" />
            </>
          )}
        </g>
      )}

      {/* ── INTEGUMENTARY SYSTEM ── */}
      {activeSystems.integumentary && (
        <g opacity={opacity * 0.3}>
          {/* Skin outline */}
          <ellipse cx="250" cy="72" rx={gender === 'female' ? 44 : 47} ry="52" fill="none" stroke="#C4A882" strokeWidth="1.5" strokeDasharray="2 2" />
          <path d={gender === 'female'
            ? "M 188 150 Q 173 200 176 280 Q 178 320 193 350 L 200 350 Q 250 362 300 350 L 307 350 Q 322 320 324 280 Q 327 200 312 150 Z"
            : "M 183 150 Q 176 200 178 280 Q 180 320 193 350 L 200 350 Q 250 362 300 350 L 307 350 Q 320 320 322 280 Q 324 200 317 150 Z"
          } fill="none" stroke="#C4A882" strokeWidth="1" strokeDasharray="2 2" />
        </g>
      )}

      {/* ── Part labels (shown on hover) ── */}
      {hoveredPart && BODY_PARTS[hoveredPart] && (() => {
        const positions: Record<string, [number, number]> = {
          brain: [250, 35],
          skull: [250, 20],
          heart: [255, 175],
          left_lung: [220, 170],
          right_lung: [280, 170],
          stomach: [240, 260],
          liver: [295, 250],
          left_kidney: [215, 265],
          right_kidney: [285, 270],
          spine: [250, 125],
        };
        const pos = positions[hoveredPart] || [250, 200];
        return (
          <g>
            <rect x={pos[0] - 35} y={pos[1] - 10} width="70" height="16" rx="3" fill="#000408" fillOpacity="0.85" stroke="#00E5FF" strokeWidth="0.5" />
            <text x={pos[0]} y={pos[1] + 2} fill="#00E5FF" fontSize="8" fontFamily="'Exo 2', sans-serif" textAnchor="middle" fontWeight="600">
              {BODY_PARTS[hoveredPart].name}
            </text>
          </g>
        );
      })()}
    </svg>
  );
}

/* ── Main Page ───────────────────────────────────────────── */
export default function AtlasPage() {
  const [activeSystems, setActiveSystems] = useState<Record<string, boolean>>({
    skeletal: true,
    cardiovascular: true,
    nervous: true,
    respiratory: true,
    digestive: false,
    muscular: false,
    lymphatic: false,
    endocrine: false,
    urinary: false,
    reproductive: false,
    integumentary: false,
  });
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [opacity, setOpacity] = useState(0.8);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const handlePartClick = useCallback((part: string) => {
    setSelectedPart(part);
  }, []);

  const toggleSystem = useCallback((key: string) => {
    setActiveSystems((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const activeCount = Object.values(activeSystems).filter(Boolean).length;
  const partInfo = selectedPart ? BODY_PARTS[selectedPart] : null;

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="font-heading font-black text-4xl sm:text-5xl text-genesis-cyan glow-cyan tracking-tight mb-2">
          THE LIVING BODY
        </h1>
        <p className="text-text-secondary text-lg font-heading font-light">
          Interactive anatomical atlas — toggle systems, click structures, explore connections.
        </p>
        <div className="flex items-center gap-3 mt-3 text-text-muted text-sm">
          <span className="font-mono">{activeCount} systems active</span>
          <span className="text-white/10">|</span>
          <span className="font-mono">{Object.keys(BODY_PARTS).length} clickable structures</span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Left Panel — Body SVG */}
        <div className="lg:w-[60%] relative">
          <div className="relative bg-bg-surface/50 border border-white/5 rounded-2xl p-6 overflow-hidden box-glow-cyan">
            {/* Background radial */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,229,255,0.04)_0%,_transparent_70%)] pointer-events-none" />

            {/* Gender + Sound toggles */}
            <div className="relative z-10 flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setGender('male')}
                  className={`px-3 py-1 rounded-lg text-sm font-heading font-semibold transition-all ${
                    gender === 'male'
                      ? 'bg-genesis-cyan/15 text-genesis-cyan border border-genesis-cyan/30'
                      : 'text-text-muted hover:text-text-secondary border border-white/5'
                  }`}
                >
                  Male
                </button>
                <button
                  onClick={() => setGender('female')}
                  className={`px-3 py-1 rounded-lg text-sm font-heading font-semibold transition-all ${
                    gender === 'female'
                      ? 'bg-genesis-magenta/15 text-genesis-magenta border border-genesis-magenta/30'
                      : 'text-text-muted hover:text-text-secondary border border-white/5'
                  }`}
                >
                  Female
                </button>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm transition-all border ${
                  soundEnabled
                    ? 'text-genesis-green border-genesis-green/30 bg-genesis-green/10'
                    : 'text-text-muted border-white/5 hover:text-text-secondary'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                Sound: {soundEnabled ? 'On' : 'Off'}
              </button>
            </div>
            {soundEnabled && (
              <p className="text-text-muted text-[10px] text-right mb-2 -mt-2">
                Heartbeat + breathing sounds play when cardiovascular / respiratory systems are active
              </p>
            )}

            {/* SVG Body */}
            <div className="relative z-10" style={{ minHeight: 500 }}>
              <InteractiveBody
                activeSystems={activeSystems}
                gender={gender}
                opacity={opacity}
                onPartClick={handlePartClick}
                hoveredPart={hoveredPart}
                setHoveredPart={setHoveredPart}
              />
            </div>
          </div>
        </div>

        {/* Right Panel — Controls + Info */}
        <div className="lg:w-[40%] space-y-4">
          {/* System Toggles */}
          <div className="bg-bg-surface/50 border border-white/5 rounded-2xl p-5">
            <h2 className="font-heading font-bold text-lg text-text-primary mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-genesis-cyan animate-pulse" />
              Body Systems
            </h2>
            <div className="space-y-1.5">
              {Object.entries(SYSTEMS).map(([key, sys]) => (
                <button
                  key={key}
                  onClick={() => toggleSystem(key)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all hover:bg-white/3 group text-left"
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      activeSystems[key] ? 'bg-opacity-30' : 'border-white/15'
                    }`}
                    style={{
                      borderColor: activeSystems[key] ? sys.color : undefined,
                      backgroundColor: activeSystems[key] ? `${sys.color}30` : 'transparent',
                    }}
                  >
                    {activeSystems[key] && (
                      <svg width="12" height="12" viewBox="0 0 12 12">
                        <path d="M 2 6 L 5 9 L 10 3" fill="none" stroke={sys.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-heading font-semibold" style={{ color: activeSystems[key] ? sys.color : '#8BA4CC' }}>
                        {sys.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted truncate">{sys.description}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full transition-all" style={{ backgroundColor: activeSystems[key] ? sys.color : '#1a2235' }} />
                </button>
              ))}
            </div>

            {/* Quick toggles */}
            <div className="flex gap-2 mt-4 pt-3 border-t border-white/5">
              <button
                onClick={() => {
                  const all: Record<string, boolean> = {};
                  Object.keys(SYSTEMS).forEach((k) => (all[k] = true));
                  setActiveSystems(all);
                }}
                className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-white/10 text-text-secondary hover:text-text-primary hover:border-white/20 transition-all font-heading font-semibold"
              >
                Show All
              </button>
              <button
                onClick={() => {
                  const none: Record<string, boolean> = {};
                  Object.keys(SYSTEMS).forEach((k) => (none[k] = false));
                  setActiveSystems(none);
                }}
                className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-white/10 text-text-secondary hover:text-text-primary hover:border-white/20 transition-all font-heading font-semibold"
              >
                Hide All
              </button>
            </div>
          </div>

          {/* Transparency Slider */}
          <div className="bg-bg-surface/50 border border-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-semibold text-sm text-text-secondary">Transparency</h3>
              <span className="font-mono text-xs text-text-muted">{Math.round(opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-full accent-genesis-cyan h-1"
            />
          </div>

          {/* Selected Part Info */}
          {partInfo ? (
            <div className="bg-bg-surface/50 border border-genesis-cyan/20 rounded-2xl p-5 box-glow-cyan animate-in">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="font-heading font-bold text-xl text-genesis-cyan glow-cyan">
                    {partInfo.name}
                  </h2>
                  <span
                    className="inline-block text-xs font-mono px-2 py-0.5 rounded-full mt-1"
                    style={{
                      color: SYSTEMS[partInfo.system.toLowerCase()]?.color || '#00E5FF',
                      backgroundColor: `${SYSTEMS[partInfo.system.toLowerCase()]?.color || '#00E5FF'}15`,
                      border: `1px solid ${SYSTEMS[partInfo.system.toLowerCase()]?.color || '#00E5FF'}30`,
                    }}
                  >
                    {partInfo.system} System
                  </span>
                </div>
                <button onClick={() => setSelectedPart(null)} className="text-text-muted hover:text-text-primary transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Function */}
              <div className="mb-4">
                <h3 className="text-xs font-heading font-semibold text-text-muted uppercase tracking-wider mb-1.5">Function</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{partInfo.function}</p>
              </div>

              {/* Connected Structures */}
              <div className="mb-4">
                <h3 className="text-xs font-heading font-semibold text-text-muted uppercase tracking-wider mb-1.5">Connected Structures</h3>
                <div className="flex flex-wrap gap-1.5">
                  {partInfo.connected.map((c) => (
                    <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-text-secondary border border-white/5">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Common Conditions */}
              <div className="mb-5">
                <h3 className="text-xs font-heading font-semibold text-text-muted uppercase tracking-wider mb-1.5">Common Conditions</h3>
                <div className="space-y-1">
                  {partInfo.conditions.map((c) => (
                    <div key={c} className="flex items-center gap-2 text-sm text-text-secondary">
                      <div className="w-1.5 h-1.5 rounded-full bg-genesis-magenta/60" />
                      {c}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <Link
                  href="/pathology"
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-heading font-semibold rounded-lg bg-genesis-magenta/10 border border-genesis-magenta/25 text-genesis-magenta hover:bg-genesis-magenta/20 transition-all"
                >
                  View in Pathology <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/lab"
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-heading font-semibold rounded-lg bg-genesis-gold/10 border border-genesis-gold/25 text-genesis-gold hover:bg-genesis-gold/20 transition-all"
                >
                  View in Lab <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-bg-surface/50 border border-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-3 text-text-muted">
                <Info className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">
                  Click on any highlighted body structure to view detailed anatomical information, connected systems, and common conditions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

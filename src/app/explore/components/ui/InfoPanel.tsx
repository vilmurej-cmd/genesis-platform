'use client';

import { useGenesisStore } from '../../store';
import { X, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const ORGAN_INFO: Record<string, {
  name: string;
  system: string;
  description: string;
  facts: string[];
  conditions: string[];
}> = {
  heart: {
    name: 'Heart',
    system: 'Cardiovascular',
    description: 'A muscular pump that circulates blood throughout the body. Beats ~100,000 times per day, pumping ~2,000 gallons of blood.',
    facts: ['Weighs 250-350g', 'Generates its own electrical impulses', 'Pumps 5L of blood per minute at rest', 'Has 4 chambers and 4 valves'],
    conditions: ['Heart Failure', 'Myocardial Infarction', 'Arrhythmia', 'Valve Disease'],
  },
  brain: {
    name: 'Brain',
    system: 'Nervous',
    description: 'The command center — processes sensory input, controls movement, enables consciousness, memory, emotion, and cognition through ~86 billion neurons.',
    facts: ['Uses 20% of body\'s oxygen', '~86 billion neurons', 'Generates ~23 watts of power', '100 trillion synaptic connections'],
    conditions: ['Alzheimer\'s', 'Stroke', 'Epilepsy', 'Parkinson\'s', 'Meningitis'],
  },
  lungs: {
    name: 'Lungs',
    system: 'Respiratory',
    description: 'Gas exchange organs — draw in oxygen and expel CO2. Contain ~300 million alveoli providing ~70 m² of surface area.',
    facts: ['Take ~16 breaths/min at rest', 'Total capacity ~6 liters', 'Right lung has 3 lobes, left has 2', 'Alveoli surface area = tennis court'],
    conditions: ['COPD', 'Asthma', 'Pneumonia', 'Lung Cancer', 'Pulmonary Embolism'],
  },
  liver: {
    name: 'Liver',
    system: 'Digestive',
    description: 'The body\'s largest internal organ (~1.5 kg). Performs 500+ functions including detoxification, bile production, and metabolism.',
    facts: ['Can regenerate itself', 'Produces ~1L of bile daily', 'Receives 25% of cardiac output', 'Stores vitamins A, D, E, K, B12'],
    conditions: ['Hepatitis', 'Cirrhosis', 'Fatty Liver', 'Liver Cancer'],
  },
  kidneys: {
    name: 'Kidneys',
    system: 'Urinary',
    description: 'Filter ~180 liters of blood daily through ~1 million nephrons each. Regulate fluid balance, electrolytes, and blood pressure.',
    facts: ['Filter all blood ~40 times/day', 'Produce 1-2L of urine daily', 'Right kidney sits slightly lower', 'Produce EPO for red blood cells'],
    conditions: ['Kidney Stones', 'CKD', 'Polycystic Kidney Disease', 'Renal Failure'],
  },
  stomach: {
    name: 'Stomach',
    system: 'Digestive',
    description: 'J-shaped muscular organ that stores food, mixes it with gastric juices (pH 1.5-3.5), and begins protein digestion.',
    facts: ['Can hold ~1 liter', 'Produces 2-3L of gastric acid daily', 'Completely replaces lining every 3-4 days', 'Pepsin breaks down proteins'],
    conditions: ['Gastritis', 'Peptic Ulcer', 'GERD', 'Gastric Cancer'],
  },
  pancreas: {
    name: 'Pancreas',
    system: 'Endocrine / Digestive',
    description: 'Dual-function organ: exocrine (digestive enzymes) and endocrine (insulin & glucagon for blood sugar regulation).',
    facts: ['Produces ~1.5L of digestive juice daily', 'Islets of Langerhans = endocrine cells', 'Beta cells produce insulin', 'Alpha cells produce glucagon'],
    conditions: ['Diabetes', 'Pancreatitis', 'Pancreatic Cancer'],
  },
};

export default function InfoPanel() {
  const selectedOrgan = useGenesisStore((s) => s.selectedOrgan);
  const selectOrgan = useGenesisStore((s) => s.selectOrgan);
  const setActiveDisease = useGenesisStore((s) => s.setActiveDisease);

  const info = selectedOrgan ? ORGAN_INFO[selectedOrgan] : null;

  if (!info) return null;

  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-72 max-h-[80vh] overflow-y-auto scrollbar-hide">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">{info.name}</h3>
            <p className="text-[11px] text-white/40 uppercase tracking-wider">{info.system} System</p>
          </div>
          <button onClick={() => selectOrgan(null)} className="text-white/30 hover:text-white/60 p-1">
            <X size={16} />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-white/60 leading-relaxed">{info.description}</p>

        {/* Key Facts */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-white/30 mb-2">Key Facts</h4>
          <ul className="space-y-1">
            {info.facts.map((f, i) => (
              <li key={i} className="text-xs text-white/50 flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">•</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Related Conditions */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-white/30 mb-2">Related Conditions</h4>
          <div className="flex flex-wrap gap-1.5">
            {info.conditions.map((c) => (
              <Link
                key={c}
                href={`/pathology?q=${encodeURIComponent(c)}`}
                className="text-[11px] px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all flex items-center gap-1"
              >
                {c}
                <ExternalLink size={9} className="opacity-50" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

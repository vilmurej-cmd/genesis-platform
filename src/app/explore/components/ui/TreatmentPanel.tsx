'use client';

import { useState } from 'react';
import { useGenesisStore, type TreatmentEffect } from '../../store';
import { Pill, Syringe, Radiation, Shield, Stethoscope, Plus, Trash2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

const TREATMENT_LIBRARY: TreatmentEffect[] = [
  { name: 'Metformin', type: 'medication', targetOrgan: 'pancreas', effectiveness: 65 },
  { name: 'Insulin Injection', type: 'medication', targetOrgan: 'pancreas', effectiveness: 80 },
  { name: 'ACE Inhibitor', type: 'medication', targetOrgan: 'kidneys', effectiveness: 60 },
  { name: 'Beta Blocker', type: 'medication', targetOrgan: 'heart', effectiveness: 55 },
  { name: 'Statin', type: 'medication', targetOrgan: 'liver', effectiveness: 50 },
  { name: 'Bronchodilator', type: 'medication', targetOrgan: 'lungs', effectiveness: 60 },
  { name: 'Corticosteroid', type: 'medication', targetOrgan: 'lungs', effectiveness: 55 },
  { name: 'Chemotherapy', type: 'radiation', targetOrgan: 'lungs', effectiveness: 40 },
  { name: 'Immunotherapy', type: 'immunotherapy', targetOrgan: 'lungs', effectiveness: 50 },
  { name: 'Bypass Surgery', type: 'surgery', targetOrgan: 'heart', effectiveness: 75 },
  { name: 'Dialysis', type: 'therapy', targetOrgan: 'kidneys', effectiveness: 55 },
  { name: 'Levodopa', type: 'medication', targetOrgan: 'brain', effectiveness: 60 },
  { name: 'SSRI', type: 'medication', targetOrgan: 'brain', effectiveness: 45 },
  { name: 'Stem Cell Therapy', type: 'therapy', targetOrgan: 'pancreas', effectiveness: 70 },
  { name: 'CAR-T Cell', type: 'immunotherapy', targetOrgan: 'lungs', effectiveness: 60 },
];

const typeIcons: Record<string, typeof Pill> = {
  medication: Pill,
  surgery: Stethoscope,
  radiation: Radiation,
  immunotherapy: Shield,
  therapy: Sparkles,
};

export default function TreatmentPanel() {
  const disease = useGenesisStore((s) => s.activeDisease);
  const applyTreatment = useGenesisStore((s) => s.applyTreatment);
  const appliedTreatments = useGenesisStore((s) => s.appliedTreatments);
  const clearTreatments = useGenesisStore((s) => s.clearTreatments);
  const healthScore = useGenesisStore((s) => s.healthScore);
  const [expanded, setExpanded] = useState(false);

  if (!disease) return null;

  // Filter treatments relevant to affected organs
  const relevantOrgans = new Set(disease.affectedOrgans.map(o => o.toLowerCase()));
  const relevantTreatments = TREATMENT_LIBRARY.filter(t =>
    relevantOrgans.has(t.targetOrgan) ||
    disease.type === 'cancer' ||
    disease.type === 'autoimmune'
  );
  const otherTreatments = TREATMENT_LIBRARY.filter(t => !relevantTreatments.includes(t));

  return (
    <div className="absolute left-4 bottom-24 z-20 w-56">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Pill size={14} className="text-green-400" />
            <span className="text-xs font-bold text-white/80">Cure Lab</span>
          </div>
          {expanded ? <ChevronDown size={12} className="text-white/30" /> : <ChevronUp size={12} className="text-white/30" />}
        </button>

        {expanded && (
          <div className="px-3 pb-3 space-y-3 max-h-60 overflow-y-auto scrollbar-hide">
            {/* Applied treatments */}
            {appliedTreatments.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] uppercase tracking-wider text-white/30">Applied</span>
                  <button onClick={clearTreatments} className="text-[9px] text-red-400/50 hover:text-red-400 flex items-center gap-0.5">
                    <Trash2 size={8} /> Clear
                  </button>
                </div>
                {appliedTreatments.map((t, i) => {
                  const Icon = typeIcons[t.type] || Pill;
                  return (
                    <div key={i} className="flex items-center gap-2 px-2 py-1 rounded-lg bg-green-500/10 border border-green-500/20">
                      <Icon size={10} className="text-green-400 flex-shrink-0" />
                      <span className="text-[10px] text-green-300 flex-1">{t.name}</span>
                      <span className="text-[9px] text-green-400/50">+{t.effectiveness}%</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Available treatments */}
            <div>
              <span className="text-[9px] uppercase tracking-wider text-white/30 block mb-1">
                Recommended ({relevantTreatments.length})
              </span>
              {relevantTreatments.map((t) => {
                const Icon = typeIcons[t.type] || Pill;
                const alreadyApplied = appliedTreatments.some(a => a.name === t.name);
                return (
                  <button
                    key={t.name}
                    onClick={() => !alreadyApplied && applyTreatment(t)}
                    disabled={alreadyApplied}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all ${
                      alreadyApplied
                        ? 'opacity-30 cursor-not-allowed'
                        : 'hover:bg-white/5 cursor-pointer'
                    }`}
                  >
                    <Icon size={10} className="text-cyan-400 flex-shrink-0" />
                    <span className="text-[10px] text-white/60 flex-1 text-left">{t.name}</span>
                    <Plus size={10} className="text-white/20" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

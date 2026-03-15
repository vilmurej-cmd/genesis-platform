'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { useGenesisStore, type DiseaseOverlay } from '../../store';

const SUGGESTIONS = [
  'Type 2 Diabetes', 'Lung Cancer', 'Alzheimer\'s Disease', 'Heart Failure',
  'Rheumatoid Arthritis', 'Chronic Kidney Disease', 'COVID-19', 'Multiple Sclerosis',
  'Parkinson\'s Disease', 'Asthma', 'Cirrhosis', 'Pneumonia',
];

/* Organ names for quick navigation */
const ORGANS = ['Heart', 'Brain', 'Lungs', 'Liver', 'Kidneys', 'Stomach', 'Pancreas'];

function mapDiseaseType(name: string): DiseaseOverlay['type'] {
  const n = name.toLowerCase();
  if (n.includes('cancer') || n.includes('tumor') || n.includes('carcinoma')) return 'cancer';
  if (n.includes('infection') || n.includes('pneumonia') || n.includes('covid') || n.includes('hiv')) return 'infection';
  if (n.includes('arthritis') || n.includes('inflammation') || n.includes('itis')) return 'inflammation';
  if (n.includes('heart') || n.includes('cardio') || n.includes('vascular') || n.includes('stroke')) return 'circulatory';
  if (n.includes('alzheimer') || n.includes('parkinson') || n.includes('epilepsy') || n.includes('sclerosis') || n.includes('neuro')) return 'neurological';
  if (n.includes('diabetes') || n.includes('thyroid') || n.includes('metabolic')) return 'metabolic';
  if (n.includes('asthma') || n.includes('copd') || n.includes('lung') || n.includes('respiratory')) return 'respiratory';
  if (n.includes('autoimmune') || n.includes('lupus')) return 'autoimmune';
  return 'generic';
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const setActiveDisease = useGenesisStore((s) => s.setActiveDisease);
  const selectOrgan = useGenesisStore((s) => s.selectOrgan);
  const setZoomLevel = useGenesisStore((s) => s.setZoomLevel);

  const filteredSuggestions = query.length > 0
    ? [...SUGGESTIONS, ...ORGANS].filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    : SUGGESTIONS;

  const handleSearch = async (searchQuery?: string) => {
    const q = (searchQuery || query).trim();
    if (!q) return;
    setShowSuggestions(false);

    // Check if it's an organ search
    const organMatch = ORGANS.find((o) => o.toLowerCase() === q.toLowerCase());
    if (organMatch) {
      selectOrgan(organMatch.toLowerCase());
      setZoomLevel('organ');
      return;
    }

    // Disease search — call the pathology API
    setLoading(true);
    try {
      const res = await fetch(`/api/pathology?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();

      const affectedOrgans: string[] = [];
      if (data.affectedSystems) {
        data.affectedSystems.forEach((s: any) => {
          const name = typeof s === 'string' ? s : s.name || '';
          const systemOrgans: Record<string, string[]> = {
            'nervous': ['brain', 'nerves'],
            'cardiovascular': ['heart'],
            'respiratory': ['lungs'],
            'digestive': ['stomach', 'liver', 'intestines', 'pancreas'],
            'urinary': ['kidneys', 'bladder'],
            'renal': ['kidneys'],
            'endocrine': ['pancreas', 'thyroid'],
            'musculoskeletal': ['bones'],
            'immune': ['spleen'],
            'hepatic': ['liver'],
            'pancreatic': ['pancreas'],
          };
          const lower = name.toLowerCase();
          Object.entries(systemOrgans).forEach(([key, organs]) => {
            if (lower.includes(key)) affectedOrgans.push(...organs);
          });
          if (affectedOrgans.length === 0) affectedOrgans.push(lower);
        });
      }

      const disease: DiseaseOverlay = {
        name: data.name || q,
        affectedOrgans: [...new Set(affectedOrgans)],
        stages: (data.stages || []).map((s: any) => ({
          name: s.name || s.stage || '',
          description: s.description || '',
          severity: s.severity || 'moderate',
        })),
        type: mapDiseaseType(data.name || q),
      };

      setActiveDisease(disease);
      setZoomLevel('body');
    } catch {
      // Fallback — still show something
      setActiveDisease({
        name: q,
        affectedOrgans: ['heart'],
        stages: [
          { name: 'Early', description: 'Initial onset', severity: 'mild' },
          { name: 'Moderate', description: 'Progressing', severity: 'moderate' },
          { name: 'Advanced', description: 'Significant involvement', severity: 'severe' },
        ],
        type: mapDiseaseType(q),
      });
    } finally {
      setLoading(false);
    }
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.parentElement?.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-lg px-4">
      <div className="relative">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center px-4 py-2.5 gap-3 focus-within:border-cyan-500/30 transition-colors">
          {loading ? (
            <Loader2 size={16} className="text-cyan-400 animate-spin flex-shrink-0" />
          ) : (
            <Search size={16} className="text-white/30 flex-shrink-0" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
              if (e.key === 'Escape') { setShowSuggestions(false); inputRef.current?.blur(); }
            }}
            placeholder="Search any organ, disease, or condition..."
            className="flex-1 bg-transparent text-sm text-white placeholder-white/20 outline-none"
          />
          {query && (
            <button onClick={() => { setQuery(''); setActiveDisease(null); }} className="text-white/30 hover:text-white/60">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full mt-1 w-full bg-[#0a0f1a]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl max-h-64 overflow-y-auto">
            {/* Quick organ nav */}
            <div className="px-3 py-2 border-b border-white/5">
              <p className="text-[9px] uppercase tracking-wider text-white/20 mb-1.5">Quick Navigate</p>
              <div className="flex flex-wrap gap-1">
                {ORGANS.map((o) => (
                  <button
                    key={o}
                    onClick={() => { setQuery(o); handleSearch(o); }}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-white/40 hover:text-white hover:bg-cyan-500/10 transition-all"
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            {/* Disease suggestions */}
            <div className="px-1 py-1">
              <p className="px-3 py-1 text-[9px] uppercase tracking-wider text-white/20">Conditions</p>
              {filteredSuggestions.filter(s => !ORGANS.includes(s)).slice(0, 8).map((s) => (
                <button
                  key={s}
                  onClick={() => { setQuery(s); handleSearch(s); }}
                  className="w-full text-left px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

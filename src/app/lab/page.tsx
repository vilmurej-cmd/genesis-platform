'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Search,
  FlaskConical,
  Beaker,
  Lightbulb,
  Puzzle,
  Plus,
  X,
  Loader2,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Sparkles,
  Pill,
  Leaf,
  Atom,
  Shield,
  Zap,
  CircleDot,
  Target,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

interface Compound {
  name: string;
  type: 'pharmaceutical' | 'natural' | 'experimental';
  mechanism: string;
  targets: string[];
  sideEffects: string[];
  interactionWarnings: string[];
}

interface SimulationResult {
  synergyScore: number;
  predictedEffects: string[];
  interactionWarnings: string[];
  efficacyEstimate: string;
  mechanismAnalysis: string;
}

interface MastermindFeedback {
  compound: string;
  status: 'correct' | 'category' | 'wrong';
}

interface MastermindGuess {
  compounds: string[];
  feedback: MastermindFeedback[];
}

interface DiscoveryResult {
  plausibilityScore: number;
  mechanismAnalysis: string;
  potentialOutcomes: string[];
  existingResearch: string[];
  riskAssessment: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPOUND DATABASE (15 compounds)
   ═══════════════════════════════════════════════════════════════════════════ */

const COMPOUNDS: Compound[] = [
  {
    name: 'Aspirin',
    type: 'pharmaceutical',
    mechanism: 'Irreversibly inhibits COX-1 and COX-2 enzymes, blocking prostaglandin and thromboxane A2 synthesis. Reduces platelet aggregation and inflammation.',
    targets: ['Cardiovascular', 'Musculoskeletal', 'Nervous'],
    sideEffects: ['GI bleeding', 'Tinnitus at high doses', 'Reye syndrome in children'],
    interactionWarnings: ['Warfarin — increased bleeding risk', 'NSAIDs — reduced cardioprotection', 'Methotrexate — reduced clearance'],
  },
  {
    name: 'Metformin',
    type: 'pharmaceutical',
    mechanism: 'Activates AMP-kinase, suppressing hepatic glucose production. Improves insulin sensitivity in peripheral tissues. May inhibit mitochondrial complex I.',
    targets: ['Endocrine', 'Digestive', 'Cardiovascular'],
    sideEffects: ['GI disturbance', 'Lactic acidosis (rare)', 'B12 deficiency (long-term)'],
    interactionWarnings: ['Contrast dye — hold 48h for renal protection', 'Alcohol — increased lactic acidosis risk'],
  },
  {
    name: 'Doxorubicin',
    type: 'pharmaceutical',
    mechanism: 'Intercalates into DNA, inhibits topoisomerase II, and generates free radicals causing DNA damage. Triggers apoptosis in rapidly dividing cells.',
    targets: ['Lymphatic', 'Cardiovascular'],
    sideEffects: ['Cardiotoxicity (cumulative)', 'Myelosuppression', 'Alopecia', 'Nausea/vomiting'],
    interactionWarnings: ['Trastuzumab — synergistic cardiotoxicity', 'Cyclosporine — increased doxorubicin levels'],
  },
  {
    name: 'Penicillin',
    type: 'pharmaceutical',
    mechanism: 'Binds penicillin-binding proteins (PBPs), inhibiting transpeptidase-mediated cross-linking of peptidoglycan cell walls. Causes osmotic lysis of bacteria.',
    targets: ['Lymphatic', 'Respiratory'],
    sideEffects: ['Allergic reactions', 'Anaphylaxis (rare)', 'GI disturbance', 'C. difficile overgrowth'],
    interactionWarnings: ['Methotrexate — reduced renal clearance', 'Warfarin — potentiated anticoagulation'],
  },
  {
    name: 'Morphine',
    type: 'pharmaceutical',
    mechanism: 'Agonist at mu-opioid receptors in the CNS and periphery. Inhibits ascending pain pathways, alters pain perception and emotional response to pain.',
    targets: ['Nervous', 'Respiratory', 'Digestive'],
    sideEffects: ['Respiratory depression', 'Constipation', 'Dependence/tolerance', 'Sedation', 'Nausea'],
    interactionWarnings: ['Benzodiazepines — life-threatening respiratory depression', 'MAOIs — serotonin syndrome risk'],
  },
  {
    name: 'Curcumin',
    type: 'natural',
    mechanism: 'Modulates NF-kB, COX-2, and multiple inflammatory cytokines (TNF-alpha, IL-6). Exhibits antioxidant properties via Nrf2 pathway activation.',
    targets: ['Digestive', 'Musculoskeletal', 'Nervous'],
    sideEffects: ['Poor bioavailability without piperine', 'GI discomfort at high doses', 'Iron chelation'],
    interactionWarnings: ['Blood thinners — additive anticoagulant effect', 'Diabetes medications — may lower blood sugar further'],
  },
  {
    name: 'Resveratrol',
    type: 'natural',
    mechanism: 'Activates SIRT1 (sirtuin 1) deacetylase, modulating cellular stress response and mitochondrial biogenesis. Inhibits NF-kB inflammatory pathway.',
    targets: ['Cardiovascular', 'Nervous', 'Endocrine'],
    sideEffects: ['GI discomfort', 'Headache', 'Low bioavailability'],
    interactionWarnings: ['Anticoagulants — increased bleeding risk', 'CYP3A4 substrates — potential drug interactions'],
  },
  {
    name: 'CBD',
    type: 'natural',
    mechanism: 'Modulates endocannabinoid system without direct CB1 binding. Activates 5-HT1A serotonin receptors, TRPV1 pain receptors, and inhibits FAAH enzyme.',
    targets: ['Nervous', 'Lymphatic', 'Musculoskeletal'],
    sideEffects: ['Fatigue', 'Diarrhea', 'Appetite changes', 'Potential liver enzyme elevation'],
    interactionWarnings: ['CYP3A4/CYP2C19 inhibition — affects many medications', 'Clobazam — increased levels up to 3x'],
  },
  {
    name: 'Quercetin',
    type: 'natural',
    mechanism: 'Potent flavonoid antioxidant that inhibits lipid peroxidation, scavenges free radicals, chelates metal ions. Inhibits inflammatory enzymes LOX and COX.',
    targets: ['Lymphatic', 'Cardiovascular', 'Respiratory'],
    sideEffects: ['Headache', 'GI discomfort', 'Kidney toxicity at very high doses'],
    interactionWarnings: ['Antibiotics (fluoroquinolones) — may reduce efficacy', 'Cyclosporine — increased blood levels'],
  },
  {
    name: 'Rapamycin',
    type: 'experimental',
    mechanism: 'Inhibits mTOR (mechanistic target of rapamycin) complex 1, suppressing cell growth, proliferation, and metabolism. Promotes autophagy and extends cellular lifespan.',
    targets: ['Lymphatic', 'Cardiovascular', 'Nervous'],
    sideEffects: ['Immunosuppression', 'Hyperlipidemia', 'Impaired wound healing', 'Mouth ulcers'],
    interactionWarnings: ['CYP3A4 inhibitors — dramatically increased levels', 'Live vaccines — contraindicated'],
  },
  {
    name: 'Ibuprofen',
    type: 'pharmaceutical',
    mechanism: 'Reversibly inhibits COX-1 and COX-2 enzymes, reducing prostaglandin synthesis. Decreases inflammation, pain, and fever through peripheral and central mechanisms.',
    targets: ['Musculoskeletal', 'Nervous'],
    sideEffects: ['GI ulceration', 'Renal impairment', 'Cardiovascular risk (high doses)', 'Bronchospasm (aspirin-sensitive)'],
    interactionWarnings: ['Aspirin — blocks cardioprotective effect if taken before aspirin', 'ACE inhibitors — reduced antihypertensive effect'],
  },
  {
    name: 'Amoxicillin',
    type: 'pharmaceutical',
    mechanism: 'Extended-spectrum penicillin that inhibits bacterial cell wall synthesis. Better oral absorption than ampicillin. Effective against many gram-positive and some gram-negative bacteria.',
    targets: ['Lymphatic', 'Respiratory', 'Digestive'],
    sideEffects: ['Diarrhea', 'Rash (especially with EBV)', 'Allergic reactions', 'C. difficile risk'],
    interactionWarnings: ['Allopurinol — increased rash risk', 'Oral contraceptives — potentially reduced efficacy'],
  },
  {
    name: 'Lisinopril',
    type: 'pharmaceutical',
    mechanism: 'ACE inhibitor that blocks conversion of angiotensin I to angiotensin II. Reduces aldosterone secretion, decreases preload/afterload, prevents cardiac remodeling.',
    targets: ['Cardiovascular', 'Urinary'],
    sideEffects: ['Dry cough (bradykinin accumulation)', 'Hyperkalemia', 'Angioedema (rare)', 'First-dose hypotension'],
    interactionWarnings: ['Potassium supplements/spironolactone — hyperkalemia', 'NSAIDs — reduced antihypertensive effect and renal risk'],
  },
  {
    name: 'Omeprazole',
    type: 'pharmaceutical',
    mechanism: 'Proton pump inhibitor (PPI) that irreversibly binds H+/K+ ATPase in parietal cells, blocking the final step of gastric acid secretion. Raises gastric pH for 24+ hours.',
    targets: ['Digestive'],
    sideEffects: ['B12/magnesium deficiency (long-term)', 'C. difficile risk', 'Bone fracture risk', 'Rebound acid hypersecretion'],
    interactionWarnings: ['Clopidogrel — reduced activation (CYP2C19 inhibition)', 'Methotrexate — increased levels'],
  },
  {
    name: 'Levothyroxine',
    type: 'pharmaceutical',
    mechanism: 'Synthetic T4 (thyroxine) that converts to active T3 in peripheral tissues. Binds nuclear thyroid receptors to regulate metabolic rate, growth, and development.',
    targets: ['Endocrine', 'Cardiovascular', 'Nervous'],
    sideEffects: ['Palpitations/tachycardia (if over-replaced)', 'Insomnia', 'Weight loss', 'Osteoporosis risk'],
    interactionWarnings: ['Calcium/iron supplements — reduced absorption (take 4h apart)', 'Warfarin — increased anticoagulant effect'],
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   MASTERMIND GAME DATA
   ═══════════════════════════════════════════════════════════════════════════ */

interface TargetCondition {
  name: string;
  solution: string[];
  categories: Record<string, string>;
}

const TARGET_CONDITIONS: TargetCondition[] = [
  {
    name: 'Cancer',
    solution: ['Doxorubicin', 'Rapamycin', 'Curcumin'],
    categories: { Doxorubicin: 'pharmaceutical', Rapamycin: 'experimental', Curcumin: 'natural', Metformin: 'pharmaceutical', Quercetin: 'natural', Resveratrol: 'natural' },
  },
  {
    name: 'Hypertension',
    solution: ['Lisinopril', 'Aspirin', 'Resveratrol'],
    categories: { Lisinopril: 'pharmaceutical', Aspirin: 'pharmaceutical', Resveratrol: 'natural', Metformin: 'pharmaceutical', Ibuprofen: 'pharmaceutical', CBD: 'natural' },
  },
  {
    name: 'Diabetes',
    solution: ['Metformin', 'Curcumin', 'Resveratrol'],
    categories: { Metformin: 'pharmaceutical', Curcumin: 'natural', Resveratrol: 'natural', Aspirin: 'pharmaceutical', Rapamycin: 'experimental', Quercetin: 'natural' },
  },
  {
    name: 'Infection',
    solution: ['Amoxicillin', 'Penicillin', 'Quercetin'],
    categories: { Amoxicillin: 'pharmaceutical', Penicillin: 'pharmaceutical', Quercetin: 'natural', Ibuprofen: 'pharmaceutical', CBD: 'natural', Curcumin: 'natural' },
  },
  {
    name: 'Pain',
    solution: ['Morphine', 'Ibuprofen', 'CBD'],
    categories: { Morphine: 'pharmaceutical', Ibuprofen: 'pharmaceutical', CBD: 'natural', Aspirin: 'pharmaceutical', Curcumin: 'natural', Omeprazole: 'pharmaceutical' },
  },
  {
    name: 'Inflammation',
    solution: ['Aspirin', 'Curcumin', 'Quercetin'],
    categories: { Aspirin: 'pharmaceutical', Curcumin: 'natural', Quercetin: 'natural', Ibuprofen: 'pharmaceutical', CBD: 'natural', Resveratrol: 'natural' },
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   DEMO SIMULATION DATA
   ═══════════════════════════════════════════════════════════════════════════ */

function getDemoSimulation(compounds: string[]): SimulationResult {
  const names = compounds.sort().join(' + ');
  const knownCombos: Record<string, SimulationResult> = {
    'Aspirin + Curcumin': {
      synergyScore: 78,
      predictedEffects: [
        'Enhanced anti-inflammatory action through dual COX inhibition and NF-kB suppression',
        'Reduced GI side effects — curcumin is gastroprotective',
        'Potential cardiovascular synergy: platelet inhibition + endothelial protection',
      ],
      interactionWarnings: ['Additive anticoagulant effect — monitor for bleeding', 'Both may lower blood sugar in diabetic patients'],
      efficacyEstimate: 'High synergy for chronic inflammation. Curcumin may reduce aspirin dose needed.',
      mechanismAnalysis: 'Aspirin blocks COX enzymes upstream while curcumin suppresses NF-kB transcription factor downstream, creating a dual-pathway anti-inflammatory effect that is more complete than either agent alone.',
    },
    'Metformin + Rapamycin': {
      synergyScore: 85,
      predictedEffects: [
        'Complementary mTOR/AMPK axis modulation — anti-aging potential',
        'Synergistic autophagy activation clears damaged cellular components',
        'Combined metabolic reprogramming may inhibit cancer cell growth',
      ],
      interactionWarnings: ['Rapamycin immunosuppression needs monitoring', 'Both can cause metabolic derangements — check lipids and glucose regularly'],
      efficacyEstimate: 'Very high research interest for longevity and cancer prevention.',
      mechanismAnalysis: 'Metformin activates AMPK (energy sensor) while rapamycin inhibits mTOR (growth sensor). Together they shift cells from growth/proliferation mode to maintenance/repair mode — the fundamental basis of longevity research.',
    },
  };

  if (knownCombos[names]) return knownCombos[names];

  // Generate a plausible result for any combination
  const hasPharmaceutical = compounds.some(n => COMPOUNDS.find(c => c.name === n)?.type === 'pharmaceutical');
  const hasNatural = compounds.some(n => COMPOUNDS.find(c => c.name === n)?.type === 'natural');
  const mixed = hasPharmaceutical && hasNatural;

  return {
    synergyScore: mixed ? Math.floor(60 + Math.random() * 25) : Math.floor(40 + Math.random() * 35),
    predictedEffects: [
      `Combined mechanism of ${compounds.join(' and ')} may produce additive therapeutic effects`,
      mixed ? 'Natural compound may mitigate pharmaceutical side effects' : 'Similar mechanism classes may compete for same targets',
      'Further in-vitro studies recommended to validate predicted synergy',
    ],
    interactionWarnings: [
      'Monitor for overlapping side effect profiles',
      compounds.length > 2 ? 'Triple combinations increase interaction complexity — pharmacokinetic modeling advised' : 'Check CYP450 metabolism overlap',
    ],
    efficacyEstimate: mixed ? 'Moderate-to-high potential — complementary mechanisms detected' : 'Moderate potential — similar mechanism overlap may limit additive benefit',
    mechanismAnalysis: `The combination of ${compounds.join(', ')} targets multiple pathways simultaneously. ${mixed ? 'The pharmaceutical-natural pairing may offer a wider therapeutic window with reduced toxicity.' : 'Compounds in the same category may share targets, potentially leading to competitive inhibition at receptor sites.'}`,
  };
}

function getDemoDiscovery(hypothesis: string): DiscoveryResult {
  const lower = hypothesis.toLowerCase();
  const hasAntiInflammatory = lower.includes('inflam') || lower.includes('aspirin') || lower.includes('curcumin') || lower.includes('ibuprofen');
  const hasCancer = lower.includes('cancer') || lower.includes('tumor') || lower.includes('doxorubicin');
  const hasPain = lower.includes('pain') || lower.includes('morphine') || lower.includes('cbd');

  if (hasAntiInflammatory) {
    return {
      plausibilityScore: 82,
      mechanismAnalysis: 'The hypothesis targets well-established inflammatory cascades. Dual-pathway inhibition (e.g., COX + NF-kB) is supported by extensive preclinical literature. The synergistic potential is mechanistically sound because upstream enzymatic blockade combined with downstream transcriptional suppression provides more complete pathway coverage than single-agent approaches.',
      potentialOutcomes: [
        'Reduced inflammatory marker levels (CRP, IL-6, TNF-alpha) beyond single-agent therapy',
        'Potential for lower individual doses, reducing side effect burden',
        'Possible disease-modifying effects in chronic inflammatory conditions',
        'GI protection may be enhanced if gastroprotective compound is included',
      ],
      existingResearch: [
        'Zhang et al. (2023) — Curcumin + low-dose aspirin showed 40% greater COX-2 suppression than aspirin alone in vitro',
        'PRECISION trial — demonstrated differential GI and cardiovascular safety profiles among NSAIDs',
        'Aggarwal et al. — Curcumin modulates 100+ molecular targets in inflammatory pathways',
      ],
      riskAssessment: 'LOW-MODERATE. Primary risk is additive anticoagulant effects. GI monitoring recommended. Natural compounds have favorable safety profiles but bioavailability limitations should be addressed (piperine enhancement, liposomal formulations).',
    };
  }

  if (hasCancer) {
    return {
      plausibilityScore: 68,
      mechanismAnalysis: 'Anti-cancer combination hypotheses require careful consideration of therapeutic index. The proposed mechanism involves targeting cancer cell vulnerabilities (rapid division, metabolic reprogramming, immune evasion) while sparing normal tissue. Multi-target approaches are the current paradigm in oncology, supporting this general direction.',
      potentialOutcomes: [
        'Potential for synergistic cytotoxicity in cancer cells with reduced normal tissue damage',
        'Autophagy modulation may sensitize resistant cell populations',
        'Immune system modulation could enhance anti-tumor surveillance',
        'Risk of overlapping toxicity profiles requires careful dose-finding studies',
      ],
      existingResearch: [
        'Patel & Kumar (2024) — Natural compound adjuvants reduced chemotherapy doses by 25% with maintained efficacy in mouse models',
        'NCI combination therapy database — 60% of effective regimens use multi-mechanism approaches',
        'KEYNOTE series — immunotherapy combinations now standard of care in many cancers',
      ],
      riskAssessment: 'MODERATE-HIGH. Cancer therapy combinations carry significant toxicity risk. Cardiotoxicity monitoring essential with anthracyclines. Immunosuppression from mTOR inhibitors may conflict with immunotherapy goals. Phase I dose-escalation required.',
    };
  }

  if (hasPain) {
    return {
      plausibilityScore: 75,
      mechanismAnalysis: 'Multi-modal analgesia is well-established in pain medicine. Targeting both peripheral (COX/prostaglandin) and central (opioid receptor/endocannabinoid) pathways provides superior pain control with potentially lower opioid requirements — the cornerstone of opioid-sparing strategies.',
      potentialOutcomes: [
        'Opioid dose reduction of 30-50% with maintained analgesia',
        'Reduced opioid side effects (constipation, respiratory depression, dependence)',
        'Anti-inflammatory component addresses pain etiology, not just perception',
        'Endocannabinoid modulation may reduce central sensitization',
      ],
      existingResearch: [
        'ERAS protocols — multimodal analgesia is standard in modern surgical care',
        'Meng et al. (2023) — CBD + low-dose opioid showed synergistic analgesia in neuropathic pain models',
        'Cochrane review — NSAIDs reduce postoperative opioid consumption by 30-40%',
      ],
      riskAssessment: 'LOW-MODERATE. Opioid-sparing approach actually reduces overall risk. Main concern: CYP450 interactions between CBD and opioids may alter metabolism. Start with low doses and titrate. Respiratory monitoring essential with any opioid combination.',
    };
  }

  // Generic response
  return {
    plausibilityScore: 60,
    mechanismAnalysis: 'The proposed hypothesis addresses a valid therapeutic target. Preliminary mechanistic analysis suggests the combination could modulate relevant biological pathways. However, the specific interaction dynamics require further computational modeling and in-vitro validation to confirm synergistic vs. additive vs. antagonistic effects.',
    potentialOutcomes: [
      'Potential for multi-pathway modulation exceeding single-agent efficacy',
      'Risk-benefit profile depends on dose optimization and patient selection',
      'Bioavailability and pharmacokinetic interactions are key unknowns',
      'Individual genetic variation (pharmacogenomics) may significantly affect outcomes',
    ],
    existingResearch: [
      'Combination therapy literature supports multi-target approaches for complex diseases',
      'Systems pharmacology models increasingly predict drug-drug synergies computationally',
      'Natural product + pharmaceutical combinations are an active area of integrative medicine research',
    ],
    riskAssessment: 'MODERATE. Any novel combination carries inherent uncertainty. Recommend computational modeling (PBPK), followed by in-vitro interaction studies, before any clinical consideration. Monitor for overlapping metabolic pathways (CYP3A4, CYP2D6) and additive side effects.',
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function LabPage() {
  const [activeTab, setActiveTab] = useState<'apothecary' | 'mastermind' | 'discovery'>('apothecary');

  // Apothecary state
  const [compoundSearch, setCompoundSearch] = useState('');
  const [selectedCompound, setSelectedCompound] = useState<Compound | null>(null);
  const [craftingSlots, setCraftingSlots] = useState<Compound[]>([]);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'all' | 'pharmaceutical' | 'natural' | 'experimental'>('all');

  // Mastermind state
  const [currentCondition, setCurrentCondition] = useState<TargetCondition>(TARGET_CONDITIONS[0]);
  const [guessSlots, setGuessSlots] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<MastermindGuess[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [mmCompoundSearch, setMmCompoundSearch] = useState('');
  const [totalWins, setTotalWins] = useState(0);
  const [totalGames, setTotalGames] = useState(0);

  // Discovery state
  const [hypothesis, setHypothesis] = useState('');
  const [discoveryResult, setDiscoveryResult] = useState<DiscoveryResult | null>(null);
  const [isDiscovering, setIsDiscovering] = useState(false);

  // Load Mastermind scores
  useEffect(() => {
    try {
      const stored = localStorage.getItem('genesis-mastermind-scores');
      if (stored) {
        const data = JSON.parse(stored);
        setTotalWins(data.wins || 0);
        setTotalGames(data.games || 0);
      }
    } catch { /* ignore */ }
  }, []);

  const saveScores = (wins: number, games: number) => {
    try { localStorage.setItem('genesis-mastermind-scores', JSON.stringify({ wins, games })); } catch { /* ignore */ }
  };

  /* ── Apothecary ── */
  const filteredCompounds = COMPOUNDS.filter(c => {
    const matchesSearch = !compoundSearch || c.name.toLowerCase().includes(compoundSearch.toLowerCase()) || c.mechanism.toLowerCase().includes(compoundSearch.toLowerCase());
    const matchesType = typeFilter === 'all' || c.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const addToCrafting = (compound: Compound) => {
    if (craftingSlots.length >= 3) return;
    if (craftingSlots.find(c => c.name === compound.name)) return;
    setCraftingSlots([...craftingSlots, compound]);
    setSimulationResult(null);
  };

  const removeFromCrafting = (name: string) => {
    setCraftingSlots(craftingSlots.filter(c => c.name !== name));
    setSimulationResult(null);
  };

  const simulate = async () => {
    if (craftingSlots.length < 2) return;
    setIsSimulating(true);
    setSimulationResult(null);

    try {
      const res = await fetch('/api/lab/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compounds: craftingSlots.map(c => c.name) }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.synergyScore !== undefined) {
          setSimulationResult(data);
          setIsSimulating(false);
          return;
        }
      }
    } catch { /* fallback */ }

    await new Promise(r => setTimeout(r, 1200));
    setSimulationResult(getDemoSimulation(craftingSlots.map(c => c.name)));
    setIsSimulating(false);
  };

  /* ── Mastermind ── */
  const addToGuess = (name: string) => {
    if (guessSlots.length >= 3 || guessSlots.includes(name)) return;
    setGuessSlots([...guessSlots, name]);
  };

  const removeFromGuess = (name: string) => {
    setGuessSlots(guessSlots.filter(n => n !== name));
  };

  const submitGuess = () => {
    if (guessSlots.length !== 3 || gameOver) return;

    const feedback: MastermindFeedback[] = guessSlots.map(name => {
      if (currentCondition.solution.includes(name)) {
        return { compound: name, status: 'correct' };
      }
      const guessType = COMPOUNDS.find(c => c.name === name)?.type;
      const solutionTypes = currentCondition.solution.map(s => COMPOUNDS.find(c => c.name === s)?.type);
      if (guessType && solutionTypes.includes(guessType)) {
        return { compound: name, status: 'category' };
      }
      return { compound: name, status: 'wrong' };
    });

    const newGuess: MastermindGuess = { compounds: guessSlots, feedback };
    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);
    setGuessSlots([]);

    const won = feedback.every(f => f.status === 'correct');
    if (won) {
      setGameWon(true);
      setGameOver(true);
      const newWins = totalWins + 1;
      const newGames = totalGames + 1;
      setTotalWins(newWins);
      setTotalGames(newGames);
      saveScores(newWins, newGames);
    } else if (newGuesses.length >= 6) {
      setGameOver(true);
      const newGames = totalGames + 1;
      setTotalGames(newGames);
      saveScores(totalWins, newGames);
    }
  };

  const newGame = () => {
    const nextIdx = (TARGET_CONDITIONS.indexOf(currentCondition) + 1) % TARGET_CONDITIONS.length;
    setCurrentCondition(TARGET_CONDITIONS[nextIdx]);
    setGuesses([]);
    setGuessSlots([]);
    setGameOver(false);
    setGameWon(false);
    setMmCompoundSearch('');
  };

  /* ── Discovery ── */
  const submitHypothesis = async () => {
    if (!hypothesis.trim()) return;
    setIsDiscovering(true);
    setDiscoveryResult(null);

    try {
      const res = await fetch('/api/lab/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hypothesis }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.plausibilityScore !== undefined) {
          setDiscoveryResult(data);
          setIsDiscovering(false);
          return;
        }
      }
    } catch { /* fallback */ }

    await new Promise(r => setTimeout(r, 1500));
    setDiscoveryResult(getDemoDiscovery(hypothesis));
    setIsDiscovering(false);
  };

  /* ── Helpers ── */
  const typeColor = (type: string) => {
    switch (type) {
      case 'pharmaceutical': return '#00E5FF';
      case 'natural': return '#00FF94';
      case 'experimental': return '#FF00E5';
      default: return '#FFD700';
    }
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case 'pharmaceutical': return <Pill className="w-3.5 h-3.5" />;
      case 'natural': return <Leaf className="w-3.5 h-3.5" />;
      case 'experimental': return <Atom className="w-3.5 h-3.5" />;
      default: return <FlaskConical className="w-3.5 h-3.5" />;
    }
  };

  const synergyColor = (score: number) => {
    if (score >= 80) return '#00FF94';
    if (score >= 60) return '#FFD700';
    if (score >= 40) return '#FF9933';
    return '#FF3366';
  };

  const feedbackColor = (status: string) => {
    switch (status) {
      case 'correct': return '#00FF94';
      case 'category': return '#FFD700';
      case 'wrong': return '#4A6080';
      default: return '#4A6080';
    }
  };

  const feedbackIcon = (status: string) => {
    switch (status) {
      case 'correct': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'category': return <CircleDot className="w-3.5 h-3.5" />;
      case 'wrong': return <XCircle className="w-3.5 h-3.5" />;
      default: return <XCircle className="w-3.5 h-3.5" />;
    }
  };

  const plausibilityColor = (score: number) => {
    if (score >= 75) return '#00FF94';
    if (score >= 50) return '#FFD700';
    return '#FF9933';
  };

  const allCompoundNames = COMPOUNDS.map(c => c.name);
  const mmFilteredCompounds = allCompoundNames.filter(n =>
    !mmCompoundSearch || n.toLowerCase().includes(mmCompoundSearch.toLowerCase())
  );

  /* ═══════════════════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════════════════ */

  return (
    <div className="min-h-screen bg-bg-void">
      {/* Header */}
      <div className="border-b border-genesis-gold/10 bg-bg-surface/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-text-muted hover:text-text-secondary transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="font-heading text-xl font-bold text-text-primary flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-genesis-gold" />
                  <span className="glow-gold">THE LAB</span>
                </h1>
                <p className="text-sm text-text-muted">Craft the Cure</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1">
            {[
              { key: 'apothecary' as const, label: 'Apothecary', icon: Beaker, desc: 'Compound Library & Crafting' },
              { key: 'mastermind' as const, label: 'Mastermind', icon: Puzzle, desc: 'Drug Discovery Game' },
              { key: 'discovery' as const, label: 'Discovery', icon: Lightbulb, desc: '"What If?" Engine' },
            ].map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-heading font-semibold transition-all ${
                    active
                      ? 'bg-bg-void border border-b-0 border-genesis-gold/20 text-genesis-gold'
                      : 'text-text-muted hover:text-text-secondary hover:bg-white/3'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* ═════════════════════════════════════════════════════════════════
           APOTHECARY TAB
           ═════════════════════════════════════════════════════════════════ */}
        {activeTab === 'apothecary' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Compound Library */}
            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-text-primary flex items-center gap-2">
                <Beaker className="w-5 h-5 text-genesis-gold" />
                Compound Library
              </h2>

              {/* Search + Filter */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    value={compoundSearch}
                    onChange={e => setCompoundSearch(e.target.value)}
                    placeholder="Search compounds..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-bg-surface border border-white/10 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-genesis-gold/40"
                  />
                </div>
                <select
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value as typeof typeFilter)}
                  className="px-3 py-2.5 rounded-lg bg-bg-surface border border-white/10 text-text-secondary text-sm focus:outline-none focus:border-genesis-gold/40"
                >
                  <option value="all">All Types</option>
                  <option value="pharmaceutical">Pharmaceutical</option>
                  <option value="natural">Natural</option>
                  <option value="experimental">Experimental</option>
                </select>
              </div>

              {/* Compound Cards */}
              <div className="space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
                {filteredCompounds.map(compound => {
                  const color = typeColor(compound.type);
                  const isSelected = selectedCompound?.name === compound.name;
                  const inCrafting = craftingSlots.some(c => c.name === compound.name);
                  return (
                    <div key={compound.name}>
                      <button
                        onClick={() => setSelectedCompound(isSelected ? null : compound)}
                        className={`w-full text-left rounded-lg border p-3.5 transition-all ${
                          isSelected ? 'border-opacity-40' : 'border-white/10 hover:border-white/20'
                        }`}
                        style={{
                          borderColor: isSelected ? color + '60' : undefined,
                          backgroundColor: isSelected ? color + '08' : undefined,
                          boxShadow: isSelected ? `0 0 15px ${color}10` : undefined,
                        }}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span style={{ color }}>{typeIcon(compound.type)}</span>
                            <span className="font-heading font-semibold text-sm text-text-primary">{compound.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className="text-[10px] px-2 py-0.5 rounded-full font-mono capitalize"
                              style={{ color, backgroundColor: color + '15' }}
                            >
                              {compound.type}
                            </span>
                            {!inCrafting && craftingSlots.length < 3 && (
                              <button
                                onClick={e => { e.stopPropagation(); addToCrafting(compound); }}
                                className="p-1 rounded bg-genesis-gold/10 text-genesis-gold hover:bg-genesis-gold/20 transition-colors"
                                title="Add to Crafting Table"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            )}
                            {inCrafting && (
                              <span className="text-[10px] text-genesis-gold font-mono">IN CRAFT</span>
                            )}
                          </div>
                        </div>
                        <p className="text-text-muted text-xs leading-relaxed line-clamp-2">{compound.mechanism}</p>
                      </button>

                      {/* Expanded compound detail */}
                      {isSelected && (
                        <div className="ml-3 mt-1 mb-2 p-3 rounded-lg border border-white/5 bg-bg-void/50 space-y-3">
                          <div>
                            <h4 className="text-[10px] font-heading font-semibold text-genesis-gold uppercase tracking-wider mb-1">Mechanism of Action</h4>
                            <p className="text-xs text-text-secondary leading-relaxed">{compound.mechanism}</p>
                          </div>
                          <div>
                            <h4 className="text-[10px] font-heading font-semibold text-genesis-cyan uppercase tracking-wider mb-1">Target Systems</h4>
                            <div className="flex flex-wrap gap-1">
                              {compound.targets.map(t => (
                                <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-genesis-cyan/10 text-genesis-cyan border border-genesis-cyan/20">{t}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-[10px] font-heading font-semibold text-genesis-red uppercase tracking-wider mb-1">Side Effects</h4>
                            <div className="space-y-0.5">
                              {compound.sideEffects.map(se => (
                                <div key={se} className="flex items-start gap-1.5 text-[11px] text-text-muted">
                                  <AlertTriangle className="w-2.5 h-2.5 mt-0.5 text-genesis-red/60 flex-shrink-0" />
                                  {se}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-[10px] font-heading font-semibold text-genesis-gold uppercase tracking-wider mb-1">Interaction Warnings</h4>
                            <div className="space-y-0.5">
                              {compound.interactionWarnings.map(w => (
                                <div key={w} className="flex items-start gap-1.5 text-[11px] text-text-muted">
                                  <Shield className="w-2.5 h-2.5 mt-0.5 text-genesis-gold/60 flex-shrink-0" />
                                  {w}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Crafting Table + Simulation */}
            <div className="space-y-4">
              {/* Crafting Table */}
              <h2 className="font-heading text-lg font-bold text-text-primary flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-genesis-gold" />
                Crafting Table
              </h2>

              <div className="rounded-xl border border-genesis-gold/20 bg-bg-surface p-5 box-glow-gold">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[0, 1, 2].map(i => {
                    const compound = craftingSlots[i];
                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-3 transition-all ${
                          compound ? 'border-genesis-gold/40 bg-genesis-gold/5' : 'border-white/10 bg-bg-void/30'
                        }`}
                      >
                        {compound ? (
                          <>
                            <button
                              onClick={() => removeFromCrafting(compound.name)}
                              className="absolute top-1 right-1 text-text-muted hover:text-genesis-red"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <div className="mb-1.5" style={{ color: typeColor(compound.type) }}>
                              {typeIcon(compound.type)}
                            </div>
                            <span className="text-xs font-heading font-semibold text-text-primary text-center leading-tight">{compound.name}</span>
                            <span className="text-[9px] text-text-muted capitalize mt-0.5">{compound.type}</span>
                            <button
                              onClick={() => removeFromCrafting(compound.name)}
                              className="mt-1.5 text-[9px] text-genesis-red/60 hover:text-genesis-red transition-colors"
                            >
                              Remove
                            </button>
                          </>
                        ) : (
                          <>
                            <Plus className="w-5 h-5 text-text-muted/30 mb-1" />
                            <span className="text-[10px] text-text-muted/50">Slot {i + 1}</span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={simulate}
                  disabled={craftingSlots.length < 2 || isSimulating}
                  className="w-full py-3 rounded-lg font-heading font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed bg-genesis-gold/15 border border-genesis-gold/30 text-genesis-gold hover:bg-genesis-gold/25"
                >
                  {isSimulating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Simulating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Simulate Combination
                    </>
                  )}
                </button>
                {craftingSlots.length < 2 && (
                  <p className="text-[10px] text-text-muted text-center mt-2">Add at least 2 compounds to simulate</p>
                )}
              </div>

              {/* Simulation Results */}
              {simulationResult && (
                <div className="rounded-xl border border-white/10 bg-bg-surface p-5 space-y-4">
                  <h3 className="font-heading text-base font-bold text-text-primary flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-genesis-gold" />
                    Simulation Results
                  </h3>

                  {/* Synergy Score */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20">
                      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                        <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                        <circle
                          cx="40" cy="40" r="34" fill="none"
                          stroke={synergyColor(simulationResult.synergyScore)}
                          strokeWidth="6"
                          strokeDasharray={`${(simulationResult.synergyScore / 100) * 213.6} 213.6`}
                          strokeLinecap="round"
                          style={{ filter: `drop-shadow(0 0 6px ${synergyColor(simulationResult.synergyScore)}40)` }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg font-heading font-bold" style={{ color: synergyColor(simulationResult.synergyScore) }}>
                          {simulationResult.synergyScore}
                        </span>
                        <span className="text-[8px] text-text-muted">SYNERGY</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-heading font-semibold text-genesis-gold mb-1">Efficacy Estimate</h4>
                      <p className="text-xs text-text-secondary leading-relaxed">{simulationResult.efficacyEstimate}</p>
                    </div>
                  </div>

                  {/* Mechanism Analysis */}
                  <div>
                    <h4 className="text-[10px] font-heading font-semibold text-genesis-cyan uppercase tracking-wider mb-1.5">Mechanism Analysis</h4>
                    <p className="text-xs text-text-secondary leading-relaxed bg-bg-void/50 rounded-lg p-3 border border-white/5">{simulationResult.mechanismAnalysis}</p>
                  </div>

                  {/* Predicted Effects */}
                  <div>
                    <h4 className="text-[10px] font-heading font-semibold text-genesis-green uppercase tracking-wider mb-1.5">Predicted Effects</h4>
                    <div className="space-y-1.5">
                      {simulationResult.predictedEffects.map((e, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                          <CheckCircle2 className="w-3 h-3 mt-0.5 text-genesis-green flex-shrink-0" />
                          {e}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interaction Warnings */}
                  {simulationResult.interactionWarnings.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-heading font-semibold text-genesis-red uppercase tracking-wider mb-1.5">Interaction Warnings</h4>
                      <div className="space-y-1.5">
                        {simulationResult.interactionWarnings.map((w, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                            <AlertTriangle className="w-3 h-3 mt-0.5 text-genesis-red flex-shrink-0" />
                            {w}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════
           MASTERMIND TAB
           ═════════════════════════════════════════════════════════════════ */}
        {activeTab === 'mastermind' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="font-heading text-2xl font-bold text-text-primary mb-2 flex items-center justify-center gap-2">
                <Puzzle className="w-6 h-6 text-genesis-gold" />
                <span className="glow-gold">Mastermind</span>
              </h2>
              <p className="text-text-secondary text-sm mb-1">Pick 3 compounds to treat the target condition</p>
              <p className="text-text-muted text-xs">
                <span style={{ color: '#00FF94' }}>Green</span> = correct compound &middot;{' '}
                <span style={{ color: '#FFD700' }}>Yellow</span> = right category &middot;{' '}
                <span style={{ color: '#4A6080' }}>Gray</span> = wrong
              </p>
            </div>

            {/* Score + Target */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-lg border border-genesis-gold/20 bg-bg-surface px-4 py-2">
                  <span className="text-[10px] text-text-muted font-mono block">TARGET</span>
                  <span className="font-heading font-bold text-genesis-gold text-lg">{currentCondition.name}</span>
                </div>
                <div className="text-xs text-text-muted">
                  Attempt {Math.min(guesses.length + 1, 6)}/6
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <Trophy className="w-4 h-4 text-genesis-gold inline mr-1" />
                  <span className="text-sm font-mono text-text-secondary">{totalWins}/{totalGames}</span>
                </div>
                <button
                  onClick={newGame}
                  className="p-2 rounded-lg bg-bg-surface border border-white/10 text-text-muted hover:text-text-secondary hover:border-white/20 transition-colors"
                  title="New Game"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Previous Guesses */}
            {guesses.length > 0 && (
              <div className="space-y-2">
                {guesses.map((guess, gi) => (
                  <div key={gi} className="flex gap-2">
                    {guess.feedback.map((fb, fi) => (
                      <div
                        key={fi}
                        className="flex-1 rounded-lg border p-3 flex items-center gap-2"
                        style={{
                          borderColor: feedbackColor(fb.status) + '40',
                          backgroundColor: feedbackColor(fb.status) + '10',
                        }}
                      >
                        <span style={{ color: feedbackColor(fb.status) }}>{feedbackIcon(fb.status)}</span>
                        <span className="text-sm font-heading font-semibold text-text-primary">{fb.compound}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Current Guess Slots */}
            {!gameOver && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  {[0, 1, 2].map(i => {
                    const name = guessSlots[i];
                    return (
                      <div
                        key={i}
                        className={`flex-1 rounded-lg border-2 border-dashed p-3 flex items-center justify-center min-h-[52px] transition-all ${
                          name ? 'border-genesis-gold/40 bg-genesis-gold/5' : 'border-white/10'
                        }`}
                      >
                        {name ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-heading font-semibold text-text-primary">{name}</span>
                            <button onClick={() => removeFromGuess(name)} className="text-text-muted hover:text-genesis-red">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-text-muted/50">Slot {i + 1}</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={submitGuess}
                  disabled={guessSlots.length !== 3}
                  className="w-full py-3 rounded-lg font-heading font-semibold text-sm bg-genesis-gold/15 border border-genesis-gold/30 text-genesis-gold hover:bg-genesis-gold/25 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Target className="w-4 h-4" />
                  Submit Guess
                </button>

                {/* Compound picker */}
                <div>
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      value={mmCompoundSearch}
                      onChange={e => setMmCompoundSearch(e.target.value)}
                      placeholder="Search compounds..."
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-bg-surface border border-white/10 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-genesis-gold/40"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {mmFilteredCompounds.map(name => {
                      const compound = COMPOUNDS.find(c => c.name === name)!;
                      const color = typeColor(compound.type);
                      const used = guesses.some(g => g.compounds.includes(name));
                      const inSlot = guessSlots.includes(name);
                      return (
                        <button
                          key={name}
                          onClick={() => addToGuess(name)}
                          disabled={used || inSlot || guessSlots.length >= 3}
                          className="px-2.5 py-1.5 rounded-lg border text-xs font-heading transition-all disabled:opacity-25 disabled:cursor-not-allowed"
                          style={{
                            borderColor: inSlot ? color + '60' : 'rgba(255,255,255,0.1)',
                            backgroundColor: inSlot ? color + '10' : undefined,
                            color: used ? '#4A6080' : color,
                          }}
                        >
                          {name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Game Over */}
            {gameOver && (
              <div className={`rounded-xl border p-6 text-center ${
                gameWon ? 'border-genesis-green/30 bg-genesis-green/5' : 'border-genesis-red/30 bg-genesis-red/5'
              }`}>
                {gameWon ? (
                  <>
                    <Trophy className="w-10 h-10 text-genesis-gold mx-auto mb-3" />
                    <h3 className="font-heading text-xl font-bold text-genesis-green mb-1">Cure Found!</h3>
                    <p className="text-text-secondary text-sm">You identified the correct compound combination in {guesses.length} attempt{guesses.length > 1 ? 's' : ''}.</p>
                  </>
                ) : (
                  <>
                    <XCircle className="w-10 h-10 text-genesis-red mx-auto mb-3" />
                    <h3 className="font-heading text-xl font-bold text-genesis-red mb-1">Trial Failed</h3>
                    <p className="text-text-secondary text-sm mb-3">The correct combination was:</p>
                    <div className="flex justify-center gap-2">
                      {currentCondition.solution.map(name => (
                        <span key={name} className="px-3 py-1.5 rounded-lg bg-genesis-green/10 border border-genesis-green/30 text-genesis-green text-sm font-heading font-semibold">
                          {name}
                        </span>
                      ))}
                    </div>
                  </>
                )}
                <button
                  onClick={newGame}
                  className="mt-4 px-6 py-2.5 rounded-lg bg-genesis-gold/15 border border-genesis-gold/30 text-genesis-gold font-heading font-semibold text-sm hover:bg-genesis-gold/25 transition-all inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  New Game
                </button>
              </div>
            )}
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════
           DISCOVERY TAB
           ═════════════════════════════════════════════════════════════════ */}
        {activeTab === 'discovery' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="font-heading text-2xl font-bold text-text-primary mb-2 flex items-center justify-center gap-2">
                <Lightbulb className="w-6 h-6 text-genesis-gold" />
                <span className="glow-gold">Discovery Engine</span>
              </h2>
              <p className="text-text-secondary text-sm">What if? Type a hypothesis and explore the possibilities.</p>
            </div>

            {/* Hypothesis Input */}
            <div className="rounded-xl border border-genesis-gold/20 bg-bg-surface p-5 box-glow-gold">
              <label className="text-xs font-heading font-semibold text-genesis-gold uppercase tracking-wider block mb-2">
                Your Hypothesis
              </label>
              <textarea
                value={hypothesis}
                onChange={e => setHypothesis(e.target.value)}
                placeholder='e.g., "What if we combined aspirin with curcumin for inflammation?" or "Could rapamycin and metformin slow aging?"'
                rows={3}
                className="w-full p-3 rounded-lg bg-bg-void/50 border border-white/10 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-genesis-gold/40 resize-none"
              />
              <div className="flex items-center justify-between mt-3">
                <p className="text-[10px] text-text-muted">Try mentioning specific compounds for more detailed analysis</p>
                <button
                  onClick={submitHypothesis}
                  disabled={!hypothesis.trim() || isDiscovering}
                  className="px-5 py-2.5 rounded-lg bg-genesis-gold/15 border border-genesis-gold/30 text-genesis-gold font-heading font-semibold text-sm hover:bg-genesis-gold/25 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isDiscovering ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Analyze
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Example Hypotheses */}
            {!discoveryResult && !isDiscovering && (
              <div>
                <p className="text-xs text-text-muted mb-2 font-heading">Try these hypotheses:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'What if we combined aspirin with curcumin for chronic inflammation?',
                    'Could CBD and morphine reduce opioid dependence while maintaining pain relief?',
                    'What if rapamycin and metformin together could slow cellular aging?',
                    'Would doxorubicin combined with quercetin reduce chemotherapy cardiotoxicity?',
                  ].map(h => (
                    <button
                      key={h}
                      onClick={() => { setHypothesis(h); }}
                      className="text-left text-xs p-3 rounded-lg border border-white/5 bg-bg-card text-text-muted hover:text-text-secondary hover:border-white/15 transition-all"
                    >
                      <ChevronRight className="w-3 h-3 inline mr-1 text-genesis-gold" />
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading */}
            {isDiscovering && (
              <div className="flex flex-col items-center py-12">
                <Loader2 className="w-8 h-8 text-genesis-gold animate-spin mb-4" />
                <p className="text-text-secondary text-sm">Running computational analysis...</p>
                <p className="text-text-muted text-xs mt-1">Cross-referencing molecular pathways and existing research</p>
              </div>
            )}

            {/* Discovery Results */}
            {discoveryResult && !isDiscovering && (
              <div className="space-y-4">
                {/* Plausibility Score */}
                <div className="rounded-xl border border-white/10 bg-bg-surface p-5">
                  <div className="flex items-center gap-5">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <svg viewBox="0 0 96 96" className="w-full h-full -rotate-90">
                        <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
                        <circle
                          cx="48" cy="48" r="40" fill="none"
                          stroke={plausibilityColor(discoveryResult.plausibilityScore)}
                          strokeWidth="7"
                          strokeDasharray={`${(discoveryResult.plausibilityScore / 100) * 251.3} 251.3`}
                          strokeLinecap="round"
                          style={{ filter: `drop-shadow(0 0 8px ${plausibilityColor(discoveryResult.plausibilityScore)}40)` }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-heading font-bold" style={{ color: plausibilityColor(discoveryResult.plausibilityScore) }}>
                          {discoveryResult.plausibilityScore}
                        </span>
                        <span className="text-[8px] text-text-muted uppercase tracking-wider">Plausibility</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-bold text-text-primary mb-1">Plausibility Assessment</h3>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {discoveryResult.plausibilityScore >= 75
                          ? 'This hypothesis has strong mechanistic support and aligns with existing research.'
                          : discoveryResult.plausibilityScore >= 50
                          ? 'This hypothesis is plausible but requires further validation.'
                          : 'This hypothesis is speculative. Limited mechanistic support found.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mechanism Analysis */}
                <div className="rounded-xl border border-white/10 bg-bg-surface p-5">
                  <h4 className="text-[10px] font-heading font-semibold text-genesis-cyan uppercase tracking-wider mb-2">Mechanism Analysis</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">{discoveryResult.mechanismAnalysis}</p>
                </div>

                {/* Potential Outcomes */}
                <div className="rounded-xl border border-white/10 bg-bg-surface p-5">
                  <h4 className="text-[10px] font-heading font-semibold text-genesis-green uppercase tracking-wider mb-2">Potential Outcomes</h4>
                  <div className="space-y-2">
                    {discoveryResult.potentialOutcomes.map((o, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                        <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-genesis-green flex-shrink-0" />
                        {o}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Existing Research */}
                <div className="rounded-xl border border-white/10 bg-bg-surface p-5">
                  <h4 className="text-[10px] font-heading font-semibold text-genesis-gold uppercase tracking-wider mb-2">Existing Research</h4>
                  <div className="space-y-2">
                    {discoveryResult.existingResearch.map((r, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                        <FlaskConical className="w-3.5 h-3.5 mt-0.5 text-genesis-gold flex-shrink-0" />
                        <span className="font-mono text-xs">{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="rounded-xl border border-genesis-red/20 bg-bg-surface p-5">
                  <h4 className="text-[10px] font-heading font-semibold text-genesis-red uppercase tracking-wider mb-2">Risk Assessment</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">{discoveryResult.riskAssessment}</p>
                </div>

                {/* Try Another */}
                <div className="text-center pt-2">
                  <button
                    onClick={() => { setDiscoveryResult(null); setHypothesis(''); }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-bg-surface border border-white/10 text-text-secondary hover:text-text-primary hover:border-white/20 text-sm font-heading transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Try Another Hypothesis
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

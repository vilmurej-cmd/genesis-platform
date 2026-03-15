'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Brain,
  Heart,
  Activity,
  Microscope,
  AlertTriangle,
  Clock,
  Pill,
  FlaskConical,
  ChevronRight,
  ArrowLeft,
  X,
  Loader2,
  Wind,
  Droplets,
  ShieldCheck,
  Zap,
  Bone,
} from 'lucide-react';

/* ── Types ──────────────────────────────────────────────── */
interface DiseaseStage {
  name: string;
  description: string;
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
}

interface Treatment {
  name: string;
  type: 'medication' | 'procedure' | 'lifestyle' | 'therapy';
  description: string;
}

interface ResearchItem {
  name: string;
  phase: string;
  description: string;
}

interface DiseaseData {
  name: string;
  affectedSystem: string;
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  description: string;
  pathophysiology: string;
  affectedSystems: { name: string; impact: string }[];
  stages: DiseaseStage[];
  treatments: Treatment[];
  research: ResearchItem[];
}

/* ── Demo Disease Database ──────────────────────────────── */
const DISEASE_DATABASE: Record<string, DiseaseData> = {
  "alzheimer's": {
    name: "Alzheimer's Disease",
    affectedSystem: 'Nervous',
    severity: 'critical',
    description: 'A progressive neurodegenerative disorder that destroys memory and cognitive function. The most common cause of dementia, affecting over 6 million Americans.',
    pathophysiology: 'Abnormal accumulation of amyloid-beta plaques between neurons and tau protein tangles within neurons leads to synaptic dysfunction and neuronal death. This begins in the hippocampus (memory center) and spreads to the cortex, causing progressive loss of brain volume and function. Chronic neuroinflammation mediated by microglia accelerates the degenerative process.',
    affectedSystems: [
      { name: 'Nervous', impact: 'Primary target — neuronal death, plaque formation, cognitive decline' },
      { name: 'Cardiovascular', impact: 'Cerebral amyloid angiopathy, increased stroke risk' },
      { name: 'Endocrine', impact: 'Disrupted circadian rhythm, melatonin deficiency' },
      { name: 'Muscular', impact: 'Late-stage motor dysfunction, swallowing difficulty' },
    ],
    stages: [
      { name: 'Preclinical', description: 'Brain changes begin 15-20 years before symptoms. Amyloid plaques accumulating silently.', severity: 'mild' },
      { name: 'Mild Cognitive Impairment', description: 'Noticeable memory lapses, word-finding difficulty, misplacing items frequently.', severity: 'moderate' },
      { name: 'Mild Dementia', description: 'Difficulty with complex tasks, personality changes, getting lost in familiar places.', severity: 'severe' },
      { name: 'Moderate Dementia', description: 'Significant confusion, inability to recognize family, wandering, sundowning.', severity: 'severe' },
      { name: 'Severe Dementia', description: 'Loss of ability to communicate, total dependence on caregivers, organ system failure.', severity: 'critical' },
    ],
    treatments: [
      { name: 'Lecanemab (Leqembi)', type: 'medication', description: 'Anti-amyloid antibody that removes plaques. First FDA-approved disease-modifying therapy.' },
      { name: 'Donanemab (Kisunla)', type: 'medication', description: 'Targets amyloid plaques; showed 35% slowing of cognitive decline in trials.' },
      { name: 'Cholinesterase Inhibitors', type: 'medication', description: 'Donepezil, rivastigmine — boost acetylcholine levels to improve signaling between neurons.' },
      { name: 'Cognitive Behavioral Therapy', type: 'therapy', description: 'Structured activities and exercises to maintain cognitive function longer.' },
      { name: 'Physical Exercise', type: 'lifestyle', description: 'Regular aerobic exercise shown to increase BDNF and slow hippocampal atrophy.' },
    ],
    research: [
      { name: 'Tau Immunotherapy', phase: 'Phase III', description: 'Antibodies targeting tau tangles — attacking the second hallmark of the disease.' },
      { name: 'Gene Therapy (APOE4)', phase: 'Phase II', description: 'CRISPR-based editing of APOE4 risk gene to protective APOE2 variant.' },
      { name: 'GLP-1 Agonists', phase: 'Phase III', description: 'Diabetes drugs (semaglutide) showing neuroprotective effects and reduced dementia risk.' },
    ],
  },
  'heart failure': {
    name: 'Heart Failure',
    affectedSystem: 'Cardiovascular',
    severity: 'critical',
    description: 'A chronic condition where the heart cannot pump blood efficiently enough to meet the body\'s needs. Affects over 6 million Americans with a 5-year mortality rate of approximately 50%.',
    pathophysiology: 'Cardiac injury (from hypertension, coronary disease, or cardiomyopathy) triggers neurohormonal activation — the RAAS system and sympathetic nervous system overcompensate, causing fluid retention, vasoconstriction, and cardiac remodeling. The heart dilates and thins (HFrEF) or stiffens (HFpEF), creating a vicious cycle of worsening pump function and increasing metabolic demand.',
    affectedSystems: [
      { name: 'Cardiovascular', impact: 'Primary — reduced cardiac output, arrhythmias, valve dysfunction' },
      { name: 'Respiratory', impact: 'Pulmonary edema, pleural effusions, dyspnea' },
      { name: 'Urinary', impact: 'Renal hypoperfusion, cardiorenal syndrome, fluid retention' },
      { name: 'Digestive', impact: 'Hepatic congestion, cardiac cirrhosis, malabsorption' },
      { name: 'Nervous', impact: 'Cerebral hypoperfusion, cognitive impairment, depression' },
    ],
    stages: [
      { name: 'Stage A (At Risk)', description: 'Risk factors present (hypertension, diabetes) but no structural heart disease yet.', severity: 'mild' },
      { name: 'Stage B (Pre-HF)', description: 'Structural changes detected (enlarged chamber, reduced EF) but no symptoms.', severity: 'moderate' },
      { name: 'Stage C (Symptomatic)', description: 'Active symptoms: shortness of breath, fatigue, edema. Responds to treatment.', severity: 'severe' },
      { name: 'Stage D (Advanced)', description: 'Refractory symptoms despite maximal therapy. Requires LVAD or transplant consideration.', severity: 'critical' },
    ],
    treatments: [
      { name: 'SGLT2 Inhibitors', type: 'medication', description: 'Dapagliflozin/empagliflozin — reduce hospitalizations and mortality in both HFrEF and HFpEF.' },
      { name: 'Sacubitril/Valsartan', type: 'medication', description: 'ARNI therapy — blocks neprilysin and angiotensin, reducing cardiac remodeling.' },
      { name: 'Beta-Blockers', type: 'medication', description: 'Carvedilol, metoprolol — slow heart rate, reduce oxygen demand, prevent remodeling.' },
      { name: 'CRT/ICD Implantation', type: 'procedure', description: 'Cardiac resynchronization therapy and defibrillators for advanced cases.' },
      { name: 'Salt/Fluid Restriction', type: 'lifestyle', description: 'Limiting sodium to <2g/day and fluid intake to prevent volume overload.' },
    ],
    research: [
      { name: 'Cardiac Gene Therapy', phase: 'Phase II', description: 'AAV-delivered SERCA2a gene to restore calcium handling in failing cardiomyocytes.' },
      { name: 'Stem Cell Therapy', phase: 'Phase III', description: 'Autologous cardiac stem cells injected to regenerate damaged myocardium.' },
      { name: 'Artificial Heart (Total)', phase: 'Phase II', description: 'Fully implantable total artificial heart as permanent destination therapy.' },
    ],
  },
  'type 2 diabetes': {
    name: 'Type 2 Diabetes Mellitus',
    affectedSystem: 'Endocrine',
    severity: 'severe',
    description: 'A metabolic disorder characterized by insulin resistance and progressive beta-cell failure, leading to chronic hyperglycemia. Affects over 460 million people worldwide.',
    pathophysiology: 'Chronic caloric excess leads to visceral fat accumulation, triggering adipose tissue inflammation and release of free fatty acids. Skeletal muscle and liver become insulin-resistant, requiring the pancreas to produce ever-increasing amounts of insulin. Eventually, beta-cell exhaustion occurs (glucotoxicity and lipotoxicity), insulin production falls, and hyperglycemia becomes persistent. Elevated glucose damages blood vessels through advanced glycation end-products (AGEs) and oxidative stress.',
    affectedSystems: [
      { name: 'Endocrine', impact: 'Primary — beta-cell failure, insulin resistance, hormonal dysregulation' },
      { name: 'Cardiovascular', impact: 'Accelerated atherosclerosis, 2-4x heart attack risk' },
      { name: 'Nervous', impact: 'Peripheral neuropathy, autonomic dysfunction' },
      { name: 'Urinary', impact: 'Diabetic nephropathy — leading cause of kidney failure' },
      { name: 'Digestive', impact: 'Gastroparesis, fatty liver disease (NAFLD/NASH)' },
    ],
    stages: [
      { name: 'Prediabetes', description: 'Fasting glucose 100-125 mg/dL. Insulin resistance present but compensated. Reversible with lifestyle changes.', severity: 'mild' },
      { name: 'Early Diabetes', description: 'Fasting glucose >126 mg/dL. Beta-cell function declining. HbA1c 6.5-7.5%. Often manageable with metformin.', severity: 'moderate' },
      { name: 'Established Diabetes', description: 'Progressive beta-cell loss. Requires multiple medications. Microvascular complications developing.', severity: 'severe' },
      { name: 'Advanced/Complicated', description: 'Significant end-organ damage: retinopathy, nephropathy, neuropathy. May require insulin.', severity: 'critical' },
    ],
    treatments: [
      { name: 'GLP-1 Receptor Agonists', type: 'medication', description: 'Semaglutide, tirzepatide — stimulate insulin, suppress glucagon, promote weight loss, cardioprotective.' },
      { name: 'Metformin', type: 'medication', description: 'First-line therapy — reduces hepatic glucose production, improves insulin sensitivity.' },
      { name: 'SGLT2 Inhibitors', type: 'medication', description: 'Block glucose reabsorption in kidneys. Cardiorenal protective effects.' },
      { name: 'Dietary Modification', type: 'lifestyle', description: 'Low-glycemic, Mediterranean-style diet. 5-10% weight loss can achieve remission in early disease.' },
      { name: 'Bariatric Surgery', type: 'procedure', description: 'Gastric bypass/sleeve — achieves diabetes remission in 60-80% of patients.' },
    ],
    research: [
      { name: 'Stem Cell-Derived Beta Cells', phase: 'Phase II', description: 'Lab-grown insulin-producing cells implanted in immunoprotective capsules.' },
      { name: 'Dual/Triple Agonists', phase: 'Phase III', description: 'Retatrutide (GLP-1/GIP/glucagon) — unprecedented weight loss and glucose control.' },
      { name: 'Islet Transplantation + CRISPR', phase: 'Phase I', description: 'Gene-edited pig islet cells made immune-invisible for transplantation.' },
    ],
  },
  'lung cancer': {
    name: 'Lung Cancer',
    affectedSystem: 'Respiratory',
    severity: 'critical',
    description: 'The leading cause of cancer death worldwide. Non-small cell lung cancer (NSCLC) accounts for 85% of cases. 5-year survival has improved from 15% to 25% with targeted therapies and immunotherapy.',
    pathophysiology: 'Chronic exposure to carcinogens (tobacco smoke, radon, asbestos) causes accumulated DNA mutations in bronchial epithelial cells. Driver mutations (EGFR, ALK, KRAS, ROS1) activate oncogenic signaling cascades promoting uncontrolled growth. Tumor cells evade immune surveillance by upregulating PD-L1, create new blood supply through VEGF signaling, and eventually metastasize via lymphatic and hematogenous spread — commonly to brain, bone, liver, and adrenal glands.',
    affectedSystems: [
      { name: 'Respiratory', impact: 'Primary — tumor obstruction, pleural effusion, respiratory failure' },
      { name: 'Lymphatic', impact: 'Lymph node metastasis, immune system suppression' },
      { name: 'Nervous', impact: 'Brain metastases in 40% of advanced cases' },
      { name: 'Skeletal', impact: 'Bone metastases, pathological fractures, hypercalcemia' },
      { name: 'Endocrine', impact: 'Paraneoplastic syndromes: SIADH, Cushing syndrome' },
    ],
    stages: [
      { name: 'Stage I', description: 'Tumor confined to lung, <4cm, no lymph node involvement. 5-year survival 68-92%.', severity: 'moderate' },
      { name: 'Stage II', description: 'Larger tumor or ipsilateral hilar lymph nodes involved. 5-year survival 53-60%.', severity: 'severe' },
      { name: 'Stage III', description: 'Mediastinal lymph node involvement or chest wall invasion. 5-year survival 13-36%.', severity: 'severe' },
      { name: 'Stage IV', description: 'Distant metastasis (brain, bone, liver). 5-year survival 0-10%.', severity: 'critical' },
    ],
    treatments: [
      { name: 'Immunotherapy (Pembrolizumab)', type: 'medication', description: 'Anti-PD-1 checkpoint inhibitor — unleashes immune system against tumor. Standard first-line for high PD-L1.' },
      { name: 'Targeted Therapy (Osimertinib)', type: 'medication', description: 'EGFR TKI for EGFR-mutant NSCLC. 80% response rate, median PFS 18.9 months.' },
      { name: 'Stereotactic Radiation (SBRT)', type: 'procedure', description: 'Precisely targeted high-dose radiation for early-stage tumors. Cure rates rival surgery.' },
      { name: 'Lobectomy/Segmentectomy', type: 'procedure', description: 'Surgical removal of affected lobe. Gold standard for early-stage disease.' },
      { name: 'Chemotherapy (Platinum Doublet)', type: 'medication', description: 'Carboplatin + pemetrexed backbone, often combined with immunotherapy.' },
    ],
    research: [
      { name: 'Bispecific Antibodies', phase: 'Phase III', description: 'Amivantamab — simultaneously targets EGFR and MET for resistant tumors.' },
      { name: 'Antibody-Drug Conjugates', phase: 'Phase III', description: 'Trastuzumab deruxtecan (T-DXd) for HER2-mutant NSCLC.' },
      { name: 'Personalized Cancer Vaccines', phase: 'Phase II', description: 'mRNA neoantigen vaccines tailored to individual tumor mutations.' },
    ],
  },
  'rheumatoid arthritis': {
    name: 'Rheumatoid Arthritis',
    affectedSystem: 'Lymphatic',
    severity: 'severe',
    description: 'A chronic autoimmune disorder causing symmetric joint inflammation and destruction. Affects approximately 1% of the global population, predominantly women (3:1 ratio).',
    pathophysiology: 'Genetic susceptibility (HLA-DR4) combined with environmental triggers (smoking, infections) causes loss of immune tolerance. Autoreactive T-cells activate B-cells to produce rheumatoid factor and anti-CCP antibodies. These immune complexes deposit in synovial tissue, triggering chronic inflammation. The inflamed synovium (pannus) invades and destroys cartilage and bone through metalloproteinase enzymes and osteoclast activation. Pro-inflammatory cytokines (TNF-alpha, IL-6, IL-17) amplify the destructive cascade.',
    affectedSystems: [
      { name: 'Lymphatic', impact: 'Primary — autoimmune dysregulation, antibody production' },
      { name: 'Skeletal', impact: 'Joint erosion, osteopenia, deformity' },
      { name: 'Cardiovascular', impact: 'Accelerated atherosclerosis, pericarditis, vasculitis' },
      { name: 'Respiratory', impact: 'Interstitial lung disease, pleural effusions, nodules' },
      { name: 'Nervous', impact: 'Carpal tunnel, cervical myelopathy, peripheral neuropathy' },
    ],
    stages: [
      { name: 'Early RA', description: 'Joint stiffness and swelling, especially mornings. ESR/CRP elevated. Crucial treatment window.', severity: 'mild' },
      { name: 'Moderate RA', description: 'Multiple joint involvement, erosions beginning on X-ray, functional limitations.', severity: 'moderate' },
      { name: 'Severe RA', description: 'Significant joint destruction, deformities developing (swan neck, boutonniere), systemic features.', severity: 'severe' },
      { name: 'End-Stage RA', description: 'Joint fusion (ankylosis), severe disability, extra-articular organ damage.', severity: 'critical' },
    ],
    treatments: [
      { name: 'Methotrexate', type: 'medication', description: 'Anchor DMARD — first-line treatment. Suppresses overactive immune cells at low doses.' },
      { name: 'TNF Inhibitors', type: 'medication', description: 'Adalimumab, etanercept — block tumor necrosis factor alpha, a key inflammatory driver.' },
      { name: 'JAK Inhibitors', type: 'medication', description: 'Tofacitinib, upadacitinib — oral targeted therapy blocking intracellular signaling.' },
      { name: 'Physical Therapy', type: 'therapy', description: 'Range-of-motion exercises, joint protection techniques, adaptive equipment training.' },
      { name: 'Joint Replacement', type: 'procedure', description: 'Total joint arthroplasty for severely destroyed joints (knees, hips, shoulders).' },
    ],
    research: [
      { name: 'CAR-T for Autoimmunity', phase: 'Phase I', description: 'Anti-CD19 CAR-T cells to eliminate autoreactive B-cells — showing complete remission.' },
      { name: 'Tolerogenic Dendritic Cells', phase: 'Phase II', description: 'Reprogrammed immune cells that teach tolerance to self-antigens.' },
      { name: 'Microbiome Therapy', phase: 'Phase II', description: 'Targeting Prevotella copri and gut dysbiosis linked to RA onset.' },
    ],
  },
  'chronic kidney disease': {
    name: 'Chronic Kidney Disease',
    affectedSystem: 'Urinary',
    severity: 'severe',
    description: 'Progressive loss of kidney function over months to years. Affects approximately 15% of US adults (37 million). Often silent until advanced stages. Leading causes: diabetes and hypertension.',
    pathophysiology: 'Initial injury (from diabetes, hypertension, glomerulonephritis) damages nephrons, causing compensatory hyperfiltration in remaining nephrons. This overwork leads to glomerular hypertension, proteinuria, and progressive fibrosis via TGF-beta signaling. The renin-angiotensin-aldosterone system (RAAS) becomes overactivated, perpetuating damage. As GFR declines, the kidneys fail to regulate fluid balance, electrolytes (potassium, phosphorus), acid-base status, and production of erythropoietin and activated vitamin D.',
    affectedSystems: [
      { name: 'Urinary', impact: 'Primary — nephron loss, declining GFR, impaired filtration and hormone production' },
      { name: 'Cardiovascular', impact: 'Hypertension, LVH, accelerated calcification, uremic cardiomyopathy' },
      { name: 'Skeletal', impact: 'Renal osteodystrophy — phosphorus retention, vitamin D deficiency, secondary hyperparathyroidism' },
      { name: 'Endocrine', impact: 'Erythropoietin deficiency (anemia), vitamin D activation failure' },
      { name: 'Nervous', impact: 'Uremic encephalopathy, peripheral neuropathy, restless legs' },
    ],
    stages: [
      { name: 'Stage 1 (GFR >90)', description: 'Normal GFR but kidney damage present (proteinuria, structural abnormality). Usually asymptomatic.', severity: 'mild' },
      { name: 'Stage 2 (GFR 60-89)', description: 'Mild GFR reduction. Still largely asymptomatic. Focus on slowing progression.', severity: 'mild' },
      { name: 'Stage 3 (GFR 30-59)', description: 'Moderate GFR loss. Fatigue, edema, nocturia. Complications begin (anemia, bone disease).', severity: 'moderate' },
      { name: 'Stage 4 (GFR 15-29)', description: 'Severe GFR loss. Pronounced symptoms. Prepare for dialysis or transplant.', severity: 'severe' },
      { name: 'Stage 5 (GFR <15)', description: 'End-stage kidney failure. Dialysis or transplant required for survival.', severity: 'critical' },
    ],
    treatments: [
      { name: 'SGLT2 Inhibitors', type: 'medication', description: 'Dapagliflozin — slows GFR decline by 39%, reduces proteinuria. Works regardless of diabetes status.' },
      { name: 'ACE Inhibitors/ARBs', type: 'medication', description: 'Reduce glomerular pressure and proteinuria. Cornerstone of CKD management.' },
      { name: 'Finerenone (Kerendia)', type: 'medication', description: 'Non-steroidal MRA — reduces kidney and cardiovascular events in diabetic CKD.' },
      { name: 'Hemodialysis', type: 'procedure', description: 'Blood filtered through external machine 3x/week for 4 hours. Replaces kidney function.' },
      { name: 'Kidney Transplant', type: 'procedure', description: 'Gold standard for ESKD. Living donor preferred. 10-15 year median graft survival.' },
    ],
    research: [
      { name: 'Bioartificial Kidney', phase: 'Phase II', description: 'Implantable device with silicon nanopore membrane + living renal cells.' },
      { name: 'Xenotransplantation', phase: 'Phase I', description: 'Gene-edited pig kidneys transplanted into humans — first cases survived months.' },
      { name: 'Kidney Organoids', phase: 'Preclinical', description: 'iPSC-derived mini-kidneys with functional nephron structures grown in lab.' },
    ],
  },
};

/* ── Featured Conditions Grid ───────────────────────────── */
interface FeaturedCondition {
  name: string;
  searchKey: string;
  system: string;
  description: string;
  icon: typeof Brain;
}

const FEATURED_CONDITIONS: FeaturedCondition[] = [
  { name: "Alzheimer's Disease", searchKey: "alzheimer's", system: 'Nervous', description: 'Progressive neurodegeneration destroying memory and cognition', icon: Brain },
  { name: 'Heart Failure', searchKey: 'heart failure', system: 'Cardiovascular', description: 'The heart cannot pump blood efficiently to meet body demands', icon: Heart },
  { name: 'Type 2 Diabetes', searchKey: 'type 2 diabetes', system: 'Endocrine', description: 'Insulin resistance and beta-cell failure causing chronic hyperglycemia', icon: Activity },
  { name: 'Lung Cancer', searchKey: 'lung cancer', system: 'Respiratory', description: 'Leading cause of cancer death — transformed by immunotherapy', icon: Wind },
  { name: 'Rheumatoid Arthritis', searchKey: 'rheumatoid arthritis', system: 'Lymphatic', description: 'Autoimmune destruction of joints with systemic inflammation', icon: Bone },
  { name: 'Chronic Kidney Disease', searchKey: 'chronic kidney disease', system: 'Urinary', description: 'Progressive nephron loss affecting 15% of adults', icon: Droplets },
];

/* ── Helpers ─────────────────────────────────────────────── */
const SYSTEM_COLORS: Record<string, string> = {
  Nervous: '#FFD700',
  Cardiovascular: '#FF3366',
  Respiratory: '#66CCFF',
  Endocrine: '#9945FF',
  Lymphatic: '#00FF94',
  Urinary: '#FFCC00',
  Skeletal: '#E8DCC8',
  Muscular: '#CC3333',
  Digestive: '#FF9933',
  Reproductive: '#FF66B2',
};

const SEVERITY_COLORS: Record<string, string> = {
  mild: '#00FF94',
  moderate: '#FFD700',
  severe: '#FF9933',
  critical: '#FF3366',
};

const SEVERITY_LABELS: Record<string, string> = {
  mild: 'Mild',
  moderate: 'Moderate',
  severe: 'Severe',
  critical: 'Critical',
};

function getSystemColor(system: string): string {
  return SYSTEM_COLORS[system] || '#00E5FF';
}

function getSeverityColor(severity: string): string {
  return SEVERITY_COLORS[severity] || '#FFD700';
}

/* ── Component ──────────────────────────────────────────── */
export default function PathologyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisease, setSelectedDisease] = useState<DiseaseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);

  const searchDisease = async (query: string) => {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return;

    setIsLoading(true);
    setSearchFailed(false);

    // Try API first
    try {
      const res = await fetch(`/api/pathology?q=${encodeURIComponent(normalizedQuery)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.name) {
          setSelectedDisease(data);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Fall through to demo data
    }

    // Demo fallback — fuzzy match against our database
    await new Promise((r) => setTimeout(r, 600));
    const match = Object.entries(DISEASE_DATABASE).find(([key]) =>
      key.includes(normalizedQuery) || normalizedQuery.includes(key)
    );
    if (match) {
      setSelectedDisease(match[1]);
    } else {
      // Partial word match
      const partialMatch = Object.entries(DISEASE_DATABASE).find(([key]) =>
        normalizedQuery.split(' ').some((word) => word.length > 3 && key.includes(word))
      );
      if (partialMatch) {
        setSelectedDisease(partialMatch[1]);
      } else {
        setSelectedDisease(null);
        setSearchFailed(true);
      }
    }
    setIsLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchDisease(searchQuery);
  };

  const handleFeaturedClick = (condition: FeaturedCondition) => {
    setSearchQuery(condition.name);
    searchDisease(condition.searchKey);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedDisease(null);
    setSearchFailed(false);
  };

  const treatmentTypeIcon = (type: string) => {
    switch (type) {
      case 'medication': return <Pill className="w-4 h-4" />;
      case 'procedure': return <Activity className="w-4 h-4" />;
      case 'lifestyle': return <Heart className="w-4 h-4" />;
      case 'therapy': return <Brain className="w-4 h-4" />;
      default: return <Pill className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-bg-void">
      {/* Header */}
      <div className="border-b border-white/5 bg-bg-surface/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-text-muted hover:text-text-secondary transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-heading text-xl font-bold text-text-primary flex items-center gap-2">
                <Microscope className="w-5 h-5 text-genesis-magenta" />
                PATHOLOGY
              </h1>
              <p className="text-sm text-text-muted">Visualize Any Disease</p>
            </div>
          </div>
          {selectedDisease && (
            <button
              onClick={clearSearch}
              className="text-sm text-text-muted hover:text-text-secondary transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to conditions
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any disease, condition, or symptom..."
              className="w-full pl-12 pr-20 py-4 rounded-xl bg-bg-surface border border-white/10 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-genesis-magenta/50 focus:ring-1 focus:ring-genesis-magenta/20 font-body text-lg transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-14 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-genesis-magenta/20 text-genesis-magenta hover:bg-genesis-magenta/30 transition-colors disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </form>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-genesis-magenta animate-spin mb-4" />
            <p className="text-text-secondary font-body">Analyzing pathology data...</p>
          </div>
        )}

        {/* Disease Detail View */}
        {selectedDisease && !isLoading && (
          <div className="space-y-6 mb-12">
            {/* Disease Header */}
            <div className="rounded-xl border border-white/10 bg-bg-surface p-6 box-glow-magenta">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex-1">
                  <h2 className="font-heading text-2xl font-bold text-text-primary mb-2">{selectedDisease.name}</h2>
                  <p className="text-text-secondary max-w-3xl leading-relaxed">{selectedDisease.description}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className="px-3 py-1.5 rounded-full text-xs font-semibold border"
                    style={{
                      color: getSystemColor(selectedDisease.affectedSystem),
                      borderColor: getSystemColor(selectedDisease.affectedSystem) + '40',
                      backgroundColor: getSystemColor(selectedDisease.affectedSystem) + '15',
                    }}
                  >
                    {selectedDisease.affectedSystem} System
                  </span>
                  <span
                    className="px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1.5"
                    style={{
                      color: getSeverityColor(selectedDisease.severity),
                      borderColor: getSeverityColor(selectedDisease.severity) + '40',
                      backgroundColor: getSeverityColor(selectedDisease.severity) + '15',
                    }}
                  >
                    <AlertTriangle className="w-3 h-3" />
                    {SEVERITY_LABELS[selectedDisease.severity]}
                  </span>
                </div>
              </div>
            </div>

            {/* Pathophysiology */}
            <div className="rounded-xl border border-white/10 bg-bg-surface p-6">
              <h3 className="font-heading text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-genesis-magenta" />
                How It Works — Pathophysiology
              </h3>
              <p className="text-text-secondary leading-relaxed">{selectedDisease.pathophysiology}</p>
            </div>

            {/* Affected Systems */}
            <div className="rounded-xl border border-white/10 bg-bg-surface p-6">
              <h3 className="font-heading text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-genesis-cyan" />
                Affected Body Systems
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedDisease.affectedSystems.map((sys) => {
                  const color = getSystemColor(sys.name);
                  return (
                    <div
                      key={sys.name}
                      className="rounded-lg border p-4 transition-all hover:scale-[1.01]"
                      style={{
                        borderColor: color + '30',
                        backgroundColor: color + '08',
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
                        <span className="text-sm font-heading font-semibold" style={{ color }}>
                          {sys.name} System
                        </span>
                      </div>
                      <p className="text-text-secondary text-sm leading-relaxed">{sys.impact}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Progression Timeline */}
            <div className="rounded-xl border border-white/10 bg-bg-surface p-6">
              <h3 className="font-heading text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-genesis-gold" />
                Disease Progression Timeline
              </h3>
              <div className="relative">
                <div className="absolute left-[18px] top-2 bottom-2 w-px bg-gradient-to-b from-genesis-green/40 via-genesis-gold/40 to-genesis-red/40" />
                <div className="space-y-4">
                  {selectedDisease.stages.map((stage, idx) => {
                    const sevColor = getSeverityColor(stage.severity);
                    return (
                      <div key={idx} className="relative pl-12">
                        <div
                          className="absolute left-2.5 top-4 w-4 h-4 rounded-full border-2 z-[1]"
                          style={{
                            borderColor: sevColor,
                            backgroundColor: sevColor + '30',
                            boxShadow: `0 0 8px ${sevColor}40`,
                          }}
                        />
                        <div className="rounded-lg border border-white/10 bg-bg-card p-4 hover:border-white/15 transition-colors">
                          <div className="flex items-center gap-3 mb-1.5">
                            <span className="font-heading font-semibold text-text-primary text-sm">{stage.name}</span>
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider"
                              style={{
                                color: sevColor,
                                backgroundColor: sevColor + '15',
                              }}
                            >
                              {SEVERITY_LABELS[stage.severity]}
                            </span>
                          </div>
                          <p className="text-text-secondary text-sm leading-relaxed">{stage.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Treatments */}
            <div className="rounded-xl border border-white/10 bg-bg-surface p-6">
              <h3 className="font-heading text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Pill className="w-5 h-5 text-genesis-green" />
                Current Treatments
              </h3>
              <div className="space-y-3">
                {selectedDisease.treatments.map((tx) => (
                  <div key={tx.name} className="rounded-lg border border-white/10 bg-bg-card p-4 flex items-start gap-3 hover:border-genesis-green/20 transition-colors">
                    <div className="mt-0.5 p-2 rounded-lg bg-genesis-green/10 text-genesis-green flex-shrink-0">
                      {treatmentTypeIcon(tx.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-heading font-semibold text-text-primary">{tx.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-text-muted capitalize border border-white/5 font-mono">{tx.type}</span>
                      </div>
                      <p className="text-text-secondary text-sm leading-relaxed">{tx.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Research */}
            <div className="rounded-xl border border-genesis-violet/20 bg-bg-surface p-6" style={{ boxShadow: '0 0 30px rgba(153, 69, 255, 0.05)' }}>
              <h3 className="font-heading text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-genesis-violet" />
                Research &amp; Experimental Treatments
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {selectedDisease.research.map((r) => (
                  <div key={r.name} className="rounded-lg border border-genesis-violet/20 bg-genesis-violet/5 p-4 hover:border-genesis-violet/30 transition-colors">
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <span className="text-sm font-heading font-semibold text-text-primary">{r.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-genesis-violet/20 text-genesis-violet font-mono whitespace-nowrap">
                        {r.phase}
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed">{r.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Explore in Lab CTA */}
            <div className="flex justify-center pt-2">
              <Link
                href="/lab"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-genesis-gold/10 border border-genesis-gold/25 text-genesis-gold font-heading font-semibold hover:bg-genesis-gold/20 transition-all"
              >
                <FlaskConical className="w-4 h-4" />
                Explore Treatments in Lab
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* No Results */}
        {searchFailed && !isLoading && (
          <div className="text-center py-16">
            <Microscope className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-50" />
            <h3 className="font-heading text-lg text-text-secondary mb-2">No results found for &quot;{searchQuery}&quot;</h3>
            <p className="text-text-muted mb-6">Try searching for one of the featured conditions below</p>
          </div>
        )}

        {/* Featured Conditions */}
        {!selectedDisease && !isLoading && (
          <div>
            <h2 className="font-heading text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-genesis-magenta" />
              Featured Conditions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURED_CONDITIONS.map((condition) => {
                const Icon = condition.icon;
                const color = getSystemColor(condition.system);
                return (
                  <button
                    key={condition.name}
                    onClick={() => handleFeaturedClick(condition)}
                    className="text-left rounded-xl border border-white/10 bg-bg-surface p-5 hover:border-white/20 transition-all duration-300 group"
                    style={{ boxShadow: '0 0 0px transparent' }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 0 25px ${color}12, 0 0 50px ${color}06`;
                      (e.currentTarget as HTMLElement).style.borderColor = color + '40';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0px transparent';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="p-2.5 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: color + '15' }}
                      >
                        <Icon className="w-5 h-5" style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-semibold text-text-primary text-sm mb-1.5 group-hover:text-white transition-colors">
                          {condition.name}
                        </h3>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full mb-2 inline-block font-mono"
                          style={{
                            color,
                            backgroundColor: color + '15',
                          }}
                        >
                          {condition.system} System
                        </span>
                        <p className="text-text-muted text-xs leading-relaxed mt-1.5">{condition.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-4 text-text-muted group-hover:text-text-secondary text-xs transition-colors">
                      <span>Explore pathology</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
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

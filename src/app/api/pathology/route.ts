import { NextResponse } from 'next/server';

const DEMO_DATA: Record<string, any> = {
  "alzheimer's": {
    name: "Alzheimer's Disease",
    affectedSystems: ['Nervous System', 'Cognitive Function', 'Behavioral Health'],
    pathophysiology: 'Progressive neurodegenerative disorder characterized by accumulation of amyloid-beta plaques and neurofibrillary tangles of hyperphosphorylated tau protein, leading to neuronal death, synaptic loss, and brain atrophy, particularly in the hippocampus and cerebral cortex.',
    stages: [
      { stage: 'Preclinical', description: 'Brain changes begin years before symptoms. Amyloid plaques start forming. No noticeable symptoms.' },
      { stage: 'Mild Cognitive Impairment', description: 'Subtle memory lapses, difficulty finding words, misplacing items. Still functionally independent.' },
      { stage: 'Mild Dementia', description: 'Noticeable memory loss, confusion about time/place, difficulty with complex tasks, personality changes.' },
      { stage: 'Moderate Dementia', description: 'Significant memory gaps, inability to recall personal history, wandering, agitation, need for daily assistance.' },
      { stage: 'Severe Dementia', description: 'Loss of ability to communicate, full dependence on caregivers, loss of motor function, susceptibility to infections.' },
    ],
    currentTreatments: ['Cholinesterase inhibitors (Donepezil, Rivastigmine)', 'NMDA receptor antagonist (Memantine)', 'Anti-amyloid antibodies (Lecanemab, Donanemab)', 'Cognitive behavioral therapy', 'Supportive care and caregiver education'],
    experimentalTreatments: ['Tau-targeting immunotherapies', 'Gene therapy (APOE4 modification)', 'Focused ultrasound blood-brain barrier opening', 'Stem cell transplantation', 'Anti-inflammatory agents (AL002)'],
    severity: 'critical',
  },
  'heart failure': {
    name: 'Heart Failure',
    affectedSystems: ['Cardiovascular System', 'Respiratory System', 'Renal System'],
    pathophysiology: 'The heart becomes unable to pump blood efficiently to meet the body\'s metabolic demands. Neurohormonal activation (RAAS, sympathetic nervous system) initially compensates but eventually leads to fluid overload, ventricular remodeling, and progressive myocardial dysfunction.',
    stages: [
      { stage: 'Stage A (At Risk)', description: 'No structural heart disease or symptoms, but risk factors present (hypertension, diabetes, obesity).' },
      { stage: 'Stage B (Pre-Heart Failure)', description: 'Structural heart disease present but no symptoms. May include reduced ejection fraction or valve disease.' },
      { stage: 'Stage C (Symptomatic)', description: 'Structural heart disease with current or prior symptoms: dyspnea, fatigue, exercise intolerance.' },
      { stage: 'Stage D (Advanced)', description: 'Refractory symptoms at rest despite optimal medical therapy. May require mechanical support or transplant.' },
    ],
    currentTreatments: ['ACE inhibitors / ARBs / ARNI (Sacubitril-Valsartan)', 'Beta-blockers (Carvedilol, Metoprolol)', 'SGLT2 inhibitors (Dapagliflozin, Empagliflozin)', 'Mineralocorticoid antagonists (Spironolactone)', 'Diuretics, cardiac resynchronization therapy, ICD'],
    experimentalTreatments: ['Cardiac gene therapy (SERCA2a)', 'Engineered heart tissue patches', 'Myosin activators (next-gen Omecamtiv)', 'RNA-based therapies', 'Xenotransplantation (porcine hearts)'],
    severity: 'severe',
  },
  diabetes: {
    name: 'Diabetes Mellitus (Type 2)',
    affectedSystems: ['Endocrine System', 'Cardiovascular System', 'Nervous System', 'Renal System'],
    pathophysiology: 'Characterized by insulin resistance and progressive beta-cell dysfunction. Peripheral tissues fail to respond adequately to insulin, leading to hyperglycemia. Chronic elevation of blood glucose causes glycation of proteins, oxidative stress, and microvascular/macrovascular complications.',
    stages: [
      { stage: 'Prediabetes', description: 'Insulin resistance present, fasting glucose 100-125 mg/dL. Reversible with lifestyle changes.' },
      { stage: 'Early Diabetes', description: 'Fasting glucose >126 mg/dL or HbA1c >6.5%. Beta cells compensate but begin declining.' },
      { stage: 'Established Diabetes', description: 'Progressive beta-cell failure, medication escalation needed, early complications may appear.' },
      { stage: 'Advanced Diabetes', description: 'Significant complications: nephropathy, retinopathy, neuropathy, cardiovascular disease. May require insulin.' },
    ],
    currentTreatments: ['Metformin (first-line)', 'SGLT2 inhibitors', 'GLP-1 receptor agonists (Semaglutide)', 'DPP-4 inhibitors', 'Insulin therapy', 'Lifestyle modification'],
    experimentalTreatments: ['Dual GIP/GLP-1 agonists (Tirzepatide)', 'Stem cell-derived islet transplantation', 'Glucokinase activators', 'Smart insulin (glucose-responsive)', 'Immunotherapy for beta-cell preservation'],
    severity: 'moderate',
  },
  'lung cancer': {
    name: 'Lung Cancer (Non-Small Cell)',
    affectedSystems: ['Respiratory System', 'Lymphatic System', 'Immune System'],
    pathophysiology: 'Uncontrolled proliferation of epithelial cells in the lung, driven by oncogenic mutations (EGFR, ALK, KRAS, ROS1). Tumor growth obstructs airways, invades surrounding tissue, and metastasizes via lymphatic and hematogenous routes to brain, bone, liver, and adrenal glands.',
    stages: [
      { stage: 'Stage I', description: 'Localized tumor < 4cm, no lymph node involvement. 5-year survival 68-92%.' },
      { stage: 'Stage II', description: 'Larger tumor or limited lymph node spread. 5-year survival 53-60%.' },
      { stage: 'Stage III', description: 'Extensive regional spread to mediastinal lymph nodes. 5-year survival 13-36%.' },
      { stage: 'Stage IV', description: 'Distant metastasis. 5-year survival 0-10%, though targeted therapies improving outcomes.' },
    ],
    currentTreatments: ['Surgical resection (lobectomy)', 'Platinum-based chemotherapy', 'Immune checkpoint inhibitors (Pembrolizumab, Nivolumab)', 'Targeted therapy (Osimertinib for EGFR, Alectinib for ALK)', 'Radiation therapy (SBRT, proton therapy)'],
    experimentalTreatments: ['Bispecific antibodies', 'CAR-T cell therapy for solid tumors', 'Antibody-drug conjugates (Trastuzumab deruxtecan)', 'Tumor-treating fields', 'Personalized neoantigen vaccines'],
    severity: 'critical',
  },
  arthritis: {
    name: 'Rheumatoid Arthritis',
    affectedSystems: ['Musculoskeletal System', 'Immune System', 'Cardiovascular System'],
    pathophysiology: 'Chronic autoimmune disorder where the immune system attacks synovial membranes, causing inflammation, pannus formation, and progressive destruction of cartilage and bone. Driven by autoreactive T cells, B cells producing rheumatoid factor and anti-CCP antibodies, and pro-inflammatory cytokines (TNF-alpha, IL-6).',
    stages: [
      { stage: 'Stage I (Early)', description: 'Synovial inflammation, joint swelling and stiffness, no cartilage damage on imaging.' },
      { stage: 'Stage II (Moderate)', description: 'Cartilage thinning begins, joint space narrowing visible on X-ray, periarticular osteopenia.' },
      { stage: 'Stage III (Severe)', description: 'Bone erosions, significant cartilage loss, joint deformity developing, muscle atrophy.' },
      { stage: 'Stage IV (Terminal)', description: 'Fibrous or bony ankylosis, severe deformity (ulnar deviation, swan neck), loss of function.' },
    ],
    currentTreatments: ['DMARDs (Methotrexate, Hydroxychloroquine)', 'Biologic agents (Adalimumab, Etanercept, Tocilizumab)', 'JAK inhibitors (Tofacitinib, Baricitinib)', 'Corticosteroids (short-term)', 'Physical therapy and joint protection'],
    experimentalTreatments: ['CAR-T cells targeting autoreactive B cells', 'IL-17 pathway inhibitors', 'Tolerogenic dendritic cell therapy', 'Epigenetic modulators', 'Microbiome-based interventions'],
    severity: 'moderate',
  },
  'kidney disease': {
    name: 'Chronic Kidney Disease',
    affectedSystems: ['Urinary System', 'Cardiovascular System', 'Endocrine System', 'Skeletal System'],
    pathophysiology: 'Progressive loss of nephron function from sustained injury (diabetes, hypertension, glomerulonephritis). Remaining nephrons undergo hyperfiltration, leading to glomerulosclerosis. Declining GFR causes accumulation of uremic toxins, fluid/electrolyte imbalance, metabolic acidosis, and secondary hyperparathyroidism.',
    stages: [
      { stage: 'Stage 1 (GFR >90)', description: 'Normal or high GFR with evidence of kidney damage (proteinuria, hematuria).' },
      { stage: 'Stage 2 (GFR 60-89)', description: 'Mild reduction in GFR. Usually asymptomatic.' },
      { stage: 'Stage 3 (GFR 30-59)', description: 'Moderate reduction. Complications emerge: anemia, bone disease, fatigue.' },
      { stage: 'Stage 4 (GFR 15-29)', description: 'Severe reduction. Preparation for renal replacement therapy.' },
      { stage: 'Stage 5 (GFR <15)', description: 'Kidney failure. Dialysis or transplantation required for survival.' },
    ],
    currentTreatments: ['RAAS blockade (ACE inhibitors / ARBs)', 'SGLT2 inhibitors (Dapagliflozin)', 'Blood pressure control', 'Dietary modification (low sodium, low protein)', 'Dialysis (hemodialysis, peritoneal)', 'Kidney transplantation'],
    experimentalTreatments: ['Bardoxolone methyl (Nrf2 activator)', 'Bioartificial kidneys', 'Xenotransplantation (porcine kidneys)', 'Anti-fibrotic agents (Pirfenidone for kidneys)', 'Stem cell-derived nephron regeneration'],
    severity: 'severe',
  },
};

const GENERIC_DEMO = {
  name: 'Unknown Condition',
  affectedSystems: ['Multiple Systems'],
  pathophysiology: 'Detailed pathophysiology requires AI analysis. Enable the OpenAI API key to analyze any disease or condition in real-time.',
  stages: [
    { stage: 'Early', description: 'Initial onset of symptoms and early tissue changes.' },
    { stage: 'Progressive', description: 'Condition advances with increasing symptom burden.' },
    { stage: 'Advanced', description: 'Significant organ or system involvement.' },
  ],
  currentTreatments: ['Consult with healthcare provider for current treatment options'],
  experimentalTreatments: ['Research ongoing — enable AI for real-time analysis'],
  severity: 'moderate' as const,
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim().toLowerCase();

  if (!q) {
    return NextResponse.json({ error: 'Missing query parameter: q' }, { status: 400 });
  }

  /* ── Try GPT-4o ───────────────────────────────── */
  if (process.env.OPENAI_API_KEY) {
    try {
      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const res = await openai.chat.completions.create({
        model: 'gpt-4o',
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You are a medical pathology AI. Given a disease or condition, provide: name, affectedSystems (array), pathophysiology, stages (array of {stage, description}), currentTreatments (array), experimentalTreatments (array), severity (mild/moderate/severe/critical). Return JSON.',
          },
          { role: 'user', content: q },
        ],
      });

      const data = JSON.parse(res.choices[0].message.content || '{}');
      return NextResponse.json(data);
    } catch (err: any) {
      console.error('Pathology AI error:', err.message);
    }
  }

  /* ── Demo fallback ────────────────────────────── */
  const match = Object.keys(DEMO_DATA).find((k) => q.includes(k) || k.includes(q));
  const data = match ? DEMO_DATA[match] : { ...GENERIC_DEMO, name: q.charAt(0).toUpperCase() + q.slice(1) };
  return NextResponse.json(data);
}

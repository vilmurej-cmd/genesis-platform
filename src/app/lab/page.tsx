'use client';

import { useState, useEffect, useCallback } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

interface Pharmaceutical {
  name: string;
  class: string;
  mechanism: string;
  uses: string[];
  route: string;
}

interface NaturalCompound {
  name: string;
  category: string;
  mechanism: string;
  uses: string[];
  evidenceRating: number;
}

interface FrequencyCompound {
  frequency: number;
  name: string;
  description: string;
  evidenceRating: number;
}

interface ExperimentalCompound {
  name: string;
  mechanism: string;
  researchStatus: string;
  evidenceRating: number;
}

type AnyCompound = Pharmaceutical | NaturalCompound | FrequencyCompound | ExperimentalCompound;

interface CraftingSlot {
  compound: AnyCompound;
  type: 'pharmaceutical' | 'natural' | 'frequency' | 'experimental';
  dosage: 'low' | 'standard' | 'high';
}

interface Disease {
  name: string;
  systems: string[];
  description: string;
  color: string;
}

interface TimelineEntry {
  day: string;
  effect: string;
}

interface SideEffect {
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
}

interface SimulationResult {
  overallScore: number;
  mechanismExplanation: string;
  timeline: TimelineEntry[];
  sideEffects: SideEffect[];
  interactions: string[];
  aiHint: string;
}

interface MastermindAttempt {
  id: number;
  compounds: { name: string; color: 'green' | 'yellow' | 'red' | 'white' }[];
  score: number;
  timestamp: number;
}

interface DiscoveryCard {
  compoundName: string;
  currentUse: string;
  theoreticalMechanism: string;
  molecularBasis: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════════════ */

const DISEASES: Disease[] = [
  { name: 'Asthma', systems: ['Respiratory'], description: 'Chronic inflammatory disease of the airways causing reversible airflow obstruction and bronchospasm', color: '#66CCFF' },
  { name: 'Type 2 Diabetes', systems: ['Endocrine', 'Cardiovascular'], description: 'Metabolic disorder characterized by insulin resistance and relative insulin deficiency', color: '#9945FF' },
  { name: 'Breast Cancer', systems: ['Reproductive', 'Lymphatic'], description: 'Malignant neoplasm originating in breast tissue, often hormone-receptor positive', color: '#FF66B2' },
  { name: "Alzheimer's Disease", systems: ['Nervous'], description: 'Progressive neurodegenerative disorder causing memory loss and cognitive decline through amyloid plaque accumulation', color: '#FFD700' },
  { name: 'Childhood ALL', systems: ['Lymphatic', 'Cardiovascular'], description: 'Acute lymphoblastic leukemia — the most common childhood cancer, affecting B or T lymphocyte precursors in bone marrow', color: '#00FF94' },
  { name: 'Heart Attack', systems: ['Cardiovascular'], description: 'Myocardial infarction caused by coronary artery occlusion leading to ischemic death of heart muscle tissue', color: '#FF3366' },
];

const PHARMACEUTICALS: Pharmaceutical[] = [
  { name: 'Albuterol', class: 'Bronchodilator', mechanism: 'Selectively stimulates beta-2 adrenergic receptors in bronchial smooth muscle, causing rapid relaxation and airway dilation', uses: ['Asthma', 'COPD', 'Exercise-induced bronchospasm'], route: 'Inhaled' },
  { name: 'Metformin', class: 'Antidiabetic (Biguanide)', mechanism: 'Decreases hepatic glucose production and increases insulin sensitivity in peripheral tissues by activating AMP-activated protein kinase', uses: ['Type 2 Diabetes', 'PCOS', 'Insulin resistance'], route: 'Oral' },
  { name: 'Tamoxifen', class: 'Anti-estrogen (SERM)', mechanism: 'Competitively binds estrogen receptors in breast tissue, blocking estrogen-driven tumor proliferation while acting as partial agonist elsewhere', uses: ['Breast Cancer', 'ER+ tumors', 'Chemoprevention'], route: 'Oral' },
  { name: 'Donepezil', class: 'Cholinesterase Inhibitor', mechanism: 'Reversibly inhibits acetylcholinesterase, increasing acetylcholine concentration at cholinergic synapses to compensate for neuronal loss', uses: ["Alzheimer's Disease", 'Dementia', 'Cognitive decline'], route: 'Oral' },
  { name: 'Aspirin', class: 'Antiplatelet / NSAID', mechanism: 'Irreversibly inhibits cyclooxygenase-1, preventing thromboxane A2 synthesis and platelet aggregation', uses: ['Heart Attack prevention', 'Stroke prevention', 'Pain', 'Inflammation'], route: 'Oral' },
  { name: 'Methotrexate', class: 'Antimetabolite', mechanism: 'Inhibits dihydrofolate reductase, blocking folic acid metabolism essential for DNA synthesis in rapidly dividing cancer cells', uses: ['Childhood ALL', 'Breast Cancer', 'Rheumatoid Arthritis'], route: 'Oral / IV / Intrathecal' },
  { name: 'Vincristine', class: 'Vinca Alkaloid', mechanism: 'Binds tubulin dimers and prevents microtubule polymerization, arresting mitosis at metaphase in dividing cancer cells', uses: ['Childhood ALL', 'Lymphomas', 'Solid tumors'], route: 'IV' },
  { name: 'Prednisone', class: 'Corticosteroid', mechanism: 'Binds glucocorticoid receptors to suppress inflammatory gene transcription, induce lymphocyte apoptosis, and reduce immune response', uses: ['Childhood ALL', 'Asthma exacerbations', 'Autoimmune disorders'], route: 'Oral' },
  { name: 'L-Asparaginase', class: 'Enzyme Therapy', mechanism: 'Depletes circulating asparagine, starving ALL blast cells that lack asparagine synthetase and cannot produce their own', uses: ['Childhood ALL', 'Acute lymphoblastic leukemia'], route: 'IM / IV' },
  { name: 'Cisplatin', class: 'Alkylating Agent', mechanism: 'Forms platinum-DNA adducts that cross-link DNA strands, preventing replication and triggering apoptosis in cancer cells', uses: ['Breast Cancer', 'Ovarian Cancer', 'Lung Cancer', 'Testicular Cancer'], route: 'IV' },
  { name: 'Lisinopril', class: 'ACE Inhibitor', mechanism: 'Inhibits angiotensin-converting enzyme, reducing angiotensin II levels to lower blood pressure and decrease cardiac afterload', uses: ['Heart Attack recovery', 'Hypertension', 'Heart Failure'], route: 'Oral' },
  { name: 'Atorvastatin', class: 'Statin', mechanism: 'Competitively inhibits HMG-CoA reductase, reducing hepatic cholesterol synthesis and upregulating LDL receptor expression', uses: ['Heart Attack prevention', 'Hyperlipidemia', 'Atherosclerosis'], route: 'Oral' },
  { name: 'Ibuprofen', class: 'NSAID', mechanism: 'Reversibly inhibits COX-1 and COX-2 enzymes, reducing prostaglandin synthesis to decrease pain, fever, and inflammation', uses: ['Pain', 'Inflammation', 'Fever', 'Arthritis'], route: 'Oral' },
  { name: 'Morphine', class: 'Opioid Analgesic', mechanism: 'Binds mu-opioid receptors in CNS and peripheral nervous system, inhibiting pain signal transmission and altering pain perception', uses: ['Severe pain', 'Heart Attack pain', 'Post-surgical pain'], route: 'Oral / IV / IM' },
  { name: 'Levothyroxine', class: 'Thyroid Hormone', mechanism: 'Synthetic T4 that converts to active T3, restoring normal metabolic rate by binding nuclear thyroid receptors', uses: ['Hypothyroidism', 'Thyroid cancer suppression', 'Myxedema'], route: 'Oral' },
];

const NATURALS: NaturalCompound[] = [
  { name: 'Turmeric / Curcumin', category: 'Anti-inflammatory', mechanism: 'Inhibits NF-kB signaling and COX-2 expression, reducing systemic inflammation and oxidative stress', uses: ['Inflammation', 'Joint pain', 'Cancer adjunct'], evidenceRating: 4 },
  { name: 'Omega-3 Fatty Acids', category: 'Essential Fatty Acid', mechanism: 'Competes with arachidonic acid to produce anti-inflammatory eicosanoids, reduces triglycerides and stabilizes cardiac membranes', uses: ['Heart health', 'Inflammation', 'Brain function'], evidenceRating: 5 },
  { name: 'Vitamin D', category: 'Vitamin / Hormone', mechanism: 'Binds VDR nuclear receptors to modulate immune function, calcium absorption, and gene expression in over 200 genes', uses: ['Immune support', 'Bone health', 'Cancer prevention'], evidenceRating: 5 },
  { name: 'Zinc', category: 'Essential Mineral', mechanism: 'Cofactor for 300+ enzymes, supports T-cell development and natural killer cell activity, essential for DNA synthesis', uses: ['Immune function', 'Wound healing', 'Growth'], evidenceRating: 4 },
  { name: 'Ashwagandha', category: 'Adaptogen', mechanism: 'Withanolides modulate cortisol response, GABAergic signaling, and hypothalamic-pituitary-adrenal axis to reduce stress', uses: ['Stress', 'Anxiety', 'Fatigue', 'Cognitive function'], evidenceRating: 3 },
  { name: "Lion's Mane", category: 'Medicinal Mushroom', mechanism: 'Hericenones and erinacines stimulate nerve growth factor (NGF) synthesis, promoting neuronal growth and myelination', uses: ['Cognitive decline', 'Nerve regeneration', 'Neuroprotection'], evidenceRating: 3 },
  { name: 'Turkey Tail', category: 'Medicinal Mushroom', mechanism: 'Polysaccharopeptide PSK activates dendritic cells and enhances cytotoxic T-cell response against tumor cells', uses: ['Cancer adjunct', 'Immune modulation', 'Gut health'], evidenceRating: 4 },
  { name: 'Green Tea (EGCG)', category: 'Polyphenol', mechanism: 'Epigallocatechin gallate inhibits VEGF-mediated angiogenesis and induces apoptosis in cancer cells through multiple pathways', uses: ['Cancer prevention', 'Metabolism', 'Antioxidant'], evidenceRating: 4 },
  { name: 'Ginger', category: 'Anti-inflammatory', mechanism: 'Gingerols and shogaols inhibit prostaglandin synthesis and suppress pro-inflammatory cytokines TNF-alpha and IL-6', uses: ['Nausea', 'Inflammation', 'Digestion'], evidenceRating: 4 },
  { name: 'Echinacea', category: 'Immunostimulant', mechanism: 'Alkylamides activate macrophages and increase phagocytic activity, polysaccharides stimulate innate immune response', uses: ['Cold/flu prevention', 'Upper respiratory infections'], evidenceRating: 3 },
  { name: 'Probiotics', category: 'Microbiome', mechanism: 'Live beneficial bacteria colonize gut, competing with pathogens, producing short-chain fatty acids, and modulating immune response', uses: ['Gut health', 'Immune support', 'Mental health'], evidenceRating: 4 },
  { name: 'Magnesium', category: 'Essential Mineral', mechanism: 'Cofactor in ATP production, muscle relaxation, and neurotransmitter regulation; blocks NMDA receptor to prevent excitotoxicity', uses: ['Muscle function', 'Heart rhythm', 'Sleep', 'Anxiety'], evidenceRating: 5 },
];

const FREQUENCIES: FrequencyCompound[] = [
  { frequency: 174, name: '174 Hz — Foundation', description: 'Associated with pain reduction and stress relief. Considered the foundation of the Solfeggio scale.', evidenceRating: 1 },
  { frequency: 285, name: '285 Hz — Cellular', description: 'Linked to cellular repair and tissue healing. Said to influence the body\'s energy field.', evidenceRating: 1 },
  { frequency: 396, name: '396 Hz — Liberation', description: 'Associated with releasing guilt and fear. Relates to the root chakra in traditional systems.', evidenceRating: 1 },
  { frequency: 417, name: '417 Hz — Change', description: 'Linked to facilitating change and undoing negative situations. Said to cleanse traumatic experiences.', evidenceRating: 1 },
  { frequency: 432, name: '432 Hz — Cosmic', description: 'The "cosmic frequency" — mathematical harmony with universal constants. Some studies show reduced anxiety vs 440 Hz.', evidenceRating: 2 },
  { frequency: 528, name: '528 Hz — Repair', description: 'The "Love Frequency" — linked to DNA repair in vitro studies. Research shows reduced cortisol and increased oxytocin.', evidenceRating: 2 },
  { frequency: 639, name: '639 Hz — Connection', description: 'Associated with harmonizing relationships and enhancing communication. Linked to the heart chakra.', evidenceRating: 1 },
  { frequency: 741, name: '741 Hz — Expression', description: 'Linked to problem-solving, self-expression, and cleansing cells of electromagnetic radiation.', evidenceRating: 1 },
  { frequency: 852, name: '852 Hz — Intuition', description: 'Associated with awakening intuition and returning to spiritual order. Linked to the third-eye chakra.', evidenceRating: 1 },
  { frequency: 963, name: '963 Hz — Crown', description: 'The frequency of divine consciousness and enlightenment. Associated with pineal gland activation.', evidenceRating: 1 },
  { frequency: 10, name: 'Alpha Binaural (8-12 Hz)', description: 'Induces relaxed, calm alertness. Used for meditation, stress reduction, and creative visualization.', evidenceRating: 3 },
  { frequency: 20, name: 'Beta Binaural (12-30 Hz)', description: 'Promotes focused concentration and active thinking. Used for studying and task performance.', evidenceRating: 3 },
  { frequency: 5, name: 'Theta Binaural (4-8 Hz)', description: 'Deep meditation and REM sleep state. Associated with memory consolidation and emotional processing.', evidenceRating: 3 },
  { frequency: 2, name: 'Delta Binaural (0.5-4 Hz)', description: 'Deep dreamless sleep and healing. Promotes HGH release and cellular regeneration.', evidenceRating: 3 },
  { frequency: 40, name: 'Gamma Binaural (30-100 Hz)', description: 'Higher cognitive processing, peak awareness. 40 Hz gamma shown to reduce amyloid plaques in Alzheimer\'s mouse models.', evidenceRating: 4 },
];

const EXPERIMENTALS: ExperimentalCompound[] = [
  { name: 'CRISPR Gene Editing', mechanism: 'Cas9 nuclease guided by sgRNA precisely cuts and edits disease-causing DNA sequences, enabling permanent genetic correction', researchStatus: 'Phase I/II clinical trials for sickle cell, beta-thalassemia. FDA approved Casgevy (2023)', evidenceRating: 5 },
  { name: 'CAR-T Cell Therapy', mechanism: 'Patient T-cells are genetically engineered to express chimeric antigen receptors targeting specific tumor antigens', researchStatus: 'FDA approved for ALL, DLBCL. Active trials for solid tumors. Complete remission rates 70-90% in ALL', evidenceRating: 5 },
  { name: 'mRNA Therapeutics', mechanism: 'Synthetic mRNA instructs cells to produce therapeutic proteins, tumor antigens for immune training, or missing enzymes', researchStatus: 'Approved for COVID vaccines. Phase II for cancer vaccines, rare diseases, and heart failure', evidenceRating: 4 },
  { name: 'Psilocybin-Assisted Therapy', mechanism: 'Psilocin activates 5-HT2A serotonin receptors, inducing neuroplasticity and disrupting default mode network rigid patterns', researchStatus: 'FDA Breakthrough Therapy for depression. Phase II for PTSD, addiction, end-of-life anxiety', evidenceRating: 3 },
  { name: 'Hyperbaric Oxygen Therapy', mechanism: 'Breathing pure oxygen at 2-3 ATM pressure saturates plasma with dissolved O2, promoting angiogenesis and stem cell mobilization', researchStatus: 'FDA approved for 14 conditions. Research ongoing for TBI, stroke recovery, anti-aging', evidenceRating: 4 },
];

/* ── Effectiveness mappings (compound name → disease → color) ── */
const EFFECTIVENESS_MAP: Record<string, Record<string, 'green' | 'yellow' | 'red'>> = {
  'Albuterol': { 'Asthma': 'green' },
  'Metformin': { 'Type 2 Diabetes': 'green' },
  'Tamoxifen': { 'Breast Cancer': 'green' },
  'Donepezil': { "Alzheimer's Disease": 'yellow' },
  'Aspirin': { 'Heart Attack': 'green', 'Breast Cancer': 'yellow' },
  'Methotrexate': { 'Childhood ALL': 'green', 'Breast Cancer': 'yellow' },
  'Vincristine': { 'Childhood ALL': 'green' },
  'Prednisone': { 'Childhood ALL': 'green', 'Asthma': 'green' },
  'L-Asparaginase': { 'Childhood ALL': 'green' },
  'Cisplatin': { 'Breast Cancer': 'yellow' },
  'Lisinopril': { 'Heart Attack': 'green', 'Type 2 Diabetes': 'yellow' },
  'Atorvastatin': { 'Heart Attack': 'green', 'Type 2 Diabetes': 'yellow' },
  'Ibuprofen': { 'Asthma': 'red' },
  'Morphine': { 'Heart Attack': 'yellow' },
  'Levothyroxine': {},
  'Turmeric / Curcumin': { 'Breast Cancer': 'yellow', "Alzheimer's Disease": 'yellow', 'Type 2 Diabetes': 'yellow' },
  'Omega-3 Fatty Acids': { 'Heart Attack': 'yellow', 'Type 2 Diabetes': 'yellow', "Alzheimer's Disease": 'yellow' },
  'Vitamin D': { 'Breast Cancer': 'yellow', 'Type 2 Diabetes': 'yellow', 'Childhood ALL': 'yellow' },
  'Zinc': { 'Childhood ALL': 'yellow' },
  'Ashwagandha': {},
  "Lion's Mane": { "Alzheimer's Disease": 'yellow' },
  'Turkey Tail': { 'Breast Cancer': 'yellow', 'Childhood ALL': 'yellow' },
  'Green Tea (EGCG)': { 'Breast Cancer': 'yellow', 'Type 2 Diabetes': 'yellow' },
  'Ginger': { 'Type 2 Diabetes': 'yellow' },
  'Echinacea': {},
  'Probiotics': { 'Type 2 Diabetes': 'yellow' },
  'Magnesium': { 'Heart Attack': 'yellow', 'Type 2 Diabetes': 'yellow', 'Asthma': 'yellow' },
  'CRISPR Gene Editing': { 'Childhood ALL': 'yellow', 'Breast Cancer': 'yellow' },
  'CAR-T Cell Therapy': { 'Childhood ALL': 'green', 'Breast Cancer': 'yellow' },
  'mRNA Therapeutics': { 'Breast Cancer': 'yellow' },
  'Psilocybin-Assisted Therapy': { "Alzheimer's Disease": 'yellow' },
  'Hyperbaric Oxygen Therapy': { 'Heart Attack': 'yellow', "Alzheimer's Disease": 'yellow' },
};

/* ── Fallback simulation data ── */
const FALLBACK_SIMULATIONS: Record<string, Record<string, { score: number; mechanism: string; timeline: TimelineEntry[]; sideEffects: SideEffect[]; interactions: string[]; aiHint: string }>> = {
  'Asthma': {
    'Albuterol': {
      score: 85,
      mechanism: 'Albuterol activates beta-2 adrenergic receptors on bronchial smooth muscle cells. This triggers adenylyl cyclase, increasing cAMP levels, which activates protein kinase A. PKA phosphorylates myosin light chain kinase, causing smooth muscle relaxation within 5-15 minutes. Bronchodilation increases airflow by 15-30%, reducing wheezing and dyspnea.',
      timeline: [
        { day: 'Day 1', effect: 'Rapid bronchodilation within 5-15 minutes of inhalation. Peak effect at 30-60 minutes. FEV1 improvement of 12-15%.' },
        { day: 'Day 7', effect: 'Consistent rescue relief. Airway responsiveness stable. If using 3+ times/week, consider controller therapy addition.' },
        { day: 'Day 30', effect: 'Effective as-needed rescue. Tolerance minimal at standard doses. If frequency increasing, underlying inflammation may be worsening.' },
      ],
      sideEffects: [
        { name: 'Tremor', severity: 'mild' },
        { name: 'Tachycardia', severity: 'mild' },
        { name: 'Nervousness', severity: 'mild' },
      ],
      interactions: ['Beta-blockers may reduce effectiveness', 'MAO inhibitors may potentiate cardiovascular effects'],
      aiHint: 'Try adding Prednisone for acute exacerbation control, or explore Magnesium as an adjunct bronchodilator.',
    },
  },
  'Breast Cancer': {
    'Tamoxifen': {
      score: 72,
      mechanism: 'Tamoxifen competitively binds estrogen receptor alpha in breast tissue, blocking estradiol-driven transcription of proliferative genes (cyclin D1, c-myc). Acts as a SERM — antagonist in breast but partial agonist in bone and endometrium. Reduces recurrence risk by 40-50% in ER+ tumors over 5 years.',
      timeline: [
        { day: 'Day 1', effect: 'ER binding begins within hours. No clinical effect yet. Steady-state plasma levels require 4-6 weeks.' },
        { day: 'Day 7', effect: 'Tumor cell proliferation markers (Ki-67) begin declining. Hot flashes and mild nausea may start.' },
        { day: 'Day 30', effect: 'Measurable tumor growth suppression. ER blockade near-complete. Side effects stabilizing. Full benefit requires 5-10 years of therapy.' },
      ],
      sideEffects: [
        { name: 'Hot flashes', severity: 'moderate' },
        { name: 'Nausea', severity: 'mild' },
        { name: 'Endometrial thickening', severity: 'moderate' },
        { name: 'Thromboembolism risk', severity: 'severe' },
      ],
      interactions: ['CYP2D6 inhibitors (fluoxetine, paroxetine) reduce conversion to active endoxifen', 'Warfarin interaction — monitor INR closely'],
      aiHint: 'Consider adding Turkey Tail mushroom (PSK) as adjunct immunotherapy — shown to improve survival in Japanese breast cancer trials.',
    },
  },
  'Type 2 Diabetes': {
    'Metformin': {
      score: 78,
      mechanism: 'Metformin activates AMP-activated protein kinase (AMPK) in hepatocytes, suppressing gluconeogenesis and reducing hepatic glucose output by 25-30%. Increases peripheral glucose uptake by enhancing GLUT4 translocation. Also modifies gut microbiome composition favorably and reduces intestinal glucose absorption.',
      timeline: [
        { day: 'Day 1', effect: 'Hepatic glucose output begins decreasing. Blood glucose may drop 10-20 mg/dL. GI side effects common initially.' },
        { day: 'Day 7', effect: 'Fasting glucose improving. GI adaptation underway. AMPK activation increasing insulin sensitivity in muscle tissue.' },
        { day: 'Day 30', effect: 'HbA1c reduction of 1-1.5% expected over 3 months. Weight-neutral or slight loss. Cardiovascular risk reduction emerging.' },
      ],
      sideEffects: [
        { name: 'GI distress (diarrhea, nausea)', severity: 'moderate' },
        { name: 'Metallic taste', severity: 'mild' },
        { name: 'B12 malabsorption (long-term)', severity: 'mild' },
      ],
      interactions: ['Contrast dye — hold 48 hours before/after (lactic acidosis risk)', 'Alcohol increases lactic acidosis risk'],
      aiHint: 'Add Omega-3 for cardiovascular protection, or explore Turmeric/Curcumin for additional insulin sensitization via PPAR-gamma activation.',
    },
  },
  "Alzheimer's Disease": {
    'Donepezil': {
      score: 45,
      mechanism: 'Donepezil reversibly inhibits acetylcholinesterase in the synaptic cleft, increasing acetylcholine availability by 30-50% at cholinergic synapses. This partially compensates for the loss of cholinergic neurons in the nucleus basalis of Meynert. Effect is symptomatic — does not modify disease progression or amyloid/tau pathology.',
      timeline: [
        { day: 'Day 1', effect: 'AChE inhibition begins. No cognitive effect yet. May cause nausea as peripheral cholinergic activity increases.' },
        { day: 'Day 7', effect: 'Steady-state levels approaching. Some patients show improved attention. GI side effects may peak.' },
        { day: 'Day 30', effect: 'Cognitive scores (MMSE) may improve 1-3 points. Effects modest and temporary — slows decline for 6-12 months on average.' },
      ],
      sideEffects: [
        { name: 'Nausea/vomiting', severity: 'moderate' },
        { name: 'Diarrhea', severity: 'mild' },
        { name: 'Insomnia', severity: 'mild' },
        { name: 'Bradycardia', severity: 'moderate' },
      ],
      interactions: ['Anticholinergic drugs directly oppose mechanism', 'Beta-blockers may potentiate bradycardia'],
      aiHint: 'Explore Lion\'s Mane mushroom for NGF stimulation, or try 40 Hz Gamma Binaural beats — shown to reduce amyloid plaques in preclinical models.',
    },
  },
  'Childhood ALL': {
    'Methotrexate': {
      score: 70,
      mechanism: 'Methotrexate inhibits dihydrofolate reductase, blocking conversion of dihydrofolate to tetrahydrofolate. This depletes reduced folate pools needed for thymidylate and purine synthesis, arresting DNA replication in rapidly dividing ALL blast cells during S-phase.',
      timeline: [
        { day: 'Day 1', effect: 'DHFR inhibition begins. Blast cell division slowing. Leucovorin rescue may be needed 24-42 hours after high-dose.' },
        { day: 'Day 7', effect: 'Significant blast count reduction. Mucositis risk highest. Bone marrow suppression emerging.' },
        { day: 'Day 30', effect: 'Combined with other agents, blast clearance progressing. CNS prophylaxis via intrathecal MTX preventing meningeal leukemia.' },
      ],
      sideEffects: [
        { name: 'Mucositis', severity: 'severe' },
        { name: 'Myelosuppression', severity: 'severe' },
        { name: 'Hepatotoxicity', severity: 'moderate' },
        { name: 'Nausea', severity: 'moderate' },
      ],
      interactions: ['NSAIDs decrease renal clearance — toxic levels', 'Trimethoprim-sulfamethoxazole increases bone marrow suppression'],
      aiHint: 'The gold-standard ALL induction is Methotrexate + Vincristine + Prednisone + L-Asparaginase (the "4-drug induction"). Add all four for optimal results.',
    },
  },
  'Heart Attack': {
    'Aspirin': {
      score: 70,
      mechanism: 'Aspirin irreversibly acetylates COX-1 in platelets (which lack nuclei and cannot resynthesize the enzyme). This permanently blocks thromboxane A2 production for the platelet\'s 7-10 day lifespan, preventing platelet aggregation at the ruptured coronary plaque.',
      timeline: [
        { day: 'Day 1', effect: 'Chewed 325mg provides antiplatelet effect within 15 minutes. Reduces re-occlusion risk by 25%. Critical in first hours of MI.' },
        { day: 'Day 7', effect: 'Daily 81mg maintaining platelet inhibition. Combined with other anticoagulants in dual antiplatelet therapy.' },
        { day: 'Day 30', effect: '23% reduction in vascular death at 5 weeks (ISIS-2 trial). Indefinite therapy recommended for secondary prevention.' },
      ],
      sideEffects: [
        { name: 'GI bleeding risk', severity: 'moderate' },
        { name: 'Bruising', severity: 'mild' },
        { name: 'Tinnitus (high dose)', severity: 'mild' },
      ],
      interactions: ['Warfarin — additive bleeding risk', 'Ibuprofen blocks aspirin from binding COX-1 if taken first'],
      aiHint: 'Add Lisinopril (ACE inhibitor) + Atorvastatin (statin) for comprehensive post-MI secondary prevention — the "triple therapy" standard of care.',
    },
  },
};

/* ── Discovery fallback data ── */
const DISCOVERY_DATA: Record<string, DiscoveryCard[]> = {
  'Asthma': [
    { compoundName: 'Curcumin', currentUse: 'Anti-inflammatory supplement', theoreticalMechanism: 'May inhibit NF-kB-driven airway inflammation and reduce eosinophilic infiltration in bronchial tissue', molecularBasis: 'Curcumin blocks IkB kinase phosphorylation, preventing NF-kB nuclear translocation. In vitro studies show 40% reduction in IL-5 and IL-13 from bronchial epithelial cells.' },
    { compoundName: '432 Hz Acoustic Therapy', currentUse: 'Relaxation and meditation', theoreticalMechanism: 'Vagal nerve stimulation through specific sound frequencies may reduce parasympathetic-mediated bronchospasm', molecularBasis: 'Preliminary data suggests 432 Hz resonance patterns increase heart rate variability (HRV), a marker of vagal tone. Improved vagal regulation correlates with reduced airway hyperresponsiveness.' },
  ],
  'Type 2 Diabetes': [
    { compoundName: 'Berberine', currentUse: 'Traditional Chinese medicine', theoreticalMechanism: 'Activates AMPK similarly to metformin, may have comparable glucose-lowering effects with different side effect profile', molecularBasis: 'Berberine activates AMPK via LKB1 pathway (same as metformin) and also inhibits mitochondrial complex I. Meta-analysis of 14 RCTs showed HbA1c reduction of 0.9% — comparable to metformin.' },
    { compoundName: 'Gamma Binaural Beats (40 Hz)', currentUse: 'Cognitive enhancement', theoreticalMechanism: 'Hypothalamic entrainment via 40 Hz stimulation may improve insulin secretion timing and circadian glucose regulation', molecularBasis: 'Pancreatic beta-cell insulin secretion follows circadian rhythms regulated by hypothalamic suprachiasmatic nucleus. Gamma entrainment may improve SCN clock gene expression (BMAL1, CLOCK).' },
  ],
  'Breast Cancer': [
    { compoundName: 'Turkey Tail (PSK)', currentUse: 'Immune supplement, approved cancer adjunct in Japan', theoreticalMechanism: 'Polysaccharide-K may restore anti-tumor immune surveillance suppressed by tumor microenvironment', molecularBasis: 'PSK activates TLR2 on dendritic cells, promoting cross-presentation of tumor antigens to CD8+ T cells. Phase III trials in Japan showed 10% improvement in 5-year survival for stage II/III breast cancer.' },
    { compoundName: 'Vitamin D3', currentUse: 'Bone health supplement', theoreticalMechanism: 'VDR activation in mammary tissue may induce cell differentiation and apoptosis in pre-malignant cells', molecularBasis: 'Vitamin D receptor is expressed in 80%+ of breast cancers. Calcitriol (active D3) induces p21/p27 cell cycle arrest and BAX-mediated apoptosis. VITAL trial: 25% reduction in cancer mortality with D3 supplementation.' },
  ],
  "Alzheimer's Disease": [
    { compoundName: '40 Hz Gamma Entrainment', currentUse: 'Experimental neuroscience', theoreticalMechanism: 'Gamma oscillation entrainment activates microglia to clear amyloid-beta plaques through enhanced phagocytosis', molecularBasis: 'MIT Tsai Lab (2016-2024): 40 Hz light + sound flicker reduced amyloid plaques by 60% and tau by 50% in mouse models. Phase I human trial showed safety and slowed brain atrophy. Mechanism: gamma oscillations activate microglial NF-kB pathway for plaque clearance.' },
    { compoundName: "Lion's Mane Mushroom", currentUse: 'Cognitive health supplement', theoreticalMechanism: 'Hericenone-stimulated NGF production may promote cholinergic neuron survival and synaptic regeneration', molecularBasis: 'Hericenones cross BBB and stimulate astrocyte NGF secretion. 2020 RCT: 16 weeks of Lion\'s Mane improved MMSE scores by 2.3 points vs placebo in mild cognitive impairment. Erinacine A promotes hippocampal neurogenesis.' },
  ],
  'Childhood ALL': [
    { compoundName: 'CAR-T Cell Therapy', currentUse: 'FDA-approved for relapsed/refractory ALL', theoreticalMechanism: 'CD19-targeted CAR-T cells hunt and destroy residual leukemic blasts that survive conventional chemotherapy', molecularBasis: 'Tisagenlecleucel (Kymriah): 82% complete remission rate in pediatric relapsed/refractory ALL. CAR-T cells persist as "living drug" providing long-term immunosurveillance. Major advance for chemotherapy-resistant disease.' },
    { compoundName: 'Probiotics (L. rhamnosus GG)', currentUse: 'Digestive health', theoreticalMechanism: 'Gut microbiome restoration during chemotherapy may reduce febrile neutropenia episodes and improve treatment tolerance', molecularBasis: 'Chemotherapy disrupts intestinal barrier and microbiome diversity. L. rhamnosus GG strengthens tight junctions and reduces bacterial translocation. Pilot study: 30% reduction in febrile neutropenia episodes during ALL induction chemotherapy.' },
  ],
  'Heart Attack': [
    { compoundName: 'Omega-3 (EPA)', currentUse: 'Cardiovascular supplement', theoreticalMechanism: 'High-dose EPA may stabilize vulnerable coronary plaques and reduce residual inflammatory cardiovascular risk', molecularBasis: 'REDUCE-IT trial: Icosapent ethyl (4g EPA) reduced cardiovascular events by 25% beyond statin therapy. Mechanism: EPA incorporates into plaque membrane phospholipids, reducing plaque lipid oxidation and macrophage infiltration.' },
    { compoundName: 'Magnesium IV', currentUse: 'Electrolyte replacement', theoreticalMechanism: 'IV magnesium during acute MI may reduce reperfusion injury and fatal arrhythmias through calcium channel antagonism', molecularBasis: 'Magnesium blocks L-type calcium channels, reducing calcium overload during ischemia-reperfusion. Acts as natural calcium channel blocker and anti-arrhythmic. LIMIT-2 trial showed 24% mortality reduction (though MAGIC trial was inconclusive).' },
  ],
};

/* ═══════════════════════════════════════════════════════════════════════════
   HELPER FUNCTIONS
   ═══════════════════════════════════════════════════════════════════════════ */

function getCompoundName(compound: AnyCompound): string {
  if ('frequency' in compound) return compound.name;
  return compound.name;
}

function getCompoundType(compound: AnyCompound): 'pharmaceutical' | 'natural' | 'frequency' | 'experimental' {
  if ('route' in compound) return 'pharmaceutical';
  if ('category' in compound) return 'natural';
  if ('frequency' in compound) return 'frequency';
  return 'experimental';
}

function getTypeIcon(type: string): string {
  switch (type) {
    case 'pharmaceutical': return '\u{1F48A}';
    case 'natural': return '\u{1F33F}';
    case 'frequency': return '\u{1F50A}';
    case 'experimental': return '\u{1F9EA}';
    default: return '\u{2728}';
  }
}

function getTypeColor(type: string): string {
  switch (type) {
    case 'pharmaceutical': return '#00E5FF';
    case 'natural': return '#00FF94';
    case 'frequency': return '#9945FF';
    case 'experimental': return '#FFD700';
    default: return '#E8F0FF';
  }
}

function getMechanism(compound: AnyCompound): string {
  if ('frequency' in compound) return compound.description;
  return compound.mechanism;
}

function getEffectivenessColor(compoundName: string, disease: string): 'green' | 'yellow' | 'red' | 'white' {
  const map = EFFECTIVENESS_MAP[compoundName];
  if (!map) return 'white';
  return map[disease] || 'white';
}

function colorToHex(color: 'green' | 'yellow' | 'red' | 'white'): string {
  switch (color) {
    case 'green': return '#00FF94';
    case 'yellow': return '#FFD700';
    case 'red': return '#FF3366';
    case 'white': return '#4A6080';
  }
}

function colorToScore(color: 'green' | 'yellow' | 'red' | 'white'): number {
  switch (color) {
    case 'green': return 85;
    case 'yellow': return 55;
    case 'red': return 15;
    case 'white': return 30;
  }
}

function generateFallbackSimulation(disease: string, slots: CraftingSlot[]): SimulationResult {
  const compoundNames = slots.map(s => getCompoundName(s.compound));

  /* Check for known fallback */
  const diseaseFallbacks = FALLBACK_SIMULATIONS[disease];
  let bestMatch: (typeof diseaseFallbacks)[string] | null = null;
  if (diseaseFallbacks) {
    for (const name of compoundNames) {
      if (diseaseFallbacks[name]) {
        bestMatch = diseaseFallbacks[name];
        break;
      }
    }
  }

  /* Calculate composite score */
  let totalScore = 0;
  let freqBoost = 0;
  let nonFreqCount = 0;

  for (const slot of slots) {
    const name = getCompoundName(slot.compound);
    const color = getEffectivenessColor(name, disease);
    const baseScore = colorToScore(color);
    const dosageMod = slot.dosage === 'high' ? 1.1 : slot.dosage === 'low' ? 0.85 : 1.0;

    if ('frequency' in slot.compound) {
      const freq = (slot.compound as FrequencyCompound).frequency;
      freqBoost = freq === 528 ? 8 : freq === 40 ? 10 : 5;
    } else {
      totalScore += baseScore * dosageMod;
      nonFreqCount++;
    }
  }

  const avgScore = nonFreqCount > 0 ? totalScore / nonFreqCount : 40;
  let finalScore = Math.min(100, Math.round(avgScore + freqBoost));

  /* Special combination: ALL 4-drug induction */
  const allNames = new Set(compoundNames);
  if (disease === 'Childhood ALL' && allNames.has('Methotrexate') && allNames.has('Vincristine') && allNames.has('Prednisone') && allNames.has('L-Asparaginase')) {
    finalScore = 91;
  }

  /* Dosage adjustments to side effects */
  const hasHighDose = slots.some(s => s.dosage === 'high');

  if (bestMatch) {
    return {
      overallScore: finalScore,
      mechanismExplanation: bestMatch.mechanism,
      timeline: bestMatch.timeline,
      sideEffects: hasHighDose
        ? [...bestMatch.sideEffects, { name: 'Increased toxicity (high dose)', severity: 'moderate' as const }]
        : bestMatch.sideEffects,
      interactions: bestMatch.interactions,
      aiHint: slots.length < 3 ? bestMatch.aiHint : 'Solid combination. Consider adjusting dosages or duration for optimization.',
    };
  }

  /* Generic fallback */
  return {
    overallScore: finalScore,
    mechanismExplanation: `This combination targets ${disease} through ${slots.length} concurrent mechanism${slots.length > 1 ? 's' : ''}. ${compoundNames.join(' + ')} ${slots.length > 1 ? 'work through complementary pathways' : 'acts on the primary disease pathway'} to address the underlying pathology. Effectiveness depends on disease stage, patient genetics, and compound bioavailability.`,
    timeline: [
      { day: 'Day 1', effect: `Initial pharmacological activity begins. ${compoundNames[0]} reaches therapeutic levels. Monitor for acute reactions.` },
      { day: 'Day 7', effect: `Steady-state concentrations achieved for most compounds. Early clinical effects may be observable. Side effects typically peak this week.` },
      { day: 'Day 30', effect: `Full therapeutic effect emerging. ${finalScore > 70 ? 'Measurable disease improvement expected.' : finalScore > 50 ? 'Moderate symptomatic improvement possible.' : 'Limited disease modification at current approach.'}` },
    ],
    sideEffects: [
      { name: 'GI disturbance', severity: 'mild' },
      { name: 'Fatigue', severity: 'mild' },
      ...(hasHighDose ? [{ name: 'Dose-dependent toxicity risk', severity: 'moderate' as const }] : []),
    ],
    interactions: slots.length > 2 ? ['Multiple drug interactions possible — consult pharmacist for complete interaction check'] : ['No major interactions identified in this combination'],
    aiHint: `Try adding a ${slots.some(s => getCompoundType(s.compound) === 'natural') ? 'pharmaceutical' : 'natural compound'} to this regimen for a multi-modal approach.`,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   STAR RATING COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

function EvidenceStars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5" title={`Evidence rating: ${rating}/5`}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`text-[10px] ${i <= rating ? 'text-genesis-gold' : 'text-white/10'}`}>
          {'\u2605'}
        </span>
      ))}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function LabPage() {
  /* ── State ── */
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [diseaseSearch, setDiseaseSearch] = useState('');
  const [apothecaryTab, setApothecaryTab] = useState<'pharmaceutical' | 'natural' | 'frequency' | 'experimental'>('pharmaceutical');
  const [craftingSlots, setCraftingSlots] = useState<CraftingSlot[]>([]);
  const [duration, setDuration] = useState<'acute' | 'short-term' | 'long-term'>('short-term');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [mastermindAttempts, setMastermindAttempts] = useState<MastermindAttempt[]>([]);
  const [discoveryCards, setDiscoveryCards] = useState<DiscoveryCard[]>([]);
  const [showDiscovery, setShowDiscovery] = useState(false);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [compoundSearch, setCompoundSearch] = useState('');

  /* ── Load mastermind from localStorage ── */
  useEffect(() => {
    if (selectedDisease) {
      try {
        const stored = localStorage.getItem(`genesis-mastermind-${selectedDisease.name}`);
        if (stored) setMastermindAttempts(JSON.parse(stored));
        else setMastermindAttempts([]);
      } catch { setMastermindAttempts([]); }
    }
  }, [selectedDisease]);

  /* ── Save mastermind to localStorage ── */
  useEffect(() => {
    if (selectedDisease && mastermindAttempts.length > 0) {
      try {
        localStorage.setItem(`genesis-mastermind-${selectedDisease.name}`, JSON.stringify(mastermindAttempts));
      } catch { /* storage full */ }
    }
  }, [mastermindAttempts, selectedDisease]);

  /* ── Compound add/remove ── */
  const addCompound = useCallback((compound: AnyCompound) => {
    if (craftingSlots.length >= 5) return;
    const name = getCompoundName(compound);
    if (craftingSlots.some(s => getCompoundName(s.compound) === name)) return;
    setCraftingSlots(prev => [...prev, { compound, type: getCompoundType(compound), dosage: 'standard' }]);
  }, [craftingSlots]);

  const removeCompound = (index: number) => {
    setCraftingSlots(prev => prev.filter((_, i) => i !== index));
  };

  const updateDosage = (index: number, dosage: 'low' | 'standard' | 'high') => {
    setCraftingSlots(prev => prev.map((s, i) => i === index ? { ...s, dosage } : s));
  };

  /* ── Simulate ── */
  const handleSimulate = async () => {
    if (!selectedDisease || craftingSlots.length === 0) return;
    setIsSimulating(true);
    setSimulationResult(null);

    try {
      const res = await fetch('/api/lab/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disease: selectedDisease.name,
          compounds: craftingSlots.map(s => ({
            name: getCompoundName(s.compound),
            type: s.type,
            dosage: s.dosage,
          })),
          duration,
          includeHolistic: true,
        }),
      });
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      setSimulationResult(data);
      addAttempt(data.overallScore);
    } catch {
      /* Fallback to inline simulation */
      await new Promise(r => setTimeout(r, 2000));
      const result = generateFallbackSimulation(selectedDisease.name, craftingSlots);
      setSimulationResult(result);
      addAttempt(result.overallScore);
    } finally {
      setIsSimulating(false);
    }
  };

  const addAttempt = (score: number) => {
    if (!selectedDisease) return;
    const colors = craftingSlots.map(s => ({
      name: getCompoundName(s.compound),
      color: getEffectivenessColor(getCompoundName(s.compound), selectedDisease.name),
    }));
    /* Pad to 5 */
    while (colors.length < 5) colors.push({ name: '-', color: 'white' as const });

    setMastermindAttempts(prev => [...prev, {
      id: Date.now(),
      compounds: colors,
      score,
      timestamp: Date.now(),
    }]);
  };

  /* ── Discovery ── */
  const handleDiscover = async () => {
    if (!selectedDisease) return;
    setIsDiscovering(true);
    setShowDiscovery(true);
    setDiscoveryCards([]);

    try {
      const res = await fetch('/api/lab/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disease: selectedDisease.name }),
      });
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      setDiscoveryCards(data.discoveries || []);
    } catch {
      await new Promise(r => setTimeout(r, 1500));
      setDiscoveryCards(DISCOVERY_DATA[selectedDisease.name] || []);
    } finally {
      setIsDiscovering(false);
    }
  };

  /* ── Clear history ── */
  const clearHistory = () => {
    if (!selectedDisease) return;
    setMastermindAttempts([]);
    localStorage.removeItem(`genesis-mastermind-${selectedDisease.name}`);
  };

  /* ── Filtered diseases ── */
  const filteredDiseases = DISEASES.filter(d =>
    d.name.toLowerCase().includes(diseaseSearch.toLowerCase())
  );

  /* ── Filtered compounds by search ── */
  const filterBySearch = <T extends AnyCompound>(items: T[]): T[] => {
    if (!compoundSearch) return items;
    const q = compoundSearch.toLowerCase();
    return items.filter(c => getCompoundName(c).toLowerCase().includes(q) || getMechanism(c).toLowerCase().includes(q));
  };

  /* ── Best score ── */
  const bestScore = mastermindAttempts.length > 0 ? Math.max(...mastermindAttempts.map(a => a.score)) : 0;

  /* ── Score color ── */
  const scoreColor = (score: number) =>
    score >= 80 ? '#00FF94' : score >= 60 ? '#FFD700' : score >= 40 ? '#FF9933' : '#FF3366';

  return (
    <div className="pt-20 pb-16 min-h-screen">
      {/* ═══ HEADER ═══ */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-3xl sm:text-4xl tracking-tight">
              <span className="text-genesis-gold glow-gold">CURE CRAFTING ENGINE</span>
            </h1>
            <p className="text-text-secondary mt-1 text-sm sm:text-base">
              Combine compounds. Simulate mechanisms. Decode the cure.
            </p>
          </div>
          {selectedDisease && (
            <button
              onClick={handleDiscover}
              disabled={isDiscovering}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-genesis-magenta/30 bg-genesis-magenta/5 text-genesis-magenta hover:bg-genesis-magenta/10 transition-all text-sm font-heading font-semibold disabled:opacity-50"
            >
              <span className="text-lg">{'\u{1F52C}'}</span>
              {isDiscovering ? 'Searching...' : 'Find Unexplored Connections'}
            </button>
          )}
        </div>
      </div>

      {/* ═══ DISEASE SELECTOR ═══ */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="rounded-2xl border border-white/5 bg-bg-card p-4">
          <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-text-muted mb-2">
            Target Disease
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={diseaseSearch}
                onChange={e => { setDiseaseSearch(e.target.value); }}
                placeholder="Search diseases..."
                className="w-full bg-bg-void/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-genesis-gold/50 transition-colors font-body"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {filteredDiseases.map(d => (
                <button
                  key={d.name}
                  onClick={() => { setSelectedDisease(d); setDiseaseSearch(''); setSimulationResult(null); setCraftingSlots([]); setShowDiscovery(false); }}
                  className={`px-4 py-2 rounded-xl text-sm font-heading font-semibold border transition-all ${
                    selectedDisease?.name === d.name
                      ? 'border-opacity-60 bg-opacity-10'
                      : 'border-white/10 bg-white/[0.02] hover:bg-white/5'
                  }`}
                  style={{
                    borderColor: selectedDisease?.name === d.name ? d.color : undefined,
                    backgroundColor: selectedDisease?.name === d.name ? `${d.color}10` : undefined,
                    color: selectedDisease?.name === d.name ? d.color : undefined,
                  }}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>

          {/* Selected disease banner */}
          {selectedDisease && (
            <div
              className="mt-4 p-4 rounded-xl border animate-breathe"
              style={{
                borderColor: `${selectedDisease.color}30`,
                background: `linear-gradient(135deg, ${selectedDisease.color}08, transparent)`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full animate-pulse-glow"
                  style={{ backgroundColor: selectedDisease.color, boxShadow: `0 0 12px ${selectedDisease.color}80` }}
                />
                <h2 className="font-heading font-bold text-lg" style={{ color: selectedDisease.color }}>
                  {selectedDisease.name}
                </h2>
                <div className="flex gap-2 ml-auto">
                  {selectedDisease.systems.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-full bg-white/5 text-[11px] font-mono text-text-secondary">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-text-secondary text-sm mt-2">{selectedDisease.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* ═══ MAIN THREE-PANEL LAYOUT ═══ */}
      {selectedDisease && (
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* ─── APOTHECARY PANEL (LEFT) ─── */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="rounded-2xl border border-white/5 bg-bg-card overflow-hidden sticky top-20">
                {/* Tabs */}
                <div className="flex border-b border-white/5">
                  {([
                    ['pharmaceutical', '\u{1F48A}', 'Pharma'],
                    ['natural', '\u{1F33F}', 'Natural'],
                    ['frequency', '\u{1F50A}', 'Freq'],
                    ['experimental', '\u{1F9EA}', 'Exptl'],
                  ] as const).map(([key, icon, label]) => (
                    <button
                      key={key}
                      onClick={() => { setApothecaryTab(key); setCompoundSearch(''); }}
                      className={`flex-1 py-3 text-xs font-heading font-semibold transition-all relative ${
                        apothecaryTab === key
                          ? 'text-text-primary bg-white/[0.03]'
                          : 'text-text-muted hover:text-text-secondary'
                      }`}
                    >
                      <span className="block text-base mb-0.5">{icon}</span>
                      {label}
                      {apothecaryTab === key && (
                        <div
                          className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full"
                          style={{ backgroundColor: getTypeColor(key) }}
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Compound search */}
                <div className="p-3 border-b border-white/5">
                  <input
                    type="text"
                    value={compoundSearch}
                    onChange={e => setCompoundSearch(e.target.value)}
                    placeholder="Filter compounds..."
                    className="w-full bg-bg-void/40 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-white/20 transition-colors font-body"
                  />
                </div>

                {/* Compound list */}
                <div className="max-h-[60vh] overflow-y-auto p-3 space-y-2">
                  {apothecaryTab === 'pharmaceutical' && filterBySearch(PHARMACEUTICALS).map(c => (
                    <CompoundCard
                      key={c.name}
                      name={c.name}
                      subtitle={c.class}
                      mechanism={c.mechanism}
                      extra={`Route: ${c.route}`}
                      type="pharmaceutical"
                      onAdd={() => addCompound(c)}
                      disabled={craftingSlots.length >= 5 || craftingSlots.some(s => getCompoundName(s.compound) === c.name)}
                    />
                  ))}
                  {apothecaryTab === 'natural' && filterBySearch(NATURALS).map(c => (
                    <CompoundCard
                      key={c.name}
                      name={c.name}
                      subtitle={c.category}
                      mechanism={c.mechanism}
                      extra={<EvidenceStars rating={c.evidenceRating} />}
                      type="natural"
                      onAdd={() => addCompound(c)}
                      disabled={craftingSlots.length >= 5 || craftingSlots.some(s => getCompoundName(s.compound) === c.name)}
                    />
                  ))}
                  {apothecaryTab === 'frequency' && filterBySearch(FREQUENCIES).map(c => (
                    <CompoundCard
                      key={c.name}
                      name={c.name}
                      subtitle={`${c.frequency} Hz`}
                      mechanism={c.description}
                      extra={<EvidenceStars rating={c.evidenceRating} />}
                      type="frequency"
                      onAdd={() => addCompound(c)}
                      disabled={craftingSlots.length >= 5 || craftingSlots.some(s => getCompoundName(s.compound) === c.name)}
                    />
                  ))}
                  {apothecaryTab === 'experimental' && filterBySearch(EXPERIMENTALS).map(c => (
                    <CompoundCard
                      key={c.name}
                      name={c.name}
                      subtitle={c.researchStatus.slice(0, 60)}
                      mechanism={c.mechanism}
                      extra={<EvidenceStars rating={c.evidenceRating} />}
                      type="experimental"
                      onAdd={() => addCompound(c)}
                      disabled={craftingSlots.length >= 5 || craftingSlots.some(s => getCompoundName(s.compound) === c.name)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* ─── CRAFTING TABLE (CENTER) ─── */}
            <div className="lg:col-span-4 xl:col-span-5">
              <div className="rounded-2xl border border-genesis-gold/20 bg-bg-card box-glow-gold p-6">
                <h3 className="font-heading font-bold text-lg text-genesis-gold glow-gold mb-4 flex items-center gap-2">
                  <span>{'\u2697\uFE0F'}</span> Crafting Table
                  <span className="ml-auto text-xs font-mono text-text-muted">{craftingSlots.length}/5 slots</span>
                </h3>

                {/* Slots */}
                <div className="space-y-3 mb-6">
                  {[0, 1, 2, 3, 4].map(i => {
                    const slot = craftingSlots[i];
                    if (!slot) {
                      return (
                        <div
                          key={i}
                          className="border border-dashed border-white/10 rounded-xl p-4 flex items-center justify-center"
                        >
                          <span className="text-text-muted text-sm">
                            {i === 0 && craftingSlots.length === 0 ? 'Add compounds from the Apothecary to begin' : `Slot ${i + 1} — empty`}
                          </span>
                        </div>
                      );
                    }
                    const name = getCompoundName(slot.compound);
                    const typeColor = getTypeColor(slot.type);
                    return (
                      <div
                        key={`${name}-${i}`}
                        className="border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 transition-all"
                        style={{ borderColor: `${typeColor}30`, background: `${typeColor}05` }}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-lg">{getTypeIcon(slot.type)}</span>
                          <div className="min-w-0">
                            <p className="font-heading font-semibold text-sm truncate" style={{ color: typeColor }}>{name}</p>
                            <p className="text-[11px] text-text-muted truncate">{getMechanism(slot.compound).slice(0, 60)}...</p>
                          </div>
                        </div>
                        {/* Dosage selector */}
                        <div className="flex items-center gap-1 bg-bg-void/40 rounded-lg p-1">
                          {(['low', 'standard', 'high'] as const).map(d => (
                            <button
                              key={d}
                              onClick={() => updateDosage(i, d)}
                              className={`px-2 py-1 rounded-md text-[10px] font-mono font-semibold uppercase transition-all ${
                                slot.dosage === d
                                  ? 'bg-white/10 text-text-primary'
                                  : 'text-text-muted hover:text-text-secondary'
                              }`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                        {/* Remove */}
                        <button
                          onClick={() => removeCompound(i)}
                          className="text-text-muted hover:text-genesis-red transition-colors text-lg leading-none"
                          title="Remove compound"
                        >
                          {'\u00D7'}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Duration */}
                <div className="mb-6">
                  <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-text-muted mb-2">
                    Treatment Duration
                  </label>
                  <div className="flex gap-2">
                    {(['acute', 'short-term', 'long-term'] as const).map(d => (
                      <button
                        key={d}
                        onClick={() => setDuration(d)}
                        className={`flex-1 py-2 rounded-xl text-xs font-heading font-semibold border transition-all capitalize ${
                          duration === d
                            ? 'border-genesis-cyan/40 bg-genesis-cyan/5 text-genesis-cyan'
                            : 'border-white/10 text-text-muted hover:text-text-secondary'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SIMULATE button */}
                <button
                  onClick={handleSimulate}
                  disabled={craftingSlots.length === 0 || isSimulating}
                  className="w-full py-4 rounded-xl font-heading font-bold text-lg uppercase tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed relative overflow-hidden group"
                  style={{
                    background: craftingSlots.length > 0 ? 'linear-gradient(135deg, #FFD700, #FF9933)' : undefined,
                    color: craftingSlots.length > 0 ? '#000408' : undefined,
                    boxShadow: craftingSlots.length > 0 ? '0 0 30px rgba(255, 215, 0, 0.3), 0 0 60px rgba(255, 215, 0, 0.1)' : undefined,
                  }}
                >
                  {isSimulating ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Simulating Molecular Interactions...
                    </span>
                  ) : (
                    <>
                      <span className="relative z-10">{'\u26A1'} SIMULATE</span>
                      {craftingSlots.length > 0 && (
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                      )}
                    </>
                  )}
                </button>
              </div>

              {/* ─── SIMULATION LOADING ANIMATION ─── */}
              {isSimulating && (
                <div className="mt-6 rounded-2xl border border-genesis-cyan/20 bg-bg-card p-8 flex flex-col items-center justify-center">
                  <div className="relative w-24 h-24 mb-4">
                    <div className="absolute inset-0 rounded-full border-2 border-genesis-cyan/20 animate-ping" />
                    <div className="absolute inset-2 rounded-full border-2 border-genesis-magenta/30 animate-ping" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute inset-4 rounded-full border-2 border-genesis-gold/40 animate-ping" style={{ animationDelay: '1s' }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl animate-pulse">{'\u{1F9EC}'}</span>
                    </div>
                  </div>
                  <p className="font-heading font-semibold text-genesis-cyan animate-pulse text-sm">
                    Modeling molecular pathways...
                  </p>
                  <p className="text-text-muted text-xs mt-1 font-mono">
                    Analyzing {craftingSlots.length} compound{craftingSlots.length > 1 ? 's' : ''} against {selectedDisease.name}
                  </p>
                </div>
              )}
            </div>

            {/* ─── RESULTS PANEL (RIGHT) ─── */}
            <div className="lg:col-span-4 xl:col-span-4">
              {simulationResult ? (
                <div className="rounded-2xl border border-white/5 bg-bg-card overflow-hidden">
                  {/* Score header */}
                  <div className="p-6 border-b border-white/5 text-center" style={{ background: `linear-gradient(135deg, ${scoreColor(simulationResult.overallScore)}08, transparent)` }}>
                    <p className="text-xs font-heading font-semibold uppercase tracking-wider text-text-muted mb-2">
                      Overall Effectiveness
                    </p>
                    <div
                      className="text-6xl font-heading font-black tabular-nums"
                      style={{
                        color: scoreColor(simulationResult.overallScore),
                        textShadow: `0 0 30px ${scoreColor(simulationResult.overallScore)}60`,
                      }}
                    >
                      {simulationResult.overallScore}
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full mt-3 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${simulationResult.overallScore}%`,
                          background: `linear-gradient(90deg, ${scoreColor(simulationResult.overallScore)}80, ${scoreColor(simulationResult.overallScore)})`,
                          boxShadow: `0 0 10px ${scoreColor(simulationResult.overallScore)}40`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-text-muted mt-2">
                      {simulationResult.overallScore >= 80 ? 'Highly effective combination' :
                       simulationResult.overallScore >= 60 ? 'Moderately effective approach' :
                       simulationResult.overallScore >= 40 ? 'Limited effectiveness — consider alternatives' :
                       'Low effectiveness — try different compounds'}
                    </p>
                  </div>

                  <div className="p-5 space-y-5 max-h-[60vh] overflow-y-auto">
                    {/* Mechanism */}
                    <div>
                      <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-genesis-cyan mb-2">
                        Mechanism of Action
                      </h4>
                      <p className="text-sm text-text-secondary leading-relaxed">{simulationResult.mechanismExplanation}</p>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-genesis-cyan mb-2">
                        Projected Timeline
                      </h4>
                      <div className="space-y-2">
                        {simulationResult.timeline.map((t, i) => (
                          <div key={i} className="flex gap-3 items-start">
                            <span className="font-mono text-[11px] text-genesis-gold font-semibold whitespace-nowrap mt-0.5 w-14">
                              {t.day}
                            </span>
                            <div className="flex-1">
                              <div className="w-px h-2 bg-white/10 ml-[-1px] hidden sm:block" />
                              <p className="text-xs text-text-secondary leading-relaxed">{t.effect}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Side effects */}
                    <div>
                      <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-genesis-cyan mb-2">
                        Side Effects
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {simulationResult.sideEffects.map((se, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-full text-[11px] font-mono border"
                            style={{
                              borderColor: se.severity === 'severe' ? '#FF336630' : se.severity === 'moderate' ? '#FFD70030' : '#00FF9430',
                              color: se.severity === 'severe' ? '#FF3366' : se.severity === 'moderate' ? '#FFD700' : '#00FF94',
                              backgroundColor: se.severity === 'severe' ? '#FF336608' : se.severity === 'moderate' ? '#FFD70008' : '#00FF9408',
                            }}
                          >
                            {se.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Interactions */}
                    {simulationResult.interactions.length > 0 && (
                      <div>
                        <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-genesis-red mb-2">
                          {'\u26A0\uFE0F'} Interactions & Warnings
                        </h4>
                        <ul className="space-y-1">
                          {simulationResult.interactions.map((int, i) => (
                            <li key={i} className="text-xs text-text-secondary flex items-start gap-2">
                              <span className="text-genesis-red mt-0.5">{'\u2022'}</span>
                              {int}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* AI Hint */}
                    <div className="rounded-xl border border-genesis-magenta/20 bg-genesis-magenta/5 p-4">
                      <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-genesis-magenta mb-1">
                        {'\u{1F9E0}'} AI Insight — Next Move
                      </h4>
                      <p className="text-sm text-text-secondary">{simulationResult.aiHint}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/5 bg-bg-card p-8 flex flex-col items-center justify-center min-h-[300px]">
                  <div className="text-5xl mb-4 opacity-20">{'\u{1F52C}'}</div>
                  <p className="font-heading font-semibold text-text-muted text-sm text-center">
                    Add compounds and simulate to see results
                  </p>
                  <p className="text-text-muted text-xs mt-1 text-center">
                    The Cure Crafting Engine will analyze molecular interactions,<br />
                    predict effectiveness, and suggest optimizations.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ═══ DISCOVERY ENGINE ═══ */}
          {showDiscovery && (
            <div className="mt-8">
              <div className="rounded-2xl border border-genesis-magenta/20 bg-bg-card box-glow-magenta p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-lg text-genesis-magenta glow-magenta flex items-center gap-2">
                    <span>{'\u{1F52C}'}</span> Discovery Engine — Unexplored Connections
                  </h3>
                  <button
                    onClick={() => setShowDiscovery(false)}
                    className="text-text-muted hover:text-text-primary transition-colors"
                  >
                    {'\u00D7'}
                  </button>
                </div>
                {isDiscovering ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 border-2 border-genesis-magenta/30 border-t-genesis-magenta rounded-full animate-spin" />
                      <p className="text-genesis-magenta text-sm font-heading animate-pulse">Scanning molecular databases...</p>
                    </div>
                  </div>
                ) : discoveryCards.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {discoveryCards.map((card, i) => (
                      <div key={i} className="rounded-xl border border-genesis-magenta/10 bg-bg-void/40 p-5 relative overflow-hidden">
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-0.5 rounded-full bg-genesis-magenta/10 border border-genesis-magenta/20 text-genesis-magenta text-[9px] font-mono font-bold uppercase">
                            Speculative
                          </span>
                        </div>
                        <h4 className="font-heading font-bold text-sm text-genesis-cyan mb-1">{card.compoundName}</h4>
                        <p className="text-[11px] text-text-muted mb-3">Current use: {card.currentUse}</p>
                        <div className="space-y-2">
                          <div>
                            <p className="text-[10px] font-heading font-semibold uppercase tracking-wider text-genesis-gold mb-0.5">Theoretical Mechanism</p>
                            <p className="text-xs text-text-secondary leading-relaxed">{card.theoreticalMechanism}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-heading font-semibold uppercase tracking-wider text-genesis-green mb-0.5">Molecular Basis</p>
                            <p className="text-xs text-text-secondary leading-relaxed">{card.molecularBasis}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-muted text-sm text-center py-8">No unexplored connections found for this disease yet.</p>
                )}
              </div>
            </div>
          )}

          {/* ═══ MASTERMIND BOARD ═══ */}
          <div className="mt-8">
            <div className="rounded-2xl border border-white/5 bg-bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-lg text-text-primary flex items-center gap-2">
                  <span>{'\u{1F9E9}'}</span> Mastermind Board
                  {mastermindAttempts.length > 0 && (
                    <span className="text-xs font-mono text-text-muted ml-2">
                      {mastermindAttempts.length} attempt{mastermindAttempts.length !== 1 ? 's' : ''} {'\u2022'} Best: <span style={{ color: scoreColor(bestScore) }}>{bestScore}</span>
                    </span>
                  )}
                </h3>
                {mastermindAttempts.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="text-xs text-text-muted hover:text-genesis-red transition-colors font-heading"
                  >
                    Clear History
                  </button>
                )}
              </div>

              {mastermindAttempts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-text-muted text-sm">No attempts yet. Craft your first combination and simulate.</p>
                  <p className="text-text-muted text-xs mt-1">Each attempt adds a row — green means effective, yellow is partial, red is ineffective.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {mastermindAttempts.map((attempt, i) => {
                    const isBest = attempt.score === bestScore;
                    return (
                      <div
                        key={attempt.id}
                        className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${
                          isBest ? 'border-genesis-gold/30 bg-genesis-gold/[0.03]' : 'border-white/5 bg-white/[0.01]'
                        }`}
                      >
                        {/* Attempt number */}
                        <span className="text-xs font-mono text-text-muted w-6 text-right">#{i + 1}</span>

                        {/* Color circles */}
                        <div className="flex gap-1.5">
                          {attempt.compounds.map((c, j) => (
                            <div
                              key={j}
                              className="w-6 h-6 rounded-full border-2 flex items-center justify-center group relative"
                              style={{
                                borderColor: colorToHex(c.color),
                                backgroundColor: `${colorToHex(c.color)}15`,
                                boxShadow: c.color !== 'white' ? `0 0 8px ${colorToHex(c.color)}30` : undefined,
                              }}
                              title={c.name}
                            >
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: colorToHex(c.color) }}
                              />
                            </div>
                          ))}
                        </div>

                        {/* Compound names */}
                        <div className="flex-1 min-w-0 hidden sm:block">
                          <p className="text-[11px] text-text-muted truncate">
                            {attempt.compounds.filter(c => c.name !== '-').map(c => c.name).join(' + ')}
                          </p>
                        </div>

                        {/* Score bar */}
                        <div className="flex items-center gap-2 w-32">
                          <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${attempt.score}%`,
                                backgroundColor: scoreColor(attempt.score),
                                boxShadow: `0 0 6px ${scoreColor(attempt.score)}40`,
                              }}
                            />
                          </div>
                          <span
                            className="text-xs font-mono font-bold w-8 text-right"
                            style={{ color: scoreColor(attempt.score) }}
                          >
                            {attempt.score}
                          </span>
                        </div>

                        {/* Best badge */}
                        {isBest && (
                          <span className="text-genesis-gold text-xs" title="Best attempt">{'\u{1F451}'}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ═══ DISCLAIMER ═══ */}
          <div className="mt-8 rounded-2xl border border-white/5 bg-bg-card p-6">
            <div className="flex items-start gap-3">
              <span className="text-genesis-red text-lg mt-0.5">{'\u26A0\uFE0F'}</span>
              <div>
                <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-genesis-red mb-1">
                  Medical Disclaimer
                </h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  GENESIS Cure Crafting Engine is an educational simulation tool designed for learning and exploration purposes only.
                  It does not provide medical advice, diagnosis, or treatment recommendations. The simulation results are based on
                  simplified pharmacological models and should never be used to make real medical decisions. Effectiveness scores
                  are approximations for educational purposes. Always consult qualified healthcare professionals before starting,
                  stopping, or changing any medical treatment. Drug interactions shown are not exhaustive. Frequency and energy
                  therapies have varying levels of scientific evidence. Experimental treatments may not be available or appropriate
                  for all conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ NO DISEASE SELECTED ═══ */}
      {!selectedDisease && (
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-white/5 bg-bg-card p-16 flex flex-col items-center justify-center text-center">
            <div className="text-7xl mb-6 animate-float">{'\u{1F9EC}'}</div>
            <h2 className="font-heading font-bold text-2xl text-text-primary mb-2">Select a Disease to Begin</h2>
            <p className="text-text-secondary text-sm max-w-md">
              Choose a disease from above to unlock the Apothecary, Crafting Table, and Mastermind Board.
              Combine pharmaceuticals, natural compounds, frequencies, and experimental therapies to
              simulate treatment approaches.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8">
              {DISEASES.map(d => (
                <button
                  key={d.name}
                  onClick={() => setSelectedDisease(d)}
                  className="px-4 py-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/5 transition-all group"
                >
                  <span
                    className="font-heading font-semibold text-sm transition-colors group-hover:drop-shadow-lg"
                    style={{ color: d.color }}
                  >
                    {d.name}
                  </span>
                  <p className="text-[10px] text-text-muted mt-0.5">{d.systems.join(', ')}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPOUND CARD COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

function CompoundCard({
  name,
  subtitle,
  mechanism,
  extra,
  type,
  onAdd,
  disabled,
}: {
  name: string;
  subtitle: string;
  mechanism: string;
  extra: React.ReactNode;
  type: 'pharmaceutical' | 'natural' | 'frequency' | 'experimental';
  onAdd: () => void;
  disabled: boolean;
}) {
  const color = getTypeColor(type);

  return (
    <div
      className="rounded-xl border p-3 transition-all hover:bg-white/[0.02] group"
      style={{ borderColor: `${color}12` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{getTypeIcon(type)}</span>
            <h4 className="font-heading font-semibold text-sm truncate" style={{ color }}>{name}</h4>
          </div>
          <p className="text-[10px] text-text-muted mt-0.5 truncate">{subtitle}</p>
          <p className="text-[11px] text-text-secondary mt-1 leading-relaxed line-clamp-2">{mechanism.slice(0, 120)}...</p>
          <div className="mt-1.5">{typeof extra === 'string' ? <span className="text-[10px] text-text-muted font-mono">{extra}</span> : extra}</div>
        </div>
        <button
          onClick={onAdd}
          disabled={disabled}
          className="shrink-0 mt-1 px-2.5 py-1 rounded-lg text-[11px] font-heading font-bold border transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          style={{
            borderColor: `${color}30`,
            color,
          }}
        >
          {disabled ? (name.length > 10 ? 'Added' : 'Added') : 'Add +'}
        </button>
      </div>
    </div>
  );
}

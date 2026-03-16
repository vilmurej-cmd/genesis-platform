'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Search,
  FileText,
  AlertTriangle,
  Clock,
  Skull,
  Droplets,
  Activity,
  ChevronRight,
  Shield,
  Thermometer,
  Eye,
  Loader2,
  Tag,
  Crosshair,
  MapPin,
  Fingerprint,
  FlaskConical,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Scale,
} from 'lucide-react';

/* ── Types ──────────────────────────────────────────────── */
interface Evidence {
  label: string;
  detail: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
}

interface TimelineEvent {
  time: string;
  event: string;
  significance: 'routine' | 'notable' | 'critical';
}

interface AnalysisResult {
  probableCause: string;
  mannerOfDeath: string;
  timeOfDeathEstimate: string;
  toxicology: { substance: string; level: string; significance: string }[];
  traumaAnalysis: string[];
  additionalFindings: string[];
}

interface ForensicCase {
  id: string;
  title: string;
  scenario: string;
  caseNumber: string;
  difficulty: 'Standard' | 'Complex' | 'Expert';
  evidence: Evidence[];
  postMortemFindings: string[];
  timeline: TimelineEvent[];
  analysis: AnalysisResult;
}

/* ── Pre-built Cases ────────────────────────────────────── */
const CASES: ForensicCase[] = [
  {
    id: 'river-remains',
    title: 'The River Remains',
    caseNumber: 'GFP-2026-001',
    difficulty: 'Complex',
    scenario:
      'A jogger discovered partially submerged human remains along the bank of the Cedar River at approximately 0630 hours. The body was lodged against a fallen tree branch approximately 200 meters downstream from a pedestrian bridge. Weather conditions for the past 72 hours included heavy rainfall and temperatures between 2-8\u00B0C. No identification was found on the body. The victim appears to be male, estimated age 30-45.',
    evidence: [
      { label: 'Skin maceration', detail: 'Washerwoman appearance on hands and feet \u2014 consistent with 48-72 hours submersion', severity: 'moderate' },
      { label: 'Ligature marks', detail: 'Circumferential abrasion pattern on both wrists \u2014 braided rope pattern, 8mm width', severity: 'critical' },
      { label: 'Petechial hemorrhages', detail: 'Present in conjunctivae and periorbital skin bilaterally', severity: 'high' },
      { label: 'Hyoid fracture', detail: 'Greater horn of hyoid bone fractured on left side', severity: 'critical' },
      { label: 'Diatom presence', detail: 'Freshwater diatoms found in lung tissue and bone marrow samples', severity: 'high' },
      { label: 'Fingernail scrapings', detail: 'Foreign skin cells recovered from under fingernails of right hand', severity: 'high' },
    ],
    postMortemFindings: [
      'Bilateral pulmonary edema with frothy fluid in airways',
      'Hemorrhagic infiltration of neck musculature (strap muscles)',
      'No significant atherosclerosis or organ pathology',
      'Stomach contents: partially digested meal (pasta, red sauce) \u2014 approx 2-4 hours pre-mortem',
      'Vitreous potassium: 12.8 mEq/L',
      'Liver temperature not viable due to submersion',
    ],
    timeline: [
      { time: 'T-72h', event: 'Heavy rainfall begins in Cedar River watershed', significance: 'routine' },
      { time: 'T-48h (est.)', event: 'Estimated earliest time of death based on decomposition', significance: 'critical' },
      { time: 'T-36h (est.)', event: 'Last meal consumed (pasta) approximately 2-4 hours before death', significance: 'notable' },
      { time: 'T-30h (est.)', event: 'Estimated time of death based on vitreous potassium levels', significance: 'critical' },
      { time: 'T-0', event: 'Body discovered by jogger at 0630 hours', significance: 'critical' },
    ],
    analysis: {
      probableCause: 'Asphyxia due to manual strangulation with subsequent submersion. Hyoid fracture and hemorrhagic infiltration of neck muscles confirm antemortem compression. Diatoms in bone marrow suggest the victim was alive when entering the water, indicating drowning as a contributing factor.',
      mannerOfDeath: 'Homicide',
      timeOfDeathEstimate: 'Approximately 30-48 hours prior to discovery, based on vitreous potassium (12.8 mEq/L), degree of skin maceration, and decomposition stage adjusted for water temperature (2-8\u00B0C).',
      toxicology: [
        { substance: 'Ethanol', level: '0.14 g/dL (blood)', significance: 'Moderate intoxication \u2014 impaired judgment and coordination' },
        { substance: 'Diazepam', level: '0.3 mg/L', significance: 'Therapeutic range but combined with alcohol suggests possible incapacitation' },
      ],
      traumaAnalysis: [
        'Ligature marks on wrists indicate restraint with braided rope \u2014 pattern consistent with antemortem binding',
        'Hyoid fracture (left greater horn) with associated soft tissue hemorrhage confirms manual strangulation',
        'Petechial hemorrhages support asphyxia mechanism',
        'No defensive fractures of upper extremities',
        'Foreign DNA under fingernails suggests struggle with assailant',
      ],
      additionalFindings: [
        'Dental records submitted for identification \u2014 results pending',
        'Foreign DNA profile submitted to CODIS database',
        'Rope fiber analysis ongoing \u2014 preliminary match to common hardware store variety',
        'Body entered water at or near the pedestrian bridge (hydrological analysis)',
      ],
    },
  },
  {
    id: 'sudden-death',
    title: 'The Silent Collapse',
    caseNumber: 'GFP-2026-002',
    difficulty: 'Standard',
    scenario:
      'A 35-year-old male was found unresponsive by his wife at 0715 hours in their bedroom. He had gone to bed the previous evening at approximately 2300 hours after returning from a gym session, reportedly feeling well. No known medical conditions, no prescribed medications. He was a recreational marathon runner with a recent physical showing no abnormalities. Wife reports he had been under significant work stress and was consuming 6-8 cups of coffee daily. EMS pronounced death at scene.',
    evidence: [
      { label: 'Scene findings', detail: 'Body in supine position in bed, no signs of struggle or disturbance. Phone on nightstand showing alarm set for 0630 (never silenced)', severity: 'low' },
      { label: 'Lividity pattern', detail: 'Fixed posterior lividity consistent with supine position \u2014 no repositioning', severity: 'low' },
      { label: 'Cardiac enlargement', detail: 'Heart weight 520g (normal 300-350g for body habitus). Asymmetric septal hypertrophy noted', severity: 'critical' },
      { label: 'Myocardial disarray', detail: 'Microscopic examination reveals myocyte disarray with interstitial fibrosis in septum', severity: 'critical' },
      { label: 'No external trauma', detail: 'No bruises, abrasions, or puncture marks anywhere on body', severity: 'low' },
      { label: 'Supplement bottles', detail: 'Pre-workout supplement (containing 400mg caffeine per serving) and creatine found in gym bag', severity: 'moderate' },
    ],
    postMortemFindings: [
      'Significant biventricular hypertrophy with asymmetric septal thickening (septum 2.2cm, free wall 1.4cm)',
      'Myocyte disarray occupying >20% of septal tissue',
      'Patchy replacement fibrosis in interventricular septum',
      'Coronary arteries: widely patent, no atherosclerosis',
      'Lungs: moderate pulmonary edema bilaterally',
      'Brain: unremarkable, no hemorrhage or edema',
      'No needle marks or signs of injection',
    ],
    timeline: [
      { time: '1800', event: 'Subject arrives at gym for routine workout (confirmed by gym entry log)', significance: 'notable' },
      { time: '1945', event: 'Subject completes workout, drives home (gym exit log)', significance: 'notable' },
      { time: '2100', event: 'Dinner with wife, reports feeling normal (wife statement)', significance: 'routine' },
      { time: '2300', event: 'Subject goes to bed, sets alarm for 0630', significance: 'routine' },
      { time: '0630', event: 'Alarm sounds \u2014 wife reports it rang for extended period before she silenced it', significance: 'notable' },
      { time: '0715', event: 'Wife attempts to wake subject, finds him unresponsive and cold to touch', significance: 'critical' },
      { time: '0728', event: 'EMS arrives, pronounces death at scene', significance: 'critical' },
    ],
    analysis: {
      probableCause: 'Sudden cardiac death due to hypertrophic cardiomyopathy (HCM). Asymmetric septal hypertrophy with extensive myocyte disarray (>20%) and interstitial fibrosis created substrate for fatal ventricular arrhythmia. The combination of intense exercise, high caffeine intake, and undiagnosed HCM created a fatal arrhythmogenic trigger.',
      mannerOfDeath: 'Natural',
      timeOfDeathEstimate: 'Between 2300-0300 hours based on degree of rigor mortis (fully established), fixed lividity, and corneal cloudiness. Core temperature measurements suggest death occurred approximately 6-8 hours before discovery.',
      toxicology: [
        { substance: 'Caffeine', level: '18 \u00B5g/mL (blood)', significance: 'Elevated \u2014 therapeutic range 1-10 \u00B5g/mL. Consistent with heavy coffee + pre-workout use. Arrhythmogenic at these levels.' },
        { substance: 'Creatine', level: 'Detected', significance: 'Consistent with supplement use, not contributory to death' },
        { substance: 'Drug screen', level: 'Negative', significance: 'No illicit substances, no prescription medications detected' },
      ],
      traumaAnalysis: [
        'No external or internal traumatic injuries identified',
        'No signs of asphyxia or strangulation',
        'No injection sites or puncture wounds',
        'Findings entirely consistent with natural cardiac death',
      ],
      additionalFindings: [
        'Genetic testing recommended for first-degree relatives \u2014 HCM has autosomal dominant inheritance',
        'Family screening for MYH7 and MYBPC3 gene mutations advised',
        'Prior physical exam likely missed HCM \u2014 standard ECG has 75-95% sensitivity but was not performed',
        'Case referred to cardiac pathology specialist for confirmatory review',
      ],
    },
  },
  {
    id: 'car-accident',
    title: 'The Highway Wreck',
    caseNumber: 'GFP-2026-003',
    difficulty: 'Standard',
    scenario:
      'A 28-year-old female driver was extracted from a single-vehicle collision at 0215 hours on Highway 9. Vehicle left roadway at high speed, struck a concrete barrier, and rolled twice before coming to rest inverted. Airbags deployed. Victim was wearing a seatbelt. Pronounced dead at the scene by first responders. No passengers. Road conditions: dry, clear night. Skid marks measured at 45 meters. Vehicle: 2024 sedan, no mechanical defects found on preliminary inspection.',
    evidence: [
      { label: 'Seatbelt sign', detail: 'Diagonal bruising pattern across chest consistent with 3-point restraint', severity: 'moderate' },
      { label: 'Steering wheel deformity', detail: 'Steering column displaced 8cm posteriorly despite airbag deployment', severity: 'high' },
      { label: 'Aortic transection', detail: 'Complete transection at aortic isthmus with 2L hemothorax', severity: 'critical' },
      { label: 'Basilar skull fracture', detail: 'Ring fracture of skull base with bilateral periorbital ecchymosis (raccoon eyes)', severity: 'critical' },
      { label: 'Vehicle speed estimate', detail: 'Accident reconstruction estimates impact speed of 130-145 km/h in 80 km/h zone', severity: 'high' },
      { label: 'Phone records', detail: "Text message sent from victim's phone at 0213 hours \u2014 2 minutes before estimated time of collision", severity: 'critical' },
    ],
    postMortemFindings: [
      'Complete traumatic aortic transection at isthmus (classic deceleration injury)',
      'Left hemothorax: 2,100mL blood',
      'Bilateral rib fractures: ribs 2-7 left, 3-6 right (seatbelt distribution)',
      'Ring fracture of skull base with epidural and subdural hemorrhage',
      "Cervical spine fracture: C2 hangman's fracture with cord transection",
      'Splenic laceration grade IV with hemoperitoneum (800mL)',
      'Liver laceration grade III (right lobe)',
      'No pre-existing pathology identified',
    ],
    timeline: [
      { time: '2200', event: "Victim last seen leaving friend's apartment (witness statement)", significance: 'notable' },
      { time: '0145', event: 'Victim sends text messages to friend (phone records)', significance: 'notable' },
      { time: '0213', event: "Final text message sent from victim's phone", significance: 'critical' },
      { time: '0214 (est.)', event: 'Vehicle departs roadway \u2014 beginning of skid marks', significance: 'critical' },
      { time: '0215', event: 'Impact with concrete barrier, vehicle rolls twice', significance: 'critical' },
      { time: '0219', event: 'Passing motorist calls 911', significance: 'notable' },
      { time: '0231', event: 'First responders arrive, pronounce death at scene', significance: 'critical' },
    ],
    analysis: {
      probableCause: 'Multiple blunt force traumatic injuries sustained in high-speed motor vehicle collision. Immediately fatal injuries include traumatic aortic transection and C2 vertebral fracture with spinal cord transection.',
      mannerOfDeath: 'Accident',
      timeOfDeathEstimate: 'Death was instantaneous or within seconds of primary impact. The combination of aortic transection, cervical cord transection, and basilar skull fracture would cause immediate cessation of cardiac and neurological function.',
      toxicology: [
        { substance: 'Ethanol', level: '0.06 g/dL', significance: 'Below legal limit but may have contributed to impaired judgment and reaction time' },
        { substance: 'THC', level: '4.2 ng/mL', significance: 'Active metabolite present \u2014 recent cannabis use within 2-4 hours of death' },
        { substance: 'THC-COOH', level: '28 ng/mL', significance: 'Carboxylic acid metabolite \u2014 suggests regular use pattern' },
      ],
      traumaAnalysis: [
        'Aortic transection at isthmus \u2014 classic high-speed deceleration injury where mobile aortic arch shears from fixed descending aorta',
        "C2 hangman's fracture with cord transection \u2014 hyperextension mechanism during rollover",
        'Basilar ring fracture \u2014 axial loading forces transmitted through cervical spine',
        'Bilateral rib fractures in seatbelt distribution \u2014 restraint functioned but deceleration forces exceeded survivable limits',
        'Solid organ injuries (spleen, liver) \u2014 consistent with extreme deceleration and compression forces',
      ],
      additionalFindings: [
        'Distracted driving (texting) identified as probable contributing factor',
        'Combined impairment from alcohol + THC likely reduced reaction time',
        'Vehicle traveling 60-80% above posted speed limit',
        'Seatbelt and airbag functioned correctly but forces exceeded survivable threshold',
        'No mechanical defect \u2014 accident attributed to driver behavior',
      ],
    },
  },
  {
    id: 'poisoning',
    title: 'The Poisoned Philanthropist',
    caseNumber: 'GFP-2026-004',
    difficulty: 'Expert',
    scenario:
      "During a dinner party at a private residence with 8 guests, a 52-year-old male host collapsed approximately 90 minutes after the meal began. Witnesses describe sudden onset of profuse sweating, excessive salivation, vomiting, and muscle fasciculations before losing consciousness. The victim had prepared the meal himself, which featured wild mushrooms he had personally foraged that afternoon. Other guests consumed different portions of the same meal \u2014 two others developed mild gastrointestinal symptoms. Victim transported to hospital, pronounced dead 4 hours after symptom onset despite aggressive treatment.",
    evidence: [
      { label: 'Mushroom specimens', detail: 'Remaining foraged mushrooms include Amanita phalloides (death cap) mixed with edible Agaricus campestris specimens', severity: 'critical' },
      { label: 'Excessive secretions', detail: 'SLUDGE presentation: salivation, lacrimation, urination, defecation, GI distress, emesis', severity: 'high' },
      { label: 'Miosis', detail: 'Bilateral pinpoint pupils documented by EMS and ER physicians', severity: 'high' },
      { label: 'Liver function', detail: 'ALT 4,200 U/L, AST 3,800 U/L at 3 hours post-ingestion (rapid fulminant hepatotoxicity)', severity: 'critical' },
      { label: 'Meal distribution', detail: 'Host consumed largest portion of mushroom risotto; prepared and served his own plate', severity: 'moderate' },
      { label: 'Cholinesterase levels', detail: 'Plasma cholinesterase severely depressed \u2014 suggesting possible organophosphate co-exposure', severity: 'critical' },
    ],
    postMortemFindings: [
      'Massive hepatic necrosis \u2014 centrilobular pattern extending to pan-lobular destruction',
      'Acute tubular necrosis of kidneys bilaterally',
      'Pulmonary edema with excessive bronchial secretions',
      'Gastric contents: partially digested mushroom fragments confirmed as Amanita phalloides by mycologist',
      'Cerebral edema secondary to hepatic encephalopathy',
      'Hemorrhagic gastritis with mucosal erosion',
    ],
    timeline: [
      { time: '1400', event: 'Host goes foraging for wild mushrooms in nearby woodland', significance: 'critical' },
      { time: '1600', event: 'Host begins preparing mushroom risotto and other dishes', significance: 'notable' },
      { time: '1830', event: 'Guests arrive, dinner begins at 1900', significance: 'routine' },
      { time: '1900', event: 'Mushroom risotto served \u2014 host takes large self-served portion', significance: 'critical' },
      { time: '2030', event: 'Host complains of abdominal cramps, begins sweating profusely', significance: 'critical' },
      { time: '2045', event: 'Violent vomiting, excessive salivation, muscle twitching observed', significance: 'critical' },
      { time: '2055', event: 'Host collapses, loses consciousness \u2014 911 called', significance: 'critical' },
      { time: '2115', event: 'EMS arrives \u2014 pinpoint pupils, bradycardia (38 bpm), copious secretions', significance: 'critical' },
      { time: '0050', event: 'Victim pronounced dead \u2014 multi-organ failure despite atropine and supportive care', significance: 'critical' },
    ],
    analysis: {
      probableCause: 'Acute amatoxin poisoning from ingestion of Amanita phalloides (death cap mushroom), with concurrent organophosphate toxicity (suspected contamination of foraging site near agricultural land). Amatoxins caused fulminant hepatic failure. Organophosphate co-exposure explains the unusually rapid cholinergic crisis.',
      mannerOfDeath: 'Accident (pending investigation \u2014 manner may be revised if evidence of intentional ingestion emerges)',
      timeOfDeathEstimate: 'Approximately 6 hours after ingestion of toxic mushrooms. Death occurred at 0050 hours, with ingestion at approximately 1900 hours.',
      toxicology: [
        { substance: 'Alpha-amanitin', level: '82 ng/mL (urine)', significance: 'Markedly elevated \u2014 lethal threshold is ~0.1 mg/kg body weight. Confirms Amanita phalloides ingestion.' },
        { substance: 'Phalloidin', level: 'Detected (serum)', significance: 'Phallotoxin from Amanita \u2014 damages hepatocyte membranes, accelerates liver necrosis' },
        { substance: 'Organophosphate metabolites', level: 'Diethyl phosphate detected', significance: 'Suggests exposure to organophosphate pesticide \u2014 explains cholinergic crisis' },
        { substance: 'Ethanol', level: '0.04 g/dL', significance: 'Minimal \u2014 consistent with wine served at dinner, not contributory' },
      ],
      traumaAnalysis: [
        'No external traumatic injuries',
        'No injection sites or signs of forced administration',
        'Internal findings entirely consistent with toxic ingestion',
        'Pattern consistent with voluntary oral consumption of poisonous material',
      ],
      additionalFindings: [
        'Foraging site located adjacent to agricultural fields treated with organophosphate pesticides',
        'Remaining mushroom specimens confirmed as mixture of Amanita phalloides and edible Agaricus campestris',
        'Two other guests with mild symptoms consumed small portions \u2014 both recovered with supportive care',
        'Host had no formal mycology training \u2014 used a mobile phone app for mushroom identification',
        'No evidence of intentional poisoning \u2014 preliminary finding is accidental misidentification',
      ],
    },
  },
  {
    id: 'locked-room',
    title: 'The Locked Room',
    caseNumber: 'GFP-2026-005',
    difficulty: 'Expert',
    scenario:
      'A 44-year-old female was found deceased in her apartment by building management after co-workers reported she had not appeared at work for three days. The apartment was locked from the inside with a chain lock and deadbolt. All windows were secured from within. No signs of forced entry. The victim was found seated at her desk in the home office, slumped forward over her laptop. A half-consumed glass of red wine and an open bottle of prescription medication (alprazolam) were on the desk. A handwritten note was found beneath the keyboard.',
    evidence: [
      { label: 'Locked apartment', detail: 'Chain lock and deadbolt engaged from inside. No signs of forced entry at door or windows. Building has no other access points.', severity: 'high' },
      { label: 'Handwritten note', detail: 'Contents describe feelings of hopelessness and apology to family members. Handwriting analysis confirms victim\'s handwriting.', severity: 'critical' },
      { label: 'Medication bottle', detail: 'Alprazolam 2mg, prescribed 2 weeks prior. 30-count bottle, 22 tablets missing. Normal dosing would account for ~14 tablets.', severity: 'critical' },
      { label: 'Red wine glass', detail: 'Half-consumed glass of Cabernet Sauvignon. Bottle 60% consumed. No unusual odor or residue.', severity: 'moderate' },
      { label: 'Injection mark', detail: 'Single fresh venipuncture mark on left antecubital fossa, not consistent with routine blood draw. Surrounding ecchymosis.', severity: 'critical' },
      { label: 'Browser history', detail: 'Laptop shows research on "painless methods" and lethal medication combinations over preceding 5 days', severity: 'critical' },
    ],
    postMortemFindings: [
      'No external signs of trauma aside from single injection site on left arm',
      'Mild pulmonary edema bilaterally',
      'Gastric contents: red wine, partially dissolved tablet fragments',
      'No petechial hemorrhages \u2014 no signs of asphyxia',
      'Mild cerebral edema',
      'Liver and kidneys grossly normal',
      'No defensive injuries',
    ],
    timeline: [
      { time: 'Day -5', event: 'Victim begins researching methods online (browser history)', significance: 'critical' },
      { time: 'Day -3', event: 'Victim last seen leaving work at 1730 hours (security camera)', significance: 'notable' },
      { time: 'Day -3 (est.)', event: 'Estimated time of death based on decomposition and environmental factors', significance: 'critical' },
      { time: 'Day -2', event: 'Victim does not report to work \u2014 co-workers assume sick day', significance: 'routine' },
      { time: 'Day -1', event: 'Co-worker calls victim\'s phone \u2014 goes to voicemail', significance: 'notable' },
      { time: 'Day 0', event: 'Co-workers alert building management \u2014 body discovered at 1430 hours', significance: 'critical' },
    ],
    analysis: {
      probableCause: 'Combined drug toxicity from self-administered alprazolam (oral overdose) potentiated by ethanol and intravenously administered potassium chloride. The benzodiazepine-alcohol combination caused respiratory depression and sedation, while potassium chloride caused fatal cardiac arrhythmia.',
      mannerOfDeath: 'Suicide',
      timeOfDeathEstimate: 'Approximately 72 hours prior to discovery (Day -3, evening hours) based on early decomposition changes, rigor mortis (resolved), and lividity pattern. Consistent with last seen alive on security camera.',
      toxicology: [
        { substance: 'Alprazolam', level: '0.8 mg/L (blood)', significance: 'Toxic range (therapeutic: 0.01-0.1 mg/L). Consistent with ingestion of approximately 8-10 tablets.' },
        { substance: 'Ethanol', level: '0.11 g/dL', significance: 'Moderate \u2014 synergistic CNS depression with benzodiazepines' },
        { substance: 'Potassium', level: '9.8 mEq/L (vitreous)', significance: 'Markedly elevated even accounting for post-mortem redistribution. Suggests exogenous potassium administration.' },
      ],
      traumaAnalysis: [
        'Single injection site on left antecubital fossa with surrounding bruising \u2014 self-administered',
        'No defensive injuries or signs of struggle',
        'No ligature marks, petechiae, or other signs of external force',
        'Findings entirely consistent with self-inflicted death',
      ],
      additionalFindings: [
        'Handwritten note authenticated as victim\'s handwriting by forensic document examiner',
        'Locked-room scenario consistent with victim acting alone',
        'Internet research history corroborates premeditation',
        'Medical records show recent diagnosis of treatment-resistant depression',
        'Potassium chloride vial found in trash can \u2014 ordered online 10 days prior',
        'Recommend notifying mental health organizations for case study documentation',
      ],
    },
  },
];

/* ── Severity Colors ────────────────────────────────────── */
const severityColor: Record<string, string> = {
  low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  moderate: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const significanceDot: Record<string, string> = {
  routine: 'bg-slate-500',
  notable: 'bg-amber-400',
  critical: 'bg-red-400',
};

const difficultyColor: Record<string, string> = {
  Standard: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
  Complex: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
  Expert: 'text-red-400 bg-red-500/15 border-red-500/30',
};

/* ── Component ──────────────────────────────────────────── */
export default function ForensicsPage() {
  const [selectedCase, setSelectedCase] = useState<ForensicCase | null>(null);
  const [customScenario, setCustomScenario] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'evidence' | 'postmortem' | 'analysis' | 'timeline'>('evidence');
  const [expandedEvidence, setExpandedEvidence] = useState<number | null>(null);
  const [requestingTest, setRequestingTest] = useState(false);
  const [additionalAnalysis, setAdditionalAnalysis] = useState<string | null>(null);

  const handleAnalyzeCase = (caseData: ForensicCase) => {
    setSelectedCase(caseData);
    setActiveTab('evidence');
    setExpandedEvidence(null);
    setAdditionalAnalysis(null);
  };

  const handleCustomAnalysis = async () => {
    if (!customScenario.trim()) return;
    setAnalyzing(true);
    try {
      const res = await fetch('/api/forensics/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: customScenario }),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedCase(data);
        setActiveTab('evidence');
      } else {
        setSelectedCase(CASES[0]);
        setActiveTab('evidence');
      }
    } catch {
      setSelectedCase(CASES[0]);
      setActiveTab('evidence');
    } finally {
      setAnalyzing(false);
    }
  };

  const requestAdditionalTest = async () => {
    if (!selectedCase || requestingTest) return;
    setRequestingTest(true);
    setAdditionalAnalysis(null);

    try {
      const res = await fetch('/api/forensics/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: `Based on this case: ${selectedCase.title} - ${selectedCase.scenario}. Provide additional forensic analysis, additional tests that should be run, and deeper investigation leads.`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAdditionalAnalysis(data.analysis?.probableCause || 'Additional analysis suggests reviewing environmental factors and conducting further toxicological screening for less common substances. Cross-reference DNA evidence with expanded databases. Consider consulting specialists in forensic entomology for more precise time-of-death estimation.');
      }
    } catch {
      setAdditionalAnalysis('Additional analysis suggests reviewing environmental factors and conducting further toxicological screening for less common substances. Cross-reference DNA evidence with expanded databases. Consider consulting specialists in forensic entomology for more precise time-of-death estimation. Trace evidence (fibers, soil, pollen) should be analyzed for geographic origin.');
    } finally {
      setRequestingTest(false);
    }
  };

  const mannerColor = (manner: string) => {
    if (manner.includes('Homicide')) return '#FF3366';
    if (manner.includes('Natural')) return '#00FF94';
    if (manner.includes('Accident')) return '#FFD700';
    if (manner.includes('Suicide')) return '#9945FF';
    return '#0066FF';
  };

  return (
    <div className="min-h-screen bg-bg-void text-text-primary font-body">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-red-500/20 bg-bg-void/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-text-muted hover:text-text-secondary transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <Skull className="w-5 h-5 text-genesis-red" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-xl tracking-wide" style={{ color: '#FF3366' }}>
                  FORENSIC PATHOLOGY
                </h1>
                <p className="text-xs text-text-muted">Case Investigation Mode</p>
              </div>
            </div>
          </div>
          {selectedCase && (
            <button
              onClick={() => { setSelectedCase(null); setAdditionalAnalysis(null); }}
              className="px-4 py-2 text-sm rounded-lg border border-red-500/30 text-genesis-red hover:bg-red-500/10 transition-colors"
            >
              New Case
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!selectedCase ? (
          /* ── Case Selection — Evidence Board Style ─────── */
          <div className="space-y-8">
            {/* Custom Scenario */}
            <div className="rounded-xl border border-red-500/20 bg-bg-surface p-6" style={{
              backgroundImage: 'linear-gradient(135deg, rgba(255,51,102,0.03) 0%, transparent 50%)',
            }}>
              <div className="flex items-center gap-3 mb-4">
                <Search className="w-5 h-5 text-genesis-red" />
                <h2 className="font-heading font-semibold text-lg">Custom Case Analysis</h2>
              </div>
              <p className="text-text-secondary text-sm mb-4">
                Enter a forensic scenario for AI-powered pathology analysis. Describe the circumstances, available evidence, and any known findings.
              </p>
              <textarea
                value={customScenario}
                onChange={(e) => setCustomScenario(e.target.value)}
                placeholder="Describe the forensic scenario in detail... Include circumstances of discovery, environmental conditions, observable findings, and any witness statements."
                className="w-full h-32 bg-bg-void border border-red-500/20 rounded-lg p-4 text-text-primary placeholder:text-text-muted text-sm resize-none focus:outline-none focus:border-red-500/50 transition-colors"
              />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleCustomAnalysis}
                  disabled={!customScenario.trim() || analyzing}
                  className="px-6 py-2.5 rounded-lg font-heading font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,51,102,0.2), rgba(255,51,102,0.05))',
                    border: '1px solid rgba(255,51,102,0.4)',
                    color: '#FF3366',
                  }}
                >
                  {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair className="w-4 h-4" />}
                  Analyze Case
                </button>
              </div>
            </div>

            {/* Pre-built Cases — Manila folder style */}
            <div>
              <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-genesis-red" />
                Case Files
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CASES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleAnalyzeCase(c)}
                    className="group text-left rounded-xl border border-red-500/15 overflow-hidden transition-all hover:border-red-500/40 hover:shadow-[0_0_20px_rgba(255,51,102,0.1)]"
                    style={{
                      background: 'linear-gradient(180deg, rgba(255,51,102,0.04) 0%, rgba(10,14,26,0.9) 100%)',
                    }}
                  >
                    {/* Manila folder tab */}
                    <div className="flex items-center justify-between px-5 py-2.5 border-b border-red-500/10" style={{
                      background: 'linear-gradient(90deg, rgba(255,51,102,0.08), rgba(255,51,102,0.02))',
                    }}>
                      <span className="font-mono text-[10px] text-genesis-red tracking-wider">{c.caseNumber}</span>
                      <span className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${difficultyColor[c.difficulty]}`}>
                        {c.difficulty}
                      </span>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-heading font-bold text-text-primary group-hover:text-genesis-red transition-colors">{c.title}</h3>
                        <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-genesis-red transition-colors shrink-0 mt-1" />
                      </div>
                      <p className="text-sm text-text-secondary line-clamp-3 mb-4">{c.scenario.slice(0, 160)}...</p>

                      {/* Evidence preview as pinned cards */}
                      <div className="flex items-center gap-3 text-[11px] text-text-muted">
                        <span className="flex items-center gap-1">
                          <Fingerprint className="w-3 h-3 text-genesis-red/60" /> {c.evidence.length} evidence
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-genesis-red/60" /> {c.timeline.length} events
                        </span>
                        <span className="flex items-center gap-1">
                          <FlaskConical className="w-3 h-3 text-genesis-red/60" /> {c.analysis.toxicology.length} tox
                        </span>
                      </div>

                      {/* Severity dots preview */}
                      <div className="flex gap-1 mt-3">
                        {c.evidence.map((ev, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 rounded-full"
                            title={`${ev.label}: ${ev.severity}`}
                            style={{
                              backgroundColor: ev.severity === 'critical' ? '#FF3366' : ev.severity === 'high' ? '#FF9933' : ev.severity === 'moderate' ? '#FFD700' : '#00FF94',
                              opacity: 0.7,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="rounded-lg border border-red-500/10 bg-red-500/5 p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-genesis-red shrink-0 mt-0.5" />
              <p className="text-sm text-text-secondary">
                This module is designed for educational and training purposes in forensic pathology. All case data is fictional. Analysis results are AI-generated and should not be used for actual forensic determinations.
              </p>
            </div>
          </div>
        ) : (
          /* ── Case Analysis — Evidence Board UI ─────────── */
          <div className="space-y-6">
            {/* Case File Header — Manila folder style */}
            <div className="rounded-xl border border-red-500/20 overflow-hidden" style={{
              background: 'linear-gradient(135deg, rgba(255,51,102,0.05) 0%, rgba(10,14,26,0.9) 100%)',
            }}>
              <div className="flex items-center justify-between px-6 py-2.5 border-b border-red-500/10" style={{
                background: 'linear-gradient(90deg, rgba(255,51,102,0.1), rgba(255,51,102,0.03))',
              }}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  <span className="font-mono text-xs text-genesis-red uppercase tracking-wider">Active Case File</span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedCase.caseNumber && (
                    <span className="font-mono text-[10px] text-text-muted">{selectedCase.caseNumber}</span>
                  )}
                  {selectedCase.difficulty && (
                    <span className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${difficultyColor[selectedCase.difficulty]}`}>
                      {selectedCase.difficulty}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-6">
                <h2 className="font-heading font-bold text-2xl mb-3" style={{ color: '#FF3366' }}>
                  {selectedCase.title}
                </h2>
                <p className="text-text-secondary text-sm leading-relaxed">{selectedCase.scenario}</p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 bg-bg-surface rounded-xl p-1 border border-red-500/10">
              {(['evidence', 'postmortem', 'timeline', 'analysis'] as const).map((tab) => {
                const icons = { evidence: Eye, postmortem: Activity, timeline: Clock, analysis: Scale };
                const Icon = icons[tab];
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-heading font-medium transition-all flex items-center justify-center gap-2 ${
                      activeTab === tab
                        ? 'bg-red-500/15 text-genesis-red border border-red-500/30'
                        : 'text-text-muted hover:text-text-secondary border border-transparent'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab === 'postmortem' ? 'Post-Mortem' : tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            {activeTab === 'evidence' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-semibold flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-genesis-red" /> Physical Evidence ({selectedCase.evidence.length} items)
                  </h3>
                  <button
                    onClick={requestAdditionalTest}
                    disabled={requestingTest}
                    className="px-4 py-2 rounded-lg text-xs font-heading font-semibold flex items-center gap-2 transition-all border border-red-500/30 text-genesis-red hover:bg-red-500/10 disabled:opacity-40"
                  >
                    {requestingTest ? <Loader2 className="w-3 h-3 animate-spin" /> : <FlaskConical className="w-3 h-3" />}
                    Request Additional Test
                  </button>
                </div>

                {/* Evidence cards — pinned card style */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedCase.evidence.map((ev, i) => {
                    const isExpanded = expandedEvidence === i;
                    return (
                      <button
                        key={i}
                        onClick={() => setExpandedEvidence(isExpanded ? null : i)}
                        className="text-left rounded-xl border border-red-500/10 bg-bg-surface transition-all hover:border-red-500/20"
                        style={{
                          boxShadow: isExpanded ? '0 0 15px rgba(255,51,102,0.1)' : 'none',
                        }}
                      >
                        {/* Pin */}
                        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-genesis-red/40" />
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Bookmark className="w-3.5 h-3.5 text-genesis-red/60" />
                              <h4 className="font-heading font-semibold text-sm text-text-primary">{ev.label}</h4>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full border ${severityColor[ev.severity]}`}
                              >
                                {ev.severity}
                              </span>
                              {isExpanded ? <ChevronUp className="w-3 h-3 text-text-muted" /> : <ChevronDown className="w-3 h-3 text-text-muted" />}
                            </div>
                          </div>
                          <p className={`text-sm text-text-secondary leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                            {ev.detail}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Additional AI Analysis */}
                {additionalAnalysis && (
                  <div className="rounded-xl border border-genesis-cyan/20 bg-genesis-cyan/5 p-5">
                    <h4 className="font-heading font-semibold text-sm text-genesis-cyan flex items-center gap-2 mb-3">
                      <FlaskConical className="w-4 h-4" />
                      Additional Analysis
                    </h4>
                    <p className="text-sm text-text-secondary leading-relaxed">{additionalAnalysis}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'postmortem' && (
              <div className="space-y-3">
                <h3 className="font-heading font-semibold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-genesis-red" /> Post-Mortem Findings
                </h3>
                <div className="rounded-xl border border-red-500/10 bg-bg-surface divide-y divide-red-500/10">
                  {selectedCase.postMortemFindings.map((finding, i) => (
                    <div key={i} className="px-5 py-3.5 flex items-start gap-3">
                      <span className="font-mono text-xs text-genesis-red mt-0.5 shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p className="text-sm text-text-secondary leading-relaxed">{finding}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="space-y-3">
                <h3 className="font-heading font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-genesis-red" /> Timeline of Events
                </h3>
                {/* Horizontal timeline strip */}
                <div className="relative">
                  <div className="absolute left-[72px] top-0 bottom-0 w-px bg-red-500/20" />
                  <div className="space-y-1">
                    {selectedCase.timeline.map((event, i) => (
                      <div
                        key={i}
                        className={`relative flex items-start gap-4 py-3 px-4 rounded-lg border border-transparent transition-all ${
                          event.significance === 'critical' ? 'bg-red-500/5 border-red-500/10' : ''
                        }`}
                      >
                        <span className="font-mono text-xs text-text-muted w-14 text-right shrink-0 pt-0.5">
                          {event.time}
                        </span>
                        <div className="relative z-10 mt-1.5">
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${significanceDot[event.significance]} ${
                              event.significance === 'critical' ? 'ring-2 ring-red-500/30' : ''
                            }`}
                          />
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed flex-1">{event.event}</p>
                        {event.significance === 'critical' && (
                          <span className="text-[9px] font-mono text-genesis-red uppercase tracking-wider shrink-0">
                            CRITICAL
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analysis' && (
              <div className="space-y-5">
                {/* Probable Cause */}
                <div className="rounded-xl border border-red-500/20 bg-bg-surface p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Crosshair className="w-4 h-4 text-genesis-red" />
                    <h3 className="font-heading font-semibold text-sm uppercase tracking-wider" style={{ color: '#FF3366' }}>
                      Probable Cause of Death
                    </h3>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{selectedCase.analysis.probableCause}</p>
                </div>

                {/* Manner & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-red-500/15 bg-bg-surface p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-genesis-red" />
                      <h4 className="font-heading font-semibold text-sm">Manner of Death</h4>
                    </div>
                    <p className="text-xl font-heading font-bold" style={{ color: mannerColor(selectedCase.analysis.mannerOfDeath) }}>
                      {selectedCase.analysis.mannerOfDeath}
                    </p>
                  </div>
                  <div className="rounded-xl border border-red-500/15 bg-bg-surface p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer className="w-4 h-4 text-genesis-red" />
                      <h4 className="font-heading font-semibold text-sm">Time of Death Estimate</h4>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">{selectedCase.analysis.timeOfDeathEstimate}</p>
                  </div>
                </div>

                {/* Toxicology */}
                <div className="rounded-xl border border-red-500/15 bg-bg-surface p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Droplets className="w-4 h-4 text-genesis-red" />
                    <h4 className="font-heading font-semibold text-sm uppercase tracking-wider" style={{ color: '#FF3366' }}>
                      Toxicology Results
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {selectedCase.analysis.toxicology.map((tox, i) => (
                      <div key={i} className="rounded-lg bg-bg-void p-3.5 border border-red-500/10">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-heading font-semibold text-sm text-text-primary">{tox.substance}</span>
                          <span className="font-mono text-xs text-genesis-red">{tox.level}</span>
                        </div>
                        <p className="text-xs text-text-secondary">{tox.significance}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trauma Analysis */}
                <div className="rounded-xl border border-red-500/15 bg-bg-surface p-5">
                  <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-3" style={{ color: '#FF3366' }}>
                    Trauma Analysis
                  </h4>
                  <ul className="space-y-2">
                    {selectedCase.analysis.traumaAnalysis.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-genesis-red mt-1 shrink-0">&bull;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Additional Findings */}
                <div className="rounded-xl border border-red-500/15 bg-bg-surface p-5">
                  <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-3" style={{ color: '#FF3366' }}>
                    Additional Findings &amp; Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {selectedCase.analysis.additionalFindings.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-amber-400 mt-1 shrink-0">&#x25B8;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

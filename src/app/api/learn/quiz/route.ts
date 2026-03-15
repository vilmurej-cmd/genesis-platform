import { NextResponse } from 'next/server';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZZES: Record<string, QuizQuestion[]> = {
  anatomy: [
    {
      question: 'Which bone is the longest in the human body?',
      options: ['Humerus', 'Tibia', 'Femur', 'Fibula'],
      correctIndex: 2,
      explanation: 'The femur (thigh bone) is the longest and strongest bone in the human body, typically about 26% of a person\'s height.',
    },
    {
      question: 'How many chambers does the human heart have?',
      options: ['2', '3', '4', '5'],
      correctIndex: 2,
      explanation: 'The heart has 4 chambers: 2 atria (upper) and 2 ventricles (lower). The right side handles deoxygenated blood, the left side oxygenated.',
    },
    {
      question: 'Which organ is responsible for producing bile?',
      options: ['Gallbladder', 'Liver', 'Pancreas', 'Stomach'],
      correctIndex: 1,
      explanation: 'The liver produces bile, which is then stored and concentrated in the gallbladder. Bile emulsifies fats for digestion.',
    },
    {
      question: 'The pituitary gland is located at the base of which structure?',
      options: ['Spinal cord', 'Cerebellum', 'Brain (hypothalamus)', 'Brainstem'],
      correctIndex: 2,
      explanation: 'The pituitary gland sits in the sella turcica at the base of the brain, just below the hypothalamus, which controls it.',
    },
    {
      question: 'Which part of the brain controls balance and coordination?',
      options: ['Cerebrum', 'Cerebellum', 'Medulla oblongata', 'Thalamus'],
      correctIndex: 1,
      explanation: 'The cerebellum (Latin for "little brain") coordinates voluntary movements, balance, posture, and motor learning.',
    },
  ],
  physiology: [
    {
      question: 'What is the normal resting heart rate for an adult?',
      options: ['40-50 bpm', '60-100 bpm', '100-120 bpm', '120-150 bpm'],
      correctIndex: 1,
      explanation: 'Normal resting heart rate for adults is 60-100 bpm. Well-trained athletes may have rates as low as 40-60 bpm.',
    },
    {
      question: 'Which hormone is primarily responsible for regulating blood sugar?',
      options: ['Cortisol', 'Thyroxine', 'Insulin', 'Adrenaline'],
      correctIndex: 2,
      explanation: 'Insulin, produced by beta cells in the pancreatic islets of Langerhans, lowers blood glucose by promoting cellular uptake.',
    },
    {
      question: 'What is the normal blood pH range?',
      options: ['6.8 - 7.0', '7.0 - 7.2', '7.35 - 7.45', '7.5 - 7.8'],
      correctIndex: 2,
      explanation: 'Normal blood pH is 7.35-7.45, slightly alkaline. Even small deviations can be life-threatening (acidosis or alkalosis).',
    },
    {
      question: 'Which type of blood cell is primarily responsible for fighting infection?',
      options: ['Red blood cells', 'Platelets', 'White blood cells', 'Plasma cells'],
      correctIndex: 2,
      explanation: 'White blood cells (leukocytes) are the immune system\'s soldiers, with subtypes including neutrophils, lymphocytes, monocytes, eosinophils, and basophils.',
    },
    {
      question: 'What is the primary function of the nephron?',
      options: ['Gas exchange', 'Blood filtration', 'Hormone production', 'Nutrient absorption'],
      correctIndex: 1,
      explanation: 'Nephrons are the functional units of the kidney, filtering blood to produce urine. Each kidney contains about 1 million nephrons.',
    },
  ],
  pathology: [
    {
      question: 'Which type of diabetes is characterized by autoimmune destruction of beta cells?',
      options: ['Type 1', 'Type 2', 'Gestational', 'Type 3c'],
      correctIndex: 0,
      explanation: 'Type 1 diabetes results from autoimmune attack on insulin-producing beta cells, leading to absolute insulin deficiency. It typically presents in childhood.',
    },
    {
      question: 'What is the hallmark pathological feature of Alzheimer\'s disease?',
      options: ['Lewy bodies', 'Amyloid plaques and neurofibrillary tangles', 'Demyelination', 'Prion accumulation'],
      correctIndex: 1,
      explanation: 'Alzheimer\'s is characterized by extracellular amyloid-beta plaques and intracellular neurofibrillary tangles of hyperphosphorylated tau protein.',
    },
    {
      question: 'Atherosclerosis primarily affects which type of blood vessel?',
      options: ['Veins', 'Capillaries', 'Arteries', 'Lymphatic vessels'],
      correctIndex: 2,
      explanation: 'Atherosclerosis is the buildup of plaques (cholesterol, fat, calcium) in arterial walls, leading to narrowing and reduced blood flow.',
    },
    {
      question: 'Which condition is characterized by uncontrolled cell growth?',
      options: ['Anemia', 'Cancer', 'Diabetes', 'Hypertension'],
      correctIndex: 1,
      explanation: 'Cancer results from mutations that cause uncontrolled cell proliferation, evading normal growth checkpoints and programmed cell death (apoptosis).',
    },
    {
      question: 'Cirrhosis most commonly results from chronic damage to which organ?',
      options: ['Kidney', 'Heart', 'Liver', 'Pancreas'],
      correctIndex: 2,
      explanation: 'Cirrhosis is end-stage liver fibrosis, most commonly caused by chronic alcohol use, hepatitis B/C, or non-alcoholic fatty liver disease.',
    },
  ],
  pharmacology: [
    {
      question: 'What class of drug is Metformin?',
      options: ['Sulfonylurea', 'Biguanide', 'DPP-4 inhibitor', 'SGLT2 inhibitor'],
      correctIndex: 1,
      explanation: 'Metformin is a biguanide — the most widely prescribed first-line medication for Type 2 diabetes. It reduces hepatic glucose production and improves insulin sensitivity.',
    },
    {
      question: 'ACE inhibitors (like Lisinopril) primarily treat which condition?',
      options: ['Diabetes', 'Hypertension', 'Asthma', 'Depression'],
      correctIndex: 1,
      explanation: 'ACE inhibitors block angiotensin-converting enzyme, reducing angiotensin II production. This lowers blood pressure and is also cardio/renoprotective.',
    },
    {
      question: 'What is the mechanism of action of aspirin?',
      options: ['Opioid receptor agonist', 'COX enzyme inhibition', 'Sodium channel blocker', 'GABA receptor modulator'],
      correctIndex: 1,
      explanation: 'Aspirin irreversibly inhibits cyclooxygenase (COX-1 and COX-2), reducing prostaglandin synthesis. This provides anti-inflammatory, antipyretic, analgesic, and antiplatelet effects.',
    },
    {
      question: 'Which neurotransmitter do SSRIs (like Fluoxetine) primarily affect?',
      options: ['Dopamine', 'GABA', 'Serotonin', 'Norepinephrine'],
      correctIndex: 2,
      explanation: 'SSRIs (Selective Serotonin Reuptake Inhibitors) block the reuptake of serotonin (5-HT) in the synaptic cleft, increasing serotonin availability.',
    },
    {
      question: 'Statins (like Atorvastatin) work by inhibiting which enzyme?',
      options: ['Cyclooxygenase', 'HMG-CoA reductase', 'ACE', 'Phosphodiesterase'],
      correctIndex: 1,
      explanation: 'Statins inhibit HMG-CoA reductase, the rate-limiting enzyme in cholesterol biosynthesis. This reduces hepatic cholesterol production and upregulates LDL receptors.',
    },
  ],
};

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json({ error: 'Missing topic string', available: Object.keys(QUIZZES) }, { status: 400 });
    }

    const key = topic.trim().toLowerCase();
    const quiz = QUIZZES[key];

    if (!quiz) {
      return NextResponse.json(
        { error: `Unknown topic: ${topic}`, available: Object.keys(QUIZZES) },
        { status: 404 }
      );
    }

    return NextResponse.json({ topic: key, questions: quiz });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

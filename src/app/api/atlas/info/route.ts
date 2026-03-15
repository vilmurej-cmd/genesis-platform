import { NextResponse } from 'next/server';

interface BodyPartInfo {
  name: string;
  system: string;
  description: string;
  functions: string[];
  commonConditions: string[];
  funFacts: string[];
  relatedParts: string[];
}

const BODY_PARTS: Record<string, BodyPartInfo> = {
  brain: {
    name: 'Brain',
    system: 'Nervous System',
    description:
      'The brain is the command center of the human body, a 3-pound organ containing approximately 86 billion neurons. It controls thought, memory, emotion, motor skills, vision, breathing, temperature, hunger, and every process that regulates the body.',
    functions: [
      'Processing sensory information from the entire body',
      'Controlling voluntary and involuntary movement',
      'Regulating consciousness, sleep, and circadian rhythms',
      'Storing and retrieving memories (hippocampus)',
      'Executive function, planning, and decision-making (prefrontal cortex)',
      'Emotional processing and fear response (amygdala)',
      'Language production (Broca\'s area) and comprehension (Wernicke\'s area)',
    ],
    commonConditions: ['Alzheimer\'s disease', 'Parkinson\'s disease', 'Stroke', 'Epilepsy', 'Brain tumors', 'Traumatic brain injury', 'Multiple sclerosis'],
    funFacts: [
      'The brain uses 20% of the body\'s total energy despite being only 2% of body weight',
      'Information travels along neurons at speeds up to 268 mph',
      'The brain generates enough electricity to power a small light bulb',
      'You have about 70,000 thoughts per day',
    ],
    relatedParts: ['spine', 'eyes', 'ears'],
  },
  heart: {
    name: 'Heart',
    system: 'Cardiovascular System',
    description:
      'The heart is a muscular organ roughly the size of a fist, located slightly left of center in the chest. It pumps blood through the circulatory system, delivering oxygen and nutrients to tissues and removing carbon dioxide and waste products.',
    functions: [
      'Pumping oxygenated blood to the body (systemic circulation)',
      'Sending deoxygenated blood to the lungs (pulmonary circulation)',
      'Maintaining blood pressure through coordinated contractions',
      'Generating its own electrical impulses (SA node — the natural pacemaker)',
      'Producing atrial natriuretic peptide (ANP) for blood pressure regulation',
    ],
    commonConditions: ['Coronary artery disease', 'Heart failure', 'Arrhythmias', 'Valvular heart disease', 'Myocardial infarction', 'Cardiomyopathy', 'Pericarditis'],
    funFacts: [
      'The heart beats approximately 100,000 times per day — about 2.5 billion times in a lifetime',
      'It pumps about 2,000 gallons of blood daily',
      'The heart has its own electrical system and can beat outside the body if given oxygen',
      'A woman\'s heart beats slightly faster than a man\'s on average',
    ],
    relatedParts: ['lungs', 'kidneys', 'brain'],
  },
  lungs: {
    name: 'Lungs',
    system: 'Respiratory System',
    description:
      'The lungs are a pair of spongy, air-filled organs located on either side of the chest. The right lung has three lobes while the left has two (to accommodate the heart). They facilitate gas exchange — bringing oxygen into the body and expelling carbon dioxide.',
    functions: [
      'Gas exchange: O2 in, CO2 out (at ~300 million alveoli)',
      'pH regulation through CO2 management',
      'Filtering small blood clots from venous circulation',
      'Immune defense via alveolar macrophages',
      'Phonation — air flow enables speech and vocalization',
      'Metabolizing certain compounds (converting angiotensin I to II)',
    ],
    commonConditions: ['Asthma', 'COPD (Chronic Obstructive Pulmonary Disease)', 'Pneumonia', 'Lung cancer', 'Pulmonary embolism', 'Pulmonary fibrosis', 'Tuberculosis'],
    funFacts: [
      'If spread flat, the alveoli would cover an area the size of a tennis court',
      'The left lung is about 10% smaller than the right to make room for the heart',
      'You breathe about 22,000 times per day',
      'Lungs are the only organs that can float on water',
    ],
    relatedParts: ['heart', 'diaphragm', 'trachea'],
  },
  liver: {
    name: 'Liver',
    system: 'Digestive System',
    description:
      'The liver is the largest solid organ in the body, weighing about 3 pounds. Located in the upper right abdomen, it performs over 500 vital functions including detoxification, protein synthesis, bile production, and metabolic regulation.',
    functions: [
      'Detoxification of blood — filtering drugs, alcohol, and metabolic waste',
      'Bile production for fat digestion and absorption',
      'Protein synthesis (albumin, clotting factors)',
      'Glycogen storage and glucose regulation',
      'Cholesterol and triglyceride metabolism',
      'Immune function via Kupffer cells',
      'Storage of vitamins (A, D, E, K, B12) and iron',
    ],
    commonConditions: ['Hepatitis (A, B, C)', 'Cirrhosis', 'Fatty liver disease (NAFLD/NASH)', 'Liver cancer', 'Hemochromatosis', 'Wilson\'s disease', 'Liver failure'],
    funFacts: [
      'The liver is the only organ that can regenerate — it can regrow to full size from just 25% of its tissue',
      'It filters about 1.4 liters of blood per minute',
      'The liver produces about 800-1000 mL of bile daily',
      'Ancient Greeks knew about liver regeneration — the myth of Prometheus reflects this',
    ],
    relatedParts: ['stomach', 'gallbladder', 'pancreas'],
  },
  kidneys: {
    name: 'Kidneys',
    system: 'Urinary System',
    description:
      'The kidneys are two bean-shaped organs, each about the size of a fist, located on either side of the spine below the ribcage. They filter blood, remove waste, regulate electrolytes, and maintain fluid balance — producing urine as a byproduct.',
    functions: [
      'Filtering blood (180 liters/day, producing ~1.5 liters of urine)',
      'Regulating electrolytes (sodium, potassium, calcium, phosphate)',
      'Maintaining acid-base balance (pH homeostasis)',
      'Producing erythropoietin (EPO) to stimulate red blood cell production',
      'Activating vitamin D for calcium absorption',
      'Regulating blood pressure via the renin-angiotensin-aldosterone system (RAAS)',
      'Removing drugs and toxins from the bloodstream',
    ],
    commonConditions: ['Chronic kidney disease', 'Kidney stones', 'Urinary tract infections', 'Polycystic kidney disease', 'Glomerulonephritis', 'Acute kidney injury', 'Renal cell carcinoma'],
    funFacts: [
      'Each kidney contains about 1 million filtering units called nephrons',
      'Kidneys filter all the blood in your body about 40 times per day',
      'You can live a healthy life with just one kidney',
      'The kidneys receive 20-25% of cardiac output despite being only 0.5% of body weight',
    ],
    relatedParts: ['bladder', 'adrenal glands', 'heart'],
  },
  stomach: {
    name: 'Stomach',
    system: 'Digestive System',
    description:
      'The stomach is a J-shaped muscular organ in the upper left abdomen. It receives food from the esophagus, mixes it with gastric acid and enzymes, and breaks it down into a semi-liquid mixture called chyme before passing it to the small intestine.',
    functions: [
      'Mechanical digestion through muscular churning contractions',
      'Chemical digestion via hydrochloric acid (pH 1.5-3.5) and pepsin',
      'Storage reservoir — can expand to hold up to 1 liter of food',
      'Production of intrinsic factor (essential for vitamin B12 absorption)',
      'Killing ingested pathogens with gastric acid',
      'Hormone secretion (gastrin, ghrelin — the "hunger hormone")',
    ],
    commonConditions: ['Gastric ulcers', 'Gastritis', 'GERD (Gastroesophageal Reflux Disease)', 'Stomach cancer', 'H. pylori infection', 'Gastroparesis', 'Zollinger-Ellison syndrome'],
    funFacts: [
      'The stomach lining replaces itself every 3-4 days to prevent self-digestion',
      'Stomach acid is strong enough to dissolve metal',
      'The stomach can function after up to 80% removal (gastrectomy)',
      'Blushing causes the stomach lining to also turn red',
    ],
    relatedParts: ['esophagus', 'small intestine', 'liver', 'pancreas'],
  },
  spine: {
    name: 'Spine (Vertebral Column)',
    system: 'Musculoskeletal / Nervous System',
    description:
      'The spine is a column of 33 vertebrae (24 articulating) extending from the skull to the pelvis. It protects the spinal cord, supports the body\'s weight, enables flexible movement, and serves as an attachment point for ribs and muscles.',
    functions: [
      'Protecting the spinal cord and nerve roots',
      'Supporting body weight and maintaining upright posture',
      'Enabling flexible movement (flexion, extension, rotation)',
      'Shock absorption via intervertebral discs',
      'Anchoring the ribcage and supporting the skull',
      'Red blood cell production in vertebral bone marrow',
    ],
    commonConditions: ['Herniated disc', 'Spinal stenosis', 'Scoliosis', 'Osteoarthritis', 'Compression fractures', 'Sciatica', 'Ankylosing spondylitis', 'Spinal cord injury'],
    funFacts: [
      'You are about 1 cm taller in the morning than at night due to disc compression',
      'The spine has the same number of vertebrae as a giraffe\'s neck (7 cervical)',
      'Astronauts can grow up to 2 inches taller in space due to spinal disc expansion',
      'The spinal cord itself is only about 18 inches long — ending at L1-L2',
    ],
    relatedParts: ['brain', 'ribs', 'pelvis'],
  },
  pancreas: {
    name: 'Pancreas',
    system: 'Digestive / Endocrine System',
    description:
      'The pancreas is a 6-inch gland located behind the stomach. It has dual function: the exocrine portion produces digestive enzymes, while the endocrine portion (islets of Langerhans) produces hormones including insulin and glucagon for blood sugar regulation.',
    functions: [
      'Producing insulin (beta cells) to lower blood glucose',
      'Producing glucagon (alpha cells) to raise blood glucose',
      'Secreting digestive enzymes (lipase, amylase, trypsin, chymotrypsin)',
      'Producing bicarbonate to neutralize stomach acid in duodenum',
      'Somatostatin production (delta cells) to regulate other hormones',
      'Producing pancreatic polypeptide to regulate secretions',
    ],
    commonConditions: ['Type 1 diabetes', 'Type 2 diabetes', 'Acute pancreatitis', 'Chronic pancreatitis', 'Pancreatic cancer', 'Pancreatic cysts', 'Insulinoma'],
    funFacts: [
      'The pancreas produces about 1.5 liters of digestive juices daily',
      'Pancreatic cancer is one of the hardest to detect early — often called the "silent killer"',
      'The islets of Langerhans make up only 1-2% of the pancreas but are crucial for life',
      'The pancreas was one of the last organs to be named — its name means "all flesh" in Greek',
    ],
    relatedParts: ['stomach', 'liver', 'small intestine', 'kidneys'],
  },
  skin: {
    name: 'Skin (Integumentary System)',
    system: 'Integumentary System',
    description:
      'The skin is the body\'s largest organ, covering approximately 20 square feet and weighing about 8 pounds. It consists of three layers — epidermis, dermis, and hypodermis — and serves as the primary barrier between the body and the external environment.',
    functions: [
      'Protection against pathogens, UV radiation, and physical damage',
      'Temperature regulation through sweating and blood vessel dilation/constriction',
      'Sensation (touch, pressure, pain, temperature) via nerve receptors',
      'Vitamin D synthesis when exposed to UVB radiation',
      'Waterproof barrier preventing dehydration',
      'Immune defense via Langerhans cells and antimicrobial peptides',
    ],
    commonConditions: ['Eczema (Atopic Dermatitis)', 'Psoriasis', 'Acne', 'Skin cancer (Melanoma, BCC, SCC)', 'Rosacea', 'Dermatitis', 'Fungal infections'],
    funFacts: [
      'Your skin sheds about 30,000-40,000 dead cells every hour',
      'Skin renews itself approximately every 27 days',
      'The thinnest skin is on the eyelids (0.02 mm), the thickest on the soles of the feet (1.4 mm)',
      'Skin accounts for about 15% of your total body weight',
    ],
    relatedParts: ['muscles', 'blood vessels', 'lymph nodes'],
  },
  eyes: {
    name: 'Eyes',
    system: 'Nervous System (Special Senses)',
    description:
      'The eyes are paired sensory organs that detect light and convert it into electrochemical impulses sent to the brain via the optic nerve. Each eye contains over 100 million photoreceptor cells (rods and cones) in the retina.',
    functions: [
      'Converting light into neural signals (phototransduction)',
      'Color vision via three types of cone cells (red, green, blue)',
      'Low-light vision via rod cells',
      'Depth perception through binocular vision',
      'Focusing at different distances (accommodation via lens)',
      'Contributing to circadian rhythm regulation via melanopsin cells',
    ],
    commonConditions: ['Myopia (nearsightedness)', 'Cataracts', 'Glaucoma', 'Macular degeneration', 'Diabetic retinopathy', 'Conjunctivitis', 'Retinal detachment'],
    funFacts: [
      'Your eyes can distinguish approximately 10 million different colors',
      'The eye muscles are the most active muscles in the body',
      'Eyes began to develop about 550 million years ago — the simplest were spots of photoreceptor protein',
      'The cornea is one of only two parts of the body with no blood supply (the other is cartilage)',
    ],
    relatedParts: ['brain', 'optic nerve'],
  },
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const part = (searchParams.get('part') || '').trim().toLowerCase();

  if (!part) {
    return NextResponse.json({ error: 'Missing query parameter: part', available: Object.keys(BODY_PARTS) }, { status: 400 });
  }

  const info = BODY_PARTS[part];

  if (!info) {
    return NextResponse.json(
      { error: `Unknown body part: ${part}`, available: Object.keys(BODY_PARTS) },
      { status: 404 }
    );
  }

  return NextResponse.json(info);
}

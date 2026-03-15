import { NextResponse } from 'next/server';

const SOLUTIONS: Record<string, { compounds: string[]; categories: Record<string, string> }> = {
  cancer: {
    compounds: ['Doxorubicin', 'Methotrexate', 'Cisplatin'],
    categories: {
      Doxorubicin: 'Anthracycline antibiotic',
      Methotrexate: 'Antimetabolite',
      Cisplatin: 'Platinum-based alkylating agent',
    },
  },
  hypertension: {
    compounds: ['Lisinopril', 'Amlodipine', 'Hydrochlorothiazide'],
    categories: {
      Lisinopril: 'ACE inhibitor',
      Amlodipine: 'Calcium channel blocker',
      Hydrochlorothiazide: 'Thiazide diuretic',
    },
  },
  diabetes: {
    compounds: ['Metformin', 'Glipizide', 'Sitagliptin'],
    categories: {
      Metformin: 'Biguanide',
      Glipizide: 'Sulfonylurea',
      Sitagliptin: 'DPP-4 inhibitor',
    },
  },
  infection: {
    compounds: ['Amoxicillin', 'Azithromycin', 'Ciprofloxacin'],
    categories: {
      Amoxicillin: 'Penicillin-type antibiotic',
      Azithromycin: 'Macrolide antibiotic',
      Ciprofloxacin: 'Fluoroquinolone antibiotic',
    },
  },
  pain: {
    compounds: ['Ibuprofen', 'Acetaminophen', 'Naproxen'],
    categories: {
      Ibuprofen: 'NSAID (COX inhibitor)',
      Acetaminophen: 'Analgesic / Antipyretic',
      Naproxen: 'NSAID (COX inhibitor)',
    },
  },
  inflammation: {
    compounds: ['Aspirin', 'Prednisone', 'Colchicine'],
    categories: {
      Aspirin: 'NSAID / COX inhibitor',
      Prednisone: 'Corticosteroid',
      Colchicine: 'Anti-inflammatory alkaloid',
    },
  },
};

export async function POST(req: Request) {
  try {
    const { condition } = await req.json();

    if (!condition || typeof condition !== 'string') {
      return NextResponse.json({ error: 'Missing condition string' }, { status: 400 });
    }

    const key = condition.trim().toLowerCase();
    const match = SOLUTIONS[key];

    if (!match) {
      return NextResponse.json(
        { error: `Unknown condition: ${condition}. Available: ${Object.keys(SOLUTIONS).join(', ')}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      solution: match.compounds,
      categories: match.categories,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

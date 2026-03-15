import { NextResponse } from 'next/server';

const HINTS: Record<string, string[]> = {
  cancer: [
    'One compound is an anthracycline antibiotic that intercalates DNA — it\'s known for its distinctive red color.',
    'Another compound is an antimetabolite that inhibits dihydrofolate reductase — also used for autoimmune diseases.',
    'The third is a platinum-based agent that cross-links DNA — one of the most widely used chemotherapy drugs ever.',
  ],
  hypertension: [
    'One compound is an ACE inhibitor — its name ends in "-pril".',
    'Another is a calcium channel blocker often used first-line — its name ends in "-dipine".',
    'The third is a thiazide diuretic — one of the oldest and most common blood pressure medications.',
  ],
  diabetes: [
    'One compound is a biguanide — the most prescribed diabetes drug worldwide and typically the first medication prescribed.',
    'Another is a sulfonylurea that stimulates insulin secretion from pancreatic beta cells.',
    'The third is a DPP-4 inhibitor (a "gliptin") that enhances incretin hormones.',
  ],
  infection: [
    'One compound is a penicillin-type antibiotic — the most commonly prescribed antibiotic in primary care.',
    'Another is a macrolide antibiotic famous for its "Z-pack" 5-day course.',
    'The third is a fluoroquinolone — a broad-spectrum antibiotic whose name ends in "-floxacin".',
  ],
  pain: [
    'One compound is the most common over-the-counter NSAID — available as Advil or Motrin.',
    'Another is an analgesic that works centrally rather than peripherally — known as Tylenol.',
    'The third is a long-acting NSAID — available as Aleve.',
  ],
  inflammation: [
    'One compound is the oldest NSAID, derived from willow bark — also used as a blood thinner.',
    'Another is a synthetic corticosteroid — the most commonly prescribed oral steroid.',
    'The third is an alkaloid from the autumn crocus — specifically used for gout attacks.',
  ],
};

export async function POST(req: Request) {
  try {
    const { condition, attempt } = await req.json();

    if (!condition || typeof condition !== 'string') {
      return NextResponse.json({ error: 'Missing condition string' }, { status: 400 });
    }

    const key = condition.trim().toLowerCase();
    const hints = HINTS[key];

    if (!hints) {
      return NextResponse.json(
        { hint: 'No hints available for this condition. Try: Cancer, Hypertension, Diabetes, Infection, Pain, or Inflammation.' },
      );
    }

    const idx = Math.min((attempt || 1) - 1, hints.length - 1);
    return NextResponse.json({ hint: hints[idx] });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

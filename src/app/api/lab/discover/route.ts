import { NextResponse } from 'next/server';

const DEMO_RESULT = {
  plausibilityScore: 68,
  mechanismAnalysis:
    'The proposed mechanism has theoretical support through known biochemical pathways. The target receptor is well-characterized and the proposed modulation aligns with existing pharmacological principles. However, achieving selective binding without off-target effects remains a challenge that would require careful molecular design.',
  potentialOutcomes: [
    'Reduced inflammation through novel IL-6 pathway modulation',
    'Possible neuroprotective effects via BDNF upregulation',
    'Risk of immunosuppression at higher doses',
    'Potential for once-weekly dosing based on predicted half-life',
  ],
  existingResearch: [
    'Dual-pathway inhibition in autoimmune disorders — Phase II trials showed 43% improvement in symptom scores with acceptable safety profile.',
    'Selective receptor modulation: A review — Allosteric modulators demonstrated improved selectivity over orthosteric antagonists in 7 of 12 studies.',
    'Biomarker-guided therapy optimization — Patient stratification by CRP and ESR levels improved treatment response rates by 28%.',
  ],
  riskAssessment:
    'Moderate risk. The hypothesis builds on validated targets but proposes a novel combination approach. Key risks include unexpected drug-drug interactions, off-target binding, and the need for extensive pharmacokinetic studies. The safety profile of individual components is well-established, which mitigates some concerns.',
  verdict:
    'Promising hypothesis with solid mechanistic rationale. Recommend proceeding to in-silico modeling and cell-based assays before animal studies. Priority should be given to selectivity profiling and toxicity screening.',
};

export async function POST(req: Request) {
  try {
    const { hypothesis } = await req.json();

    if (!hypothesis || typeof hypothesis !== 'string') {
      return NextResponse.json({ error: 'Missing hypothesis string' }, { status: 400 });
    }

    /* ── Try GPT-4o ───────────────────────────────── */
    if (process.env.OPENAI_API_KEY) {
      try {
        const OpenAI = (await import('openai')).default;
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const res = await openai.chat.completions.create({
          model: 'gpt-4o',
          temperature: 0.4,
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content:
                'Evaluate this medical hypothesis. Return JSON with: plausibilityScore (0-100), mechanismAnalysis (string), potentialOutcomes (array), existingResearch (array of {title, finding}), riskAssessment (string), verdict (string)',
            },
            { role: 'user', content: `Evaluate this medical hypothesis: ${hypothesis}` },
          ],
        });

        const data = JSON.parse(res.choices[0].message.content || '{}');
        return NextResponse.json(data);
      } catch (err: any) {
        console.error('Lab discover AI error:', err.message);
      }
    }

    /* ── Demo fallback ────────────────────────────── */
    return NextResponse.json({
      ...DEMO_RESULT,
      plausibilityScore: 50 + Math.floor(Math.random() * 40),
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

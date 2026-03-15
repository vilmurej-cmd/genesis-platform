import { NextResponse } from 'next/server';

const DEMO_RESULT = {
  causeOfDeath: 'Acute myocardial infarction secondary to severe coronary artery atherosclerosis',
  mannerOfDeath: 'natural',
  timeOfDeath: 'Approximately 6-8 hours prior to discovery, based on rigor mortis progression and liver temperature',
  toxicology: [
    'Blood alcohol: 0.02% (minimal, likely from prior evening)',
    'Acetaminophen: therapeutic levels detected',
    'No illicit substances detected',
    'Digoxin: subtherapeutic levels (possible non-compliance)',
  ],
  traumaAnalysis:
    'No external signs of trauma. Lividity pattern consistent with supine position and undisturbed postmortem interval. No defense wounds or suspicious markings. Minor abrasions on knees consistent with a fall (likely perimortem collapse).',
  findings: [
    'Severe three-vessel coronary artery disease with >90% stenosis of LAD',
    'Left ventricular hypertrophy with 480g heart weight (normal: 300-350g)',
    'Pulmonary edema bilateral — consistent with acute heart failure',
    'Old myocardial scarring in posterior wall (prior silent MI)',
    'Mild hepatic congestion consistent with chronic right heart failure',
  ],
  recommendations: [
    'Case classification: Natural death — no further investigation required',
    'Notify primary care physician regarding subtherapeutic digoxin levels',
    'Family counseling recommended regarding hereditary cardiac risk factors',
    'Medical records review to confirm cardiac history',
  ],
};

export async function POST(req: Request) {
  try {
    const { scenario, evidence } = await req.json();

    if (!scenario || typeof scenario !== 'string') {
      return NextResponse.json({ error: 'Missing scenario string' }, { status: 400 });
    }

    /* ── Try GPT-4o ───────────────────────────────── */
    if (process.env.OPENAI_API_KEY) {
      try {
        const OpenAI = (await import('openai')).default;
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const evidenceStr = evidence?.length ? `\nEvidence: ${evidence.join(', ')}` : '';

        const res = await openai.chat.completions.create({
          model: 'gpt-4o',
          temperature: 0.3,
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content:
                'You are a forensic pathologist. Analyze this case. Return JSON with: causeOfDeath (string), mannerOfDeath (natural/accident/homicide/suicide/undetermined), timeOfDeath (estimate string), toxicology (array of strings), traumaAnalysis (string), findings (array of strings), recommendations (array of strings)',
            },
            { role: 'user', content: `Analyze this case: ${scenario}${evidenceStr}` },
          ],
        });

        const data = JSON.parse(res.choices[0].message.content || '{}');
        return NextResponse.json(data);
      } catch (err: any) {
        console.error('Forensics AI error:', err.message);
      }
    }

    /* ── Demo fallback ────────────────────────────── */
    return NextResponse.json(DEMO_RESULT);
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

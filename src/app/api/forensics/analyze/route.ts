import { NextResponse } from 'next/server';

const DEMO_RESULT = {
  id: 'demo-analysis',
  title: 'AI Forensic Analysis',
  scenario: 'Custom scenario analyzed by forensic AI',
  evidence: [
    { label: 'Coronary atherosclerosis', detail: 'Severe three-vessel disease with >90% stenosis of LAD', severity: 'critical' },
    { label: 'Cardiac hypertrophy', detail: 'Left ventricular hypertrophy with 480g heart weight (normal: 300-350g)', severity: 'high' },
    { label: 'Pulmonary edema', detail: 'Bilateral — consistent with acute heart failure', severity: 'high' },
    { label: 'Toxicology', detail: 'Blood alcohol 0.02%, acetaminophen therapeutic, digoxin subtherapeutic, no illicit substances', severity: 'moderate' },
  ],
  postMortemFindings: [
    'Severe three-vessel coronary artery disease with >90% stenosis of LAD',
    'Left ventricular hypertrophy with 480g heart weight (normal: 300-350g)',
    'Pulmonary edema bilateral — consistent with acute heart failure',
    'Old myocardial scarring in posterior wall (prior silent MI)',
    'Mild hepatic congestion consistent with chronic right heart failure',
    'No external signs of trauma — lividity consistent with supine position',
  ],
  timeline: [
    { time: '6-8 hours prior', event: 'Estimated time of death based on rigor mortis and liver temperature' },
    { time: 'Perimortem', event: 'Minor knee abrasions consistent with collapse' },
    { time: 'Discovery', event: 'Body found in supine position, undisturbed lividity pattern' },
  ],
  analysis: {
    probableCause: 'Acute myocardial infarction secondary to severe coronary artery atherosclerosis',
    manner: 'Natural death',
    confidence: 92,
    notes: 'No external signs of trauma. Subtherapeutic digoxin levels suggest possible medication non-compliance. Family counseling recommended regarding hereditary cardiac risk factors.',
  },
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
        const toxicology = data.toxicology || [];
        return NextResponse.json({
          id: 'ai-analysis',
          title: data.title || 'AI Forensic Analysis',
          scenario: scenario,
          evidence: (data.evidence || []).map((e: any) =>
            typeof e === 'string'
              ? { label: e, detail: e, severity: 'moderate' }
              : { label: e.label || e.name || '', detail: e.detail || e.description || '', severity: e.severity || 'moderate' }
          ),
          postMortemFindings: data.postMortemFindings || data.post_mortem_findings || data.findings || [],
          timeline: (data.timeline || []).map((t: any) =>
            typeof t === 'string'
              ? { time: '', event: t, significance: 'notable' }
              : { time: t.time || '', event: t.event || t.description || '', significance: t.significance || 'notable' }
          ),
          analysis: {
            probableCause: data.analysis?.probableCause || data.causeOfDeath || data.cause_of_death || '',
            mannerOfDeath: data.analysis?.mannerOfDeath || data.mannerOfDeath || data.manner_of_death || '',
            timeOfDeathEstimate: data.analysis?.timeOfDeathEstimate || data.timeOfDeath || data.time_of_death || '',
            toxicology: Array.isArray(toxicology) ? toxicology.map((t: any) =>
              typeof t === 'string'
                ? { substance: t, level: 'Detected', significance: '' }
                : { substance: t.substance || t.name || '', level: t.level || '', significance: t.significance || '' }
            ) : [],
            traumaAnalysis: data.analysis?.traumaAnalysis || (typeof data.traumaAnalysis === 'string' ? [data.traumaAnalysis] : data.traumaAnalysis) || data.trauma_analysis || [],
            additionalFindings: data.analysis?.additionalFindings || data.recommendations || data.additional_findings || [],
          },
        });
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

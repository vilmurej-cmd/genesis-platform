import { NextResponse } from 'next/server';

const DEMO_RESULT = {
  synergyScore: 72,
  predictedEffects: [
    'Enhanced anti-inflammatory response through dual COX pathway inhibition',
    'Improved bioavailability via complementary absorption mechanisms',
    'Potential cardioprotective synergy',
    'Extended duration of therapeutic effect',
  ],
  interactionWarnings: [
    'Monitor for increased GI irritation when combining NSAIDs',
    'Hepatic enzyme competition may alter metabolism of compound B',
    'Dose adjustment recommended for renal-impaired patients',
  ],
  efficacyEstimate: 'Moderate-to-high efficacy predicted based on complementary mechanisms of action. The combination targets multiple pathways simultaneously, reducing likelihood of resistance.',
  mechanismAnalysis: 'Compound synergy arises from complementary target engagement: while Compound A inhibits upstream signaling (receptor level), Compound B acts on downstream effectors (enzymatic level). This dual-level blockade creates a more complete therapeutic response than either agent alone.',
  riskLevel: 'moderate',
};

export async function POST(req: Request) {
  try {
    const { compounds } = await req.json();

    if (!compounds || !Array.isArray(compounds) || compounds.length === 0) {
      return NextResponse.json({ error: 'Missing or invalid compounds array' }, { status: 400 });
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
                'Analyze this drug combination. Return JSON with: synergyScore (0-100), predictedEffects (array), interactionWarnings (array), efficacyEstimate (string), mechanismAnalysis (string), riskLevel (low/moderate/high)',
            },
            { role: 'user', content: `Analyze this drug combination: ${compounds.join(', ')}` },
          ],
        });

        const data = JSON.parse(res.choices[0].message.content || '{}');
        return NextResponse.json({
          synergyScore: data.synergyScore ?? data.synergy_score ?? 50,
          predictedEffects: data.predictedEffects || data.predicted_effects || data.effects || [],
          interactionWarnings: data.interactionWarnings || data.interaction_warnings || data.warnings || [],
          efficacyEstimate: data.efficacyEstimate || data.efficacy_estimate || data.efficacy || '',
          mechanismAnalysis: data.mechanismAnalysis || data.mechanism_analysis || data.mechanism || '',
          riskLevel: data.riskLevel || data.risk_level || 'moderate',
        });
      } catch (err: any) {
        console.error('Lab simulate AI error:', err.message);
      }
    }

    /* ── Demo fallback ────────────────────────────── */
    return NextResponse.json({
      ...DEMO_RESULT,
      synergyScore: Math.min(95, 40 + compounds.length * 15 + Math.floor(Math.random() * 20)),
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

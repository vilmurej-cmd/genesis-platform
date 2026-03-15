import { NextResponse } from 'next/server';

const DEMO_RESULT = {
  condition: 'General Wellness',
  approaches: [
    {
      tradition: 'Traditional Chinese Medicine (TCM)',
      recommendation: 'Restore Qi flow and balance Yin-Yang through acupuncture meridian therapy, focusing on the Spleen and Kidney channels to support vital energy.',
      herbs: ['Astragalus (Huang Qi)', 'Ginseng (Ren Shen)', 'Goji Berry (Gou Qi Zi)', 'Licorice Root (Gan Cao)'],
      lifestyle: ['Tai Chi or Qigong practice 20 minutes daily', 'Warm cooked foods, avoid cold/raw', 'Acupressure on ST36 (Zusanli) and SP6 (Sanyinjiao)', 'Sleep by 11 PM to align with Liver Qi cycle'],
      evidenceLevel: 3,
    },
    {
      tradition: 'Ayurveda',
      recommendation: 'Balance the three doshas (Vata, Pitta, Kapha) through personalized diet, herbal formulations, and daily routines (Dinacharya) aligned with circadian rhythms.',
      herbs: ['Ashwagandha (Withania somnifera)', 'Turmeric (Curcuma longa)', 'Tulsi / Holy Basil (Ocimum sanctum)', 'Triphala (three-fruit blend)'],
      lifestyle: ['Oil pulling (Gandusha) with sesame oil each morning', 'Abhyanga self-massage with warm oil', 'Eat largest meal at noon when Agni (digestive fire) peaks', 'Meditation and Pranayama breathing exercises'],
      evidenceLevel: 3,
    },
    {
      tradition: 'Western Herbalism',
      recommendation: 'Support the body\'s innate healing through adaptogenic and tonic herbs that modulate the HPA axis and support immune resilience.',
      herbs: ['Echinacea (Echinacea purpurea)', 'Elderberry (Sambucus nigra)', 'Chamomile (Matricaria chamomilla)', 'Valerian Root (Valeriana officinalis)'],
      lifestyle: ['Herbal teas 2-3 times daily', 'Forest bathing (shinrin-yoku) weekly', 'Reduce processed food intake', 'Ensure 7-9 hours of quality sleep'],
      evidenceLevel: 4,
    },
    {
      tradition: 'Naturopathy',
      recommendation: 'Apply the Vis Medicatrix Naturae principle — support the body\'s self-healing through clean nutrition, hydrotherapy, and targeted supplementation.',
      herbs: ['Milk Thistle (Silybum marianum)', 'St. John\'s Wort (Hypericum perforatum)', 'Peppermint (Mentha piperita)', 'Ginger (Zingiber officinale)'],
      lifestyle: ['Contrast hydrotherapy (alternating hot/cold showers)', 'Anti-inflammatory whole-foods diet', 'Daily sunlight exposure (15-20 min)', 'Magnesium supplementation (glycinate form)'],
      evidenceLevel: 3,
    },
  ],
  warnings: [
    'Herbal remedies can interact with prescription medications — consult your healthcare provider',
    'Some herbs are contraindicated during pregnancy or breastfeeding',
    'Quality and standardization of herbal products varies significantly between manufacturers',
    'Evidence levels reflect current research — absence of evidence is not evidence of absence',
  ],
  disclaimer:
    'This information is for educational purposes only and does not constitute medical advice. Holistic approaches should complement, not replace, conventional medical care. Always consult a qualified healthcare practitioner before starting any new treatment regimen.',
};

export async function POST(req: Request) {
  try {
    const { condition } = await req.json();

    if (!condition || typeof condition !== 'string') {
      return NextResponse.json({ error: 'Missing condition string' }, { status: 400 });
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
                'You are a holistic medicine expert. For the given condition, provide approaches from TCM, Ayurveda, Herbalism, and Naturopathy. Return JSON with: condition (string), approaches (array of {tradition, recommendation, herbs (array), lifestyle (array), evidenceLevel (1-5)}), warnings (array), disclaimer (string)',
            },
            { role: 'user', content: `Provide holistic approaches for: ${condition}` },
          ],
        });

        const data = JSON.parse(res.choices[0].message.content || '{}');
        return NextResponse.json(data);
      } catch (err: any) {
        console.error('Holistic AI error:', err.message);
      }
    }

    /* ── Demo fallback ────────────────────────────── */
    return NextResponse.json({ ...DEMO_RESULT, condition });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

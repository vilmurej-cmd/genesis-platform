import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { content, targetLanguage, context } = await request.json();

    if (!content || !targetLanguage) {
      return NextResponse.json({ error: 'Missing content or targetLanguage' }, { status: 400 });
    }

    if (targetLanguage === 'en') {
      return NextResponse.json({
        success: true,
        translated: content,
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: true,
        translated: content, // graceful degradation
      });
    }

    const isArray = Array.isArray(content);
    const textToTranslate = isArray ? content.join('\n---SEPARATOR---\n') : content;

    const platformContext = context || 'GENESIS (The Human Body Discovery Engine — a medical/scientific educational platform)';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 4000,
        messages: [
          {
            role: 'system',
            content: `You are a professional translator for ${platformContext}, part of Vilmure Ventures. Translate the following content into ${targetLanguage}.

RULES:
- Maintain the EXACT same meaning, tone, and formatting
- Preserve any HTML tags, markdown, or special formatting
- For medical content: use precise medical terminology in the target language
- For legal disclaimers: translate formally and accurately
- Keep proper nouns unchanged (GENESIS, ATLAS, PATHOLOGY, CLARITY, HARMONY, BRIDGE, LINGUA, TRUTH, EZRE, ARIA)
- Keep brand names unchanged
- If a concept has no direct translation, provide the closest equivalent
- Return ONLY the translated text, no explanations
${isArray ? '- Items are separated by ---SEPARATOR--- — maintain the same separator in output' : ''}`,
          },
          {
            role: 'user',
            content: `Translate to ${targetLanguage}:\n\n${textToTranslate}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ success: true, translated: content });
    }

    const data = await response.json();
    const translatedText = data.choices?.[0]?.message?.content || textToTranslate;

    const translated = isArray
      ? translatedText.split('---SEPARATOR---').map((s: string) => s.trim())
      : translatedText;

    return NextResponse.json({ success: true, translated });
  } catch {
    return NextResponse.json({ success: true, translated: (await request.clone().json()).content });
  }
}

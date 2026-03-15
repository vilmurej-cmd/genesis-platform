import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface LessonSection {
  heading: string;
  content: string;
  keyPoints: string[];
}

interface LessonContent {
  title: string;
  sections: LessonSection[];
  summary: string;
  quiz: { question: string; options: string[]; correctIndex: number; explanation: string }[];
}

/* ── Demo content for when OpenAI is unavailable ─────────── */
const DEMO_LESSONS: Record<string, LessonContent> = {
  'Introduction to Human Anatomy': {
    title: 'Introduction to Human Anatomy',
    sections: [
      {
        heading: 'What is Anatomy?',
        content: 'Anatomy is the branch of biology concerned with the study of the structure of organisms and their parts. Human anatomy specifically deals with the structures of the human body. The word "anatomy" comes from the Greek word "anatomē," meaning "dissection." The study of anatomy has been fundamental to medicine for thousands of years, dating back to ancient Egyptian and Greek civilizations.\n\nThere are two main approaches to studying anatomy: **gross anatomy** (also called macroscopic anatomy), which examines structures visible to the naked eye, and **microscopic anatomy** (histology), which studies tissues and cells under a microscope.',
        keyPoints: [
          'Anatomy = study of body structure',
          'Gross anatomy: visible structures',
          'Microscopic anatomy (histology): cellular/tissue level',
          'Foundation of all medical sciences',
        ],
      },
      {
        heading: 'Levels of Structural Organization',
        content: 'The human body is organized into increasingly complex levels:\n\n1. **Chemical level** — Atoms and molecules (water, proteins, DNA)\n2. **Cellular level** — The basic unit of life (~37.2 trillion cells in the human body)\n3. **Tissue level** — Groups of similar cells (4 types: epithelial, connective, muscle, nervous)\n4. **Organ level** — Two or more tissue types working together (heart, liver, brain)\n5. **Organ system level** — Related organs cooperating (cardiovascular, nervous, digestive)\n6. **Organism level** — All systems working together as one living human being\n\nEach level builds upon the previous one. A failure at any level can cascade upward — for example, a genetic mutation (chemical level) can cause abnormal cell growth (cellular), forming a tumor (tissue/organ), which disrupts system function.',
        keyPoints: [
          '6 levels: chemical → cellular → tissue → organ → system → organism',
          '37.2 trillion cells in the human body',
          '4 tissue types: epithelial, connective, muscle, nervous',
          '11 organ systems in total',
        ],
      },
      {
        heading: 'The 11 Organ Systems',
        content: 'The human body contains 11 major organ systems, each with specific functions:\n\n• **Integumentary** — Skin, hair, nails. Protection, temperature regulation, sensation.\n• **Skeletal** — 206 bones. Support, protection, movement, blood cell production.\n• **Muscular** — ~600 muscles. Movement, posture, heat generation.\n• **Nervous** — Brain, spinal cord, nerves. Control, communication, sensation.\n• **Endocrine** — Glands (thyroid, adrenals, pituitary). Hormonal regulation.\n• **Cardiovascular** — Heart, blood vessels. Transport of oxygen, nutrients, waste.\n• **Lymphatic/Immune** — Lymph nodes, spleen, thymus. Defense against disease.\n• **Respiratory** — Lungs, airways. Gas exchange (O₂ in, CO₂ out).\n• **Digestive** — Stomach, intestines, liver. Nutrient breakdown and absorption.\n• **Urinary** — Kidneys, bladder. Waste filtration, fluid/electrolyte balance.\n• **Reproductive** — Gonads, reproductive tract. Continuation of the species.\n\nNo system works in isolation — they are deeply interconnected. The cardiovascular system delivers oxygen obtained by the respiratory system, nutrients processed by the digestive system, and hormones produced by the endocrine system.',
        keyPoints: [
          '11 organ systems total',
          '206 bones in the skeletal system',
          '~600 muscles in the muscular system',
          'All systems are interconnected — none works in isolation',
        ],
      },
    ],
    summary: 'Human anatomy is the study of body structure, organized across 6 levels from atoms to the complete organism. The body contains 11 interconnected organ systems, each essential for survival. Understanding anatomy is the foundation upon which all medical knowledge is built.',
    quiz: [
      {
        question: 'How many organ systems are in the human body?',
        options: ['8', '10', '11', '13'],
        correctIndex: 2,
        explanation: 'The human body has 11 major organ systems: integumentary, skeletal, muscular, nervous, endocrine, cardiovascular, lymphatic/immune, respiratory, digestive, urinary, and reproductive.',
      },
      {
        question: 'Which level of organization comes between tissues and organ systems?',
        options: ['Cellular', 'Chemical', 'Organ', 'Organism'],
        correctIndex: 2,
        explanation: 'The levels go: chemical → cellular → tissue → ORGAN → organ system → organism. Organs are composed of two or more tissue types working together.',
      },
      {
        question: 'Approximately how many cells are in the human body?',
        options: ['3.7 million', '37.2 billion', '37.2 trillion', '372 trillion'],
        correctIndex: 2,
        explanation: 'The human body contains approximately 37.2 trillion cells, though this number varies by individual size and composition.',
      },
    ],
  },
};

export async function POST(req: Request) {
  try {
    const { lessonTitle, courseTitle, courseContext, lessonIndex, totalLessons } = await req.json();

    if (!lessonTitle || !courseTitle) {
      return NextResponse.json({ error: 'Missing lessonTitle or courseTitle' }, { status: 400 });
    }

    // Check demo content first
    if (DEMO_LESSONS[lessonTitle]) {
      return NextResponse.json(DEMO_LESSONS[lessonTitle]);
    }

    // Try GPT-4o
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(generateFallbackLesson(lessonTitle, courseTitle));
    }

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        temperature: 0.7,
        max_tokens: 3000,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: `You are a world-class medical educator creating an interactive lesson for GENESIS, an advanced medical learning platform. Generate comprehensive, accurate, engaging lesson content.

Return JSON with this exact structure:
{
  "title": "lesson title",
  "sections": [
    {
      "heading": "section heading",
      "content": "detailed content with **bold** for key terms, bullet points with •, and numbered lists. 2-4 paragraphs per section.",
      "keyPoints": ["key point 1", "key point 2", "key point 3"]
    }
  ],
  "summary": "2-3 sentence summary of the entire lesson",
  "quiz": [
    {
      "question": "quiz question",
      "options": ["option A", "option B", "option C", "option D"],
      "correctIndex": 0,
      "explanation": "why this answer is correct"
    }
  ]
}

Requirements:
- 3-4 sections per lesson
- 3-4 key points per section
- 3 quiz questions per lesson
- Content should be medically accurate and at undergraduate level
- Use engaging language but maintain scientific rigor
- Include clinical correlations where relevant`,
          },
          {
            role: 'user',
            content: `Generate a lesson for:
Course: ${courseTitle}
Lesson ${(lessonIndex || 0) + 1} of ${totalLessons || '?'}: "${lessonTitle}"
${courseContext ? `Course topics include: ${courseContext}` : ''}`,
          },
        ],
      });

      const raw = JSON.parse(completion.choices[0].message.content || '{}');

      // Normalize response
      const content: LessonContent = {
        title: raw.title || lessonTitle,
        sections: Array.isArray(raw.sections)
          ? raw.sections.map((s: Record<string, unknown>) => ({
              heading: s.heading || s.title || 'Section',
              content: s.content || s.text || s.body || '',
              keyPoints: Array.isArray(s.keyPoints || s.key_points)
                ? (s.keyPoints || s.key_points) as string[]
                : [],
            }))
          : [],
        summary: raw.summary || raw.conclusion || '',
        quiz: Array.isArray(raw.quiz || raw.questions)
          ? (raw.quiz || raw.questions).map((q: Record<string, unknown>) => ({
              question: q.question || '',
              options: Array.isArray(q.options || q.choices) ? (q.options || q.choices) as string[] : [],
              correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : (q.correct_index as number) || 0,
              explanation: q.explanation || '',
            }))
          : [],
      };

      return NextResponse.json(content);
    } catch (aiError) {
      console.error('OpenAI error, using fallback:', aiError);
      return NextResponse.json(generateFallbackLesson(lessonTitle, courseTitle));
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

function generateFallbackLesson(lessonTitle: string, courseTitle: string): LessonContent {
  return {
    title: lessonTitle,
    sections: [
      {
        heading: `Understanding ${lessonTitle}`,
        content: `This lesson covers the fundamental concepts of **${lessonTitle}** as part of the ${courseTitle} curriculum. This topic is essential for building a comprehensive understanding of medical science.\n\nThe study of ${lessonTitle.toLowerCase()} has evolved significantly over centuries of medical research and clinical observation. Modern understanding combines classical anatomical knowledge with cutting-edge molecular biology and imaging technology.\n\nAs you progress through this lesson, pay attention to the key relationships between structure and function — this theme recurs throughout all of medicine.`,
        keyPoints: [
          `Core concepts of ${lessonTitle}`,
          'Structure-function relationships',
          'Clinical relevance and applications',
          'Historical development of this field',
        ],
      },
      {
        heading: 'Key Principles',
        content: `Several fundamental principles underpin our understanding of ${lessonTitle.toLowerCase()}:\n\n• **Homeostasis** — The body constantly works to maintain stable internal conditions. Every structure and process we study serves this goal directly or indirectly.\n\n• **Complementarity of Structure and Function** — Form follows function. The structure of every cell, tissue, and organ is optimized for its specific role.\n\n• **Hierarchy of Organization** — Simple components combine into increasingly complex systems. Understanding each level is crucial for grasping the whole.\n\n• **Integration** — No system operates in isolation. Understanding the connections between different body systems is as important as understanding each system individually.`,
        keyPoints: [
          'Homeostasis: maintaining internal stability',
          'Structure complements function',
          'Hierarchical organization from cells to systems',
          'Integration between body systems',
        ],
      },
      {
        heading: 'Clinical Applications',
        content: `The knowledge gained from studying ${lessonTitle.toLowerCase()} has direct clinical applications:\n\n**Diagnosis** — Understanding normal anatomy and physiology allows clinicians to recognize when something is abnormal. Many diagnostic techniques (physical examination, imaging, lab tests) are rooted in anatomical and physiological knowledge.\n\n**Treatment** — Whether surgical, pharmacological, or rehabilitative, treatment approaches are designed based on understanding of body structure and function.\n\n**Prevention** — Knowledge of how diseases develop (pathophysiology) enables preventive strategies, from vaccines to lifestyle modifications.\n\nModern medicine increasingly relies on understanding these fundamentals at the molecular level, leading to personalized treatment approaches tailored to individual patients.`,
        keyPoints: [
          'Foundation for diagnostic reasoning',
          'Basis for treatment design',
          'Enables preventive medicine',
          'Supports personalized medicine',
        ],
      },
    ],
    summary: `${lessonTitle} is a critical component of the ${courseTitle} curriculum, providing foundational knowledge that connects structure to function. Understanding these concepts is essential for clinical reasoning, diagnosis, and treatment planning.`,
    quiz: [
      {
        question: `Which principle states that the structure of a body part is designed for its specific role?`,
        options: ['Homeostasis', 'Complementarity of structure and function', 'Hierarchy of organization', 'Cellular adaptation'],
        correctIndex: 1,
        explanation: 'The complementarity of structure and function principle states that form follows function — every structure is optimized for its specific role in the body.',
      },
      {
        question: 'What is homeostasis?',
        options: ['Cell division', 'Maintaining stable internal conditions', 'Genetic inheritance', 'Tissue repair'],
        correctIndex: 1,
        explanation: 'Homeostasis is the body\'s ability to maintain stable internal conditions (temperature, pH, blood glucose, etc.) despite changing external environments.',
      },
      {
        question: 'Which approach to medicine uses knowledge of how diseases develop to prevent them?',
        options: ['Surgical medicine', 'Emergency medicine', 'Preventive medicine', 'Rehabilitative medicine'],
        correctIndex: 2,
        explanation: 'Preventive medicine uses understanding of pathophysiology (how diseases develop) to implement strategies like vaccines, screenings, and lifestyle modifications.',
      },
    ],
  };
}

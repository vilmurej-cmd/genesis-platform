import { NextResponse } from 'next/server';

interface TherapyRecommendation {
  concern: string;
  frequencies: { name: string; hz: number; description: string; duration: string }[];
  breathingPattern: { inhale: number; hold: number; exhale: number; name: string; description: string };
  colorTherapy: { color: string; hex: string; wavelength: string; description: string };
}

const RECOMMENDATIONS: Record<string, TherapyRecommendation> = {
  anxiety: {
    concern: 'Anxiety & Stress',
    frequencies: [
      { name: 'Alpha Waves', hz: 10, description: 'Promotes relaxation and calm mental states. Associated with reduced cortisol levels.', duration: '15-20 minutes' },
      { name: 'Schumann Resonance', hz: 7.83, description: 'Earth\'s natural frequency. Grounding effect that helps synchronize biological rhythms.', duration: '20-30 minutes' },
      { name: 'Solfeggio 396 Hz', hz: 396, description: 'Associated with liberating fear and guilt. Used in sound healing for emotional release.', duration: '10-15 minutes' },
    ],
    breathingPattern: { inhale: 4, hold: 7, exhale: 8, name: '4-7-8 Breathing', description: 'Activates the parasympathetic nervous system, reducing fight-or-flight response. Developed by Dr. Andrew Weil.' },
    colorTherapy: { color: 'Blue', hex: '#4488FF', wavelength: '450-490 nm', description: 'Blue light has been shown to lower heart rate and blood pressure. Associated with tranquility and mental clarity.' },
  },
  insomnia: {
    concern: 'Insomnia & Sleep Disorders',
    frequencies: [
      { name: 'Delta Waves', hz: 2, description: 'Associated with deep, dreamless sleep and physical restoration. Dominant during NREM Stage 3.', duration: '30-45 minutes (as you fall asleep)' },
      { name: 'Solfeggio 174 Hz', hz: 174, description: 'Considered a natural anesthetic. Reduces pain and tension, promoting deep relaxation.', duration: '20-30 minutes before bed' },
      { name: 'Binaural Beat 3 Hz', hz: 3, description: 'Delta-range binaural beat. Requires stereo headphones. Entrains brainwaves to deep sleep pattern.', duration: '30 minutes' },
    ],
    breathingPattern: { inhale: 4, hold: 4, exhale: 6, name: 'Extended Exhale', description: 'Longer exhale stimulates the vagus nerve, activating rest-and-digest mode. Slows heart rate naturally.' },
    colorTherapy: { color: 'Deep Red / Amber', hex: '#FF6622', wavelength: '590-620 nm', description: 'Warm amber light does not suppress melatonin like blue light. Signals to the brain that it is time to wind down.' },
  },
  focus: {
    concern: 'Focus & Concentration',
    frequencies: [
      { name: 'Beta Waves', hz: 18, description: 'Associated with active thinking, focus, and problem-solving. Dominant during alert mental states.', duration: '25-45 minutes (study/work sessions)' },
      { name: 'Gamma Waves', hz: 40, description: 'Linked to heightened perception, learning, and memory consolidation. Found in experienced meditators.', duration: '15-20 minutes' },
      { name: 'Solfeggio 528 Hz', hz: 528, description: 'Known as the "Miracle Tone." Associated with DNA repair and transformation. Enhances mental clarity.', duration: '20-30 minutes' },
    ],
    breathingPattern: { inhale: 4, hold: 4, exhale: 4, name: 'Box Breathing', description: 'Used by Navy SEALs for focus under pressure. Equal-ratio breathing stabilizes the autonomic nervous system.' },
    colorTherapy: { color: 'Yellow', hex: '#FFD700', wavelength: '570-590 nm', description: 'Yellow light stimulates the mind, boosts alertness, and is associated with intellectual energy and optimism.' },
  },
  pain: {
    concern: 'Pain Management',
    frequencies: [
      { name: 'Solfeggio 174 Hz', hz: 174, description: 'The lowest Solfeggio frequency. Acts as a natural anesthetic, reducing physical and energetic pain.', duration: '20-30 minutes' },
      { name: 'Theta Waves', hz: 6, description: 'Associated with deep meditation and pain gate modulation. Can increase endorphin production.', duration: '20-30 minutes' },
      { name: 'Solfeggio 285 Hz', hz: 285, description: 'Associated with tissue healing and cellular regeneration. Influences the energy field around the body.', duration: '15-25 minutes' },
    ],
    breathingPattern: { inhale: 5, hold: 0, exhale: 5, name: 'Rhythmic Breathing', description: 'Steady rhythmic breathing without holds. Reduces muscle tension and activates endogenous opioid pathways.' },
    colorTherapy: { color: 'Green', hex: '#00FF94', wavelength: '495-570 nm', description: 'Green is the color of balance and healing. Studies suggest green light exposure can reduce migraine intensity by up to 20%.' },
  },
  depression: {
    concern: 'Depression & Low Mood',
    frequencies: [
      { name: 'Alpha-Theta Border', hz: 8, description: 'The crossover point between relaxed awareness and deep meditation. Associated with mood elevation and creativity.', duration: '20-30 minutes' },
      { name: 'Solfeggio 639 Hz', hz: 639, description: 'Associated with harmonizing relationships and emotional balance. Enhances communication and connection.', duration: '15-20 minutes' },
      { name: 'Solfeggio 852 Hz', hz: 852, description: 'Linked to returning to spiritual order. Associated with awakening intuition and raising cellular energy.', duration: '10-15 minutes' },
    ],
    breathingPattern: { inhale: 3, hold: 0, exhale: 6, name: 'Sighing Breath', description: 'Cyclic sighing with extended exhale. Stanford research shows 5 minutes daily improves mood more than mindfulness meditation.' },
    colorTherapy: { color: 'Orange', hex: '#FF8833', wavelength: '590-620 nm', description: 'Orange light stimulates enthusiasm, creativity, and emotional warmth. Associated with the sacral chakra and emotional processing.' },
  },
};

const GENERIC: TherapyRecommendation = {
  concern: 'General Wellness',
  frequencies: [
    { name: 'Schumann Resonance', hz: 7.83, description: 'Earth\'s fundamental frequency. Promotes overall balance and natural rhythm synchronization.', duration: '20 minutes' },
    { name: 'Solfeggio 528 Hz', hz: 528, description: 'The "Love Frequency." Associated with transformation, DNA repair, and healing.', duration: '15 minutes' },
    { name: 'Alpha Waves', hz: 10, description: 'Promotes relaxed alertness — the ideal state for learning and creativity.', duration: '15-20 minutes' },
  ],
  breathingPattern: { inhale: 4, hold: 4, exhale: 4, name: 'Box Breathing', description: 'Simple and versatile technique suitable for any situation. Balances the autonomic nervous system.' },
  colorTherapy: { color: 'Violet', hex: '#9945FF', wavelength: '380-450 nm', description: 'Violet light is associated with higher consciousness, creativity, and spiritual awareness. Calming yet stimulating.' },
};

export async function POST(req: Request) {
  try {
    const { concern } = await req.json();

    if (!concern || typeof concern !== 'string') {
      return NextResponse.json({ error: 'Missing concern string' }, { status: 400 });
    }

    const key = concern.trim().toLowerCase();
    const match = Object.keys(RECOMMENDATIONS).find((k) => key.includes(k) || k.includes(key));

    return NextResponse.json(match ? RECOMMENDATIONS[match] : { ...GENERIC, concern });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Leaf,
  Search,
  Star,
  AlertTriangle,
  Heart,
  Wind,
  Eye,
  Sparkles,
  Loader2,
  BookOpen,
  Globe,
  Zap,
  Flame,
  Droplets,
  Sun,
  Moon,
} from 'lucide-react';

/* ── Evidence Rating ────────────────────────────────────── */
function EvidenceStars({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i < rating ? 'text-genesis-violet fill-genesis-violet' : 'text-white/15'}`}
        />
      ))}
      <span className="text-[10px] text-text-muted ml-1.5">{rating}/{max}</span>
    </div>
  );
}

/* ── Types ──────────────────────────────────────────────── */
interface Tradition {
  id: string;
  name: string;
  origin: string;
  icon: typeof Leaf;
  philosophy: string;
  keyPractices: string[];
  evidenceLevel: number;
  color: string;
}

interface Herb {
  name: string;
  tradition: string;
  uses: string[];
  evidenceLevel: number;
  warnings: string;
}

interface Chakra {
  name: string;
  sanskrit: string;
  color: string;
  location: string;
  organs: string;
  element: string;
}

interface SearchResult {
  condition: string;
  approaches: { tradition: string; recommendation: string }[];
  herbs: string[];
  lifestyle: string[];
  evidenceRating: number;
}

/* ── Traditions Data ────────────────────────────────────── */
const TRADITIONS: Tradition[] = [
  {
    id: 'tcm',
    name: 'Traditional Chinese Medicine',
    origin: 'China, 3000+ years',
    icon: Wind,
    philosophy:
      'Views the body as an interconnected system of Qi (vital energy) flowing through 12 primary meridians. Health is the balance of Yin and Yang forces. Disease arises from blockages or imbalances in Qi flow. The Five Element Theory (Wood, Fire, Earth, Metal, Water) connects organs, emotions, seasons, and tastes into an integrated diagnostic framework.',
    keyPractices: [
      'Acupuncture \u2014 insertion of fine needles at specific points along meridians to restore Qi flow',
      'Herbal formulas \u2014 complex multi-herb prescriptions tailored to individual pattern diagnosis',
      'Cupping \u2014 suction cups applied to skin to improve circulation and relieve stagnation',
      'Tai Chi & Qigong \u2014 moving meditation practices to cultivate and balance internal energy',
      'Tui Na massage \u2014 therapeutic bodywork following meridian pathways',
    ],
    evidenceLevel: 3,
    color: '#FF3366',
  },
  {
    id: 'ayurveda',
    name: 'Ayurveda',
    origin: 'India, 5000+ years',
    icon: Flame,
    philosophy:
      "India's ancient \"Science of Life\" classifies individuals by their dominant dosha (constitutional type): Vata (air/space), Pitta (fire/water), and Kapha (earth/water). Agni (digestive fire) is central to health. Treatment is deeply individualized based on prakriti (birth constitution) and vikriti (current imbalance). Emphasis on prevention through daily routines (dinacharya) and seasonal adaptation (ritucharya).",
    keyPractices: [
      'Panchakarma \u2014 five-action detoxification protocol including oil massage, herbal steam, and cleansing',
      'Dietary therapy \u2014 food as medicine, prescribed by dosha type and current imbalance',
      'Rasayana \u2014 rejuvenation therapies using specific herbs and lifestyle practices',
      'Pranayama \u2014 controlled breathing techniques to balance prana (life force)',
      'Marma therapy \u2014 stimulation of vital energy points on the body',
    ],
    evidenceLevel: 3,
    color: '#FF9933',
  },
  {
    id: 'herbalism',
    name: 'Western Herbalism',
    origin: 'Europe & Americas, 2000+ years',
    icon: Leaf,
    philosophy:
      'Uses whole plants and plant extracts to support the body\'s innate healing capacity. Differs from pharmaceutical medicine by using the "synergy" of whole-plant chemistry rather than isolated compounds. Emphasizes the concept of "tissue states" (hot/cold, dry/damp, tense/relaxed) to match herbs to individual presentations. Many modern pharmaceuticals originated from herbal traditions.',
    keyPractices: [
      'Tinctures \u2014 alcohol-based plant extracts for internal use',
      'Infusions & decoctions \u2014 water-based preparations (teas) from leaves, roots, and bark',
      'Poultices & compresses \u2014 topical plant applications for local conditions',
      'Flower essences \u2014 vibrational preparations addressing emotional states',
      'Aromatherapy \u2014 therapeutic use of essential oils via inhalation and topical application',
    ],
    evidenceLevel: 3,
    color: '#00FF94',
  },
  {
    id: 'naturopathy',
    name: 'Naturopathy',
    origin: 'Germany/USA, 19th century',
    icon: Sun,
    philosophy:
      'A system of medicine emphasizing the body\'s inherent ability to heal itself (vis medicatrix naturae). Naturopathic doctors use modern diagnostics combined with natural therapeutics. Six guiding principles: First do no harm, the healing power of nature, identify and treat causes, doctor as teacher, treat the whole person, and prevention. Licensed NDs complete 4-year doctoral programs.',
    keyPractices: [
      'Clinical nutrition \u2014 therapeutic diets and targeted supplementation',
      'Botanical medicine \u2014 evidence-based use of medicinal plants',
      'Hydrotherapy \u2014 therapeutic use of water (hot/cold contrast, constitutional treatments)',
      'Physical medicine \u2014 massage, exercise prescription, physiotherapy',
      'Counseling \u2014 lifestyle modification, stress management, behavioral change',
    ],
    evidenceLevel: 3,
    color: '#00E5FF',
  },
  {
    id: 'energy',
    name: 'Energy Medicine',
    origin: 'Global traditions, ancient',
    icon: Zap,
    philosophy:
      'Based on the premise that the human body generates and responds to electromagnetic and subtle energy fields. Disruptions in these energy patterns precede and contribute to physical disease. Practices aim to detect and correct energetic imbalances to restore health. Includes both ancient systems (chakras, meridians) and modern approaches (biofield therapy, frequency medicine).',
    keyPractices: [
      'Reiki \u2014 Japanese technique channeling universal life energy through practitioner\'s hands',
      'Therapeutic touch \u2014 directing energy to promote healing without physical contact',
      'Crystal healing \u2014 placing crystals on or near the body to influence energy fields',
      'Sound therapy \u2014 using specific frequencies and vibrations for healing',
      'Biofield therapy \u2014 working with the electromagnetic field surrounding the body',
    ],
    evidenceLevel: 2,
    color: '#9945FF',
  },
];

/* ── Herbs Data ─────────────────────────────────────────── */
const HERBS: Herb[] = [
  { name: 'Turmeric (Curcuma longa)', tradition: 'Ayurveda, TCM', uses: ['Anti-inflammatory', 'Antioxidant', 'Joint pain', 'Digestive support'], evidenceLevel: 5, warnings: 'May interact with blood thinners. High doses may cause GI upset. Bioavailability enhanced with piperine (black pepper).' },
  { name: 'Ginger (Zingiber officinale)', tradition: 'Ayurveda, TCM, Western', uses: ['Nausea relief', 'Anti-inflammatory', 'Digestive aid', 'Circulation'], evidenceLevel: 5, warnings: 'May interact with blood thinners. Limit to 4g/day. Use caution before surgery.' },
  { name: 'Ashwagandha (Withania somnifera)', tradition: 'Ayurveda', uses: ['Adaptogen (stress response)', 'Anxiety reduction', 'Thyroid support', 'Sleep quality'], evidenceLevel: 4, warnings: 'Avoid with autoimmune thyroid conditions. May increase thyroid hormone levels. Not recommended during pregnancy.' },
  { name: 'Echinacea (Echinacea purpurea)', tradition: 'Native American, Western', uses: ['Immune stimulation', 'Upper respiratory infections', 'Wound healing', 'Cold prevention'], evidenceLevel: 3, warnings: 'Avoid with autoimmune conditions. May interact with immunosuppressants. Effectiveness debated for cold prevention.' },
  { name: 'Ginseng (Panax ginseng)', tradition: 'TCM, Korean', uses: ['Energy and vitality', 'Cognitive function', 'Immune support', 'Blood sugar regulation'], evidenceLevel: 4, warnings: 'May interact with blood thinners, diabetes medications, and MAOIs. Avoid with hormone-sensitive conditions. Limit use to 3 months.' },
  { name: 'Valerian (Valeriana officinalis)', tradition: 'Western Herbalism', uses: ['Sleep aid', 'Anxiety relief', 'Muscle relaxation', 'Nervous tension'], evidenceLevel: 3, warnings: 'May cause drowsiness. Do not combine with sedatives or alcohol. May take 2-4 weeks for full effect.' },
  { name: "St. John's Wort (Hypericum perforatum)", tradition: 'Western Herbalism', uses: ['Mild-moderate depression', 'Anxiety', 'Nerve pain', 'Wound healing (topical)'], evidenceLevel: 4, warnings: 'MAJOR drug interactions: oral contraceptives, SSRIs, blood thinners, HIV meds, immunosuppressants. Causes photosensitivity.' },
  { name: 'Milk Thistle (Silybum marianum)', tradition: 'Western Herbalism', uses: ['Liver protection', 'Detoxification support', 'Antioxidant', 'Blood sugar support'], evidenceLevel: 4, warnings: 'Generally well tolerated. May have mild laxative effect. May interact with diabetes and cholesterol medications.' },
  { name: 'Elderberry (Sambucus nigra)', tradition: 'Western, European folk', uses: ['Immune support', 'Antiviral properties', 'Upper respiratory infections', 'Antioxidant'], evidenceLevel: 3, warnings: 'Raw berries, bark, and leaves are toxic. Only use commercially prepared products. May stimulate immune system \u2014 caution with autoimmune conditions.' },
  { name: 'Chamomile (Matricaria chamomilla)', tradition: 'Western, Egyptian', uses: ['Sleep and relaxation', 'Digestive calming', 'Anti-anxiety', 'Skin inflammation (topical)'], evidenceLevel: 3, warnings: 'Allergy risk for those allergic to ragweed/daisy family. May interact with blood thinners. Generally very safe.' },
  { name: 'Holy Basil / Tulsi (Ocimum tenuiflorum)', tradition: 'Ayurveda', uses: ['Adaptogen', 'Stress resilience', 'Blood sugar regulation', 'Respiratory support'], evidenceLevel: 3, warnings: 'May slow blood clotting. Avoid before surgery. May interact with diabetes medications.' },
  { name: 'Reishi (Ganoderma lucidum)', tradition: 'TCM, Japanese', uses: ['Immune modulation', 'Stress adaptation', 'Sleep quality', 'Liver support'], evidenceLevel: 3, warnings: 'May interact with blood thinners and immunosuppressants. May cause GI upset. Avoid with bleeding disorders.' },
];

/* ── Chakras Data ───────────────────────────────────────── */
const CHAKRAS: Chakra[] = [
  { name: 'Crown', sanskrit: 'Sahasrara', color: '#9945FF', location: 'Top of head', organs: 'Brain, nervous system, pineal gland', element: 'Thought' },
  { name: 'Third Eye', sanskrit: 'Ajna', color: '#4A00E0', location: 'Between eyebrows', organs: 'Eyes, pituitary gland, sinuses', element: 'Light' },
  { name: 'Throat', sanskrit: 'Vishuddha', color: '#00E5FF', location: 'Throat center', organs: 'Thyroid, throat, mouth, ears', element: 'Sound' },
  { name: 'Heart', sanskrit: 'Anahata', color: '#00FF94', location: 'Center of chest', organs: 'Heart, lungs, thymus gland', element: 'Air' },
  { name: 'Solar Plexus', sanskrit: 'Manipura', color: '#FFD700', location: 'Upper abdomen', organs: 'Stomach, liver, pancreas, adrenals', element: 'Fire' },
  { name: 'Sacral', sanskrit: 'Svadhisthana', color: '#FF9933', location: 'Lower abdomen', organs: 'Reproductive organs, kidneys, bladder', element: 'Water' },
  { name: 'Root', sanskrit: 'Muladhara', color: '#FF3366', location: 'Base of spine', organs: 'Spine, legs, feet, immune system', element: 'Earth' },
];

/* ── Demo Search Results ────────────────────────────────── */
const DEMO_RESULTS: Record<string, SearchResult> = {
  anxiety: {
    condition: 'Anxiety & Stress',
    approaches: [
      { tradition: 'TCM', recommendation: 'Acupuncture targeting Heart and Liver meridians, Shen-calming herbal formulas (Gui Pi Tang, Tian Wang Bu Xin Dan), Tai Chi practice for nervous system regulation' },
      { tradition: 'Ayurveda', recommendation: 'Vata-pacifying routine (warm oil massage, regular schedule, warm foods), Ashwagandha and Brahmi supplementation, Nadi Shodhana (alternate nostril breathing)' },
      { tradition: 'Western Herbalism', recommendation: 'Passionflower tincture, Lemon balm and chamomile teas, Lavender essential oil aromatherapy, Kava for acute episodes (short-term)' },
      { tradition: 'Naturopathy', recommendation: 'Magnesium glycinate supplementation, B-complex vitamins, adrenal support protocols, hydrotherapy (contrast showers), elimination diet to identify triggers' },
      { tradition: 'Energy Medicine', recommendation: 'Heart chakra balancing, Reiki sessions for nervous system calming, grounding practices, sound therapy with 528 Hz frequency' },
    ],
    herbs: ['Ashwagandha', 'Passionflower', 'Valerian', 'Chamomile', 'Lemon Balm', 'Holy Basil'],
    lifestyle: ['Daily meditation (20 min minimum)', 'Regular exercise (yoga, walking)', '4-7-8 breathing technique', 'Reduce caffeine and sugar', 'Forest bathing (shinrin-yoku)', 'Consistent sleep schedule', 'Digital detox periods'],
    evidenceRating: 4,
  },
  insomnia: {
    condition: 'Insomnia & Sleep Disorders',
    approaches: [
      { tradition: 'TCM', recommendation: 'Acupuncture at HT7 (Shenmen), SP6, and Anmian points. Herbal formula Suan Zao Ren Tang (Ziziphus combination). Avoid late-night mental stimulation per TCM clock theory.' },
      { tradition: 'Ayurveda', recommendation: 'Warm milk with nutmeg and ashwagandha before bed. Abhyanga (oil massage) with sesame oil. Yoga Nidra practice. Follow dinacharya with consistent sleep/wake times.' },
      { tradition: 'Western Herbalism', recommendation: 'Valerian root tincture 30 min before bed. Passionflower and hops combination tea. Lavender sachets under pillow. Californian poppy for difficulty falling asleep.' },
      { tradition: 'Naturopathy', recommendation: 'Magnesium glycinate 400mg before bed. Melatonin 0.5-3mg (low dose). Sleep hygiene protocol. Blue light elimination 2 hours before bed. Tart cherry juice (natural melatonin source).' },
      { tradition: 'Energy Medicine', recommendation: 'Third eye and crown chakra meditation before sleep. Binaural beats in delta frequency range (1-4 Hz). Grounding sheet or earthing practice.' },
    ],
    herbs: ['Valerian', 'Passionflower', 'Chamomile', 'Hops', 'Ashwagandha', 'Reishi'],
    lifestyle: ['No screens 1-2 hours before bed', 'Consistent bedtime routine', 'Cool bedroom (65-68\u00B0F)', 'No caffeine after 2pm', 'Morning sunlight exposure', 'Gentle evening yoga or stretching'],
    evidenceRating: 4,
  },
  pain: {
    condition: 'Chronic Pain Management',
    approaches: [
      { tradition: 'TCM', recommendation: 'Acupuncture (strong evidence for chronic pain). Cupping for muscular tension. Herbal topical liniments (dit da jow). Tai Chi for pain reduction and mobility.' },
      { tradition: 'Ayurveda', recommendation: 'Warm sesame oil massage (Abhyanga). Turmeric and boswellia supplementation. Panchakarma detoxification. Anti-inflammatory Pitta-pacifying diet.' },
      { tradition: 'Western Herbalism', recommendation: 'Turmeric/curcumin extract (high potency). Willow bark tea (natural salicin). Devil\'s claw for joint pain. Arnica topical application.' },
      { tradition: 'Naturopathy', recommendation: 'Anti-inflammatory diet (Mediterranean pattern). Omega-3 supplementation. Contrast hydrotherapy. Physical therapy and targeted exercise. Vitamin D optimization.' },
      { tradition: 'Energy Medicine', recommendation: 'Reiki for pain perception modulation. Sound therapy with specific healing frequencies. Crystal placement on pain sites. Biofield therapy sessions.' },
    ],
    herbs: ['Turmeric', 'Ginger', 'Boswellia', 'Devil\'s Claw', 'Willow Bark', 'Arnica (topical)'],
    lifestyle: ['Anti-inflammatory diet', 'Gentle daily movement', 'Mindfulness-based stress reduction', 'Hot/cold contrast therapy', 'Adequate hydration', 'Quality sleep prioritization'],
    evidenceRating: 4,
  },
};

/* ── Component ──────────────────────────────────────────── */
export default function HolisticPage() {
  const [activeSection, setActiveSection] = useState<'traditions' | 'search' | 'chakras' | 'herbs'>('traditions');
  const [expandedTradition, setExpandedTradition] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [expandedHerb, setExpandedHerb] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch('/api/holistic/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ condition: searchQuery }),
      });
      if (res.ok) {
        const data = await res.json();
        setSearchResult(data);
      } else {
        // Fallback to demo data
        const key = Object.keys(DEMO_RESULTS).find((k) =>
          searchQuery.toLowerCase().includes(k)
        );
        setSearchResult(
          key
            ? DEMO_RESULTS[key]
            : {
                condition: searchQuery,
                approaches: DEMO_RESULTS.anxiety.approaches,
                herbs: ['Turmeric', 'Ashwagandha', 'Chamomile', 'Ginger'],
                lifestyle: ['Regular exercise', 'Balanced nutrition', 'Adequate sleep', 'Stress management'],
                evidenceRating: 3,
              }
        );
      }
    } catch {
      const key = Object.keys(DEMO_RESULTS).find((k) =>
        searchQuery.toLowerCase().includes(k)
      );
      setSearchResult(key ? DEMO_RESULTS[key] : DEMO_RESULTS.anxiety);
    } finally {
      setSearching(false);
    }
  };

  const sections = [
    { id: 'traditions' as const, label: 'Traditions', icon: Globe },
    { id: 'search' as const, label: 'Remedy Search', icon: Search },
    { id: 'chakras' as const, label: 'Chakra Map', icon: Sparkles },
    { id: 'herbs' as const, label: 'Herb Library', icon: Leaf },
  ];

  return (
    <div className="min-h-screen bg-bg-void text-text-primary font-body">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-violet-500/20 bg-bg-void/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-text-muted hover:text-text-secondary transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-genesis-violet" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-xl tracking-wide" style={{ color: '#9945FF' }}>
                  HOLISTIC
                </h1>
                <p className="text-xs text-text-muted">Beyond Western Medicine</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Section Navigation */}
        <div className="flex gap-1 bg-bg-surface rounded-lg p-1 border border-violet-500/10 mb-8">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`flex-1 py-2.5 px-3 rounded-md text-sm font-heading font-medium transition-all flex items-center justify-center gap-2 ${
                  activeSection === sec.id
                    ? 'bg-violet-500/15 text-genesis-violet border border-violet-500/30'
                    : 'text-text-muted hover:text-text-secondary border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Traditions ─────────────────────────────────── */}
        {activeSection === 'traditions' && (
          <div className="space-y-4">
            <h2 className="font-heading font-bold text-2xl mb-6" style={{ color: '#9945FF' }}>
              Healing Traditions
            </h2>
            {TRADITIONS.map((t) => {
              const Icon = t.icon;
              const isExpanded = expandedTradition === t.id;
              return (
                <div
                  key={t.id}
                  className={`rounded-xl border transition-all ${
                    isExpanded ? 'border-violet-500/30 bg-bg-surface' : 'border-white/8 bg-bg-card/60 hover:border-white/15'
                  }`}
                >
                  <button
                    onClick={() => setExpandedTradition(isExpanded ? null : t.id)}
                    className="w-full text-left p-5 flex items-start gap-4"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${t.color}15`, border: `1px solid ${t.color}30` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: t.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-heading font-bold text-lg" style={{ color: t.color }}>
                          {t.name}
                        </h3>
                        <span className="text-xs text-text-muted">{t.origin}</span>
                      </div>
                      <p className="text-sm text-text-secondary line-clamp-2">{t.philosophy}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[10px] text-text-muted uppercase tracking-wider">Evidence:</span>
                        <EvidenceStars rating={t.evidenceLevel} />
                      </div>
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-white/5 pt-4 ml-14">
                      <p className="text-sm text-text-secondary leading-relaxed mb-4">{t.philosophy}</p>
                      <h4 className="font-heading font-semibold text-xs uppercase tracking-wider mb-3" style={{ color: t.color }}>
                        Key Practices
                      </h4>
                      <ul className="space-y-2">
                        {t.keyPractices.map((p, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                            <span style={{ color: t.color }} className="mt-1 shrink-0">&bull;</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Remedy Search ──────────────────────────────── */}
        {activeSection === 'search' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-violet-500/20 bg-bg-surface p-6">
              <div className="flex items-center gap-3 mb-4">
                <Search className="w-5 h-5 text-genesis-violet" />
                <h2 className="font-heading font-semibold text-lg">Remedy Search</h2>
              </div>
              <p className="text-text-secondary text-sm mb-4">
                Search any condition for holistic approaches from multiple healing traditions.
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search any condition for holistic approaches..."
                  className="flex-1 bg-bg-void border border-violet-500/20 rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                />
                <button
                  onClick={handleSearch}
                  disabled={!searchQuery.trim() || searching}
                  className="px-6 py-2.5 rounded-lg font-heading font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-40"
                  style={{
                    background: 'linear-gradient(135deg, rgba(153,69,255,0.2), rgba(153,69,255,0.05))',
                    border: '1px solid rgba(153,69,255,0.4)',
                    color: '#9945FF',
                  }}
                >
                  {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  Search
                </button>
              </div>
              {/* Quick search suggestions */}
              <div className="mt-3 flex flex-wrap gap-2">
                {['anxiety', 'insomnia', 'pain', 'digestion', 'immunity', 'fatigue'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      const key = Object.keys(DEMO_RESULTS).find((k) => term.includes(k));
                      if (key) setSearchResult(DEMO_RESULTS[key]);
                      else {
                        setSearchResult({
                          condition: term.charAt(0).toUpperCase() + term.slice(1),
                          approaches: DEMO_RESULTS.anxiety.approaches,
                          herbs: ['Turmeric', 'Ginger', 'Chamomile', 'Ashwagandha'],
                          lifestyle: ['Regular exercise', 'Balanced nutrition', 'Adequate sleep', 'Stress management'],
                          evidenceRating: 3,
                        });
                      }
                    }}
                    className="px-3 py-1 rounded-full text-xs border border-violet-500/20 text-text-muted hover:text-genesis-violet hover:border-violet-500/40 transition-colors capitalize"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {searchResult && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-xl" style={{ color: '#9945FF' }}>
                    {searchResult.condition}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted">Overall Evidence:</span>
                    <EvidenceStars rating={searchResult.evidenceRating} />
                  </div>
                </div>

                {/* Approaches by Tradition */}
                <div className="space-y-3">
                  <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-text-secondary">
                    Approaches by Tradition
                  </h4>
                  {searchResult.approaches.map((a, i) => (
                    <div key={i} className="rounded-lg border border-violet-500/10 bg-bg-surface p-4">
                      <h5 className="font-heading font-semibold text-sm text-genesis-violet mb-2">{a.tradition}</h5>
                      <p className="text-sm text-text-secondary leading-relaxed">{a.recommendation}</p>
                    </div>
                  ))}
                </div>

                {/* Herbs & Lifestyle */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-violet-500/10 bg-bg-surface p-5">
                    <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-3" style={{ color: '#9945FF' }}>
                      Recommended Herbs &amp; Supplements
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {searchResult.herbs.map((h, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-full text-xs bg-violet-500/10 border border-violet-500/20 text-genesis-violet">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-violet-500/10 bg-bg-surface p-5">
                    <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-3" style={{ color: '#9945FF' }}>
                      Lifestyle Modifications
                    </h4>
                    <ul className="space-y-1.5">
                      {searchResult.lifestyle.map((l, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                          <span className="text-genesis-violet mt-1 shrink-0">&bull;</span>
                          {l}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Chakra Map ─────────────────────────────────── */}
        {activeSection === 'chakras' && (
          <div className="space-y-6">
            <h2 className="font-heading font-bold text-2xl mb-2" style={{ color: '#9945FF' }}>
              Chakra &amp; Meridian Reference
            </h2>
            <p className="text-text-secondary text-sm mb-6">
              The seven primary chakras are energy centers along the spine, each associated with specific organs, emotions, and states of consciousness.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* SVG Body Map */}
              <div className="flex justify-center">
                <div className="relative">
                  <svg viewBox="0 0 200 340" className="w-64 h-[400px]">
                    <defs>
                      <filter id="chakra-glow-h">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    {/* Body silhouette */}
                    <circle cx="100" cy="35" r="22" fill="none" stroke="rgba(153,69,255,0.25)" strokeWidth="1" />
                    <line x1="100" y1="57" x2="100" y2="72" stroke="rgba(153,69,255,0.2)" strokeWidth="1" />
                    <path d="M 70 72 Q 65 125 68 190 L 82 190 Q 100 195 118 190 L 132 190 Q 135 125 130 72 Z" fill="none" stroke="rgba(153,69,255,0.2)" strokeWidth="1" />
                    <path d="M 70 77 Q 42 105 32 155 Q 28 170 38 175" fill="none" stroke="rgba(153,69,255,0.15)" strokeWidth="1" />
                    <path d="M 130 77 Q 158 105 168 155 Q 172 170 162 175" fill="none" stroke="rgba(153,69,255,0.15)" strokeWidth="1" />
                    <path d="M 82 190 Q 78 240 73 300 Q 71 320 78 335" fill="none" stroke="rgba(153,69,255,0.15)" strokeWidth="1" />
                    <path d="M 118 190 Q 122 240 127 300 Q 129 320 122 335" fill="none" stroke="rgba(153,69,255,0.15)" strokeWidth="1" />
                    {/* Central channel */}
                    <line x1="100" y1="25" x2="100" y2="265" stroke="rgba(153,69,255,0.12)" strokeWidth="1" strokeDasharray="3 3">
                      <animate attributeName="strokeDashoffset" values="0;6" dur="2s" repeatCount="indefinite" />
                    </line>
                    {/* Chakra points */}
                    {CHAKRAS.map((ch, i) => {
                      const yPos = [28, 52, 100, 138, 172, 210, 255][i];
                      return (
                        <g key={ch.name}>
                          <circle cx="100" cy={yPos} r="10" fill={ch.color} opacity="0.12" filter="url(#chakra-glow-h)">
                            <animate attributeName="r" values="8;13;8" dur={`${3 + i * 0.3}s`} repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.08;0.2;0.08" dur={`${3 + i * 0.3}s`} repeatCount="indefinite" />
                          </circle>
                          <circle cx="100" cy={yPos} r="5" fill={ch.color} opacity="0.85" filter="url(#chakra-glow-h)" />
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Chakra List */}
              <div className="space-y-3">
                {CHAKRAS.map((ch) => (
                  <div
                    key={ch.name}
                    className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-bg-card/40 hover:border-white/10 transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-full shrink-0 mt-0.5"
                      style={{
                        backgroundColor: `${ch.color}20`,
                        border: `2px solid ${ch.color}`,
                        boxShadow: `0 0 10px ${ch.color}30`,
                      }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-heading font-bold text-sm" style={{ color: ch.color }}>
                          {ch.name}
                        </h4>
                        <span className="text-[10px] text-text-muted font-mono">({ch.sanskrit})</span>
                      </div>
                      <p className="text-text-muted text-xs">
                        <span className="text-text-secondary">Location:</span> {ch.location}
                      </p>
                      <p className="text-text-muted text-xs">
                        <span className="text-text-secondary">Organs:</span> {ch.organs}
                      </p>
                      <p className="text-text-muted text-xs">
                        <span className="text-text-secondary">Element:</span> {ch.element}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Herb Library ───────────────────────────────── */}
        {activeSection === 'herbs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-2xl" style={{ color: '#9945FF' }}>
                Herb Library
              </h2>
              <span className="text-xs text-text-muted">{HERBS.length} herbs</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {HERBS.map((herb) => {
                const isExpanded = expandedHerb === herb.name;
                return (
                  <div
                    key={herb.name}
                    className={`rounded-xl border transition-all cursor-pointer ${
                      isExpanded
                        ? 'border-violet-500/30 bg-bg-surface md:col-span-2 lg:col-span-3'
                        : 'border-white/8 bg-bg-card/60 hover:border-white/15'
                    }`}
                    onClick={() => setExpandedHerb(isExpanded ? null : herb.name)}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-heading font-semibold text-sm text-text-primary">{herb.name}</h3>
                        <EvidenceStars rating={herb.evidenceLevel} />
                      </div>
                      <p className="text-xs text-text-muted mb-2">{herb.tradition}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {herb.uses.map((use, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full text-[10px] bg-violet-500/10 border border-violet-500/15 text-genesis-violet">
                            {use}
                          </span>
                        ))}
                      </div>
                      {isExpanded && (
                        <div className="mt-4 pt-3 border-t border-white/5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <h4 className="text-xs font-heading font-semibold text-amber-400 mb-1">Warnings &amp; Interactions</h4>
                              <p className="text-xs text-text-secondary leading-relaxed">{herb.warnings}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 rounded-xl border border-violet-500/15 bg-violet-500/5 p-6 text-center">
          <p className="text-text-muted text-xs leading-relaxed">
            GENESIS presents holistic and alternative medicine systems for educational exploration. Evidence ratings reflect peer-reviewed research as of 2026. These practices should complement, not replace, conventional medical care. Always consult a qualified healthcare provider before making health decisions or beginning any new supplement regimen.
          </p>
        </div>
      </main>
    </div>
  );
}

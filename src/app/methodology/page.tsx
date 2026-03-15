export default function MethodologyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl mb-4">
            <span className="text-genesis-cyan glow-cyan">Methodology</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            How GENESIS works — evidence-based, AI-augmented, and built for learning.
          </p>
        </div>

        {/* Principles */}
        <section className="mb-16">
          <h2 className="font-heading font-semibold text-2xl text-text-primary mb-6">Core Principles</h2>
          <div className="space-y-4">
            {[
              {
                title: 'Evidence-Based Foundation',
                desc: 'All medical content in GENESIS is grounded in established clinical knowledge — textbook anatomy, peer-reviewed pathophysiology, FDA-approved pharmacology, and WHO-recognized disease classifications. Our baseline data reflects current medical consensus.',
              },
              {
                title: 'AI-Augmented Analysis',
                desc: "When OpenAI's GPT-4o is available, GENESIS uses it to provide real-time analysis of diseases, drug interactions, forensic cases, and holistic approaches. The AI synthesizes from its training data spanning medical literature, clinical guidelines, and research papers.",
              },
              {
                title: 'Educational First',
                desc: 'Every feature in GENESIS is designed to teach. The platform uses progressive disclosure — starting with high-level summaries and allowing users to drill into detailed pathophysiology, staging, mechanisms, and treatments at their own pace.',
              },
            ].map((p) => (
              <div key={p.title} className="bg-bg-card border border-white/5 rounded-xl p-6">
                <h3 className="font-heading font-semibold text-lg text-genesis-cyan mb-2">{p.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How Each Module Works */}
        <section className="mb-16">
          <h2 className="font-heading font-semibold text-2xl text-text-primary mb-6">How Each Module Works</h2>
          <div className="space-y-6">
            {[
              {
                module: 'ATLAS',
                color: '#00E5FF',
                method: "Body part data is curated from standard anatomical references (Gray's Anatomy, Netter's). Each organ entry includes system classification, core functions, common pathologies, and anatomical relationships. The interactive model uses a simplified body map for navigation.",
              },
              {
                module: 'PATHOLOGY',
                color: '#FF00E5',
                method: 'Disease analysis combines a curated database of common conditions with GPT-4o for real-time queries. Each analysis provides affected body systems, pathophysiology narrative, disease staging, current standard-of-care treatments, and experimental therapies from clinical trial pipelines.',
              },
              {
                module: 'LAB',
                color: '#FFD700',
                method: 'Drug simulation uses AI to predict pharmacological interactions based on known mechanisms of action, receptor affinities, and metabolic pathways. The Mastermind game uses curated condition-to-treatment mappings from clinical pharmacology guidelines. Hypothesis evaluation assesses plausibility against known biochemical principles.',
              },
              {
                module: 'LEARN',
                color: '#00FF94',
                method: 'Quiz content is authored from medical education standards (USMLE Step 1 level material). Questions span anatomy, physiology, pathology, and pharmacology with detailed explanations for each answer. Designed for reinforcement learning through active recall.',
              },
              {
                module: 'FORENSICS',
                color: '#FF3366',
                method: 'Forensic analysis follows the standard medicolegal autopsy framework: cause of death, manner of death, time estimation, toxicology screening, trauma assessment, and investigative recommendations. AI-generated cases follow realistic forensic pathology patterns.',
              },
              {
                module: 'HOLISTIC',
                color: '#9945FF',
                method: 'Holistic approaches are drawn from Traditional Chinese Medicine (TCM), Ayurvedic medicine, Western herbalism, and naturopathic principles. Each recommendation includes an evidence level rating (1-5) based on available clinical research, along with safety warnings and interaction considerations.',
              },
              {
                module: 'THERAPY',
                color: '#0066FF',
                method: 'Sound and frequency recommendations are based on brainwave entrainment research (alpha, beta, theta, delta waves), Solfeggio frequencies from sound healing traditions, and breathing physiology. Color therapy draws from chromotherapy research and photobiology. Evidence quality varies by modality.',
              },
            ].map((m) => (
              <div key={m.module} className="bg-bg-surface border border-white/5 rounded-xl p-6">
                <h3 className="font-heading font-semibold text-sm uppercase tracking-wider mb-3" style={{ color: m.color }}>
                  {m.module}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">{m.method}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Data Sources */}
        <section className="mb-16">
          <div className="bg-bg-card border border-white/5 rounded-2xl p-8">
            <h2 className="font-heading font-semibold text-2xl text-text-primary mb-4">Data Sources &amp; Limitations</h2>
            <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
              <p>
                <strong className="text-text-primary">AI Model:</strong> GENESIS uses OpenAI&apos;s GPT-4o (when available) for real-time medical analysis. GPT-4o was trained on a broad corpus of medical literature, clinical guidelines, and biomedical research. However, its knowledge has a training cutoff and may not reflect the most recent publications or guideline updates.
              </p>
              <p>
                <strong className="text-text-primary">Curated Data:</strong> Demo/fallback content is authored by the GENESIS team based on standard medical references including Harrison&apos;s Principles of Internal Medicine, Robbins Pathologic Basis of Disease, Goodman &amp; Gilman&apos;s Pharmacological Basis of Therapeutics, and current FDA/WHO guidelines.
              </p>
              <p>
                <strong className="text-text-primary">Limitations:</strong> AI-generated content may contain inaccuracies. Medical knowledge evolves rapidly — treatment guidelines, drug approvals, and clinical evidence change regularly. GENESIS should be used as an educational starting point, not as a definitive clinical reference.
              </p>
              <p>
                <strong className="text-text-primary">Holistic &amp; Therapy Modules:</strong> These modules include approaches from non-Western and complementary medicine traditions. Evidence levels vary significantly. Some approaches have robust clinical trial support; others are based on traditional use with limited controlled studies.
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section>
          <div className="bg-genesis-red/5 border border-genesis-red/20 rounded-2xl p-8 text-center">
            <h2 className="font-heading font-semibold text-xl text-genesis-red mb-3">Medical Disclaimer</h2>
            <p className="text-text-secondary text-sm leading-relaxed max-w-2xl mx-auto">
              GENESIS is an educational and exploratory platform designed for learning purposes only.
              It does not provide medical advice, diagnosis, or treatment recommendations. The
              information presented should not be used as a substitute for professional medical
              consultation. Always seek the advice of a qualified healthcare provider with any
              questions regarding a medical condition or treatment.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

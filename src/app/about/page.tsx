export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl mb-4">
            About <span className="text-genesis-cyan glow-cyan">GENESIS</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            The Human Body Discovery Engine
          </p>
        </div>

        {/* Mission */}
        <section className="mb-16">
          <div className="bg-bg-card border border-white/5 rounded-2xl p-8 sm:p-10">
            <h2 className="font-heading font-semibold text-2xl text-text-primary mb-4">Our Mission</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              GENESIS was built with a singular vision: to make the complexity of the human body
              accessible, explorable, and understandable to everyone — from curious students to
              medical professionals seeking a rapid-reference tool.
            </p>
            <p className="text-text-secondary leading-relaxed">
              We believe that understanding the body is the first step to improving human health.
              By combining advanced AI with deep medical knowledge, GENESIS transforms dense
              clinical data into interactive, visual, and intuitive experiences.
            </p>
          </div>
        </section>

        {/* What We Do */}
        <section className="mb-16">
          <h2 className="font-heading font-semibold text-2xl text-text-primary mb-6">What GENESIS Does</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'ATLAS', desc: 'Interactive 3D body exploration with system-by-system breakdowns and detailed organ information.', color: '#00E5FF' },
              { name: 'PATHOLOGY', desc: 'AI-powered disease analysis — pathophysiology, staging, current treatments, and experimental therapies.', color: '#FF00E5' },
              { name: 'LAB', desc: 'Virtual drug simulation, hypothesis testing, and compound analysis powered by GPT-4o.', color: '#FFD700' },
              { name: 'LEARN', desc: 'Medical education modules with interactive quizzes spanning anatomy, physiology, pathology, and pharmacology.', color: '#00FF94' },
              { name: 'FORENSICS', desc: 'Forensic pathology case analysis — cause of death determination, toxicology, and trauma assessment.', color: '#FF3366' },
              { name: 'HOLISTIC', desc: 'Evidence-rated approaches from Traditional Chinese Medicine, Ayurveda, Herbalism, and Naturopathy.', color: '#9945FF' },
              { name: 'THERAPY', desc: 'Sound frequency healing, breathing patterns, and color therapy — backed by emerging neuroscience.', color: '#0066FF' },
            ].map((mod) => (
              <div key={mod.name} className="bg-bg-surface border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors">
                <h3 className="font-heading font-semibold text-sm uppercase tracking-wider mb-2" style={{ color: mod.color }}>
                  {mod.name}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">{mod.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Vision */}
        <section className="mb-16">
          <div className="bg-bg-card border border-white/5 rounded-2xl p-8 sm:p-10">
            <h2 className="font-heading font-semibold text-2xl text-text-primary mb-4">Our Vision</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              We envision a future where anyone — regardless of background or education level — can
              explore the human body with the same depth and clarity once reserved for medical
              professionals. GENESIS is a step toward democratizing medical knowledge.
            </p>
            <p className="text-text-secondary leading-relaxed">
              As AI and biomedical research advance, GENESIS will evolve — integrating genomic data,
              real-time research feeds, and personalized health insights to become the most
              comprehensive human body discovery platform ever built.
            </p>
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <div className="bg-bg-surface border border-white/5 rounded-2xl p-8 sm:p-10 text-center">
            <h2 className="font-heading font-semibold text-2xl text-text-primary mb-4">Built By</h2>
            <p className="text-genesis-cyan font-heading font-bold text-xl glow-cyan mb-2">
              Vilmure Ventures
            </p>
            <p className="text-text-muted text-sm leading-relaxed max-w-lg mx-auto">
              GENESIS is a Vilmure Ventures company — a technology studio focused on building
              AI-powered platforms that solve real problems. From real estate to medicine, we build
              tools that transform industries.
            </p>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="text-center">
          <p className="text-text-muted text-xs leading-relaxed max-w-xl mx-auto">
            GENESIS is an educational and exploratory platform. It does not provide medical advice,
            diagnosis, or treatment. Always consult a qualified healthcare professional for medical
            decisions.
          </p>
        </div>
      </div>
    </div>
  );
}

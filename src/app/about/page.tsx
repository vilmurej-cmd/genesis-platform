import { Sparkles } from 'lucide-react';

const PORTFOLIO = [
  { name: 'EZRE', tagline: 'The Operating System for Real Estate', color: '#00E5FF' },
  { name: 'CLARITY', tagline: 'See the world clearly', color: '#9945FF' },
  { name: 'HARMONY', tagline: 'Music, reimagined', color: '#FF00E5' },
  { name: 'BRIDGE', tagline: 'Connecting what matters', color: '#FF9933' },
  { name: 'LINGUA', tagline: 'Language without borders', color: '#00FF94' },
  { name: 'TRUTH', tagline: 'Unfiltered information', color: '#FF3366' },
  { name: 'GENESIS', tagline: 'The Human Body Discovery Engine', color: '#00E5FF' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero Quote */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
        <Sparkles className="w-8 h-8 text-genesis-gold mx-auto mb-6 opacity-60" />
        <blockquote className="text-2xl sm:text-3xl text-text-primary font-heading font-light italic leading-relaxed mb-6">
          &ldquo;GENESIS was born from a dreamer who believed that the next breakthrough in medicine might not come from a billion-dollar lab, but from a curious mind with the right tools.&rdquo;
        </blockquote>
        <p className="text-text-muted text-sm">A Vilmure Ventures Company</p>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-white/8 bg-bg-card/60 p-8">
            <h2 className="font-heading font-bold text-xl text-genesis-cyan glow-cyan mb-4">Mission</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              To democratize medical knowledge by building the most comprehensive, interactive, and accessible human body exploration platform ever created. We believe that understanding the body should not be locked behind expensive textbooks and medical school tuition. Every curious person deserves the tools to explore, learn, and discover.
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-bg-card/60 p-8">
            <h2 className="font-heading font-bold text-xl text-genesis-magenta glow-magenta mb-4">Vision</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              A world where anyone, anywhere, can explore the human body at the molecular level, simulate diseases, test treatments, and contribute to the collective understanding of human health. GENESIS is not replacing doctors. It is arming the next generation of thinkers, researchers, and healers with knowledge.
            </p>
          </div>
        </div>
      </section>

      {/* What GENESIS Offers */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="font-heading font-bold text-2xl text-text-primary mb-6 text-center">What GENESIS Offers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Interactive Atlas', desc: 'Explore 11 body systems in stunning detail', color: '#00E5FF' },
            { label: 'Disease Simulation', desc: 'Visualize how 1,000+ conditions affect the body', color: '#FF00E5' },
            { label: 'Virtual Lab', desc: 'Test 5,000+ compound combinations', color: '#FFD700' },
            { label: 'Medical Curriculum', desc: '7 structured courses from anatomy to pharmacology', color: '#00FF94' },
            { label: 'Forensic Pathology', desc: 'Determine cause of death through evidence analysis', color: '#FF3366' },
            { label: 'Therapy Studio', desc: 'Sound, light, breathing, and frequency healing', color: '#0066FF' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-white/5 bg-bg-card/40 p-5 hover:border-white/10 transition-all"
            >
              <h3 className="font-heading font-bold text-sm mb-1" style={{ color: item.color }}>
                {item.label}
              </h3>
              <p className="text-text-muted text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="font-heading font-bold text-2xl text-text-primary mb-2 text-center">Vilmure Ventures Portfolio</h2>
        <p className="text-text-muted text-sm text-center mb-8">
          GENESIS is part of the Vilmure Ventures family of platforms.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {PORTFOLIO.map((company) => (
            <div
              key={company.name}
              className="rounded-xl border border-white/5 bg-bg-card/40 p-4 text-center hover:border-white/10 transition-all"
            >
              <h3 className="font-heading font-bold text-lg tracking-wider mb-1" style={{ color: company.color }}>
                {company.name}
              </h3>
              <p className="text-text-muted text-[10px]">{company.tagline}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading font-bold text-2xl text-text-primary mb-6 text-center">Team</h2>
        <div className="rounded-2xl border border-white/5 bg-bg-card/30 p-12 text-center">
          <p className="text-text-muted text-sm">
            GENESIS is built by a small, dedicated team of dreamers, engineers, and medical enthusiasts.
          </p>
          <p className="text-text-muted text-xs mt-2">Team profiles coming soon.</p>
        </div>
      </section>
    </div>
  );
}

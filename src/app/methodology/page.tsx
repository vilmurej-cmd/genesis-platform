export default function MethodologyPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-black text-4xl sm:text-5xl text-text-primary mb-4 text-center">
          Methodology
        </h1>
        <p className="text-text-secondary text-lg text-center mb-16 max-w-2xl mx-auto">
          How GENESIS simulations work, where the data comes from, and what the limitations are.
        </p>

        {/* How Simulations Work */}
        <div className="rounded-2xl border border-white/8 bg-bg-card/60 p-8 mb-8">
          <h2 className="font-heading font-bold text-xl text-genesis-cyan glow-cyan mb-4">How Simulations Work</h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            GENESIS uses AI-powered models to simulate biological processes at multiple levels of abstraction. When you explore a disease in the Pathology module, the system models how cellular changes cascade through tissue, organ, and system levels. When you test a compound in the Lab, the system simulates pharmacokinetic and pharmacodynamic interactions based on known drug properties.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            These are <span className="text-text-primary font-semibold">educational simulations</span>, not clinical predictions. They are designed to help users understand mechanisms and relationships, not to provide treatment guidance. The models simplify enormously complex biological systems into interactive visualizations.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            Simulation outputs are generated using large language models trained on medical literature, combined with structured data from peer-reviewed sources. Results are presented as approximations to aid understanding, not as definitive medical conclusions.
          </p>
        </div>

        {/* Data Sources */}
        <div className="rounded-2xl border border-white/8 bg-bg-card/60 p-8 mb-8">
          <h2 className="font-heading font-bold text-xl text-genesis-magenta glow-magenta mb-4">Data Sources</h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            GENESIS draws from a range of publicly available medical and scientific sources:
          </p>
          <ul className="space-y-2">
            {[
              'PubMed and PubMed Central (NIH) — peer-reviewed medical literature',
              'World Health Organization (WHO) — disease classifications and epidemiology',
              'FDA drug databases — approved compounds, mechanisms, interactions',
              'Medical textbooks and curricula — structured anatomical and physiological knowledge',
              'Cochrane Reviews — systematic reviews of treatment evidence',
              'National Library of Medicine — comprehensive medical reference data',
              'Open-access anatomy and physiology datasets',
            ].map((source, i) => (
              <li key={i} className="text-text-muted text-sm flex items-start gap-2">
                <span className="text-genesis-magenta mt-0.5 flex-shrink-0">&bull;</span>
                {source}
              </li>
            ))}
          </ul>
        </div>

        {/* Evidence Rating System */}
        <div className="rounded-2xl border border-white/8 bg-bg-card/60 p-8 mb-8">
          <h2 className="font-heading font-bold text-xl text-genesis-gold glow-gold mb-4">Evidence Rating System</h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-6">
            Throughout GENESIS, you will see evidence ratings displayed as filled circles (1-5). Here is what each level means:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 font-heading font-semibold text-text-secondary text-xs uppercase tracking-wider">Rating</th>
                  <th className="text-left py-3 px-4 font-heading font-semibold text-text-secondary text-xs uppercase tracking-wider">Level</th>
                  <th className="text-left py-3 px-4 font-heading font-semibold text-text-secondary text-xs uppercase tracking-wider">Description</th>
                  <th className="text-left py-3 px-4 font-heading font-semibold text-text-secondary text-xs uppercase tracking-wider">Example</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { rating: 1, level: 'Anecdotal', desc: 'Based primarily on traditional use, case reports, or limited preliminary studies. Insufficient peer-reviewed evidence.', example: 'Crystal healing, homeopathy' },
                  { rating: 2, level: 'Preliminary', desc: 'Some promising small studies or pilot trials. Mechanism plausible but not well-established. More research needed.', example: 'Grounding/earthing, some herbal remedies' },
                  { rating: 3, level: 'Moderate', desc: 'Multiple studies with generally positive results. Mechanism partially understood. Some systematic reviews available.', example: 'Acupuncture for pain, Ayurvedic herbs' },
                  { rating: 4, level: 'Strong', desc: 'Substantial body of peer-reviewed research. Well-understood mechanisms. Systematic reviews and meta-analyses support efficacy.', example: 'Red light therapy, meditation, yoga' },
                  { rating: 5, level: 'Robust', desc: 'Extensive clinical evidence. Well-established mechanisms. Widely accepted in evidence-based medicine with strong systematic review support.', example: 'Meditation for stress, CBT, established pharmacology' },
                ].map((row) => (
                  <tr key={row.rating} className="border-b border-white/5">
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full border ${
                              i < row.rating ? 'bg-genesis-gold border-genesis-gold/60' : 'bg-transparent border-white/15'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-heading font-semibold text-text-primary text-xs">{row.level}</td>
                    <td className="py-3 px-4 text-text-muted text-xs leading-relaxed">{row.desc}</td>
                    <td className="py-3 px-4 text-text-muted text-xs italic">{row.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Limitations */}
        <div className="rounded-2xl border border-genesis-red/20 bg-genesis-red/5 p-8">
          <h2 className="font-heading font-bold text-xl text-genesis-red mb-4">Limitations & Disclaimers</h2>
          <ul className="space-y-3">
            {[
              'GENESIS is an educational platform. It does not provide medical advice, diagnosis, or treatment recommendations.',
              'Simulations are simplified models of complex biological systems. Real human biology involves interactions that no simulation can fully capture.',
              'Drug interaction simulations are based on known pharmacological data but cannot account for individual genetic variation, comorbidities, or real-time physiological states.',
              'Evidence ratings are based on the state of published research as of early 2026 and may not reflect the most current findings.',
              'Holistic and alternative medicine content is presented for educational exploration. Evidence ratings reflect scientific research, not lived experience or cultural significance.',
              'Always consult qualified healthcare professionals for medical decisions. GENESIS is a learning tool, not a clinical tool.',
            ].map((item, i) => (
              <li key={i} className="text-text-muted text-sm flex items-start gap-2">
                <span className="text-genesis-red mt-0.5 flex-shrink-0">&bull;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-black text-4xl sm:text-5xl text-text-primary mb-4 text-center">
          Terms of Use
        </h1>
        <p className="text-text-muted text-sm text-center mb-16">Last updated: March 14, 2026</p>

        <div className="space-y-8">
          {/* NOT MEDICAL ADVICE — Prominent */}
          <div className="rounded-2xl border-2 border-genesis-red/40 bg-genesis-red/8 p-8">
            <h2 className="font-heading font-bold text-2xl text-genesis-red mb-4">
              NOT MEDICAL ADVICE
            </h2>
            <p className="text-text-primary text-sm leading-relaxed mb-4 font-semibold">
              GENESIS is an educational and exploratory platform. It does NOT provide medical advice, diagnosis, treatment, or prescriptions.
            </p>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              All content, simulations, and tools on GENESIS are intended solely for educational and informational purposes. The information presented should never be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified healthcare provider with any questions you may have regarding a medical condition.
            </p>
            <p className="text-text-secondary text-sm leading-relaxed">
              Never disregard professional medical advice or delay seeking it because of something you have learned on GENESIS. If you think you may have a medical emergency, call your doctor, go to the emergency department, or call emergency services immediately.
            </p>
          </div>

          {/* Simulation Limitations */}
          <div className="rounded-2xl border border-white/8 bg-bg-card/60 p-8">
            <h2 className="font-heading font-bold text-xl text-genesis-cyan glow-cyan mb-4">
              Simulation Limitations
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              The simulations in GENESIS are simplified models of complex biological systems. By using these simulations, you acknowledge and agree that:
            </p>
            <ul className="space-y-2">
              {[
                'Simulations are educational approximations, not clinical predictions.',
                'Biological systems are infinitely more complex than any model can represent.',
                'Drug interaction simulations cannot account for individual genetics, comorbidities, dosing history, or concurrent medications.',
                'Disease progression models show generalized patterns, not individual prognoses.',
                'AI-generated content may contain inaccuracies or oversimplifications.',
                'Compound combination results in the Lab are theoretical and have NOT been clinically validated.',
                'No simulation output should be used to make decisions about real medical treatment.',
              ].map((item, i) => (
                <li key={i} className="text-text-muted text-sm flex items-start gap-2">
                  <span className="text-genesis-cyan mt-0.5 flex-shrink-0">&bull;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* User Responsibility */}
          <div className="rounded-2xl border border-white/8 bg-bg-card/60 p-8">
            <h2 className="font-heading font-bold text-xl text-genesis-gold glow-gold mb-4">
              User Responsibility
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              By using GENESIS, you agree to the following:
            </p>
            <ul className="space-y-2">
              {[
                'You will use GENESIS solely for educational, exploratory, and personal enrichment purposes.',
                'You will not use simulation results to self-diagnose, self-treat, or make medical decisions for yourself or others.',
                'You will not represent GENESIS outputs as medical advice or clinical data to any third party.',
                'You understand that GENESIS is not a replacement for medical school, clinical training, or professional medical education.',
                'You will consult qualified healthcare professionals for all medical decisions.',
                'You are solely responsible for how you use the information provided by GENESIS.',
                'You will not use GENESIS to create, distribute, or sell pharmaceutical products or treatments.',
              ].map((item, i) => (
                <li key={i} className="text-text-muted text-sm flex items-start gap-2">
                  <span className="text-genesis-gold mt-0.5 flex-shrink-0">&bull;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Frequency Therapy Disclaimer */}
          <div className="rounded-2xl border border-genesis-violet/20 bg-genesis-violet/5 p-8">
            <h2 className="font-heading font-bold text-xl text-genesis-violet mb-4">
              Frequency Therapy Disclaimer
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              The Sound Therapy, Light Therapy, and Breathing Therapy features of GENESIS are presented for educational and experimental purposes. By using these features, you acknowledge:
            </p>
            <ul className="space-y-2">
              {[
                'Sound frequencies (Solfeggio, binaural beats) are not FDA-approved treatments for any condition.',
                'Light therapy information is educational. Clinical photobiomodulation should only be administered by qualified practitioners with appropriate devices.',
                'Breathing exercises can cause dizziness, lightheadedness, or hyperventilation. Stop immediately if you feel unwell.',
                'If you have epilepsy, seizure disorders, or photosensitivity, consult your doctor before using light or frequency-based features.',
                'If you have respiratory conditions (asthma, COPD, etc.), consult your doctor before engaging in breathing exercises.',
                'The Wim Hof Method in particular can cause loss of consciousness. Never practice near water or while driving.',
                'GENESIS makes no medical claims about the therapeutic effects of any frequency, wavelength, or breathing pattern.',
              ].map((item, i) => (
                <li key={i} className="text-text-muted text-sm flex items-start gap-2">
                  <span className="text-genesis-violet mt-0.5 flex-shrink-0">&bull;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Intellectual Property */}
          <div className="rounded-2xl border border-white/8 bg-bg-card/60 p-8">
            <h2 className="font-heading font-bold text-xl text-text-primary mb-4">
              Intellectual Property
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              All content, design, code, simulations, and branding on GENESIS are the intellectual property of Vilmure Ventures and its affiliates. You may not reproduce, distribute, modify, or create derivative works from any GENESIS content without explicit written permission. Educational use for personal, non-commercial purposes is permitted.
            </p>
          </div>

          {/* Limitation of Liability */}
          <div className="rounded-2xl border border-white/8 bg-bg-card/60 p-8">
            <h2 className="font-heading font-bold text-xl text-text-primary mb-4">
              Limitation of Liability
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              GENESIS, Vilmure Ventures, and all associated entities, employees, and contributors shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from:
            </p>
            <ul className="space-y-2">
              {[
                'Use or inability to use the GENESIS platform',
                'Any decisions made based on information or simulations provided by GENESIS',
                'Inaccuracies or errors in simulation outputs',
                'Any adverse effects from engaging with therapy features (sound, light, breathing)',
                'Loss of local data stored in your browser',
              ].map((item, i) => (
                <li key={i} className="text-text-muted text-sm flex items-start gap-2">
                  <span className="text-text-secondary mt-0.5 flex-shrink-0">&bull;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Changes */}
          <div className="rounded-2xl border border-white/8 bg-bg-card/60 p-8">
            <h2 className="font-heading font-bold text-xl text-text-primary mb-4">
              Changes to These Terms
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Vilmure Ventures reserves the right to modify these Terms of Use at any time. Changes will be posted on this page with an updated revision date. Your continued use of GENESIS after modifications constitutes acceptance of the updated terms.
            </p>
          </div>

          {/* Governing Law */}
          <div className="rounded-2xl border border-white/8 bg-bg-card/60 p-8">
            <h2 className="font-heading font-bold text-xl text-text-primary mb-4">
              Governing Law
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              These Terms of Use shall be governed by and construed in accordance with the laws of the State of Florida, United States, without regard to conflict of law principles.
            </p>
            <p className="text-text-muted text-xs mt-4">A Vilmure Ventures Company</p>
          </div>
        </div>
      </section>
    </div>
  );
}

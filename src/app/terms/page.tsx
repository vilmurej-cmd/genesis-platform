export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl mb-4">
            <span className="text-genesis-cyan glow-cyan">Terms of Service</span>
          </h1>
          <p className="text-text-muted text-sm">Last updated: March 14, 2026</p>
        </div>

        <div className="bg-bg-card border border-white/5 rounded-2xl p-8 sm:p-10 space-y-8">
          <section>
            <h2 className="font-heading font-semibold text-xl text-text-primary mb-3">1. Acceptance of Terms</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              By accessing or using GENESIS (&quot;the Platform&quot;), operated by Vilmure Ventures
              (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to be bound by these Terms of Service. If you do
              not agree to these terms, you may not use the Platform. We reserve the right to
              modify these terms at any time, and your continued use constitutes acceptance of
              any changes.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-text-primary mb-3">2. Description of Service</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              GENESIS is an educational and exploratory platform that provides interactive tools
              for learning about the human body, diseases, pharmacology, forensic pathology,
              holistic medicine, and therapeutic modalities. The Platform uses artificial
              intelligence (AI) to augment educational content and provide analytical tools.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-text-primary mb-3">3. Use License</h2>
            <div className="text-text-secondary text-sm leading-relaxed space-y-3">
              <p>
                Permission is granted to access and use the Platform for personal, educational,
                and non-commercial purposes, subject to the following restrictions:
              </p>
              <ul className="list-disc list-inside space-y-1 text-text-muted ml-2">
                <li>You may not use the Platform for clinical decision-making or patient care</li>
                <li>You may not represent Platform output as professional medical advice</li>
                <li>You may not attempt to reverse-engineer, decompile, or extract the Platform&apos;s source code or AI models</li>
                <li>You may not use the Platform for any unlawful purpose</li>
                <li>You may not use automated systems (bots, scrapers) to access the Platform at scale</li>
                <li>You may not redistribute or commercially exploit Platform content without written permission</li>
              </ul>
            </div>
          </section>

          {/* Medical Disclaimer — prominent */}
          <section>
            <div className="bg-genesis-red/5 border border-genesis-red/20 rounded-xl p-6">
              <h2 className="font-heading font-semibold text-xl text-genesis-red mb-3">4. Medical Disclaimer</h2>
              <div className="text-text-secondary text-sm leading-relaxed space-y-3">
                <p>
                  <strong className="text-text-primary">GENESIS IS NOT A MEDICAL DEVICE AND DOES NOT PROVIDE MEDICAL ADVICE.</strong>
                </p>
                <p>
                  All content on the Platform — including but not limited to disease analyses, drug
                  interaction simulations, forensic case evaluations, holistic recommendations, and
                  therapeutic suggestions — is provided for <strong className="text-text-primary">educational and informational
                  purposes only</strong>.
                </p>
                <p>
                  The Platform is not intended to be a substitute for professional medical advice,
                  diagnosis, or treatment. Never disregard professional medical advice or delay
                  seeking treatment because of something you read or interacted with on GENESIS.
                </p>
                <p>
                  AI-generated content may contain inaccuracies, outdated information, or
                  incomplete analysis. Drug interaction simulations are theoretical and must not
                  be used for prescribing or medication management decisions.
                </p>
                <p>
                  If you think you may have a medical emergency, call your doctor, go to the
                  emergency department, or call emergency services immediately.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-text-primary mb-3">5. AI-Generated Content</h2>
            <div className="text-text-secondary text-sm leading-relaxed space-y-3">
              <p>
                Portions of the Platform use artificial intelligence (OpenAI GPT-4o) to generate
                content in response to user queries. You acknowledge and agree that:
              </p>
              <ul className="list-disc list-inside space-y-1 text-text-muted ml-2">
                <li>AI-generated content may be inaccurate, incomplete, or misleading</li>
                <li>AI responses do not reflect the views or opinions of Vilmure Ventures</li>
                <li>AI models have knowledge cutoff dates and may not include the latest research</li>
                <li>You are solely responsible for how you interpret and use AI-generated content</li>
                <li>Your queries may be processed by third-party AI providers subject to their terms</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-text-primary mb-3">6. Disclaimer of Warranties</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              THE PLATFORM IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
              EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT
              WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL
              COMPONENTS. WE MAKE NO WARRANTIES REGARDING THE ACCURACY, RELIABILITY, OR
              COMPLETENESS OF ANY CONTENT PROVIDED.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-text-primary mb-3">7. Limitation of Liability</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              IN NO EVENT SHALL VILMURE VENTURES, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS
              BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
              INCLUDING WITHOUT LIMITATION LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER
              INTANGIBLE LOSSES, RESULTING FROM (A) YOUR USE OF OR INABILITY TO USE THE PLATFORM;
              (B) ANY CONTENT OBTAINED FROM THE PLATFORM; (C) ANY MEDICAL DECISIONS MADE BASED ON
              PLATFORM CONTENT; OR (D) UNAUTHORIZED ACCESS TO YOUR DATA, WHETHER BASED ON WARRANTY,
              CONTRACT, TORT, OR ANY OTHER LEGAL THEORY.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-text-primary mb-3">8. Indemnification</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              You agree to indemnify, defend, and hold harmless Vilmure Ventures and its officers,
              directors, employees, and agents from and against any claims, liabilities, damages,
              losses, and expenses arising from your use of the Platform, violation of these Terms,
              or infringement of any third-party rights.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-text-primary mb-3">9. Governing Law</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the
              State of Florida, United States, without regard to its conflict of law provisions.
              Any disputes arising under these Terms shall be resolved in the courts located in
              the State of Florida.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-text-primary mb-3">10. Contact</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              For questions about these Terms of Service, please contact Vilmure Ventures at{' '}
              <span className="text-genesis-cyan">legal@vilmureventures.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

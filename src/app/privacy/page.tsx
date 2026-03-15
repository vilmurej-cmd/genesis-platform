export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-black text-4xl sm:text-5xl text-text-primary mb-4 text-center">
          Privacy Policy
        </h1>
        <p className="text-text-muted text-sm text-center mb-16">Last updated: March 14, 2026</p>

        <div className="space-y-8">
          {/* Zero Health Data */}
          <div className="rounded-2xl border border-genesis-green/20 bg-genesis-green/5 p-8">
            <h2 className="font-heading font-bold text-xl text-genesis-green glow-green mb-4">
              Zero Health Data Storage
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              GENESIS does not collect, store, transmit, or process any personal health information (PHI). We do not ask for your medical history, symptoms, diagnoses, or treatment plans. The platform is an educational tool, and all interactions are anonymous. We are not a covered entity under HIPAA and do not handle protected health information.
            </p>
          </div>

          {/* LocalStorage */}
          <div className="rounded-2xl border border-white/8 bg-bg-card/60 p-8">
            <h2 className="font-heading font-bold text-xl text-genesis-cyan glow-cyan mb-4">
              Local Storage Only
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              Your progress through courses, simulation history, and preferences are stored exclusively in your browser&apos;s localStorage. This data:
            </p>
            <ul className="space-y-2">
              {[
                'Never leaves your device',
                'Is not transmitted to any server',
                'Is not accessible to GENESIS or any third party',
                'Can be cleared at any time by clearing your browser data',
                'Is not backed up or synchronized across devices',
              ].map((item, i) => (
                <li key={i} className="text-text-muted text-sm flex items-start gap-2">
                  <span className="text-genesis-cyan mt-0.5 flex-shrink-0">&bull;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* No Personal Health Info */}
          <div className="rounded-2xl border border-white/8 bg-bg-card/60 p-8">
            <h2 className="font-heading font-bold text-xl text-genesis-gold glow-gold mb-4">
              No Personal Health Information Collected
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              We want to be clear about what we do NOT collect:
            </p>
            <ul className="space-y-2">
              {[
                'No medical records or health history',
                'No symptoms, diagnoses, or conditions',
                'No medication or treatment information',
                'No biometric data (heart rate, blood pressure, etc.)',
                'No genetic or genomic information',
                'No mental health or behavioral health data',
                'No insurance or healthcare provider information',
              ].map((item, i) => (
                <li key={i} className="text-text-muted text-sm flex items-start gap-2">
                  <span className="text-genesis-gold mt-0.5 flex-shrink-0">&bull;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Standard Sections */}
          <div className="rounded-2xl border border-white/8 bg-bg-card/60 p-8">
            <h2 className="font-heading font-bold text-xl text-text-primary mb-4">Information We May Collect</h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              Like most websites, we may collect minimal, non-personal technical information:
            </p>
            <ul className="space-y-2">
              {[
                'Anonymous usage analytics (page views, feature usage) to improve the platform',
                'Device type and browser information for compatibility purposes',
                'General geographic region (country level) for content optimization',
                'Error logs to diagnose and fix technical issues',
              ].map((item, i) => (
                <li key={i} className="text-text-muted text-sm flex items-start gap-2">
                  <span className="text-text-secondary mt-0.5 flex-shrink-0">&bull;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/8 bg-bg-card/60 p-8">
            <h2 className="font-heading font-bold text-xl text-text-primary mb-4">Third-Party Services</h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              GENESIS may use third-party services for analytics and AI processing. These services operate under their own privacy policies. We do not share personal information with third parties for advertising purposes.
            </p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-bg-card/60 p-8">
            <h2 className="font-heading font-bold text-xl text-text-primary mb-4">Children&apos;s Privacy</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              GENESIS is an educational platform suitable for users of all ages. We do not knowingly collect personal information from children under 13. If we discover that we have inadvertently collected such information, we will delete it promptly.
            </p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-bg-card/60 p-8">
            <h2 className="font-heading font-bold text-xl text-text-primary mb-4">Changes to This Policy</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. Continued use of GENESIS after changes constitutes acceptance of the updated policy.
            </p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-bg-card/60 p-8">
            <h2 className="font-heading font-bold text-xl text-text-primary mb-4">Contact</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              For questions about this Privacy Policy, please contact us through the Vilmure Ventures website.
            </p>
            <p className="text-text-muted text-xs mt-4">A Vilmure Ventures Company</p>
          </div>
        </div>
      </section>
    </div>
  );
}

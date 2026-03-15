export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl mb-4">
            <span className="text-genesis-cyan glow-cyan">Privacy Policy</span>
          </h1>
          <p className="text-text-muted text-sm">Last updated: March 14, 2026</p>
        </div>

        <div className="bg-bg-card border border-white/5 rounded-2xl p-8 sm:p-10 space-y-8">
          <section>
            <h2 className="font-heading font-semibold text-xl text-text-primary mb-3">1. Introduction</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              GENESIS (&quot;the Platform&quot;), operated by Vilmure Ventures (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;),
              is committed to protecting your privacy. This Privacy Policy explains how we collect,
              use, store, and share information when you use the GENESIS platform and its associated
              services.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-text-primary mb-3">2. Data Collection</h2>
            <div className="text-text-secondary text-sm leading-relaxed space-y-3">
              <p>We may collect the following types of information:</p>
              <ul className="list-disc list-inside space-y-1 text-text-muted ml-2">
                <li><strong className="text-text-secondary">Usage Data:</strong> Pages visited, features used, search queries entered into the platform, and interaction patterns.</li>
                <li><strong className="text-text-secondary">Technical Data:</strong> Browser type, device information, IP address, operating system, and referral URLs.</li>
                <li><strong className="text-text-secondary">Query Data:</strong> Search terms and prompts submitted to AI-powered features (Pathology, Lab, Forensics, Holistic modules).</li>
                <li><strong className="text-text-secondary">Analytics Data:</strong> Aggregated, anonymized data about platform usage for improvement purposes.</li>
              </ul>
              <p>
                GENESIS does not collect personal health information, medical records, or any data
                that could be considered Protected Health Information (PHI) under HIPAA. The platform
                is designed for educational use and does not require account creation or personal
                identification.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-text-primary mb-3">3. How We Use Your Data</h2>
            <div className="text-text-secondary text-sm leading-relaxed space-y-3">
              <p>Information collected is used for the following purposes:</p>
              <ul className="list-disc list-inside space-y-1 text-text-muted ml-2">
                <li>To provide and improve the GENESIS platform and its features</li>
                <li>To analyze usage patterns and optimize the user experience</li>
                <li>To process AI queries through our integrated language model services</li>
                <li>To maintain platform security and prevent abuse</li>
                <li>To comply with legal obligations</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-text-primary mb-3">4. Data Storage &amp; Security</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              We implement industry-standard security measures to protect data during transmission
              and storage. Query data sent to AI services (OpenAI) is transmitted securely via
              encrypted connections (TLS 1.2+). We do not permanently store the content of AI
              queries beyond the session in which they are made. Technical and analytics data may
              be retained for up to 12 months for platform improvement purposes.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-text-primary mb-3">5. Third-Party Services</h2>
            <div className="text-text-secondary text-sm leading-relaxed space-y-3">
              <p>GENESIS integrates with the following third-party services:</p>
              <ul className="list-disc list-inside space-y-1 text-text-muted ml-2">
                <li><strong className="text-text-secondary">OpenAI:</strong> AI queries are processed via the OpenAI API. Queries are subject to OpenAI&apos;s data usage policies and privacy practices.</li>
                <li><strong className="text-text-secondary">Hosting Provider:</strong> The platform is hosted on Vercel. Server logs and technical data are subject to Vercel&apos;s privacy policy.</li>
                <li><strong className="text-text-secondary">Analytics:</strong> We may use anonymized analytics services to understand platform usage.</li>
              </ul>
              <p>
                We do not sell, rent, or trade your personal information to third parties for
                marketing purposes.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-text-primary mb-3">6. Cookies</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              GENESIS may use minimal cookies or local storage for session management and
              user preference persistence (such as theme settings). No tracking cookies are used
              for advertising purposes.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-text-primary mb-3">7. Your Rights</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Depending on your jurisdiction, you may have the right to access, correct, delete,
              or port your data. Since GENESIS does not require account creation and does not
              collect personal identification data, most user interactions are inherently anonymous.
              If you have questions about your data rights, please contact us.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-text-primary mb-3">8. Children&apos;s Privacy</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              GENESIS is an educational platform and does not knowingly collect personal information
              from children under 13. The platform&apos;s content is educational in nature and suitable
              for supervised educational use.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-text-primary mb-3">9. Changes to This Policy</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will be posted on this
              page with an updated revision date. Continued use of the platform after changes
              constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-text-primary mb-3">10. Contact</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              For questions or concerns about this Privacy Policy or your data, please contact
              Vilmure Ventures at <span className="text-genesis-cyan">privacy@vilmureventures.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

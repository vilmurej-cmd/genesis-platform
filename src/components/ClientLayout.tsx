'use client';

import { LanguageProvider, useLanguage } from '@/lib/language-context';
import UniversalLanguageSelector from './UniversalLanguageSelector';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <Navigation />
      <main>{children}</main>
      <Footer />
    </LanguageProvider>
  );
}

/* ── Navigation ──────────────────────────────────── */
function Navigation() {
  const { t } = useLanguage();

  const links = [
    { href: '/atlas', key: 'nav.atlas', color: '#00E5FF' },
    { href: '/pathology', key: 'nav.pathology', color: '#FF00E5' },
    { href: '/lab', key: 'nav.lab', color: '#FFD700' },
    { href: '/learn', key: 'nav.learn', color: '#00FF94' },
    { href: '/forensics', key: 'nav.forensics', color: '#FF3366' },
    { href: '/holistic', key: 'nav.holistic', color: '#9945FF' },
    { href: '/therapy', key: 'nav.therapy', color: '#0066FF' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-void/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="font-heading font-bold text-xl tracking-wider">
            <span className="text-genesis-cyan glow-cyan">GENESIS</span>
          </a>
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-white/5"
              >
                {t(link.key)}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <UniversalLanguageSelector />
            <a
              href="/about"
              className="text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              {t('nav.about')}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ── Footer ──────────────────────────────────────── */
function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading font-bold text-lg text-genesis-cyan glow-cyan mb-3">
              GENESIS
            </h3>
            <p className="text-text-muted text-sm leading-relaxed">
              {t('footer.description')}
            </p>
            <p className="text-text-muted text-xs mt-3">{t('footer.company')}</p>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm text-text-secondary uppercase tracking-wider mb-3">
              {t('footer.explore')}
            </h4>
            <div className="space-y-2">
              {['Atlas', 'Pathology', 'Lab', 'Learn', 'Forensics', 'Holistic', 'Therapy'].map(
                (p) => (
                  <a
                    key={p}
                    href={`/${p.toLowerCase()}`}
                    className="block text-sm text-text-muted hover:text-text-primary transition-colors"
                  >
                    {t(`nav.${p.toLowerCase()}`)}
                  </a>
                )
              )}
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm text-text-secondary uppercase tracking-wider mb-3">
              {t('footer.legal')}
            </h4>
            <div className="space-y-2">
              {[
                [t('nav.about'), '/about'],
                [t('footer.methodology'), '/methodology'],
                [t('footer.privacy'), '/privacy'],
                [t('footer.terms'), '/terms'],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className="block text-sm text-text-muted hover:text-text-primary transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
            <p className="text-text-muted text-[10px] mt-6 leading-relaxed">
              {t('footer.medicalDisclaimer')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client';

import { useState } from 'react';
import { LanguageProvider, useLanguage } from '@/lib/language-context';
import UniversalLanguageSelector from './UniversalLanguageSelector';
import {
  Menu,
  X,
  Dna,
  Bug,
  FlaskConical,
  BookOpen,
  Microscope,
  Leaf,
  Volume2,
  MapPin,
} from 'lucide-react';

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
const NAV_LINKS = [
  { href: '/atlas', key: 'nav.atlas', color: '#00E5FF', icon: MapPin, label: 'Atlas' },
  { href: '/explore', key: 'nav.explore', color: '#00E5FF', icon: Dna, label: 'Explore' },
  { href: '/pathology', key: 'nav.pathology', color: '#FF00E5', icon: Bug, label: 'Pathology' },
  { href: '/lab', key: 'nav.lab', color: '#FFD700', icon: FlaskConical, label: 'Lab' },
  { href: '/learn', key: 'nav.learn', color: '#00FF94', icon: BookOpen, label: 'Learn' },
  { href: '/forensics', key: 'nav.forensics', color: '#FF3366', icon: Microscope, label: 'Forensics' },
  { href: '/holistic', key: 'nav.holistic', color: '#9945FF', icon: Leaf, label: 'Holistic' },
  { href: '/therapy', key: 'nav.therapy', color: '#0066FF', icon: Volume2, label: 'Therapy' },
];

function Navigation() {
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-void/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="font-heading font-bold text-xl tracking-wider">
              <span className="text-genesis-cyan glow-cyan">GENESIS</span>
            </a>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-white/5"
                >
                  {t(link.key) || link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <UniversalLanguageSelector />
              <a
                href="/about"
                className="text-sm text-text-muted hover:text-text-primary transition-colors hidden sm:block"
              >
                {t('nav.about') || 'About'}
              </a>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[49] md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-16 right-0 w-72 max-h-[calc(100vh-4rem)] bg-bg-void/95 backdrop-blur-xl border-l border-white/5 border-b border-b-white/5 rounded-bl-2xl overflow-y-auto">
            <div className="p-4 space-y-1">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                  >
                    <Icon className="w-4 h-4" style={{ color: link.color }} />
                    <span className="font-heading font-medium text-sm">{t(link.key) || link.label}</span>
                  </a>
                );
              })}
              <div className="border-t border-white/5 mt-3 pt-3">
                <a
                  href="/about"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
                >
                  <span className="font-heading font-medium text-sm">{t('nav.about') || 'About'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
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
              {t('footer.description') || 'The Human Body Discovery Engine. Explore anatomy, decode disease, discover the cure.'}
            </p>
            <p className="text-text-muted text-xs mt-3">{t('footer.company') || 'A Vilmure Ventures Platform'}</p>
            <p className="text-text-muted text-[10px] mt-1 italic">Built with care by a human and an AI</p>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm text-text-secondary uppercase tracking-wider mb-3">
              {t('footer.explore') || 'Explore'}
            </h4>
            <div className="space-y-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-text-muted hover:text-text-primary transition-colors"
                >
                  {t(link.key) || link.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm text-text-secondary uppercase tracking-wider mb-3">
              {t('footer.legal') || 'Legal'}
            </h4>
            <div className="space-y-2">
              {[
                [t('nav.about') || 'About', '/about'],
                [t('footer.methodology') || 'Methodology', '/methodology'],
                [t('footer.privacy') || 'Privacy', '/privacy'],
                [t('footer.terms') || 'Terms', '/terms'],
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
              {t('footer.medicalDisclaimer') || 'GENESIS is an educational platform. It is not a substitute for professional medical advice, diagnosis, or treatment.'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

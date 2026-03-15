import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GENESIS — The Human Body Discovery Engine',
  description: 'Understand the body. Decode disease. Discover the cure. A Vilmure Ventures Company.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg-void text-text-primary min-h-screen">
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

/* ── Inline Navigation ──────────────────────────────── */
function Navigation() {
  const links = [
    { href: '/atlas', label: 'Atlas', color: '#00E5FF' },
    { href: '/pathology', label: 'Pathology', color: '#FF00E5' },
    { href: '/lab', label: 'Lab', color: '#FFD700' },
    { href: '/learn', label: 'Learn', color: '#00FF94' },
    { href: '/forensics', label: 'Forensics', color: '#FF3366' },
    { href: '/holistic', label: 'Holistic', color: '#9945FF' },
    { href: '/therapy', label: 'Therapy', color: '#0066FF' },
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
                style={{ ['--hover-color' as string]: link.color }}
              >
                {link.label}
              </a>
            ))}
          </div>
          <a href="/about" className="text-sm text-text-muted hover:text-text-primary transition-colors">
            About
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ── Inline Footer ──────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading font-bold text-lg text-genesis-cyan glow-cyan mb-3">GENESIS</h3>
            <p className="text-text-muted text-sm leading-relaxed">
              The Human Body Discovery Engine. Understand the body. Decode disease. Discover the cure.
            </p>
            <p className="text-text-muted text-xs mt-3">A Vilmure Ventures Company</p>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm text-text-secondary uppercase tracking-wider mb-3">Explore</h4>
            <div className="space-y-2">
              {['Atlas', 'Pathology', 'Lab', 'Learn', 'Forensics', 'Holistic', 'Therapy'].map((p) => (
                <a key={p} href={`/${p.toLowerCase()}`} className="block text-sm text-text-muted hover:text-text-primary transition-colors">{p}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm text-text-secondary uppercase tracking-wider mb-3">Legal</h4>
            <div className="space-y-2">
              {[['About', '/about'], ['Methodology', '/methodology'], ['Privacy', '/privacy'], ['Terms', '/terms']].map(([label, href]) => (
                <a key={href} href={href} className="block text-sm text-text-muted hover:text-text-primary transition-colors">{label}</a>
              ))}
            </div>
            <p className="text-text-muted text-[10px] mt-6 leading-relaxed">
              GENESIS is an educational and exploratory platform. It does not provide medical advice, diagnosis, or treatment.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

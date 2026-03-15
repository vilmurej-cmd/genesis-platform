'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Globe, Search, Check, X, ArrowRight } from 'lucide-react';
import { useLanguage, LANGUAGES, POPULAR_CODES, type LanguageInfo } from '@/lib/language-context';

export default function UniversalLanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestedLang, setSuggestedLang] = useState<LanguageInfo | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Auto-detect browser language on first visit
  useEffect(() => {
    const dismissed = localStorage.getItem('lingua-suggestion-dismissed');
    const saved = localStorage.getItem('lingua-preferred-language');
    if (dismissed || saved) return;

    const browserLang = navigator.language?.split('-')[0];
    if (browserLang && browserLang !== 'en') {
      const match = LANGUAGES.find(
        (l) => l.code === browserLang || l.code.startsWith(browserLang)
      );
      if (match) {
        setSuggestedLang(match);
        setShowSuggestion(true);
      }
    }
  }, []);

  // Recent languages from localStorage
  const [recentLangs, setRecentLangs] = useState<string[]>([]);
  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('lingua-recent-languages') || '[]');
    setRecentLangs(recent);
  }, [language]);

  // Close on escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen]);

  // Focus search on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchRef.current?.focus(), 100);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  // Close on click outside
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setIsOpen(false);
  }, []);

  const handleSelect = useCallback(
    (code: string) => {
      setLanguage(code);
      setIsOpen(false);
    },
    [setLanguage]
  );

  const handleDismissSuggestion = useCallback(() => {
    setShowSuggestion(false);
    localStorage.setItem('lingua-suggestion-dismissed', 'true');
  }, []);

  const handleAcceptSuggestion = useCallback(() => {
    if (suggestedLang) {
      setLanguage(suggestedLang.code);
    }
    setShowSuggestion(false);
    localStorage.setItem('lingua-suggestion-dismissed', 'true');
  }, [suggestedLang, setLanguage]);

  // Filter languages
  const searchLower = search.toLowerCase();
  const filtered = search
    ? LANGUAGES.filter(
        (l) =>
          l.name.toLowerCase().includes(searchLower) ||
          l.nativeName.toLowerCase().includes(searchLower) ||
          l.code.toLowerCase().includes(searchLower)
      )
    : LANGUAGES;

  const popularLangs = LANGUAGES.filter((l) => POPULAR_CODES.includes(l.code));
  const recentLangInfos = recentLangs
    .map((code) => LANGUAGES.find((l) => l.code === code))
    .filter(Boolean) as LanguageInfo[];

  const currentLang = LANGUAGES.find((l) => l.code === language);

  return (
    <>
      {/* Suggestion Banner */}
      {showSuggestion && suggestedLang && (
        <div className="fixed top-16 left-0 right-0 z-[60] flex justify-center px-4 animate-in">
          <div className="flex items-center gap-3 px-4 py-2.5 bg-bg-surface border border-genesis-cyan/20 rounded-xl shadow-lg box-glow-cyan max-w-md">
            <Globe className="w-4 h-4 text-genesis-cyan flex-shrink-0" />
            <p className="text-sm text-text-secondary">
              It looks like you speak{' '}
              <span className="text-genesis-cyan font-semibold">{suggestedLang.nativeName}</span>.
              Switch?
            </p>
            <button
              onClick={handleAcceptSuggestion}
              className="flex items-center gap-1 px-3 py-1 text-xs font-heading font-semibold bg-genesis-cyan/15 text-genesis-cyan border border-genesis-cyan/30 rounded-lg hover:bg-genesis-cyan/25 transition-colors"
            >
              Switch <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={handleDismissSuggestion}
              className="text-text-muted hover:text-text-secondary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Globe Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-white/5"
        title={`Language: ${currentLang?.nativeName || 'English'}`}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline text-xs font-mono">
          {currentLang?.code?.toUpperCase() || 'EN'}
        </span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <div
            ref={modalRef}
            className="w-full max-w-lg bg-bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            style={{ maxHeight: 'calc(100vh - 120px)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-genesis-cyan" />
                <h2 className="font-heading font-bold text-lg text-text-primary">
                  Language
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="px-5 py-3 border-b border-white/5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search languages..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-genesis-cyan/30"
                />
              </div>
            </div>

            {/* Language List */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
              {/* Recently Used */}
              {!search && recentLangInfos.length > 0 && (
                <div className="px-5 pt-4 pb-2">
                  <p className="text-[11px] font-heading font-semibold text-text-muted uppercase tracking-wider mb-2">
                    Recently Used
                  </p>
                  <div className="space-y-0.5">
                    {recentLangInfos.map((lang) => (
                      <LangRow
                        key={lang.code}
                        lang={lang}
                        isActive={lang.code === language}
                        onSelect={handleSelect}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Popular */}
              {!search && (
                <div className="px-5 pt-4 pb-2">
                  <p className="text-[11px] font-heading font-semibold text-text-muted uppercase tracking-wider mb-2">
                    Popular Languages
                  </p>
                  <div className="space-y-0.5">
                    {popularLangs.map((lang) => (
                      <LangRow
                        key={lang.code}
                        lang={lang}
                        isActive={lang.code === language}
                        onSelect={handleSelect}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* All / Search Results */}
              <div className="px-5 pt-4 pb-4">
                <p className="text-[11px] font-heading font-semibold text-text-muted uppercase tracking-wider mb-2">
                  {search ? `Results (${filtered.length})` : 'All Languages'}
                </p>
                <div className="space-y-0.5">
                  {filtered.map((lang) => (
                    <LangRow
                      key={lang.code}
                      lang={lang}
                      isActive={lang.code === language}
                      onSelect={handleSelect}
                    />
                  ))}
                  {filtered.length === 0 && (
                    <p className="text-sm text-text-muted py-4 text-center">
                      No languages found for &ldquo;{search}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Language Row ──────────────────────────────────── */
function LangRow({
  lang,
  isActive,
  onSelect,
}: {
  lang: LanguageInfo;
  isActive: boolean;
  onSelect: (code: string) => void;
}) {
  return (
    <button
      onClick={() => onSelect(lang.code)}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
        isActive
          ? 'bg-genesis-cyan/10 border border-genesis-cyan/20'
          : 'hover:bg-white/5 border border-transparent'
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium ${
              isActive ? 'text-genesis-cyan' : 'text-text-primary'
            }`}
          >
            {lang.nativeName}
          </span>
          {lang.rtl && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-genesis-violet/15 text-genesis-violet border border-genesis-violet/20 font-mono">
              RTL
            </span>
          )}
        </div>
        <span className="text-xs text-text-muted">{lang.name}</span>
      </div>
      <span className="text-[10px] font-mono text-text-muted">{lang.code}</span>
      {isActive && <Check className="w-4 h-4 text-genesis-cyan flex-shrink-0" />}
    </button>
  );
}

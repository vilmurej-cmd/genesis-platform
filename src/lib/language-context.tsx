'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getCached, setCache } from './translation-cache';

/* ── Language list ─────────────────────────────────── */
export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  rtl?: boolean;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '中文（简体）' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '中文（繁體）' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'th', name: 'Thai', nativeName: 'ภาษาไทย' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', rtl: true },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', rtl: true },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', rtl: true },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල' },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာ' },
  { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ' },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ' },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული' },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ' },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbek' },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip' },
  { code: 'eu', name: 'Basque', nativeName: 'Euskara' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català' },
  { code: 'gl', name: 'Galician', nativeName: 'Galego' },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg' },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge' },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti' },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska' },
  { code: 'mk', name: 'Macedonian', nativeName: 'Македонски' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски' },
  { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski' },
];

export const POPULAR_CODES = [
  'en', 'zh-CN', 'zh-TW', 'es', 'hi', 'ar', 'bn', 'pt', 'ru', 'ja',
  'ko', 'fr', 'de', 'it', 'tr', 'vi', 'th', 'nl', 'pl', 'id',
];

const RTL_CODES = ['ar', 'he', 'fa', 'ur'];

/* ── Translation JSON loader ──────────────────────── */
type TranslationMap = Record<string, string | Record<string, string>>;

const translationCache: Record<string, TranslationMap> = {};

async function loadTranslations(langCode: string): Promise<TranslationMap> {
  if (translationCache[langCode]) return translationCache[langCode];
  try {
    const mod = await import(`@/translations/${langCode}.json`);
    translationCache[langCode] = mod.default || mod;
    return translationCache[langCode];
  } catch {
    if (langCode !== 'en') {
      return loadTranslations('en');
    }
    return {};
  }
}

/* ── Context ──────────────────────────────────────── */
interface LanguageContextValue {
  language: string;
  setLanguage: (code: string) => void;
  t: (key: string) => string;
  translateAsync: (text: string) => Promise<string>;
  isRTL: boolean;
  languageInfo: LanguageInfo | undefined;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
  translateAsync: async (text) => text,
  isRTL: false,
  languageInfo: undefined,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState('en');
  const [translations, setTranslations] = useState<TranslationMap>({});

  // Load saved language on mount
  useEffect(() => {
    const saved = localStorage.getItem('lingua-preferred-language');
    if (saved) {
      setLanguageState(saved);
      loadTranslations(saved).then(setTranslations);
    } else {
      loadTranslations('en').then(setTranslations);
    }
  }, []);

  const setLanguage = useCallback((code: string) => {
    setLanguageState(code);
    localStorage.setItem('lingua-preferred-language', code);

    // Update recent languages
    const recent: string[] = JSON.parse(localStorage.getItem('lingua-recent-languages') || '[]');
    const updated = [code, ...recent.filter((c) => c !== code)].slice(0, 3);
    localStorage.setItem('lingua-recent-languages', JSON.stringify(updated));

    // Set RTL
    const isRtl = RTL_CODES.includes(code);
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = code;

    // Load translations
    loadTranslations(code).then(setTranslations);
  }, []);

  // t() — synchronous lookup with dot notation
  const t = useCallback(
    (key: string): string => {
      const parts = key.split('.');
      let current: unknown = translations;
      for (const part of parts) {
        if (current && typeof current === 'object' && part in (current as Record<string, unknown>)) {
          current = (current as Record<string, unknown>)[part];
        } else {
          return key; // fallback to key itself
        }
      }
      return typeof current === 'string' ? current : key;
    },
    [translations]
  );

  // translateAsync — API-based translation with cache
  const translateAsync = useCallback(
    async (text: string): Promise<string> => {
      if (language === 'en') return text;
      const cached = getCached(text, language);
      if (cached) return cached;

      try {
        const res = await fetch('/api/translate-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: text, targetLanguage: language }),
        });
        const data = await res.json();
        if (data.translated && data.translated !== text) {
          setCache(text, data.translated, language);
          return data.translated;
        }
        return text;
      } catch {
        return text;
      }
    },
    [language]
  );

  const isRTL = RTL_CODES.includes(language);
  const languageInfo = LANGUAGES.find((l) => l.code === language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateAsync, isRTL, languageInfo }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

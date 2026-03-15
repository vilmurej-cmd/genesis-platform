const CACHE_KEY = 'lingua-translations';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

export function getCached(original: string, language: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    const key = `${language}:${hashString(original)}`;
    const entry = cache[key];
    if (entry && Date.now() - entry.timestamp < CACHE_EXPIRY) {
      return entry.translated;
    }
    return null;
  } catch {
    return null;
  }
}

export function setCache(original: string, translated: string, language: string): void {
  if (typeof window === 'undefined') return;
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    const key = `${language}:${hashString(original)}`;
    cache[key] = { original, translated, language, timestamp: Date.now() };
    const cacheStr = JSON.stringify(cache);
    if (cacheStr.length < 5 * 1024 * 1024) {
      localStorage.setItem(CACHE_KEY, cacheStr);
    }
  } catch {
    // localStorage full or unavailable
  }
}

export function clearTranslationCache(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CACHE_KEY);
}

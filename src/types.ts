export interface HistoryItem {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: number;
}

export const LANGUAGES: Record<string, string> = {
  en: 'Inggris',
  id: 'Indonesia',
  es: 'Spanyol',
  fr: 'Prancis',
  de: 'Jerman',
  zh: 'Tionghoa',
  ja: 'Jepang',
  ko: 'Korea',
  ar: 'Arab',
  ru: 'Rusia',
  pt: 'Portugis',
  it: 'Italia',
  nl: 'Belanda',
  tr: 'Turki',
  vi: 'Vietnam',
  th: 'Thailand',
  ms: 'Melayu',
};

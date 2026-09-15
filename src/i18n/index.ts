import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ta from './locales/ta.json';
import hi from './locales/hi.json';
import te from './locales/te.json';
import kn from './locales/kn.json';
import ml from './locales/ml.json';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  script: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', script: 'Latin', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'Kannada', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', script: 'Malayalam', flag: '🇮🇳' },
];

export const STORAGE_KEY = 'nlams_language';

// Get initial language from localStorage or default to 'en'
const getStoredLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
      return saved;
    }
  }
  return 'en';
};

const initialLanguage = getStoredLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ta: { translation: ta },
      hi: { translation: hi },
      te: { translation: te },
      kn: { translation: kn },
      ml: { translation: ml },
    },
    lng: initialLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false,
    },
  });

// Automatically persist any language switch to localStorage and document lang attribute
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, lng);
    document.documentElement.lang = lng;
  }
});

// Format Indian currency based on language
export const formatCurrency = (amount: number, lng?: string): string => {
  const currentLng = lng || i18n.language || 'en';
  const localeMap: Record<string, string> = {
    en: 'en-IN',
    ta: 'ta-IN',
    hi: 'hi-IN',
    te: 'te-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
  };
  const locale = localeMap[currentLng] || 'en-IN';
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
};

// Format numbers according to Indian numbering system in the selected locale
export const formatNumber = (num: number, lng?: string): string => {
  const currentLng = lng || i18n.language || 'en';
  const localeMap: Record<string, string> = {
    en: 'en-IN',
    ta: 'ta-IN',
    hi: 'hi-IN',
    te: 'te-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
  };
  const locale = localeMap[currentLng] || 'en-IN';
  try {
    return new Intl.NumberFormat(locale).format(num);
  } catch {
    return num.toLocaleString('en-IN');
  }
};

// Format date according to the selected language locale
export const formatDate = (dateStr: string | Date, lng?: string): string => {
  const currentLng = lng || i18n.language || 'en';
  const localeMap: Record<string, string> = {
    en: 'en-IN',
    ta: 'ta-IN',
    hi: 'hi-IN',
    te: 'te-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
  };
  const locale = localeMap[currentLng] || 'en-IN';
  try {
    const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    if (isNaN(d.getTime())) return String(dateStr);
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch {
    return String(dateStr);
  }
};

export default i18n;

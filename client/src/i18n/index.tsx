import React, { createContext, useContext, useState } from 'react';
import { LanguageCode } from '../../../shared/types';
import en from './locales/en.json';
import ta from './locales/ta.json';
import hi from './locales/hi.json';
import te from './locales/te.json';

const translations: Record<LanguageCode, Record<string, string>> = {
  en,
  ta,
  hi,
  te
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, defaultVal?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('nyayaai_lang') as LanguageCode) || 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('nyayaai_lang', lang);
  };

  const t = (key: string, defaultVal?: string): string => {
    const currentDict = translations[language] || translations.en;
    if (currentDict[key]) return currentDict[key];
    if (translations.en[key]) return translations.en[key];
    return defaultVal || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

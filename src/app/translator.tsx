'use client';

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';
import '@/i18n/config'; // Initialize i18next

export type LanguageCode = 'en' | 'ru';

interface TranslationContextProps {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
}

const TranslationContext = createContext<TranslationContextProps | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useI18nTranslation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const setLanguage = (newLanguage: LanguageCode) => {
    i18n.changeLanguage(newLanguage);
  };

  const contextValue = {
    language: (i18n.language?.split('-')[0] as LanguageCode) || 'en',
    setLanguage,
  };

  // Prevent hydration mismatches
  if (!isMounted) return <>{children}</>;

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslatedText = (text: string): string => {
  const { t } = useI18nTranslation();
  // We use the text itself as the key. i18next will return the translation if found,
  // or the text itself (key) if not.
  return t(text);
};

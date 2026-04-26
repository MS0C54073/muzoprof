
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { translateBatch } from '@/ai/flows/translate-batch-flow';
import type { TranslateBatchInput } from '@/ai/flows/translate-batch.types';

export type LanguageCode = 'en' | 'ru';

interface TranslationContextProps {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  translations: Map<string, string>; // Cache for translated text
  requestTranslation: (text: string) => void; // Function for components to register text
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
  // Default to English to avoid hydration mismatches. 
  // We'll sync with localStorage in a useEffect.
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [translations, setTranslations] = useState<Map<string, string>>(new Map());
  const [isMounted, setIsMounted] = useState(false);
  
  // Use refs for the queue to avoid triggering re-renders on every registration.
  const queueRef = useRef<Set<string>>(new Set());
  const inFlightRef = useRef<Set<string>>(new Set());
  const processingRef = useRef(false);

  // Sync language with localStorage after mount.
  useEffect(() => {
    setIsMounted(true);
    const storedLang = localStorage.getItem('user-language');
    if (storedLang === 'ru' || storedLang === 'en') {
      setLanguageState(storedLang as LanguageCode);
    }
  }, []);

  // Function for components to register their text
  const requestTranslation = useCallback((text: string) => {
    if (!text || language === 'en') return;
    
    // Only queue if it's not already translated and not already requested.
    if (!translations.has(text) && !inFlightRef.current.has(text) && !queueRef.current.has(text)) {
      queueRef.current.add(text);
    }
  }, [language, translations]);

  const setLanguage = (newLanguage: LanguageCode) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user-language', newLanguage);
    }
    setLanguageState(newLanguage);
    // Clear cache and queues on language change
    setTranslations(new Map());
    queueRef.current.clear();
    inFlightRef.current.clear();
    processingRef.current = false;
  };

  // Process the queue in batches every second.
  useEffect(() => {
    if (language === 'en' || !isMounted) return;

    const performBatchTranslation = async () => {
      if (queueRef.current.size === 0 || processingRef.current) return;
      
      processingRef.current = true;
      const textsToTranslate = Array.from(queueRef.current);
      queueRef.current.clear();
      
      // Mark as in-flight
      textsToTranslate.forEach(t => inFlightRef.current.add(t));

      try {
        const result = await translateBatch({
          texts: textsToTranslate,
          targetLanguage: language,
        });

        if (result && result.translations) {
          setTranslations(prev => {
            const newTranslations = new Map(prev);
            result.translations.forEach((translatedText, i) => {
              newTranslations.set(textsToTranslate[i], translatedText);
            });
            return newTranslations;
          });
        }
      } catch (error) {
        console.error("Batch translation failed:", error);
      } finally {
        textsToTranslate.forEach(t => inFlightRef.current.delete(t));
        processingRef.current = false;
      }
    };

    const intervalId = setInterval(performBatchTranslation, 1000);
    return () => clearInterval(intervalId);
  }, [language, isMounted]);

  const contextValue = {
    language,
    setLanguage,
    translations,
    requestTranslation,
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslatedText = (text: string): string => {
  const { translations, requestTranslation, language } = useTranslation();

  useEffect(() => {
    // Register the text for translation when the component mounts or text/language changes
    if (text && language !== 'en') {
      requestTranslation(text);
    }
  }, [text, requestTranslation, language]);

  if (language === 'en') {
    return text;
  }
  
  // Return the translated text from the central cache, or the original text as a fallback.
  return translations.get(text) || text;
};

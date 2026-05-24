
'use client';

import { useTranslatedText } from '@/app/translator';
import { useState, useEffect, type FC } from 'react';

interface TranslatedTextProps {
  text: string;
}

const TranslatedText: FC<TranslatedTextProps> = ({ text }) => {
  const [mounted, setMounted] = useState(false);
  const translatedText = useTranslatedText(text);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return the original text (key) during server rendering and initial hydration
  // to ensure the client-side HTML matches the server exactly.
  // Once mounted, the translated version is displayed.
  return <>{mounted ? translatedText : text}</>;
};

export default TranslatedText;

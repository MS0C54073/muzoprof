
'use client';

import { useTranslatedText } from '@/app/translator';
import type { FC } from 'react';

interface TranslatedTextProps {
  text: string;
}

const TranslatedText: FC<TranslatedTextProps> = ({ text }) => {
  const translatedText = useTranslatedText(text);
  return <>{translatedText}</>;
};

export default TranslatedText;

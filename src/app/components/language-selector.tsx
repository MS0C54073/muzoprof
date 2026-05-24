'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { RussiaFlagIcon, UnitedKingdomFlagIcon } from '@/components/flag-icons';

export function LanguageSelector() {
  const { i18n } = useI18nTranslation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleLanguage = () => {
    const currentLang = i18n.language?.split('-')[0];
    const newLang = currentLang === 'en' ? 'ru' : 'en';
    i18n.changeLanguage(newLang);
  };
  
  if (!isMounted) {
    return <div className="h-10 w-10" />;
  }

  const currentLang = i18n.language?.split('-')[0];
  const Icon = currentLang === 'en' ? UnitedKingdomFlagIcon : RussiaFlagIcon;

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={toggleLanguage}
      aria-label="Toggle language"
    >
      <Icon className="h-6 w-6" />
    </Button>
  );
}

import { useTranslation } from 'react-i18next';

export type Language = 'en' | 'pt-BR';

export function useLanguage() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
  };

  const currentLanguage = (i18n.language as Language) || 'en';

  return {
    currentLanguage,
    changeLanguage,
    t,
  };
}

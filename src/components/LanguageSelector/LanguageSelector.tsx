import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import styles from './LanguageSelector.module.css';

export function LanguageSelector() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const currentLang = i18n.language;

  return (
    <div className={styles.container}>
      <Languages className={styles.icon} />
      <select
        value={currentLang}
        onChange={(e) => changeLanguage(e.target.value)}
        className={styles.select}
        aria-label={t('language.select')}
      >
        <option value="en">{t('language.en')}</option>
        <option value="pt-BR">{t('language.pt')}</option>
      </select>
    </div>
  );
}

import styles from './Header.module.css';
import { ThemeSelector } from '../ThemeSelector';
import { LanguageSelector } from '../LanguageSelector/LanguageSelector';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  favoriteCount?: number;
}

export function Header({ title, subtitle, favoriteCount = 0 }: HeaderProps) {
  const { effectiveMode, toggleMode } = useTheme();
  const { t } = useTranslation();

  const displayTitle = title || t('header.title');

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <div className={styles.icon}>⚡</div>
            <div>
              <h1 className={styles.title}>{displayTitle}</h1>
              {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
          </div>
          <div className={styles.actions}>
            {favoriteCount > 0 && (
              <div className={styles.favoritesBadge} title={`${favoriteCount} saved ${favoriteCount === 1 ? 'story' : 'stories'}`}>
                <span className={styles.favoritesIcon}>★</span>
                {favoriteCount}
              </div>
            )}
            <button
              className={styles.themeToggle}
              onClick={toggleMode}
              title={`Switch to ${effectiveMode === 'dark' ? 'light' : 'dark'} mode`}
            >
              {effectiveMode === 'dark' ? '☀️' : '🌙'}
            </button>
            <LanguageSelector />
            <ThemeSelector />
            <div className={styles.badge}>{t('header.live')}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

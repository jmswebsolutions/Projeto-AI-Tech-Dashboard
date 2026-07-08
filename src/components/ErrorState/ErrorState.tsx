import styles from './ErrorState.module.css';
import { useTranslation } from 'react-i18next';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useTranslation();
  const displayMessage = message || t('error.message');

  return (
    <div className={styles.container}>
      <div className={styles.icon}>⚠️</div>
      <h2 className={styles.title}>{t('error.title')}</h2>
      <p className={styles.description}>{displayMessage}</p>
      {onRetry && (
        <button className={styles.button} onClick={onRetry}>
          {t('error.retry')}
        </button>
      )}
    </div>
  );
}

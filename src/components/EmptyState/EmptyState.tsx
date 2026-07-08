import styles from './EmptyState.module.css';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  const { t } = useTranslation();
  const displayTitle = title || t('empty.title');
  const displayDescription = description || t('empty.message');

  return (
    <div className={styles.container}>
      <div className={styles.icon}>🔍</div>
      <h2 className={styles.title}>{displayTitle}</h2>
      <p className={styles.description}>{displayDescription}</p>
    </div>
  );
}

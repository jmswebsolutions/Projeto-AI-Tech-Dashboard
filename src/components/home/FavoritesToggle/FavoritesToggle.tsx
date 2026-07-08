import styles from './FavoritesToggle.module.css';
import { useTranslation } from 'react-i18next';

interface FavoritesToggleProps {
  value: 'all' | 'favorites';
  onChange: (value: 'all' | 'favorites') => void;
  count: number;
}

export function FavoritesToggle({ value, onChange, count }: FavoritesToggleProps) {
  const { t } = useTranslation();
  const isFavorites = value === 'favorites';

  return (
    <label className={styles.toggle}>
      <input
        type="checkbox"
        checked={isFavorites}
        onChange={(e) => onChange(e.target.checked ? 'favorites' : 'all')}
        className={styles.input}
      />
      <span className={styles.track}>
        <span className={styles.thumb} />
      </span>
      <span className={styles.text}>
        {t('toolbar.views.favorites')} {count > 0 && <span className={styles.count}>({count})</span>}
      </span>
    </label>
  );
}

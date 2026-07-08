import styles from './FilterPanel.module.css';
import type { TimeFilter } from '../home/storyFilters';
import { useTranslation } from 'react-i18next';

interface FilterPanelProps {
  timeFilter: TimeFilter;
  minScore: number;
  onTimeFilterChange: (filter: TimeFilter) => void;
  onMinScoreChange: (score: number) => void;
}

export function FilterPanel({ timeFilter, minScore, onTimeFilterChange, onMinScoreChange }: FilterPanelProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.filterPanel}>
      <div className={styles.filterGroup}>
        <label className={styles.label}>{t('toolbar.timeFilter')}</label>
        <div className={styles.buttonGroup}>
          {(['all', '24h', 'week', 'month'] as TimeFilter[]).map((filter) => (
            <button
              key={filter}
              type="button"
              className={`${styles.filterButton} ${timeFilter === filter ? styles.active : ''}`}
              onClick={() => onTimeFilterChange(filter)}
            >
              {filter === 'all' ? t('toolbar.timeFilters.all') : filter === '24h' ? t('toolbar.timeFilters.today') : filter === 'week' ? t('toolbar.timeFilters.week') : t('toolbar.timeFilters.month')}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>{t('toolbar.minScore')}</label>
        <div className={styles.scoreInput}>
          <input
            type="number"
            min="0"
            max="1000"
            value={minScore}
            onChange={(e) => onMinScoreChange(Number(e.target.value))}
            className={styles.input}
          />
          <span className={styles.unit}>{t('newsCard.points')}</span>
        </div>
      </div>
    </div>
  );
}

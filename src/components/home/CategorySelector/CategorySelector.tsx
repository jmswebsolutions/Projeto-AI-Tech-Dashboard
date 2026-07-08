import type { StoryCategory } from '../../../api/newsApi';
import { categoryLabels } from '../../../constants/categories';
import { useTranslation } from 'react-i18next';
import styles from './CategorySelector.module.css';

interface CategorySelectorProps {
  value: StoryCategory;
  onChange: (category: StoryCategory) => void;
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  const { t } = useTranslation();

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>{t('toolbar.category')}</legend>
      <div className={styles.radioGroup}>
        {(Object.keys(categoryLabels) as StoryCategory[]).map((cat) => (
          <label key={cat} className={styles.label}>
            <input
              type="radio"
              name="category"
              value={cat}
              checked={value === cat}
              onChange={() => onChange(cat)}
              className={styles.radio}
            />
            <span className={styles.text}>{t(`toolbar.categories.${cat}`)}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

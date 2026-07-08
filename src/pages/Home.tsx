import { useState, useRef } from 'react';
import { Header } from '../components/Header/Header';
import { SearchBar } from '../components/SearchBar/SearchBar';
import { FilterBar } from '../components/home/FilterBar/FilterBar';
import { FilterPanel } from '../components/FilterPanel/FilterPanel';
import { ContentArea } from '../components/home/ContentArea/ContentArea';
import { useNews } from '../hooks/useNews';
import { useFavorites } from '../hooks/useFavorites';
import { useReadHistory } from '../hooks/useReadHistory';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { filterStories, type TimeFilter } from '../components/home/storyFilters';
import type { StoryCategory } from '../api/newsApi';
import mixpanel from 'mixpanel-browser';
import { useTranslation } from 'react-i18next';
import styles from './Home.module.css';

type ViewFilter = 'all' | 'favorites';

export function Home() {
  const { t } = useTranslation();
  const [category, setCategory] = useState<StoryCategory>('top');
  const { stories, loading, error, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } = useNews(category);
  const { toggleFavorite, isFavorite, favoriteCount } = useFavorites();
  const { markAsRead, markAsUnread, isRead } = useReadHistory();
  const [search, setSearch] = useState('');
  const [view, setView] = useState<ViewFilter>('all');

  // Track search analytics
  const handleSearchChange = (value: string) => {
    setSearch(value);
    try {
      mixpanel.track('Search Performed', {
        query: value,
        resultsCount: filtered.length,
      });
    } catch (error) {
      // Silently fail if Mixpanel is not configured
    }
  };

  // Track category change
  const handleCategoryChange = (newCategory: StoryCategory) => {
    setCategory(newCategory);
    try {
      mixpanel.track('Category Changed', {
        from: category,
        to: newCategory,
      });
    } catch (error) {
      // Silently fail if Mixpanel is not configured
    }
  };

  // Track view filter change
  const handleViewChange = (newView: ViewFilter) => {
    setView(newView);
    try {
      mixpanel.track('View Filter Changed', {
        from: view,
        to: newView,
      });
    } catch (error) {
      // Silently fail if Mixpanel is not configured
    }
  };
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [minScore, setMinScore] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const { sentinelRef } = useInfiniteScroll(hasNextPage, fetchNextPage, isFetchingNextPage);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = filterStories(stories, view, search, isFavorite, timeFilter, minScore);
  const showToolbar = !error;

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onNavigateDown: () => {
      if (filtered.length > 0) {
        setFocusedIndex(prev => (prev + 1) % filtered.length);
      }
    },
    onNavigateUp: () => {
      if (filtered.length > 0) {
        setFocusedIndex(prev => prev <= 0 ? filtered.length - 1 : prev - 1);
      }
    },
    onToggleFavorite: () => {
      if (focusedIndex >= 0 && focusedIndex < filtered.length) {
        toggleFavorite(filtered[focusedIndex].id);
      }
    },
    onFocusSearch: () => {
      searchRef.current?.focus();
    },
  });

  const handleToggleRead = (storyId: number) => {
    if (isRead(storyId)) {
      markAsUnread(storyId);
    } else {
      markAsRead(storyId);
    }
  };

  return (
    <div className={styles.root}>
      <Header favoriteCount={favoriteCount} />

      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div>
              <p className={styles.eyebrow}>
                <span className={styles.dot} />
                {t('hero.badge')}
              </p>
              <h1 className={styles.heading}>
                {t('hero.heading')}
              </h1>
              <p className={styles.subheading}>
                {t('hero.subheading')}
              </p>
            </div>
            <SearchBar ref={searchRef} value={search} onChange={handleSearchChange} placeholder={t('hero.searchPlaceholder')} />
          </div>
        </div>
      </section>

      {showToolbar && (
        <div className={styles.toolbar}>
          <div className={styles.container}>
            <FilterBar
              category={category}
              view={view}
              onCategoryChange={handleCategoryChange}
              onViewChange={handleViewChange}
              favoriteCount={favoriteCount}
            />
            <FilterPanel
              timeFilter={timeFilter}
              minScore={minScore}
              onTimeFilterChange={setTimeFilter}
              onMinScoreChange={setMinScore}
            />
          </div>
        </div>
      )}

      <main id="main-content" className={styles.main}>
        <div className={styles.container}>
          <ContentArea
            stories={stories}
            filteredStories={filtered}
            isLoading={loading}
            error={error}
            category={category}
            view={view}
            search={search}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            isRead={isRead}
            onToggleRead={handleToggleRead}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            sentinelRef={sentinelRef}
            onRetry={() => refetch()}
            focusedIndex={focusedIndex}
          />
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <p className={styles.footerText}>
              {t('footer.copyright')}{' '}
              <a href="https://news.ycombinator.com" target="_blank" rel="noreferrer">
                {t('footer.hackerNews')}
              </a>
            </p>
            <div className={styles.footerLinks}>
              <a href="https://news.ycombinator.com" target="_blank" rel="noreferrer">
                Hacker News
              </a>
              <a href="https://github.com/jmswebsolutions/Project-AI-Tech-Dashboard" target="_blank" rel="noreferrer">
                {t('footer.github')}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

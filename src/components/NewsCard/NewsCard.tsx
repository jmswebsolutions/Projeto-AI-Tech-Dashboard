import { useState } from 'react';
import type { Story } from '../../api/newsApi';
import type { Comment } from '../../api/newsApi';
import { CommentThread } from '../CommentThread/CommentThread';
import { useTranslation } from 'react-i18next';
import styles from './NewsCard.module.css';

interface NewsCardProps {
  story: Story;
  index: number;
  isFavorite?: boolean;
  onToggleFavorite?: (storyId: number) => void;
  isRead?: boolean;
  onToggleRead?: (storyId: number) => void;
  isFocused?: boolean;
}

export function NewsCard({ story, index, isFavorite = false, onToggleFavorite, isRead = false, onToggleRead, isFocused = false }: NewsCardProps) {
  const { t, i18n } = useTranslation();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const date = new Date(story.time * 1000).toLocaleDateString(i18n.language, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const domain = story.url
    ? (() => {
        try {
          return new URL(story.url).hostname.replace('www.', '');
        } catch {
          return '';
        }
      })()
    : '';

  const articleHref = story.url || '';
  const hnHref = `https://news.ycombinator.com/item?id=${story.id}`;

  const handleShare = async () => {
    const shareData = {
      title: story.title,
      text: `Check out this story from Hacker News: ${story.title}`,
      url: articleHref || hnHref,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareData.url);
      alert('Link copied to clipboard!');
    }
  };

  const handleToggleComments = async () => {
    if (!showComments && comments.length === 0 && !loadingComments) {
      setLoadingComments(true);
      try {
        const { getComments } = await import('../../api/newsApi');
        if (story.kids) {
          const fetchedComments = await getComments(story.kids);
          setComments(fetchedComments);
        }
      } catch (error) {
        console.error('Failed to load comments:', error);
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments(!showComments);
  };

  return (
    <article className={`${styles.card} ${isRead ? styles.read : ''} ${isFocused ? styles.focused : ''}`}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <span className={styles.rank}>{String(index + 1).padStart(2, '0')}</span>
          <div className={styles.headerActions}>
            {onToggleRead && (
              <button
                type="button"
                className={`${styles.readBtn} ${isRead ? styles.readActive : ''}`}
                onClick={() => onToggleRead(story.id)}
                aria-pressed={isRead}
                title={isRead ? t('newsCard.markAsUnread') : t('newsCard.markAsRead')}
              >
                {isRead ? '✓' : '○'}
              </button>
            )}
            {onToggleFavorite && (
              <button
                type="button"
                className={`${styles.favoriteBtn} ${isFavorite ? styles.favoriteActive : ''}`}
                onClick={() => onToggleFavorite(story.id)}
                aria-pressed={isFavorite}
              >
                {isFavorite ? '★' : '☆'}
              </button>
            )}
          </div>
        </div>
        <a
          href={articleHref || hnHref}
          target="_blank"
          rel="noreferrer"
          className={styles.titleLink}
        >
          <h2 className={styles.title}>{story.title}</h2>
        </a>
      </div>

      <div className={styles.metadata}>
        <div className={styles.stats}>
          <span className={styles.stat} title={t('newsCard.points')}>
            <span className={styles.icon}>▲</span>
            {story.score}
          </span>
          <span className={styles.stat} title={t('newsCard.comments')}>
            <span className={styles.icon}>💬</span>
            {story.descendants ?? 0}
          </span>
        </div>
        <div className={styles.info}>
          <span className={styles.author} title={`${t('newsCard.by')} ${story.by}`}>{story.by}</span>
          <span className={styles.separator}>·</span>
          <span className={styles.date} title={date}>{date}</span>
        </div>
      </div>

      {domain && <div className={styles.domain}>{domain}</div>}

      <div className={styles.actions}>
        {articleHref && (
          <a
            href={articleHref}
            target="_blank"
            rel="noreferrer"
            className={`${styles.button} ${styles.primary}`}
          >
            {t('newsCard.readArticle')}
            <span className={styles.arrow}>→</span>
          </a>
        )}
        <button
          type="button"
          className={`${styles.button} ${styles.discussBtn}`}
          onClick={handleToggleComments}
          title={`${story.descendants ?? 0} ${t('newsCard.comments')}`}
          aria-expanded={showComments}
          aria-label={`${story.descendants ?? 0} ${t('newsCard.comments')}`}
        >
          <span className={styles.icon}>💬</span>
        </button>
        <button
          type="button"
          className={`${styles.button} ${styles.shareBtn}`}
          onClick={handleShare}
          title="Share story"
          aria-label="Share story"
        >
          <span className={styles.icon}>📤</span>
        </button>
      </div>

      {showComments && (
        <>
          {loadingComments ? (
            <div className={styles.commentsLoading}>{t('loading.title')}</div>
          ) : comments.length > 0 ? (
            <CommentThread comments={comments} storyId={story.id} />
          ) : (
            <div className={styles.noComments}>{t('newsCard.comments')}</div>
          )}
        </>
      )}
    </article>
  );
}
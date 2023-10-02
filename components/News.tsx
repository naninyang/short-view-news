import { useRouter } from 'next/router';
import PerfectScrollbar from 'react-perfect-scrollbar';
import YouTubeController from './YouTubeController';
import styles from '@/styles/news.module.sass';
import styled from '@emotion/styled';
import { images } from '@/images';

type ShortData = {
  idx: string;
  video_id: string;
  subject: string;
  summary: string;
  blockquote: string;
  created: string;
};

interface NewsProps {
  newsItem: ShortData | undefined;
}

const CrossButton = styled.i({
  display: 'block',
  'body &, body[data-theme="dark"] &': {
    background: `url(${images.arrow.crossLight}) no-repeat 50% 50%/contain`,
  },
  'body[data-theme="light"] &': {
    background: `url(${images.arrow.crossDark}) no-repeat 50% 50%/contain`,
  },
});

const NewsDetail: React.FC<NewsProps> = ({ newsItem }) => {
  const router = useRouter();
  const handleCloseModal = () => {
    router.push('/');
  };

  if (!newsItem)
    return (
      <main className={styles.news}>
        <p className={styles.loading}>기사 불러오는 중...</p>
      </main>
    );

  return (
    <div className={`${styles.news} ${styles['news-container']}`}>
      <article>
        <header>
          <button className="close-btn" onClick={handleCloseModal}>
            <CrossButton />
            <span>닫기</span>
          </button>
          <h1>{newsItem.subject}</h1>
          <time>{newsItem.created}</time>
        </header>
        <div className={styles['news-content']}>
          <PerfectScrollbar className={styles['scrollbar-container']}>
            <YouTubeController videoId={newsItem.video_id} />
            <div className={styles.description}>
              <p dangerouslySetInnerHTML={{ __html: newsItem.summary }} />
              <p>{newsItem.blockquote}</p>
            </div>
          </PerfectScrollbar>
        </div>
      </article>
    </div>
  );
};

export default NewsDetail;

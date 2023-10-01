import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMediaQuery } from 'react-responsive';
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

export function useDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  const desktop = useMediaQuery({ query: '(min-width: 768px)' });
  useEffect(() => {
    setIsDesktop(desktop);
  }, [desktop]);
  return isDesktop;
}

const NewsDetail: React.FC<NewsProps> = ({ newsItem }) => {
  const router = useRouter();
  const isDesktop = useDesktop();
  const handleCloseModal = () => {
    router.push('/');
  };

  if (!newsItem) return <p>뉴스 불러오는 중...</p>;

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
            <YouTubeController
              videoId={newsItem.video_id}
              thumbnailUrl={
                isDesktop
                  ? `https://i.ytimg.com/vi/${newsItem.video_id}/sddefault.webp`
                  : `https://i.ytimg.com/vi/${newsItem.video_id}/mqdefault.webp`
              }
            />
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

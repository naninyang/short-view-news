import { useRouter } from 'next/router';
import PerfectScrollbar from 'react-perfect-scrollbar';
import YouTubeController from './YouTubeController';
import styles from '@/styles/watch.module.sass';
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

interface watchProps {
  watchItem: ShortData | undefined;
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

const watchDetail: React.FC<watchProps> = ({ watchItem }) => {
  const router = useRouter();
  const handleCloseModal = () => {
    router.push('/');
  };

  if (!watchItem)
    return (
      <main className={styles.watch}>
        <p className={styles.loading}>기사 불러오는 중...</p>
      </main>
    );

  return (
    <div className={`${styles.watch} ${styles['watch-container']}`}>
      <article>
        <header>
          <button className="close-btn" onClick={handleCloseModal}>
            <CrossButton />
            <span>닫기</span>
          </button>
          <h1>{watchItem.subject}</h1>
          <time>{watchItem.created}</time>
        </header>
        <div className={styles['watch-content']}>
          <PerfectScrollbar className={styles['scrollbar-container']}>
            <YouTubeController videoId={watchItem.video_id} />
            <div className={styles.description}>
              <p dangerouslySetInnerHTML={{ __html: watchItem.summary }} />
              <p>{watchItem.blockquote}</p>
            </div>
          </PerfectScrollbar>
        </div>
      </article>
    </div>
  );
};

export default watchDetail;

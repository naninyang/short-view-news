import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import PerfectScrollbar from 'react-perfect-scrollbar';
import YouTubeController from './YouTubeController';
import { images } from '@/images';
import styles from '@/styles/watch.module.sass';
import 'react-perfect-scrollbar/dist/css/styles.css';

type WatchData = {
  idx: string;
  video_id: string;
  title: string;
  description: string;
  comment: string;
  created: string;
};

interface watchProps {
  watchItem: WatchData | undefined;
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
    router.push('/witches');
  };

  return (
    <div className={`${styles.watch} ${styles['watch-container']}`}>
      <article>
        {watchItem ? (
          <>
            <header>
              <button type="button" className="close-btn" onClick={handleCloseModal}>
                <CrossButton />
                <span>닫기</span>
              </button>
              <h1>{watchItem.title}</h1>
              <time>{watchItem.created}</time>
            </header>
            <div className={styles['watch-content']}>
              <PerfectScrollbar className={styles['scrollbar-container']}>
                <YouTubeController videoId={watchItem.video_id} />
                <div className={styles.description}>
                  <p dangerouslySetInnerHTML={{ __html: watchItem.description }} />
                  <p>{watchItem.comment}</p>
                </div>
              </PerfectScrollbar>
            </div>
          </>
        ) : (
          <header>
            <button type="button" className="close-btn" onClick={handleCloseModal}>
              <CrossButton />
              <span>닫기</span>
            </button>
            <h1>본문 불러오는 중</h1>
          </header>
        )}
      </article>
    </div>
  );
};

export default watchDetail;

import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import PerfectScrollbar from 'react-perfect-scrollbar';
import YouTubeController from './YouTubeController';
import { images } from './images';
import styles from '@/styles/watch.module.sass';
import 'react-perfect-scrollbar/dist/css/styles.css';

type WatchData = {
  idx: string;
  video_id: string;
  title: string;
  description: string;
  comment: string;
  created: string;
  type: string;
  titles: string;
  video_ids: string;
  title1: string;
  description1: string;
  comment1: string;
  title2: string;
  description2: string;
  comment2: string;
  title3?: string;
  description3?: string;
  comment3?: string;
  title4?: string;
  description4?: string;
  comment4?: string;
  title5?: string;
  description5?: string;
  comment5?: string;
  title6?: string;
  description6?: string;
  comment6?: string;
  title7?: string;
  description7?: string;
  comment7?: string;
  title8?: string;
  description8?: string;
  comment8?: string;
  title9?: string;
  description9?: string;
  comment9?: string;
  title10?: string;
  description10?: string;
  comment10?: string;
};

interface watchProps {
  watchItem: WatchData | undefined;
}

const CrossButton = styled.i({
  display: 'block',
  'body[data-theme="dark"] &': {
    background: `url(${images.arrow.crossLight}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${images.arrow.crossDark}) no-repeat 50% 50%/contain`,
  },
});

const Comment = styled.p({
  '&::before': {
    'body[data-theme="dark"] &': {
      background: `url(${images.misc.commentLight}) no-repeat 50% 50%/contain`,
    },
    'body &, body[data-theme="light"] &': {
      background: `url(${images.misc.commentDark}) no-repeat 50% 50%/contain`,
    },
  },
});

const watchDetail: React.FC<watchProps> = ({ watchItem }) => {
  const router = useRouter();
  const handleCloseModal = () => {
    router.push('/watches');
  };

  const countItems = (data: string): number => {
    return data.split(',').length - 1;
  };

  return (
    <div className={`${styles.watch} ${styles['watch-container']}`}>
      <article>
        {watchItem ? (
          <>
            {watchItem.titles ? (
              <>
                <header>
                  <button type="button" className="close-btn" onClick={handleCloseModal}>
                    <CrossButton />
                    <span>닫기</span>
                  </button>
                  <h1>
                    &lt;{watchItem.title}&gt; 외 {countItems(watchItem.titles)}건
                  </h1>
                  <time>{watchItem.created}</time>
                </header>
                <div className={styles['watch-content']}>
                  <PerfectScrollbar className={styles['scrollbar-container']}>
                    <YouTubeController videoId={watchItem.video_ids} titles={watchItem.titles} isPlaylist={true} />
                    <div className={styles['playlist-description']}>
                      <strong>{watchItem.title1}</strong>
                      <p dangerouslySetInnerHTML={{ __html: watchItem.description1 }} />
                      <Comment>{watchItem.comment1}</Comment>
                    </div>
                    {watchItem.title2 && (
                      <div className={styles['playlist-description']}>
                        <strong>{watchItem.title2}</strong>
                        <p dangerouslySetInnerHTML={{ __html: watchItem.description2 || '' }} />
                        <Comment>{watchItem.comment2}</Comment>
                      </div>
                    )}
                    {watchItem.title3 && (
                      <div className={styles['playlist-description']}>
                        <strong>{watchItem.title3}</strong>
                        <p dangerouslySetInnerHTML={{ __html: watchItem.description3 || '' }} />
                        <Comment>{watchItem.comment3}</Comment>
                      </div>
                    )}
                    {watchItem.title4 && (
                      <div className={styles['playlist-description']}>
                        <strong>{watchItem.title4}</strong>
                        <p dangerouslySetInnerHTML={{ __html: watchItem.description4 || '' }} />
                        <Comment>{watchItem.comment4}</Comment>
                      </div>
                    )}
                    {watchItem.title5 && (
                      <div className={styles['playlist-description']}>
                        <strong>{watchItem.title5}</strong>
                        <p dangerouslySetInnerHTML={{ __html: watchItem.description5 || '' }} />
                        <Comment>{watchItem.comment5}</Comment>
                      </div>
                    )}
                    {watchItem.title6 && (
                      <div className={styles['playlist-description']}>
                        <strong>{watchItem.title6}</strong>
                        <p dangerouslySetInnerHTML={{ __html: watchItem.description6 || '' }} />
                        <Comment>{watchItem.comment6}</Comment>
                      </div>
                    )}
                    {watchItem.title7 && (
                      <div className={styles['playlist-description']}>
                        <strong>{watchItem.title7}</strong>
                        <p dangerouslySetInnerHTML={{ __html: watchItem.description7 || '' }} />
                        <Comment>{watchItem.comment7}</Comment>
                      </div>
                    )}
                    {watchItem.title8 && (
                      <div className={styles['playlist-description']}>
                        <strong>{watchItem.title8}</strong>
                        <p dangerouslySetInnerHTML={{ __html: watchItem.description8 || '' }} />
                        <Comment>{watchItem.comment8}</Comment>
                      </div>
                    )}
                    {watchItem.title9 && (
                      <div className={styles['playlist-description']}>
                        <strong>{watchItem.title9}</strong>
                        <p dangerouslySetInnerHTML={{ __html: watchItem.description9 || '' }} />
                        <Comment>{watchItem.comment9}</Comment>
                      </div>
                    )}
                    {watchItem.title10 && (
                      <div className={styles['playlist-description']}>
                        <strong>{watchItem.title10}</strong>
                        <p dangerouslySetInnerHTML={{ __html: watchItem.description10 || '' }} />
                        <Comment>{watchItem.comment10}</Comment>
                      </div>
                    )}
                  </PerfectScrollbar>
                </div>
              </>
            ) : (
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
                    <YouTubeController videoId={watchItem.video_id} isPlaylist={false} />
                    <div className={styles.description}>
                      <p dangerouslySetInnerHTML={{ __html: watchItem.description }} />
                      <p>{watchItem.comment}</p>
                    </div>
                  </PerfectScrollbar>
                </div>
              </>
            )}
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

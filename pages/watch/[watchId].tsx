import { useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import axios from 'axios';
import { images } from '@/images';
import Seo from '@/components/Seo';
import YouTubeController from '@/components/YouTubeController';
import AnchorLink from '@/components/AnchorLink';
import styled from '@emotion/styled';
import styles from '@/styles/watch.module.sass';

type SheetData = {
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

const BackButton = styled.i({
  display: 'block',
  'body[data-theme="dark"] &': {
    background: `url(${images.arrow.backLight}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${images.arrow.backDark}) no-repeat 50% 50%/contain`,
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

export default function watchDetail({ watchData }: { watchData: SheetData | null }) {
  const router = useRouter();
  let savedScrollPosition;

  const handleBackClick = () => {
    const savedScrollPosition = sessionStorage.getItem('scrollPosition_' + router.asPath);
    if (savedScrollPosition) {
      router.back();
    }
  };

  const [timeoutReached, setTimeoutReached] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutReached(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!watchData) {
    if (timeoutReached) {
      return (
        <main className={styles.watch}>
          <p className={styles.error}>
            뉴스를 불러오지 못했습니다. 삭제된 기사이거나 인터넷 속도가 느립니다.{' '}
            <AnchorLink href="/watches">뒤로가기</AnchorLink>
          </p>
        </main>
      );
    } else {
      return (
        <main className={styles.watch}>
          <p className={styles.loading}>기사 불러오는 중...</p>
        </main>
      );
    }
  }

  const countItems = (data: string): number => {
    return data.split(',').length - 1;
  };

  return (
    <main className={styles.watch}>
      {watchData.type === 'playlist' ? (
        <Seo
          pageTitle={watchData.title}
          pageDescription={watchData.description}
          pageImg={`https://i.ytimg.com/vi/${watchData.video_ids}/maxresdefault.jpg`}
          pageOgType="video.other"
        />
      ) : (
        <Seo
          pageTitle={watchData.title}
          pageDescription={watchData.description}
          pageImg={`https://i.ytimg.com/vi/${watchData.video_id}/maxresdefault.jpg`}
          pageOgType="video.other"
        />
      )}
      <div className="top-link">
        {savedScrollPosition ? (
          <button onClick={handleBackClick}>뒤로가기</button>
        ) : (
          <AnchorLink href="/watches">
            <BackButton />
            <span>뒤로가기</span>
          </AnchorLink>
        )}
      </div>
      <article>
        {watchData.type === 'playlist' ? (
          <>
            <header>
              <h1>
                &lt;{watchData.title}&gt; 외 {countItems(watchData.titles)}건
              </h1>
              <time>{watchData.created}</time>
            </header>
            <YouTubeController videoId={watchData.video_ids} titles={watchData.titles} isPlaylist={true} />
            <div className={styles['playlist-description']}>
              <strong>{watchData.title1}</strong>
              <p dangerouslySetInnerHTML={{ __html: watchData.description1 }} />
              <Comment>{watchData.comment1}</Comment>
            </div>
            {watchData.title2 && (
              <div className={styles['playlist-description']}>
                <strong>{watchData.title2}</strong>
                <p dangerouslySetInnerHTML={{ __html: watchData.description2 || '' }} />
                <Comment>{watchData.comment2}</Comment>
              </div>
            )}
            {watchData.title3 && (
              <div className={styles['playlist-description']}>
                <strong>{watchData.title3}</strong>
                <p dangerouslySetInnerHTML={{ __html: watchData.description3 || '' }} />
                <Comment>{watchData.comment3}</Comment>
              </div>
            )}
            {watchData.title4 && (
              <div className={styles['playlist-description']}>
                <strong>{watchData.title4}</strong>
                <p dangerouslySetInnerHTML={{ __html: watchData.description4 || '' }} />
                <Comment>{watchData.comment4}</Comment>
              </div>
            )}
            {watchData.title5 && (
              <div className={styles['playlist-description']}>
                <strong>{watchData.title5}</strong>
                <p dangerouslySetInnerHTML={{ __html: watchData.description5 || '' }} />
                <Comment>{watchData.comment5}</Comment>
              </div>
            )}
            {watchData.title6 && (
              <div className={styles['playlist-description']}>
                <strong>{watchData.title6}</strong>
                <p dangerouslySetInnerHTML={{ __html: watchData.description6 || '' }} />
                <Comment>{watchData.comment6}</Comment>
              </div>
            )}
            {watchData.title7 && (
              <div className={styles['playlist-description']}>
                <strong>{watchData.title7}</strong>
                <p dangerouslySetInnerHTML={{ __html: watchData.description7 || '' }} />
                <Comment>{watchData.comment7}</Comment>
              </div>
            )}
            {watchData.title8 && (
              <div className={styles['playlist-description']}>
                <strong>{watchData.title8}</strong>
                <p dangerouslySetInnerHTML={{ __html: watchData.description8 || '' }} />
                <Comment>{watchData.comment8}</Comment>
              </div>
            )}
            {watchData.title9 && (
              <div className={styles['playlist-description']}>
                <strong>{watchData.title9}</strong>
                <p dangerouslySetInnerHTML={{ __html: watchData.description9 || '' }} />
                <Comment>{watchData.comment9}</Comment>
              </div>
            )}
            {watchData.title10 && (
              <div className={styles['playlist-description']}>
                <strong>{watchData.title10}</strong>
                <p dangerouslySetInnerHTML={{ __html: watchData.description10 || '' }} />
                <Comment>{watchData.comment10}</Comment>
              </div>
            )}
          </>
        ) : (
          <>
            <header>
              <h1>{watchData.title}</h1>
              <time>{watchData.created}</time>
            </header>
            <YouTubeController videoId={watchData.video_id} isPlaylist={false} />
            <div className={styles.description}>
              <p dangerouslySetInnerHTML={{ __html: watchData.description }} />
              <p>{watchData.comment}</p>
            </div>
          </>
        )}
      </article>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const watchId = context.params?.watchId;
  let watchData = null;

  if (watchId) {
    const response = await axios.get<SheetData[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/sheetItem?idx=${watchId}`);
    watchData = response.data;
  }

  if (!watchData) {
    return {
      props: {
        watchData: null,
      },
    };
  }

  return {
    props: {
      watchData,
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

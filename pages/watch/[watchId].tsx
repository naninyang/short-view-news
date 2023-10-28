import { GetStaticPaths, GetStaticProps } from 'next';
import axios from 'axios';
import { images } from '@/images';
import Seo from '@/components/Seo';
import YouTubeController from '@/components/YouTubeController';
import AnchorLink from '@/components/AnchorLink';
import styled from '@emotion/styled';
import styles from '@/styles/watch.module.sass';
import { useEffect, useState } from 'react';

type SheetData = {
  idx: string;
  video_id: string;
  title: string;
  description: string;
  comment: string;
  created: string;
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

export default function watchDetail({ watchData }: { watchData: SheetData | null }) {
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

  return (
    <main className={styles.watch}>
      <Seo
        pageTitle={watchData.title}
        pageDescription={watchData.description}
        pageImg={`https://i.ytimg.com/vi/${watchData.video_id}/maxresdefault.jpg`}
        pageOgType="video.other"
      />
      <div className="top-link">
        <AnchorLink href="/watches">
          <BackButton />
          <span>뒤로가기</span>
        </AnchorLink>
      </div>
      <article>
        <header>
          <h1>{watchData.title}</h1>
          <time>{watchData.created}</time>
        </header>
        <YouTubeController videoId={watchData.video_id} />
        <div className={styles.description}>
          <p dangerouslySetInnerHTML={{ __html: watchData.description }} />
          <p>{watchData.comment}</p>
        </div>
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

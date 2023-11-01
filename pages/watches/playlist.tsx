import React, { useEffect, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Modal from 'react-modal';
import axios from 'axios';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { Masonry } from 'masonic';
import YouTubeController from '@/components/YouTubeController';
import { images } from '@/components/images';
import styled from '@emotion/styled';
import styles from '@/styles/watches.module.sass';

type SheetData = {
  idx: string;
  titles: string;
  video_ids: string;
  title: string;
  description: string;
  created: string;
  title1: string;
  description1: string;
  comment1: string;
  title2?: string;
  description2?: string;
  comment2?: string;
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

Modal.setAppElement('#__next');

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

const Seemore = styled.em({
  '&::after': {
    'body[data-theme="dark"] &': {
      background: `url(${images.misc.seemoreLight}) no-repeat 50% 50%/contain`,
    },
    'body &, body[data-theme="light"] &': {
      background: `url(${images.misc.seemoreDark}) no-repeat 50% 50%/contain`,
    },
  },
});

export const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const getKey = (pageIndex: number, previousPageData: any) => {
  if (previousPageData && !previousPageData.length) return null;
  return `${process.env.NEXT_PUBLIC_API_URL}/api/sheetsPlaylist?start=${pageIndex * 20}&count=20`;
};

export default function WatchesPlaylist() {
  const router = useRouter();

  const { data, error, size, setSize } = useSWRInfinite(getKey, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  });

  const [target, setTarget] = useState<HTMLElement | null | undefined>(null);
  const watchId = Array.isArray(router.query.watchId) ? router.query.watchId[0] : router.query.watchId;

  const sheets = data ? [].concat(...data) : [];
  const isLoading = !data && !error;
  const isReachingEnd = data && data[data.length - 1]?.length < 20;

  const onIntersect: IntersectionObserverCallback = ([entry]) => {
    if (entry.isIntersecting && !isReachingEnd && !isLoading && (size === 0 || size === 1)) {
      setSize((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (!target) return;
    const observer = new IntersectionObserver(onIntersect);
    observer.observe(target);
    return () => observer && observer.disconnect();
  }, [target]);

  useEffect(() => {
    if (!target || isLoading) return;
  }, [target, isLoading]);

  const selectedWatch = Array.isArray(sheets) ? sheets.find((watch: any) => watch.idx === watchId) : undefined;

  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    if (watchId !== undefined) {
      window.addEventListener('wheel', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });
    } else {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    }

    return () => {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    };
  }, [watchId]);

  const handleResize = () => {
    const width = window.innerWidth;
    if (width < 671) setColumnCount(1);
    else if (width >= 671 && width <= 922) setColumnCount(2);
    else if (width >= 922 && width <= 1396) setColumnCount(3);
    else setColumnCount(4);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const renderCard = ({ data }: { data: SheetData }) => (
    <div className={styles.item}>
      <figure>
        <YouTubeController videoId={data.video_ids} titles={data.titles} isPlaylist={true} />
        <figcaption>
          <Link key={data.idx} href={`/watch/${data.idx}`} scroll={false} shallow={true}>
            <div className={styles['playlist-description']}>
              <strong>{data.title1}</strong>
              <p dangerouslySetInnerHTML={{ __html: data.description1 }} />
              <Comment>{data.comment1}</Comment>
              <Seemore>
                <span>더보기</span>
              </Seemore>
            </div>
          </Link>
        </figcaption>
      </figure>
    </div>
  );

  const handleRefresh = async () => {
    window.location.reload();
  };
  const [columnCount, setColumnCount] = useState(1);

  return (
    <>
      {isLoading && <div className={styles.loading}>뉴스를 불러오는 중입니다.</div>}
      {error && (
        <div className={styles.error}>
          <p>데이터를 불러오는데 실패했습니다.</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      )}
      {!isLoading && !error && (
        <div className={styles['watch-content']}>
          <PullToRefresh onRefresh={handleRefresh}>
            <Masonry
              items={sheets || []}
              columnCount={columnCount}
              render={renderCard}
              key={sheets.length}
              data-index={sheets.length}
            />
          </PullToRefresh>
          {isReachingEnd !== undefined && (
            <div ref={setTarget} className={styles.ref}>
              {isReachingEnd === false && <p>뉴스를 불러오는 중입니다.</p>}
            </div>
          )}
        </div>
      )}
    </>
  );
}

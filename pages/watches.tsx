import React, { useEffect, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Modal from 'react-modal';
import axios from 'axios';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { Masonry } from 'masonic';
import styled from '@emotion/styled';
import Seo from '@/components/Seo';
import YouTubeController from '@/components/YouTubeController';
import { images } from '@/images';
import { hex, rem } from '@/styles/designSystem';
import { modalContainer } from '@/components/ModalStyling';
import WatchDetail from '@/components/Watch';
import styles from '@/styles/watches.module.sass';
import Services from '@/components/Services';

type SheetData = {
  idx: string;
  video_id: string;
  title: string;
  description: string;
  comment: string;
  created: string;
};

Modal.setAppElement('#__next');

const IsOffline = styled.main({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: `calc(100vh - ${rem(175)})`,
  'body[data-theme="dark"] &': {
    color: hex.white,
  },
  'body[data-theme="light"] &': {
    color: hex.black,
  },
  '& .container': {
    textAlign: 'center',
  },
  '& h2': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: rem(15),
    fontSize: rem(16),
    fontWeight: '700',
    '&::before': {
      content: "''",
      display: 'block',
      background: `url(${images.misc.error}) no-repeat 50% 50%/contain`,
      width: rem(50),
      height: rem(50),
    },
  },
  '& p': {
    margin: `${rem(15)} 0 ${rem(25)}`,
    fontSize: rem(14),
  },
  '& button': {
    background: 'none',
    border: `1px solid ${hex.accent}`,
    borderRadius: rem(32),
    padding: `0 ${rem(32)}`,
    height: rem(32),
    fontSize: rem(16),
    fontWeight: '700',
    lineHeight: 1,
    'body[data-theme="dark"] &': {
      color: hex.white,
    },
    'body[data-theme="light"] &': {
      color: hex.black,
    },
  },
});

export const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const getKey = (pageIndex: number, previousPageData: any) => {
  if (previousPageData && !previousPageData.length) return null;
  return `${process.env.NEXT_PUBLIC_API_URL}/api/sheets?start=${pageIndex * 20}&count=20`;
};

export default function Watches() {
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
        <YouTubeController videoId={data.video_id} />
        <figcaption>
          <div>
            <Link
              key={data.idx}
              href={`/watches?watchId=${data.idx}`}
              as={`/watch/${data.idx}`}
              scroll={false}
              shallow={true}
            >
              {data.title} / <time>{data.created}</time>
            </Link>
            <p dangerouslySetInnerHTML={{ __html: data.description }} />
          </div>
          <p>{data.comment}</p>
        </figcaption>
      </figure>
    </div>
  );

  const handleRefresh = async () => {
    window.location.reload();
  };
  const [columnCount, setColumnCount] = useState(1);

  const timestamp = Date.now();

  return (
    <main className={styles.watches}>
      <Seo
        pageTitle="유튜브 쇼츠 뉴스"
        pageDescription="당신이 놓친 뉴스를 짧게 요약해 드려요"
        pageImg={`https://news.dev1stud.io/og-image.png?ts=${timestamp}`}
      />
      <Modal
        isOpen={!!watchId}
        onRequestClose={() => router.push('/watches', undefined, { scroll: false })}
        contentLabel="Watch Modal"
        style={modalContainer}
      >
        <WatchDetail watchItem={selectedWatch} />
      </Modal>
      <Services />
      {isLoading && <div className={styles.loading}>기사를 불러오는 중입니다.</div>}
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
              {isReachingEnd === false && <p>기사를 불러오는 중입니다.</p>}
            </div>
          )}
        </div>
      )}
    </main>
  );
}

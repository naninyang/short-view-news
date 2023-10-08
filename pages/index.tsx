import React, { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Modal from 'react-modal';
import { throttle } from 'lodash';
import { Masonry } from 'masonic';
import axios from 'axios';
import styled from '@emotion/styled';
import Seo from '@/components/Seo';
import PullToRefresh from 'react-simple-pull-to-refresh';
import YouTubeController from '@/components/YouTubeController';
import { images } from '@/images';
import { hex, rem } from '@/styles/designSystem';
import { modalContainer } from '@/components/ModalStyling';
import WatchDetail from '@/components/Watch';
import styles from '@/styles/home.module.sass';
import Services from '@/components/Services';

type SheetData = {
  idx: string;
  video_id: string;
  subject: string;
  summary: string;
  blockquote: string;
  created: string;
};

Modal.setAppElement('#__next');

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

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

export default function Home() {
  const router = useRouter();
  const [loadedItems, setLoadedItems] = useState(0);

  const {
    data: sheets = [],
    error,
    mutate,
  } = useSWR(`/api/sheets?start=0&count=20`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  });

  const isLoading = !sheets && !error;
  const [columnCount, setColumnCount] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const watchId = Array.isArray(router.query.watchId) ? router.query.watchId[0] : router.query.watchId;
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

  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const isBottom = window.innerHeight + window.scrollY + 2000 >= document.body.offsetHeight;
      if (!isFetching && isBottom && !isLoading && hasMore) {
        setIsFetching(true);
        setLoadedItems((prev) => prev + 20);
        loadSheets(loadedItems + 20, 20);
      }
    }, 200);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoading, hasMore, isFetching, loadedItems]);

  useEffect(() => {
    if (loadedItems > 0 && !isFetching) {
      loadSheets(loadedItems, 20);
    }
  }, [loadedItems]);

  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const loadSheets = async (start: number, count: number) => {
    setIsFetchingMore(true);

    try {
      const response = await axios.get(`/api/sheets?start=${start}&count=${count}`);
      const additionalSheets = response.data;

      mutate((currentSheets: any) => {
        if (!Array.isArray(currentSheets)) {
          currentSheets = [];
        }
        const uniqueSheets = additionalSheets.filter(
          (sheet: any) => !currentSheets.some((current: any) => current.idx === sheet.idx),
        );
        return [...currentSheets, ...uniqueSheets];
      }, false);

      if (additionalSheets.length < count) {
        setHasMore(false);
      }

      setLoadedItems(start + additionalSheets.length);
    } catch (err) {
      console.error('Error fetching sheets:', err);
    } finally {
      setIsFetchingMore(false);
    }
  };

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

  const sortedSheets = [...(sheets || [])].sort((a, b) => b.idx.localeCompare(a.idx));

  const renderCard = ({ data }: { data: SheetData }) => (
    <div className={styles.item}>
      <figure>
        <YouTubeController videoId={data.video_id} />
        <figcaption>
          <div>
            <Link key={data.idx} href={`/?watchId=${data.idx}`} as={`/watch/${data.idx}`} scroll={false} shallow={true}>
              {data.subject} / <time>{data.created}</time>
            </Link>
            <p dangerouslySetInnerHTML={{ __html: data.summary }} />
          </div>
          <p>{data.blockquote}</p>
        </figcaption>
      </figure>
    </div>
  );

  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    function updateNetworkStatus() {
      setIsOnline(navigator.onLine);
    }

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, []);

  if (!isOnline) {
    return (
      <IsOffline>
        <div className="container">
          <h2>인터넷 연결 필요</h2>
          <p>오프라인 상태입니다. 연결 상태를 확인하세요.</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      </IsOffline>
    );
  }

  const handleRefresh = async () => {
    try {
      const count = 20;
      const response = await axios.get(`/api/sheets?start=0&count=${count}`);
      const newSheets = response.data;

      mutate((currentSheets: any) => {
        const updatedSheets = newSheets.filter(
          (newSheet: any) => !currentSheets.some((sheet: any) => sheet.idx === newSheet.idx),
        );
        return [...updatedSheets, ...currentSheets];
      }, false);
    } catch (error) {
      console.error('Failed to refresh:', error);
    }
  };

  const timestamp = Date.now();

  return (
    <main className={styles.main}>
      <Seo
        pageTitle="유튜브 쇼츠 뉴스"
        pageDescription="당신이 놓친 뉴스를 짧게 요약해 드려요"
        pageImg={`https://news.dev1stud.io/og-image.png?ts=${timestamp}`}
      />
      <Modal
        isOpen={!!watchId}
        onRequestClose={() => router.push('/', undefined, { scroll: false })}
        contentLabel="Watch Modal"
        style={modalContainer}
      >
        <WatchDetail watchItem={selectedWatch} />
      </Modal>
      <Services />
      <PullToRefresh onRefresh={handleRefresh}>
        <Masonry
          items={sortedSheets}
          columnCount={columnCount}
          render={renderCard}
          key={sheets.length}
          data-index={sheets.length}
        />
      </PullToRefresh>
      {isFetchingMore && hasMore && <div className={styles.loading}>기사를 불러오는 중입니다.</div>}
      {error && (
        <div className={styles.error}>
          <p>데이터를 불러오는데 실패했습니다.</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      )}
    </main>
  );
}

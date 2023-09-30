import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import axios from 'axios';
import styled from '@emotion/styled';
import { Masonry } from 'masonic';
import PullToRefresh from 'react-simple-pull-to-refresh';
import Seo from '@/components/Seo';
import YouTubeController from '@/components/YouTubeController';
import { hex, rem } from '@/styles/designSystem';
import { images } from '@/images';
import NewsDetail from '@/components/News';
import styles from '@/styles/home.module.sass';

type ShortData = {
  idx: string;
  video_id: string;
  subject: string;
  summary: string;
  blockquote: string;
  created: string;
};

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

Modal.setAppElement('#__next');

export default function Home() {
  const router = useRouter();

  const [shorts, setShorts] = useState<ShortData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [columnCount, setColumnCount] = useState(1);
  const [loadedItems, setLoadedItems] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const newsId = Array.isArray(router.query.newsId) ? router.query.newsId[0] : router.query.newsId;
  const selectedNews = shorts.find((news) => news.idx === newsId);

  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    if (newsId !== undefined) {
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
  }, [newsId]);

  useEffect(() => {
    loadShorts(loadedItems, 20);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY + 1000 >= document.body.offsetHeight && !isLoading && hasMore) {
        loadShorts(loadedItems, 20);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadedItems, isLoading, hasMore]);

  const loadShorts = (start: number, count: number) => {
    setIsLoading(true);

    axios
      .get(`/api/shorts?start=${start}&count=${count}`)
      .then((response) => {
        if (JSON.stringify(response.data) !== JSON.stringify(shorts.slice(start, start + count))) {
          setShorts((prev) => [...prev, ...response.data]);
        }
        if (response.data.length < count) {
          setHasMore(false);
        }
        setLoadedItems((prev) => prev + response.data.length);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching shorts:', err);
        setError('데이터를 불러오는데 실패했습니다.');
        setIsLoading(false);
      });
  };

  const handleResize = () => {
    const width = window.innerWidth;
    if (width < 922) setColumnCount(1);
    else if (width >= 922 && width <= 1396) setColumnCount(2);
    else setColumnCount(4);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const sortedShorts = [...shorts].sort((a, b) => b.idx.localeCompare(a.idx));

  const renderCard = ({ data }: { data: ShortData }) => (
    <div className={styles.item}>
      <figure>
        <YouTubeController
          videoId={data.video_id}
          thumbnailUrl={`https://i.ytimg.com/vi/${data.video_id}/maxresdefault.jpg`}
        />
        <figcaption>
          <div>
            <Link key={data.idx} href={`/?newsId=${data.idx}`} as={`/news/${data.idx}`} scroll={false} shallow={true}>
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

  const modalContainer = {
    overlay: {
      zIndex: 1070,
      backgroundColor: `var(--bg-primary-opacity)`,
      backdropFilter: `saturate(180%) blur(${rem(20)})`,
      WebkitBackdropFilter: `saturate(180%) blur(${rem(20)})`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      inset: undefined,
      position: undefined,
      background: 'var(--bg-secondary)',
      margin: 0,
      border: undefined,
      borderRadius: undefined,
      padding: undefined,
      maxWidth: rem(922),
    },
  };

  const handleRefresh = async () => {
    try {
      const start = shorts.length;
      const count = 20;

      const response = await axios.get(`/api/shorts?start=${start}&count=${count}`);
      if (response.data.length > 0) {
        setShorts((prevShorts) => [...prevShorts, ...response.data]);
      }
    } catch (error) {
      console.error('Failed to refresh:', error);
    }
  };

  return (
    <main className={styles.main}>
      <Seo
        pageTitle="숏뷰 뉴스 {short.view: news}"
        pageDescription="당신이 놓친 뉴스를 짧게 요약해 드려요"
        pageImg="og.png"
      />
      <Modal
        isOpen={!!newsId}
        onRequestClose={() => router.push('/', undefined, { scroll: false })}
        contentLabel="News Modal"
        style={modalContainer}
      >
        <NewsDetail newsItem={selectedNews} />
      </Modal>
      <PullToRefresh onRefresh={handleRefresh}>
        <Masonry items={sortedShorts} columnCount={columnCount} render={renderCard} />
      </PullToRefresh>
      {isLoading && hasMore && <div className={styles.loading}>기사를 불러오는 중입니다.</div>}
      {error && (
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      )}
    </main>
  );
}

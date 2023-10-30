import React, { useEffect, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMediaQuery } from 'react-responsive';
import Modal from 'react-modal';
import axios from 'axios';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { Masonry } from 'masonic';
import { modalContainer } from '@/components/ModalStyling';
import YouTubeController from '@/components/YouTubeController';
import WatchDetail from '@/components/Watch';
import styles from '@/styles/watches.module.sass';

type SheetData = {
  idx: string;
  video_id: string;
  title: string;
  description: string;
  comment: string;
  created: string;
};

Modal.setAppElement('#__next');

export function useDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  const desktop = useMediaQuery({ query: '(min-width: 768px)' });
  useEffect(() => {
    setIsDesktop(desktop);
  }, [desktop]);
  return isDesktop;
}

export const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const getKey = (pageIndex: number, previousPageData: any) => {
  if (previousPageData && !previousPageData.length) return null;
  return `${process.env.NEXT_PUBLIC_API_URL}/api/sheetsNews?start=${pageIndex * 20}&count=20`;
};

export default function WatchesNewsItem() {
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

  const isDesktop = useDesktop();

  const renderCard = ({ data }: { data: SheetData }) => (
    <div className={styles.item}>
      <figure>
        <YouTubeController videoId={data.video_id} isPlaylist={false} />
        <figcaption>
          <div>
            {isDesktop ? (
              <Link
                key={data.idx}
                href={`/watches?watchId=${data.idx}`}
                as={`/watch/${data.idx}`}
                scroll={false}
                shallow={true}
              >
                {data.title} <time>{data.created}</time>
              </Link>
            ) : (
              <Link key={data.idx} href={`/watch/${data.idx}`} scroll={false} shallow={true}>
                {data.title} <time>{data.created}</time>
              </Link>
            )}
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

  return (
    <>
      <Modal
        isOpen={!!watchId}
        onRequestClose={() => router.push('/watches', undefined, { scroll: false })}
        contentLabel="Watch Modal"
        style={modalContainer}
      >
        <WatchDetail watchItem={selectedWatch} />
      </Modal>
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

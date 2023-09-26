import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Masonry } from 'masonic';
import YouTubeController from '@/components/YouTubeController';
import styles from '@/styles/home.module.sass';
import Seo from '@/components/Seo';

type ShortData = {
  thumbnail: string;
  video_id: string;
  subject: string;
  summary: string;
  blockquote: string;
  created: string;
};

export default function Home() {
  const [shorts, setShorts] = useState<ShortData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [columnCount, setColumnCount] = useState(1);
  const [loadedItems, setLoadedItems] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadShorts(loadedItems, 20);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY + 1000 >= document.body.offsetHeight && !isLoading) {
        loadShorts(loadedItems, 20);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadedItems, isLoading]);

  const loadShorts = (start: number, count: number) => {
    setIsLoading(true);
    axios
      .get(`/api/shorts?start=${start}&count=${count}`)
      .then((response) => {
        if (response.data.length < count) {
          setHasMore(false);
        }
        setShorts((prev) => [...prev, ...response.data]);
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

  const sortedShorts = [...shorts].sort((a, b) => b.thumbnail.localeCompare(a.thumbnail));

  const dev = process.env.NODE_ENV !== 'production';

  const renderCard = ({ data }: { data: ShortData }) => (
    <div className={styles.item}>
      <figure>
        {dev ? (
          <YouTubeController videoId={data.video_id} thumbnailUrl={`/images/${data.thumbnail}`} />
        ) : (
          <YouTubeController
            videoId={data.video_id}
            thumbnailUrl={`https://image.toast.com/aaaacnn/short-view-news/${data.thumbnail}`}
          />
        )}
        <figcaption>
          <div>
            <h2>
              {data.subject} / <time>{data.created}</time>
            </h2>
            <p dangerouslySetInnerHTML={{ __html: data.summary }} />
          </div>
          <p>{data.blockquote}</p>
        </figcaption>
      </figure>
    </div>
  );

  return (
    <main className={styles.main}>
      <Seo
        pageTitle="숏뷰 뉴스 {short.view: news}"
        pageDescription="당신이 놓친 뉴스를 짧게 요약해 드려요"
        pageImg="og.png"
      />
      <Masonry items={sortedShorts} columnCount={columnCount} render={renderCard} />
      {isLoading && hasMore && <div className={styles.loading}>기사를 불러오는 중입니다.</div>}
      {error && <div className={styles.error}>{error}</div>}
    </main>
  );
}

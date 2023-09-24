import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Masonry } from 'masonic';
import YouTubeController from '@/components/YouTubeController';
import styles from '@/styles/home.module.sass';

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
  const [columnCount, setColumnCount] = useState(1);

  useEffect(() => {
    axios
      .get('/api/shorts')
      .then((response) => {
        setShorts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching shorts:', error);
      });

    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 922) setColumnCount(1);
      else if (width >= 922 && width <= 1396) setColumnCount(2);
      else setColumnCount(4);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const renderCard = ({ data }: { data: ShortData }) => (
    <div className={styles.item}>
      <figure>
        <YouTubeController
          videoId={data.video_id}
          thumbnailUrl={`https://image.toast.com/aaaacnn/short-view-news/${data.thumbnail}`}
        />
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
      <Masonry items={shorts} columnCount={columnCount} render={renderCard} />
    </main>
  );
}

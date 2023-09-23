import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '@/styles/home.module.sass';

type ShortData = {
  thumbnail: string;
  video_id: string;
  subject: string;
  summary: string;
  blockquote: string;
  created: string;
};

type ThumbnailData = {
  name: string;
  url: string;
};

export default function Home() {
  const [shorts, setShorts] = useState<ShortData[]>([]);
  const [thumbnails, setThumbnails] = useState<ThumbnailData[]>([]);

  useEffect(() => {
    axios
      .get('/api/shorts')
      .then((response) => {
        setShorts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching shorts:', error);
      });
  }, []);

  return (
    <main className={styles.main}>
      {shorts.map((item, index) => {
        return (
          <figure key={index}>
            <img
              src={`https://image.toast.com/aaaacnn/short-view-news/${item.thumbnail}`}
              alt=""
            />
            <figcaption>
              <div>
                <p>{item.video_id}</p>
                <h2>
                  {item.subject} / <time>{item.created}</time>
                </h2>
                <p dangerouslySetInnerHTML={{ __html: item.summary }} />
              </div>
              <p>{item.blockquote}</p>
            </figcaption>
          </figure>
        );
      })}
    </main>
  );
}

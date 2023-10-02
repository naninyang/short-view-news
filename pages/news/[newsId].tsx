import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styled from '@emotion/styled';
import { images } from '@/images';
import Seo from '@/components/Seo';
import YouTubeController from '@/components/YouTubeController';
import AnchorLink from '@/components/AnchorLink';
import styles from '@/styles/news.module.sass';

type ShortData = {
  idx: string;
  video_id: string;
  subject: string;
  summary: string;
  blockquote: string;
  created: string;
};

const BackButton = styled.i({
  display: 'block',
  'body &, body[data-theme="dark"] &': {
    background: `url(${images.arrow.backLight}) no-repeat 50% 50%/contain`,
  },
  'body[data-theme="light"] &': {
    background: `url(${images.arrow.backDark}) no-repeat 50% 50%/contain`,
  },
});

const NewsDetail = () => {
  const [newsData, setNewsData] = useState<ShortData | null>(null);
  const router = useRouter();
  const { newsId } = router.query;

  useEffect(() => {
    if (newsId) {
      axios.get<ShortData[]>('/api/shorts').then((response) => {
        const matchedData = response.data.find((news) => news.idx === newsId);
        if (matchedData) {
          setNewsData(matchedData);
        }
      });
    }
  }, [newsId]);

  if (!newsData)
    return (
      <main className={styles.news}>
        <p className={styles.loading}>기사 불러오는 중...</p>
      </main>
    );

  return (
    <main className={styles.news}>
      <Seo
        pageTitle={newsData.subject}
        pageDescription={newsData.summary}
        pageImg={`/vi/${newsData.video_id}/maxresdefault.jpg`}
      />
      <div className={styles['top-link']}>
        <AnchorLink href="/">
          <BackButton />
          <span>뒤로가기</span>
        </AnchorLink>
      </div>
      <article>
        <header>
          <h1>{newsData.subject}</h1>
          <time>{newsData.created}</time>
        </header>
        <YouTubeController videoId={newsData.video_id} />
        <div className={styles.description}>
          <p dangerouslySetInnerHTML={{ __html: newsData.summary }} />
          <p>{newsData.blockquote}</p>
        </div>
      </article>
    </main>
  );
};

export default NewsDetail;

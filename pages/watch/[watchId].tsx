import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styled from '@emotion/styled';
import { images } from '@/images';
import Seo from '@/components/Seo';
import YouTubeController from '@/components/YouTubeController';
import AnchorLink from '@/components/AnchorLink';
import styles from '@/styles/watch.module.sass';

type SheetData = {
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

const watchDetail = () => {
  const router = useRouter();
  const [watchData, setwatchData] = useState<SheetData | null>(null);
  const { watchId } = router.query;

  useEffect(() => {
    if (watchId) {
      axios.get<SheetData[]>('/api/sheets').then((response) => {
        const matchedData = response.data.find((watch) => watch.idx === watchId);
        if (matchedData) {
          setwatchData(matchedData);
        }
      });
    }
  }, [watchId]);

  if (!watchData)
    return (
      <main className={styles.watch}>
        <p className={styles.loading}>기사 불러오는 중...</p>
      </main>
    );

  return (
    <main className={styles.watch}>
      <Seo
        pageTitle={watchData.subject}
        pageDescription={watchData.summary}
        pageImg={`/vi/${watchData.video_id}/maxresdefault.jpg`}
        pageOgType="video.other"
      />
      <div className={styles['top-link']}>
        <AnchorLink href="/">
          <BackButton />
          <span>뒤로가기</span>
        </AnchorLink>
      </div>
      <article>
        <header>
          <h1>{watchData.subject}</h1>
          <time>{watchData.created}</time>
        </header>
        <YouTubeController videoId={watchData.video_id} />
        <div className={styles.description}>
          <p dangerouslySetInnerHTML={{ __html: watchData.summary }} />
          <p>{watchData.blockquote}</p>
        </div>
      </article>
    </main>
  );
};

export default watchDetail;

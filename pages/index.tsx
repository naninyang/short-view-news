import { useEffect, useState } from 'react';
import axios from 'axios';
import { isIOS } from 'react-device-detect';
import Seo from '@/components/Seo';
import styled from '@emotion/styled';
import { rem } from '@/styles/designSystem';
import styles from '@/styles/pages.module.sass';
import content from '@/styles/content.module.sass';
import main from '@/styles/main.module.sass';
import { images } from '@/images';

interface Counts {
  youtube: number;
  naver: number;
}

type DataResponse = {
  description: string;
};

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(25),
  '& div[data-youtube] h2 i': {
    'body &, body[data-theme="dark"] &': {
      background: `url(${images.tab.youtube.light}) no-repeat 50% 50%/contain`,
    },
    'body[data-theme="light"] &': {
      background: `url(${images.tab.youtube.dark}) no-repeat 50% 50%/contain`,
    },
  },
  '& div[data-naver] h2 i': {
    'body &, body[data-theme="dark"] &': {
      background: `url(${images.tab.naver.light}) no-repeat 50% 50%/contain`,
    },
    'body[data-theme="light"] &': {
      background: `url(${images.tab.naver.dark}) no-repeat 50% 50%/contain`,
    },
  },
});

export default function Home() {
  const [data, setData] = useState<DataResponse | null>(null);
  const title = 'Home';

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`/api/pages?title=${title}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching page info:', error);
      }
    }

    fetchData();
  }, [title]);

  useEffect(() => {
    localStorage.removeItem('currentPage');
  }, []);

  const [count, setCount] = useState<Counts | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get<Counts>(`${process.env.NEXT_PUBLIC_API_URL}/api/contentTotalCount`);
        setCount(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const renderCountInfo = () => {
    if (loading || error || !count) return <div>..</div>;
    return (
      <dl>
        <div>
          <dt>가져온 YouTube 뉴스</dt>
          <dd>{count.youtube} 건</dd>
        </div>
        <div>
          <dt>가져온 NAVER 뉴스</dt>
          <dd>{count.naver} 건</dd>
        </div>
      </dl>
    );
  };

  const timestamp = Date.now();

  return (
    <main className={`${content.content} ${styles.pages} ${styles.home} ${main.main}`}>
      <Seo
        pageTitle="숏뷰 뉴스 {short.view: news}"
        pageDescription="당신이 놓친 뉴스를 짧게 요약해 드려요"
        pageImg={`https://news.dev1stud.io/og-image.png?ts=${timestamp}`}
      />
      <div className={`${styles['pages-content']} ${main['main-content']}`}>
        <h1>
          <span>{`숏뷰 뉴스 {short.view: news}`}</span>
        </h1>
        {data && <Container className={main.description} dangerouslySetInnerHTML={{ __html: data.description }} />}
        {renderCountInfo()}
        {/* {isIOS && <div className={styles.iOS}>아이폰과 아이패드에서 앱 내려받는 방법</div>} */}
      </div>
    </main>
  );
}

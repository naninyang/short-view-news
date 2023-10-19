import { useEffect, useState } from 'react';
import axios from 'axios';
import { isIOS } from 'react-device-detect';
import Seo from '@/components/Seo';
import { images } from '@/images';
import styled from '@emotion/styled';
import styles from '@/styles/pages.module.sass';
import content from '@/styles/content.module.sass';
import main from '@/styles/main.module.sass';

const Container = styled.div({
  '& div[data-primary]::before': {
    background: `url(${images.home.primary}) no-repeat 50% 50%/contain`,
  },
  '& div[data-secondary]::before': {
    background: `url(${images.home.secondary}) no-repeat 50% 50%/contain`,
  },
});

type DataResponse = {
  description: string;
};

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

  const timestamp = Date.now();

  return (
    <main className={`${content.content} ${styles.pages} ${styles.home} ${main.main}`}>
      <Seo
        pageTitle="숏뷰 뉴스 {short.view: news}"
        pageDescription="당신이 놓친 뉴스를 짧게 요약해 드려요"
        pageImg={`https://news.dev1stud.io/og-image.png?ts=${timestamp}`}
      />
      {data && (
        <Container className={`${styles['pages-content']} ${main['main-content']}`}>
          <h1>
            <span>{`숏뷰 뉴스 {short.view: news}`}</span>
          </h1>
          <div className={main.description} dangerouslySetInnerHTML={{ __html: data.description }} />
          {/* {isIOS && <div className={styles.iOS}>아이폰과 아이패드에서 앱 내려받는 방법</div>} */}
        </Container>
      )}
    </main>
  );
}

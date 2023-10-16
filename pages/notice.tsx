import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';
import Seo from '@/components/Seo';
import AnchorLink from '@/components/AnchorLink';
import { images } from '@/images';
import content from '@/styles/content.module.sass';
import styles from '@/styles/pages.module.sass';

type DataResponse = {
  description: string;
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

export default function Notice() {
  const [data, setData] = useState<DataResponse | null>(null);
  const title = 'Notice';

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

  const [currentPage, setCurrentPage] = useState<string | null>(null);

  useEffect(() => {
    const storedPage = localStorage.getItem('currentPage');
    setCurrentPage(storedPage);
  }, []);

  const timestamp = Date.now();

  return (
    <main className={`${content.content} ${styles.pages} ${styles.notice}`}>
      <Seo
        pageTitle="안내사항"
        pageDescription="당신이 놓친 뉴스를 짧게 요약해 드려요"
        pageImg={`https://news.dev1stud.io/og-image.png?ts=${timestamp}`}
      />
      <div className={`top-link ${styles['top-link']}`}>
        {currentPage ? (
          <AnchorLink href={`/${currentPage}`}>
            <BackButton />
            <span>뒤로가기</span>
          </AnchorLink>
        ) : (
          <AnchorLink href="/">
            <BackButton />
            <span>뒤로가기</span>
          </AnchorLink>
        )}
      </div>
      {data && (
        <div className={styles['pages-content']}>
          <h1>
            <span>안내사항 Notice.</span>
          </h1>
          <div dangerouslySetInnerHTML={{ __html: data.description }} />
        </div>
      )}
    </main>
  );
}

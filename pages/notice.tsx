import styled from '@emotion/styled';
import Seo from '@/components/Seo';
import { images } from '@/images';
import { hex, rem } from '@/styles/designSystem';
import styles from '@/styles/home.module.sass';
import Services from '@/components/Services';
import { useEffect, useState } from 'react';
import axios from 'axios';

type DataResponse = {
  description: string;
};

export default function Home() {
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

  const timestamp = Date.now();

  return (
    <main className={styles.main}>
      <Seo
        pageTitle="안내사항"
        pageDescription="당신이 놓친 뉴스를 짧게 요약해 드려요"
        pageImg={`https://news.dev1stud.io/og-image.png?ts=${timestamp}`}
      />
      {data && <div className={styles['main-content']} dangerouslySetInnerHTML={{ __html: data.description }} />}
      <Services />
    </main>
  );
}

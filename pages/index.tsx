import { useEffect, useState } from 'react';
import axios from 'axios';
import Seo from '@/components/Seo';
import styles from '@/styles/pages.module.sass';
import Services from '@/components/Services';

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
    localStorage.setItem('currentPage', title);
  }, []);

  const timestamp = Date.now();

  return (
    <main className={`${styles.pages} ${styles.home}`}>
      <Seo
        pageTitle="숏뷰 뉴스 {short.view: news}"
        pageDescription="당신이 놓친 뉴스를 짧게 요약해 드려요"
        pageImg={`https://news.dev1stud.io/og-image.png?ts=${timestamp}`}
      />
      {data && (
        <div className={styles['pages-content']}>
          <h1>
            <span>{`숏뷰 뉴스 {short.view: news}`}</span>
          </h1>
          <div dangerouslySetInnerHTML={{ __html: data.description }} />
        </div>
      )}
      <Services />
    </main>
  );
}

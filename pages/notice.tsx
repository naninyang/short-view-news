import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';
import Seo from '@/components/Seo';
import AnchorLink from '@/components/AnchorLink';
import { images } from '@/components/images';
import content from '@/styles/content.module.sass';
import styles from '@/styles/pages.module.sass';

type DataResponse = {
  description: string;
};

const BackButton = styled.i({
  display: 'block',
  'body[data-theme="dark"] &': {
    background: `url(${images.arrow.backLight}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
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
      <div className="top-link">
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
          <div>
            <p>이 서비스는 Vercel, Netlify, Google, Twitter(X) 그리고 NAVER와 관련이 없습니다.</p>
            <p>
              <span>큐레이터 생각이 들어간 부분은 언론사의 의견 또는 입장과 많이 다를 수 있으며,</span> 큐레이터 본인의
              생각은 큐레이터 개인의 사견입니다.
            </p>
            <hr />
            <p>뉴스 콘텐츠에 대한 저작권은 각 언론사에 있습니다.</p>
            <p>트윗에 대한 저작권은 각 트위터 유저에게 있습니다.</p>
            <hr />
            <p>본 서비스는 더 이상 업데이트 되지 않습니다.</p>
            <p>
              <span>{`숏뷰 뉴스{short.view: news}는`}</span> 숏뷰뉴스 short.view.new 이름으로 시즌2를 시작합니다.{' '}
              <span>
                <AnchorLink href="https://shorts.dev1stud.io">여기</AnchorLink>로 오세요.
              </span>
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

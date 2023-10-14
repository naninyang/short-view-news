import styled from '@emotion/styled';
import Seo from '@/components/Seo';
import { images } from '@/images';
import { hex, rem } from '@/styles/designSystem';
import styles from '@/styles/home.module.sass';
import Services from '@/components/Services';

export default function Home() {
  const timestamp = Date.now();

  return (
    <main className={styles.main}>
      <Seo
        pageTitle="숏뷰 뉴스 {short.view: news}"
        pageDescription="당신이 놓친 뉴스를 짧게 요약해 드려요"
        pageImg={`https://news.dev1stud.io/og-image.png?ts=${timestamp}`}
      />
      <div className={styles['main-content']}>
        <p>YouTube 및 NAVER 뉴스에 업로드 된 뉴스를 요약하고 큐레이터 본인의 생각을 짧게 보여주는 서비스입니다.</p>
        <p>YouTube는 5분 미만의 짧은 뉴스를 가져오며, 아주 가끔 그 이상의 뉴스도 가져옵니다.</p>
      </div>
      <Services />
    </main>
  );
}

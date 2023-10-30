import { useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import axios from 'axios';
import AnchorLink from '@/components/AnchorLink';
import Seo from '@/components/Seo';
import { images } from '@/images';
import { Article } from '@/types';
import styled from '@emotion/styled';
import styles from '@/styles/article.module.sass';

const BackButton = styled.i({
  display: 'block',
  'body[data-theme="dark"] &': {
    background: `url(${images.arrow.backLight}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${images.arrow.backDark}) no-repeat 50% 50%/contain`,
  },
});

export default function ArticleDetail({ article }: { article: Article | null }) {
  const router = useRouter();
  let savedScrollPosition;

  const handleBackClick = () => {
    const savedScrollPosition = sessionStorage.getItem('scrollPosition_' + router.asPath);
    if (savedScrollPosition) {
      router.back();
    }
  };

  return (
    <main className={styles.article}>
      <div className="top-link">
        {savedScrollPosition ? (
          <button onClick={handleBackClick}>뒤로가기</button>
        ) : (
          <AnchorLink href="/articles">
            <BackButton />
            <span>뒤로가기</span>
          </AnchorLink>
        )}
      </div>
      <article>
        <Seo
          pageTitle={`${article?.title}`}
          pageDescription={`${article?.description}`}
          pageImg={`https://drive.google.com/uc?id=${article?.thumbnail}`}
          pageOgType="article"
        />
        <header>
          <h1>{article?.title}</h1>
        </header>
        {article ? (
          <>
            <div className={styles.description}>
              <p>{`${article?.description}`}</p>
              <Image
                src={`https://drive.google.com/uc?id=${article?.thumbnail}`}
                width={640}
                height={480}
                unoptimized
                priority
                alt=""
              />
            </div>
            {article.newsMetaData ? (
              <AnchorLink href={`https://n.news.naver.com/article/${article.oid}/${article.aid}`}>
                <div className={styles['og-container']}>
                  <img src={article.newsMetaData?.ogImage} alt="" />
                  <div className={styles['og-info']}>
                    <div className={styles.created}>
                      <cite>{article.newsMetaData?.ogCreator}</cite>
                      {/* <time dateTime={article.newsMetaData?.datestampTimeAttribute}>
                      {article.newsMetaData?.datestampTimeContent}
                    </time> */}
                    </div>
                    <div className={styles.summary}>
                      <strong>{article.newsMetaData?.ogTitle}</strong>
                      <div className={styles.description}>
                        {article.newsMetaData?.ogDescription}
                        ...
                      </div>
                    </div>
                  </div>
                </div>
              </AnchorLink>
            ) : (
              <AnchorLink href={`https://n.news.naver.com/article/${article.oid}/${article.aid}`}>
                <div className={styles['og-container']}>
                  <img src={article.entertainmentMetaData?.ogImage} alt="" />
                  <div className={styles['og-info']}>
                    <div className={styles.created}>
                      <cite>{article.entertainmentMetaData?.ogCreator}</cite>
                      {/* <time dateTime={article.entertainmentMetaData?.datestampTimeAttribute}>
                      {article.entertainmentMetaData?.datestampTimeContent}
                    </time> */}
                    </div>
                    <div className={styles.summary}>
                      <strong>{article.entertainmentMetaData?.ogTitle}</strong>
                      <div className={styles.description}>
                        {article.entertainmentMetaData?.ogDescription}
                        ...
                      </div>
                    </div>
                  </div>
                </div>
              </AnchorLink>
            )}
          </>
        ) : (
          <p className={styles.loading}>본문 불러오는 중</p>
        )}
      </article>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const articleId = context.params?.articleId;
  let articleData = null;

  if (articleId) {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/articleItem?idx=${articleId}`);
    articleData = response.data;
  }

  return {
    props: {
      article: articleData,
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

import React, { useEffect, useState } from 'react';
import { mutate } from 'swr';
import useSWRInfinite from 'swr/infinite';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Modal from 'react-modal';
import axios from 'axios';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { Article } from '@/types';
import { modalContainer } from '@/components/ModalStyling';
import Services from '@/components/Services';
import Seo from '@/components/Seo';
import ArticleDetail from '@/components/Article';
import styles from '@/styles/articles.module.sass';
import AnchorLink from '@/components/AnchorLink';

export const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const getKey = (pageIndex: number, previousPageData: any) => {
  if (previousPageData && !previousPageData.length) return null;
  return `${process.env.NEXT_PUBLIC_API_URL}/api/articles?start=${pageIndex * 20}&count=20`;
};

function Articles() {
  const router = useRouter();

  const { data, error, size, setSize } = useSWRInfinite(getKey, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 7000,
  });

  const [target, setTarget] = useState<HTMLElement | null | undefined>(null);
  const articleId = Array.isArray(router.query.articleId) ? router.query.articleId[0] : router.query.articleId;

  const articles = data ? [].concat(...data) : [];
  const isLoading = !data && !error;
  const isReachingEnd = data && data[data.length - 1]?.length < 20;

  const onIntersect: IntersectionObserverCallback = ([entry]) => {
    if (entry.isIntersecting && !isReachingEnd && !isLoading && (size === 0 || size === 1)) {
      setSize((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (!target) return;
    const observer = new IntersectionObserver(onIntersect);
    observer.observe(target);
    return () => observer && observer.disconnect();
  }, [target]);

  useEffect(() => {
    if (!target || isLoading) return;
  }, [target, isLoading]);

  const selectedArticle = Array.isArray(articles)
    ? articles.find((article: any) => article.idx === articleId)
    : undefined;

  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    if (articleId !== undefined) {
      window.addEventListener('wheel', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });
    } else {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    }

    return () => {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    };
  }, [articleId]);

  const handleRefresh = async () => {
    try {
      const count = 20;
      const response = await axios.get(`/api/articles?start=0&count=${count}`);
      const newArticles = response.data;

      mutate((currentArticles: any) => {
        if (!Array.isArray(currentArticles)) {
          return newArticles;
        }
        const updatedArticles = newArticles.filter(
          (newSheet: any) => !currentArticles.some((article: any) => article.idx === newSheet.idx),
        );
        return [...updatedArticles, ...currentArticles];
      }, false);
    } catch (error) {
      console.error('Failed to refresh:', error);
    }
  };

  const timestamp = Date.now();

  return (
    <main className={styles.articles}>
      <Seo
        pageTitle="네이버 쇼츠 뉴스"
        pageDescription="당신이 놓친 뉴스를 짧게 요약해 드려요"
        pageImg={`https://news.dev1stud.io/og-image.png?ts=${timestamp}`}
      />
      <Modal
        isOpen={!!articleId}
        onRequestClose={() => router.push('/articles', undefined, { scroll: false })}
        contentLabel="Article Modal"
        style={modalContainer}
      >
        <ArticleDetail articleItem={selectedArticle} />
      </Modal>
      <Services />
      {isLoading && (
        <div className={styles.loading}>
          <p>기사를 가져오는 중입니다.</p>
        </div>
      )}
      {error && (
        <div className={styles.error}>
          <p>데이터를 불러오는데 실패했습니다. 네트워크가 느리거나 삭제된 기사입니다.</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      )}
      {!isLoading && !error && (
        <div className={styles['article-content']}>
          <PullToRefresh onRefresh={handleRefresh}>
            <div className={styles['article-list']}>
              {articles.map((article: Article, index: number) => (
                <article key={article.idx} data-index={index}>
                  <div className={styles.description}>
                    <Link
                      key={article.idx}
                      href={`/articles?articleId=${article.idx}`}
                      as={`/article/${article.idx}`}
                      scroll={false}
                      shallow={true}
                    >
                      <p className={styles.comment} dangerouslySetInnerHTML={{ __html: article.description }} />
                    </Link>
                    <Image
                      src={`https://drive.google.com/uc?id=${article.thumbnail}`}
                      width={640}
                      height={480}
                      unoptimized
                      priority
                      alt=""
                    />
                  </div>
                  <div className={styles.opengraph}>
                    <AnchorLink href={`https://n.news.naver.com/article/${article.oid}/${article.aid}`}>
                      <div className={styles['og-container']}>
                        <img src={article.metaData?.ogImage} alt="" />
                        <div className={styles['og-info']}>
                          <div className={styles.created}>
                            <cite>{article.metaData?.ogCreator}</cite>
                            <time dateTime={article.metaData?.datestampTimeAttribute}>
                              {article.metaData?.datestampTimeContent}
                            </time>
                          </div>
                          <div className={styles.summary}>
                            <strong>{article.metaData?.ogTitle}</strong>
                            <div className={styles.description}>
                              {article.metaData?.ogDescription}
                              ...
                            </div>
                          </div>
                        </div>
                      </div>
                    </AnchorLink>
                  </div>
                </article>
              ))}
            </div>
          </PullToRefresh>
          {isReachingEnd !== undefined && (
            <div ref={setTarget} className={styles.ref}>
              {isReachingEnd === false && <p>기사를 불러오는 중입니다.</p>}
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default Articles;

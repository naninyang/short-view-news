import React, { useEffect, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Modal from 'react-modal';
import axios, { AxiosError } from 'axios';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { Article } from '@/types';
import { modalContainer } from '@/components/ModalStyling';
import ArticleDetail from '@/components/Article';
import AnchorLink from '@/components/AnchorLink';
import styles from '@/styles/articles.module.sass';

Modal.setAppElement('#__next');

function ArticlesEntertainment() {
  const router = useRouter();

  const [waitingFor504, setWaitingFor504] = useState(false);

  const fetcher = async (url: string) => {
    try {
      const response = await axios.get(url);
      setWaitingFor504(false);
      return response.data;
    } catch (error) {
      if ((error as AxiosError).response?.status === 504) {
        setWaitingFor504(true);
      }
      throw error;
    }
  };

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/api/articlesEntertainment?start=${pageIndex * 20}&count=20`;
  };

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

  useEffect(() => {
    localStorage.removeItem('currentPage');
    localStorage.setItem('currentPage', 'articles');
  }, []);

  const handleRefresh = async () => {
    window.location.reload();
  };

  const timestamp = Date.now();

  return (
    <>
      <Modal
        isOpen={!!articleId}
        onRequestClose={() => router.push('/articles', undefined, { scroll: false })}
        contentLabel="Article Modal"
        style={modalContainer}
      >
        <ArticleDetail articleItem={selectedArticle} />
      </Modal>
      {isLoading && (
        <div className={styles.loading}>
          <p>기사를 가져오는 중입니다.</p>
        </div>
      )}
      {waitingFor504 && (
        <div className={styles.error}>
          <p>
            임시로 데이터를 불러 올 수 없는 상태입니다.
            <br />
            <button onClick={() => window.location.reload()}>다시 시도</button> 해 주세요 ㅠㅠ
            <br />
            (두어번 누르고 기다리시면 자동으로 불러옵니다.)
          </p>
        </div>
      )}
      {error && (
        <div className={styles.error}>
          <p>데이터를 불러오는데 실패했습니다.</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      )}
      {!isLoading && !error && (
        <div className={styles['article-content']}>
          <PullToRefresh onRefresh={handleRefresh}>
            <div className={styles['article-list']}>
              {articles.map((article: Article) => (
                <article key={article.idx}>
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
                    <AnchorLink href={`https://entertain.naver.com/read?oid=${article.oid}&aid=${article.aid}`}>
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
    </>
  );
}

export default ArticlesEntertainment;

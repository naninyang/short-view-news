import React, { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Modal from 'react-modal';
import { throttle } from 'lodash';
import axios from 'axios';
import { Article } from '@/types';
import { modalContainer } from '@/components/ModalStyling';
import Services from '@/components/Services';
import Seo from '@/components/Seo';
import ArticleDetail from '@/components/Article';
import styles from '@/styles/articles.module.sass';
import PullToRefresh from 'react-simple-pull-to-refresh';
import AnchorLink from '@/components/AnchorLink';

interface Metadata {
  ogTitle: string;
  ogUrl: string;
  ogImage: string;
  ogDescription: string;
  ogCreator: string;
  datestampTimeContent: any;
  datestampTimeAttribute: any;
}

Modal.setAppElement('#__next');

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function Articles() {
  const router = useRouter();
  const [loadedItems, setLoadedItems] = useState(0);

  const {
    data: articles = [],
    error,
    mutate,
  } = useSWR(`/api/articles?start=0&count=20`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  });

  const isLoading = !articles && !error;
  const [hasMore, setHasMore] = useState(true);

  const [metadata, setMetadata] = useState<Record<string, Metadata>>({});
  const articleId = Array.isArray(router.query.articleId) ? router.query.articleId[0] : router.query.articleId;
  const selectedArticle = Array.isArray(articles)
    ? articles.find((article: any) => article.idx === articleId)
    : undefined;

  useEffect(() => {
    if (articles) {
      articles.forEach((article: Article) => {
        fetchArticleMetadata(encodeURIComponent(`https://n.news.naver.com/article/${article.oid}/${article.aid}`));
      });
    }
  }, [articles]);

  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const handleScroll = throttle(() => {
      console.log('Scrolling...');
      const isBottom = window.innerHeight + window.scrollY + 2000 >= document.body.offsetHeight;
      console.log('Is near bottom:', isBottom);
      if (!isFetching && isBottom && !isLoading && hasMore) {
        setIsFetching(true);
        setLoadedItems((prev) => prev + 20);
        loadArticles(loadedItems + 20, 20); // 이 부분을 추가했습니다.
      }
    }, 200);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoading, hasMore, isFetching, loadedItems]);

  useEffect(() => {
    if (loadedItems > 0 && !isFetching) {
      loadArticles(loadedItems, 20);
    }
  }, [loadedItems]);

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

  const fetchArticleMetadata = async (url: string) => {
    try {
      const { data } = await axios.get<Metadata>(`/api/naverScraping?url=${url}`);
      setMetadata((prevData) => ({ ...prevData, [url]: data }));
    } catch (err) {
      console.error('Failed to fetch article metadata', err);
    }
  };

  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const loadArticles = async (start: number, count: number) => {
    setIsFetchingMore(true);

    try {
      const response = await axios.get(`/api/articles?start=${start}&count=${count}`);
      const additionalArticles = response.data;

      mutate((currentArticles: any) => {
        if (!Array.isArray(currentArticles)) {
          currentArticles = [];
        }
        const uniqueArticles = additionalArticles.filter(
          (article: any) => !currentArticles.some((current: any) => current.idx === article.idx),
        );
        return [...currentArticles, ...uniqueArticles];
      }, false);

      console.log(additionalArticles);

      additionalArticles.forEach((article: Article) => {
        fetchArticleMetadata(encodeURIComponent(`https://n.news.naver.com/article/${article.oid}/${article.aid}`));
        console.log(fetchArticleMetadata);
        console.log('adsfasffafs');
      });

      if (additionalArticles.length < count) {
        setHasMore(false);
      }

      setLoadedItems(start + additionalArticles.length);
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const handleRefresh = async () => {
    try {
      const count = 20;
      const response = await axios.get(`/api/articles?start=0&count=${count}`);
      const newArticles = response.data;

      mutate((currentArticles: any) => {
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
                  {metadata && (
                    <AnchorLink href={`https://n.news.naver.com/article/${article.oid}/${article.aid}`}>
                      <div className={styles['og-container']}>
                        <img
                          src={
                            metadata[
                              encodeURIComponent(`https://n.news.naver.com/article/${article.oid}/${article.aid}`)
                            ]?.ogImage
                          }
                          alt=""
                        />
                        <div className={styles['og-info']}>
                          <div className={styles.created}>
                            <cite>
                              {
                                metadata[
                                  encodeURIComponent(`https://n.news.naver.com/article/${article.oid}/${article.aid}`)
                                ]?.ogCreator
                              }
                            </cite>
                            <time
                              dateTime={
                                metadata[
                                  encodeURIComponent(`https://n.news.naver.com/article/${article.oid}/${article.aid}`)
                                ]?.datestampTimeAttribute
                              }
                            >
                              {
                                metadata[
                                  encodeURIComponent(`https://n.news.naver.com/article/${article.oid}/${article.aid}`)
                                ]?.datestampTimeContent
                              }
                            </time>
                          </div>
                          <div className={styles.summary}>
                            <strong>
                              {
                                metadata[
                                  encodeURIComponent(`https://n.news.naver.com/article/${article.oid}/${article.aid}`)
                                ]?.ogTitle
                              }
                            </strong>
                            <div className={styles.description}>
                              {
                                metadata[
                                  encodeURIComponent(`https://n.news.naver.com/article/${article.oid}/${article.aid}`)
                                ]?.ogDescription
                              }
                              ...
                            </div>
                          </div>
                        </div>
                      </div>
                    </AnchorLink>
                  )}
                </div>
              </article>
            ))}
          </div>
        </PullToRefresh>
        {isFetchingMore && <div className={styles.loading}>기사를 불러오는 중입니다.</div>}
        {error && (
          <div className={styles.error}>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>다시 시도</button>
          </div>
        )}
      </div>
    </main>
  );
}

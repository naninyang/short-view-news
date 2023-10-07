import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Modal from 'react-modal';
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

export default function Articles() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<Record<string, Metadata>>({});
  const articleId = Array.isArray(router.query.articleId) ? router.query.articleId[0] : router.query.articleId;
  const selectedArticle = articles.find((article) => article.idx === articleId);

  const [start, setStart] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
        setStart((prevStart) => prevStart + 20);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data } = await axios.get<Article[]>(`/api/articles?start=${start}&count=20`);
        setArticles((prevArticles) => [...prevArticles, ...data]);

        data.forEach((article: Article) => {
          fetchArticleMetadata(encodeURIComponent(`https://n.news.naver.com/article/${article.oid}/${article.aid}`));
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('데이터를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchArticles();
  }, [start]);

  const handleRefresh = async () => {
    try {
      const start = articles.length;
      const count = 20;

      const response = await axios.get(`/api/articles?start=${start}&count=${count}`);
      if (response.data.length > 0) {
        setArticles((prevSheets) => [...prevSheets, ...response.data]);
      }
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
      </div>
      {loading && <div className={styles.loading}>기사를 불러오는 중입니다.</div>}
      {error && (
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      )}
    </main>
  );
}

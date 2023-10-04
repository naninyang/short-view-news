import { useState, useEffect, FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Modal from 'react-modal';
import axios from 'axios';
import { Article } from '@/types';
import styles from '@/styles/articles.module.sass';
import { useRouter } from 'next/router';
import { modalContainer } from '@/components/ModalStyling';
import ArticleDetail from '@/components/Article';
import Services from '@/components/Services';

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
        const { data } = await axios.post<Article[]>('/api/articles');
        setArticles(data);

        data.forEach((article: Article) => {
          fetchArticleMetadata(encodeURIComponent(`https://n.news.naver.com/article/${article.oid}/${article.aid}`));
        });
      } catch (err) {
        setError('Failed to fetch articles.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <main className={styles.articles}>
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
        <div className={styles['article-list']}>
          {articles.map((article: Article) => (
            <article key={article.idx}>
              <Link
                key={article.idx}
                href={`/articles/?articleId=${article.idx}`}
                as={`/article/${article.idx}`}
                scroll={false}
                shallow={true}
              >
                <div className={styles.description}>
                  <div className={styles.comment} dangerouslySetInnerHTML={{ __html: article.description }} />
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
                    <div className={styles['og-container']}>
                      <img
                        src={
                          metadata[encodeURIComponent(`https://n.news.naver.com/article/${article.oid}/${article.aid}`)]
                            ?.ogImage
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
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
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

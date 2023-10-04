import { useState, useEffect, FC } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Article } from '@/types';
import AnchorLink from './AnchorLink';
import { images } from '@/images';
import styled from '@emotion/styled';
import styles from '@/styles/articles.module.sass';

interface Metadata {
  ogTitle: string;
  ogUrl: string;
  ogImage: string;
  ogDescription: string;
  ogCreator: string;
  datestampTimeContent: any;
  datestampTimeAttribute: any;
}

interface articleProps {
  articleItem: Article | undefined;
}

const CrossButton = styled.i({
  display: 'block',
  'body &, body[data-theme="dark"] &': {
    background: `url(${images.arrow.crossLight}) no-repeat 50% 50%/contain`,
  },
  'body[data-theme="light"] &': {
    background: `url(${images.arrow.crossDark}) no-repeat 50% 50%/contain`,
  },
});

const articleDetail: React.FC<articleProps> = ({ articleItem }) => {
  const router = useRouter();
  const { articleId } = router.query;
  const [article, setArticle] = useState<Article | null>(null);
  const [metadata, setMetadata] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (articleId) {
      const fetchArticle = async () => {
        try {
          const { data } = await axios.get(`/api/articles?id=${articleId}`);
          setArticle(data);

          const metadataUrl = `https://n.news.naver.com/article/${data.oid}/${data.aid}`;
          const metadataResponse = await axios.get(`/api/naverScraping?url=${metadataUrl}`);
          setMetadata((prev: Record<string, Metadata>) => ({ ...prev, [metadataUrl]: metadataResponse.data }));
        } catch (err) {
          setError('Failed to fetch article details.');
        } finally {
          setLoading(false);
        }
      };

      fetchArticle();
    }
  }, [articleId]);

  const handleCloseModal = () => {
    router.push('/articles');
  };

  if (!articleItem)
    return (
      <main className={styles.article}>
        <p className={styles.loading}>기사 불러오는 중...</p>
      </main>
    );

  return (
    <main className={`${styles.article} ${styles['article-container']}`}>
      <article>
        {metadata && (
          <>
            <header>
              <button type="button" className="close-btn" onClick={handleCloseModal}>
                <CrossButton />
                <span>닫기</span>
              </button>
              <h1>
                {metadata &&
                  metadata[`https://n.news.naver.com/article/${articleItem?.oid}/${articleItem?.aid}`]?.ogTitle}
              </h1>
            </header>
            <PerfectScrollbar>
              <p className={styles.description}>{`${articleItem?.description}`}</p>
              <AnchorLink href={`https://n.news.naver.com/article/${articleItem?.oid}/${articleItem?.aid}`}>
                <img
                  src={metadata[`https://n.news.naver.com/article/${articleItem?.oid}/${articleItem?.aid}`]?.ogImage}
                  alt=""
                />
                <cite>
                  {metadata[`https://n.news.naver.com/article/${articleItem?.oid}/${articleItem?.aid}`]?.ogCreator}
                </cite>
                <time
                  dateTime={
                    metadata[`https://n.news.naver.com/article/${articleItem?.oid}/${articleItem?.aid}`]
                      ?.datestampTimeAttribute
                  }
                >
                  {
                    metadata[`https://n.news.naver.com/article/${articleItem?.oid}/${articleItem?.aid}`]
                      ?.datestampTimeContent
                  }
                </time>
                <strong>
                  {metadata &&
                    metadata[`https://n.news.naver.com/article/${articleItem?.oid}/${articleItem?.aid}`]?.ogTitle}
                </strong>
                <div>
                  {metadata[`https://n.news.naver.com/article/${articleItem?.oid}/${articleItem?.aid}`]?.ogDescription}
                </div>
              </AnchorLink>
            </PerfectScrollbar>
          </>
        )}
      </article>
    </main>
  );
};

export default articleDetail;

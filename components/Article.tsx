import { useState, useEffect, FC } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Article } from '@/types';
import AnchorLink from './AnchorLink';
import { images } from '@/images';
import styled from '@emotion/styled';
import styles from '@/styles/article.module.sass';

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
  const [metadata, setMetadata] = useState<any>({});

  useEffect(() => {
    if (articleId) {
      const fetchArticle = async () => {
        try {
          const { data } = await axios.get(`/api/articles?id=${articleId}`);
          const metadataUrl = `https://n.news.naver.com/article/${data.oid}/${data.aid}`;
          const metadataResponse = await axios.get(`/api/naverScraping?url=${metadataUrl}`);
          setMetadata((prev: Record<string, Metadata>) => ({ ...prev, [metadataUrl]: metadataResponse.data }));
        } catch (err) {
          console.log('Failed to fetch article details.');
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
    <div className={`${styles.article} ${styles['article-container']}`}>
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
            <PerfectScrollbar className={styles['scrollbar-container']}>
              <p className={styles.comment}>{`${articleItem?.description}`}</p>
              <AnchorLink href={`https://n.news.naver.com/article/${articleItem?.oid}/${articleItem?.aid}`}>
                <img
                  src={metadata[`https://n.news.naver.com/article/${articleItem?.oid}/${articleItem?.aid}`]?.ogImage}
                  alt=""
                />
                <div className={styles['og-info']}>
                  <div className={styles.created}>
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
                  </div>
                  <div className={styles.summary}>
                    <strong>
                      {metadata &&
                        metadata[`https://n.news.naver.com/article/${articleItem?.oid}/${articleItem?.aid}`]?.ogTitle}
                    </strong>
                    <p className={styles.summary}>
                      {
                        metadata[`https://n.news.naver.com/article/${articleItem?.oid}/${articleItem?.aid}`]
                          ?.ogDescription
                      }
                    </p>
                  </div>
                </div>
              </AnchorLink>
            </PerfectScrollbar>
          </>
        )}
      </article>
    </div>
  );
};

export default articleDetail;

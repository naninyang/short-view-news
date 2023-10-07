import { useState, useEffect, FC } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Article } from '@/types';
import AnchorLink from './AnchorLink';
import { images } from '@/images';
import styled from '@emotion/styled';
import styles from '@/styles/article.module.sass';
import Image from 'next/image';

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
  const [metadata, setMetadata] = useState<any>({});

  useEffect(() => {
    if (articleItem) {
      const fetchArticle = async () => {
        try {
          const metadataUrl = `https://n.news.naver.com/article/${articleItem.oid}/${articleItem.aid}`;
          const metadataResponse = await axios.get(`/api/naverScraping?url=${metadataUrl}`);
          setMetadata((prev: Record<string, Metadata>) => ({ ...prev, [metadataUrl]: metadataResponse.data }));
        } catch (err) {
          console.log('Failed to fetch article details.');
        }
      };

      fetchArticle();
    }
  }, [articleItem]);

  const handleCloseModal = () => {
    router.push('/articles');
  };

  return (
    <div className={`${styles.article} ${styles['article-container']}`}>
      <article>
        {articleItem ? (
          <>
            <header>
              <button type="button" className="close-btn" onClick={handleCloseModal}>
                <CrossButton />
                <span>닫기</span>
              </button>
              <h1>{articleItem?.subject}</h1>
            </header>
            <PerfectScrollbar className={styles['scrollbar-container']}>
              <div className={styles.description}>
                <p>{`${articleItem?.description}`}</p>
                <Image
                  src={`https://drive.google.com/uc?id=${articleItem?.thumbnail}`}
                  width={640}
                  height={480}
                  unoptimized
                  priority
                  alt=""
                />
              </div>
              {metadata && (
                <>
                  <AnchorLink href={`https://n.news.naver.com/article/${articleItem?.oid}/${articleItem?.aid}`}>
                    <img
                      src={
                        metadata[`https://n.news.naver.com/article/${articleItem?.oid}/${articleItem?.aid}`]?.ogImage
                      }
                      alt=""
                    />
                    <div className={styles['og-info']}>
                      <div className={styles.created}>
                        <cite>
                          {
                            metadata[`https://n.news.naver.com/article/${articleItem?.oid}/${articleItem?.aid}`]
                              ?.ogCreator
                          }
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
                            metadata[`https://n.news.naver.com/article/${articleItem?.oid}/${articleItem?.aid}`]
                              ?.ogTitle}
                        </strong>
                        <p className={styles.description}>
                          {
                            metadata[`https://n.news.naver.com/article/${articleItem?.oid}/${articleItem?.aid}`]
                              ?.ogDescription
                          }
                        </p>
                      </div>
                    </div>
                  </AnchorLink>
                </>
              )}
            </PerfectScrollbar>
          </>
        ) : (
          <header>
            <button type="button" className="close-btn" onClick={handleCloseModal}>
              <CrossButton />
              <span>닫기</span>
            </button>
            <h1>본문 불러오는 중</h1>
          </header>
        )}
      </article>
    </div>
  );
};

export default articleDetail;

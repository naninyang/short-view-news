import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import axios from 'axios';
import { Article } from '@/types';
import AnchorLink from '@/components/AnchorLink';
import { images } from '@/images';
import Seo from '@/components/Seo';
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

const BackButton = styled.i({
  display: 'block',
  'body &, body[data-theme="dark"] &': {
    background: `url(${images.arrow.backLight}) no-repeat 50% 50%/contain`,
  },
  'body[data-theme="light"] &': {
    background: `url(${images.arrow.backDark}) no-repeat 50% 50%/contain`,
  },
});

export default function ArticleDetail() {
  const router = useRouter();
  const { articleId } = router.query;

  const [article, setArticle] = useState<Article | null>(null);
  const [metadata, setMetadata] = useState<any>({});

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
          console.log('Failed to fetch article details.');
        }
      };

      fetchArticle();
    }
  }, [articleId]);

  if (!metadata)
    return (
      <main className={styles.article}>
        <p className={styles.loading}>기사 불러오는 중...</p>
      </main>
    );

  return (
    <main className={styles.article}>
      <div className={styles['top-link']}>
        <AnchorLink href="/articles">
          <BackButton />
          <span>뒤로가기</span>
        </AnchorLink>
      </div>
      <article>
        {metadata && (
          <>
            <Seo
              pageTitle={
                metadata && metadata[`https://n.news.naver.com/article/${article?.oid}/${article?.aid}`]?.ogTitle
              }
              pageDescription={
                metadata[`https://n.news.naver.com/article/${article?.oid}/${article?.aid}`]?.ogDescription
              }
              pageImg={metadata[`https://n.news.naver.com/article/${article?.oid}/${article?.aid}`]?.ogImage}
              pageOgType="article"
            />
            <header>
              <h1>
                {metadata && metadata[`https://n.news.naver.com/article/${article?.oid}/${article?.aid}`]?.ogTitle}
              </h1>
            </header>
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
            <AnchorLink href={`https://n.news.naver.com/article/${article?.oid}/${article?.aid}`}>
              <img src={metadata[`https://n.news.naver.com/article/${article?.oid}/${article?.aid}`]?.ogImage} alt="" />
              <div className={styles['og-info']}>
                <div className={styles.created}>
                  <cite>{metadata[`https://n.news.naver.com/article/${article?.oid}/${article?.aid}`]?.ogCreator}</cite>
                  <time
                    dateTime={
                      metadata[`https://n.news.naver.com/article/${article?.oid}/${article?.aid}`]
                        ?.datestampTimeAttribute
                    }
                  >
                    {metadata[`https://n.news.naver.com/article/${article?.oid}/${article?.aid}`]?.datestampTimeContent}
                  </time>
                </div>
                <div className={styles.summary}>
                  <strong>
                    {metadata && metadata[`https://n.news.naver.com/article/${article?.oid}/${article?.aid}`]?.ogTitle}
                  </strong>
                  <div className={styles.description}>
                    {metadata[`https://n.news.naver.com/article/${article?.oid}/${article?.aid}`]?.ogDescription}
                  </div>
                </div>
              </div>
            </AnchorLink>
          </>
        )}
      </article>
    </main>
  );
}

import { useState, useEffect, FC } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Article } from '@/types';
import AnchorLink from '@/components/AnchorLink';
import styled from '@emotion/styled';
import styles from '@/styles/articles.module.sass';
import { images } from '@/images';
import Seo from '@/components/Seo';
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

const BackButton = styled.i({
  display: 'block',
  'body &, body[data-theme="dark"] &': {
    background: `url(${images.arrow.backLight}) no-repeat 50% 50%/contain`,
  },
  'body[data-theme="light"] &': {
    background: `url(${images.arrow.backDark}) no-repeat 50% 50%/contain`,
  },
});

const ArticlePage: FC = () => {
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  console.log(router);

  return (
    <main className={styles.article}>
      <div className={styles['top-link']}>
        <AnchorLink href="/articles">
          <BackButton />
          <span>뒤로가기</span>
        </AnchorLink>
      </div>
      <article>
        <div className={styles.description}>
          <p className={styles.description}>{`${article?.description}`}</p>
          <Image
            src={`https://drive.google.com/uc?id=${article?.thumbnail}`}
            width={640}
            height={480}
            unoptimized
            priority
            alt=""
          />
        </div>
        {metadata && (
          <AnchorLink href={`https://n.news.naver.com/article/${article?.oid}/${article?.aid}`}>
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
            <img src={metadata[`https://n.news.naver.com/article/${article?.oid}/${article?.aid}`]?.ogImage} alt="" />
            <cite>{metadata[`https://n.news.naver.com/article/${article?.oid}/${article?.aid}`]?.ogCreator}</cite>
            <time
              dateTime={
                metadata[`https://n.news.naver.com/article/${article?.oid}/${article?.aid}`]?.datestampTimeAttribute
              }
            >
              {metadata[`https://n.news.naver.com/article/${article?.oid}/${article?.aid}`]?.datestampTimeContent}
            </time>
            <strong>
              {metadata && metadata[`https://n.news.naver.com/article/${article?.oid}/${article?.aid}`]?.ogTitle}
            </strong>
            <div>{metadata[`https://n.news.naver.com/article/${article?.oid}/${article?.aid}`]?.ogDescription}</div>
          </AnchorLink>
        )}
      </article>
    </main>
  );
};

export default ArticlePage;

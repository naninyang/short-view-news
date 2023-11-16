import { useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import axios from 'axios';
import { format, formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import Image from 'next/image';
import AnchorLink from '@/components/AnchorLink';
import Seo from '@/components/Seo';
import { images } from '@/components/images';
import { Article } from 'types';
import styled from '@emotion/styled';
import styles from '@/styles/article.module.sass';

type DataResponse = {
  collection: string;
  created: string;
  idx: string;
  username: string;
  comment: string;
};

const BackButton = styled.i({
  display: 'block',
  'body[data-theme="dark"] &': {
    background: `url(${images.arrow.backLight}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${images.arrow.backDark}) no-repeat 50% 50%/contain`,
  },
});

export function foramtDate(date: string) {
  const d = new Date(date);
  const now = Date.now();
  const diff = (now - d.getTime()) / 1000;
  if (diff < 60 * 1) {
    return '방금 전';
  }
  if (diff < 60 * 60 * 24 * 3) {
    return formatDistanceToNow(d, { addSuffix: true, locale: ko });
  }
  return format(d, 'PPP EEE p', { locale: ko });
}

export default function ArticleDetail({ article }: { article: Article | null }) {
  const router = useRouter();
  let savedScrollPosition;

  const handleBackClick = () => {
    const savedScrollPosition = sessionStorage.getItem('scrollPosition_' + router.asPath);
    if (savedScrollPosition) {
      router.back();
    }
  };

  const [formData, setFormData] = useState({
    collection: `naver-${article?.type}-${process.env.NODE_ENV}`,
    permalink: `${process.env.NEXT_PUBLIC_API_URL}/article/${article?.idx}`,
    idx: article?.idx,
    created: new Date().toISOString(),
    username: '',
    comment: '',
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post(`/api/comments`, formData);
      if (response.status === 200) {
        await fetchNaverData();
      }
    } catch (error) {
      await fetchNaverData();
    }
  };

  const [naverData, setNaverData] = useState<DataResponse[]>([]);
  const fetchNaverData = async () => {
    try {
      const response = await axios.get(
        `/api/comments?collection=naver-${article?.type}-${process.env.NODE_ENV}&idx=${article?.idx}`,
      );
      setNaverData(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (error) {
      console.error('Error fetching page info:', error);
    }
  };

  useEffect(() => {
    fetchNaverData();
  }, []);

  return (
    <main className={styles.article}>
      <div className="top-link">
        {savedScrollPosition ? (
          <button onClick={handleBackClick}>
            <BackButton />
            <span>뒤로가기</span>
          </button>
        ) : (
          <AnchorLink href="/articles">
            <BackButton />
            <span>뒤로가기</span>
          </AnchorLink>
        )}
      </div>
      <article>
        <Seo
          pageTitle={`${article?.title}`}
          pageDescription={`${article?.description}`}
          pageImg={`https://cat-svn.netlify.app/img/${article?.thumbnail}${
            article?.thumbnail?.endsWith('.gif') ? '' : '.webp'
          }`}
          pageOgType="article"
        />
        <header>
          <h1>{article?.title}</h1>
        </header>
        {article ? (
          <>
            <div className={styles.description}>
              <p>{`${article?.description}`}</p>
              <Image
                src={`https://cat-svn.netlify.app/img/${article?.thumbnail}${
                  article?.thumbnail?.endsWith('.gif') ? '' : '.webp'
                }`}
                width={640}
                height={480}
                unoptimized
                priority
                alt=""
              />
            </div>
            {article.newsMetaData ? (
              <AnchorLink href={`https://n.news.naver.com/article/${article.oid}/${article.aid}`}>
                <div className={styles['og-container']}>
                  <img src={article.newsMetaData?.ogImage} alt="" />
                  <div className={styles['og-info']}>
                    <div className={styles.created}>
                      <cite>{article.newsMetaData?.ogCreator}</cite>
                      {/* <time dateTime={article.newsMetaData?.datestampTimeAttribute}>
                      {article.newsMetaData?.datestampTimeContent}
                    </time> */}
                    </div>
                    <div className={styles.summary}>
                      <strong>{article.newsMetaData?.ogTitle}</strong>
                      <div className={styles.description}>
                        {article.newsMetaData?.ogDescription}
                        ...
                      </div>
                    </div>
                  </div>
                </div>
              </AnchorLink>
            ) : (
              <AnchorLink href={`https://n.news.naver.com/article/${article.oid}/${article.aid}`}>
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
            )}
          </>
        ) : (
          <p className={styles.loading}>본문 불러오는 중</p>
        )}
      </article>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>댓글 달기</legend>
          <input required type="hidden" value={formData.collection} />
          <input required type="hidden" value={formData.permalink} />
          <input required type="hidden" value={formData.created} />
          <input required type="hidden" value={formData.idx} />
          <div className={styles['field-group']}>
            <input
              required
              type="text"
              id="username"
              value={formData.username}
              placeholder="이름"
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
          <div className={styles['field-group']}>
            <textarea
              required
              id="comment"
              value={formData.comment}
              placeholder="댓글"
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            />
          </div>
          <button type="submit">
            <span>댓글달기</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M20.3573 2.00773C20.2188 1.99505 20.0787 1.99774 19.9374 2.01749C17.6498 2.33843 12.7349 3.04557 7.69914 8.99991H5.61711C5.27011 8.99991 4.93819 9.14249 4.69719 9.39249L2.39836 11.7851C2.02636 12.1571 1.91511 12.7121 2.11711 13.1991C2.31811 13.6861 2.78933 13.9999 3.31633 13.9999H5.77531C5.44403 14.3741 5.27001 14.7721 5.08391 15.2245C4.87785 15.7254 4.69633 16.2777 4.54094 16.8007C4.23016 17.8466 4.02336 18.7831 4.02336 18.7831C3.98683 18.9474 3.99234 19.1182 4.03937 19.2798C4.0864 19.4413 4.17344 19.5884 4.29243 19.7074C4.41142 19.8264 4.5585 19.9134 4.72007 19.9605C4.88164 20.0075 5.05246 20.013 5.21672 19.9765C5.21672 19.9765 6.15321 19.7697 7.19914 19.4589C7.72211 19.3035 8.27444 19.122 8.77531 18.9159C9.2277 18.7298 9.62572 18.5558 9.99992 18.2245V20.6835C9.99992 21.2105 10.3137 21.6827 10.8007 21.8827C10.9657 21.9517 11.1376 21.9823 11.3066 21.9823C11.6376 21.9823 11.9576 21.8597 12.1816 21.6347L14.582 19.4472C14.848 19.2052 14.9999 18.8628 14.9999 18.5038V16.3007C20.9518 11.2656 21.6606 6.35 21.9823 4.06241C22.0613 3.49441 21.8756 2.93616 21.4706 2.53116C21.1661 2.22666 20.7731 2.04574 20.3573 2.00773ZM16.4999 5.99991C17.3279 5.99991 17.9999 6.67191 17.9999 7.49991C17.9999 8.32791 17.3279 8.99991 16.4999 8.99991C15.6719 8.99991 14.9999 8.32791 14.9999 7.49991C14.9999 6.67191 15.6719 5.99991 16.4999 5.99991ZM12.4999 9.99991C13.3279 9.99991 13.9999 10.6719 13.9999 11.4999C13.9999 12.3279 13.3279 12.9999 12.4999 12.9999C11.6719 12.9999 10.9999 12.3279 10.9999 11.4999C10.9999 10.6719 11.6719 9.99991 12.4999 9.99991ZM7.64055 14.9452L9.05461 16.3593L8.70695 16.7069C8.72507 16.6888 8.41356 16.9018 8.01359 17.0663C7.61362 17.2309 7.11174 17.3974 6.62883 17.5409C6.50819 17.5768 6.51477 17.5687 6.39836 17.6015C6.43114 17.4851 6.42306 17.4916 6.45891 17.371C6.60239 16.8881 6.76897 16.3862 6.93351 15.9862C7.09806 15.5863 7.31101 15.2748 7.29289 15.2929L7.64055 14.9452Z"
                fill="black"
              />
            </svg>
          </button>
        </fieldset>
      </form>

      {naverData && (
        <div className={styles.comments}>
          <strong>댓글 {naverData.length}개</strong>
          {naverData.map((comment, index) => (
            <div key={index} className={styles.comment}>
              <div className={styles.user}>
                <cite>{comment.username}</cite>
                <time>{foramtDate(comment.created)}</time>
              </div>
              <div className={styles.desc}>
                {comment.comment.split('\n').map((line) => {
                  return <p>{line}</p>;
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const articleId = context.params?.articleId;
  let articleData = null;

  if (articleId) {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/articleItem?idx=${articleId}`);
    articleData = response.data;
  }

  return {
    props: {
      article: articleData,
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

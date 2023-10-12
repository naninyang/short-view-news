import { useRouter } from 'next/router';
import PerfectScrollbar from 'react-perfect-scrollbar';
import AnchorLink from './AnchorLink';
import { images } from '@/images';
import styled from '@emotion/styled';
import styles from '@/styles/article.module.sass';
import Image from 'next/image';
import 'react-perfect-scrollbar/dist/css/styles.css';

type ArticleData = {
  idx: string;
  description: string;
  thumbnail: string;
  title: string;
  oid: string;
  aid: string;
  metaData?: {
    ogTitle: string;
    ogUrl: string;
    ogImage: string;
    ogDescription: string;
    ogCreator: string;
    datestampTimeContent: any;
    datestampTimeAttribute: any;
  };
};

interface articleProps {
  articleItem: ArticleData | undefined;
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
              <h1>{articleItem?.title}</h1>
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
              <AnchorLink href={`https://n.news.naver.com/article/${articleItem.oid}/${articleItem.aid}`}>
                <div className={styles['og-container']}>
                  <img src={articleItem.metaData?.ogImage} alt="" />
                  <div className={styles['og-info']}>
                    <div className={styles.created}>
                      <cite>{articleItem.metaData?.ogCreator}</cite>
                      <time dateTime={articleItem.metaData?.datestampTimeAttribute}>
                        {articleItem.metaData?.datestampTimeContent}
                      </time>
                    </div>
                    <div className={styles.summary}>
                      <strong>{articleItem.metaData?.ogTitle}</strong>
                      <div className={styles.description}>
                        {articleItem.metaData?.ogDescription}
                        ...
                      </div>
                    </div>
                  </div>
                </div>
              </AnchorLink>
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

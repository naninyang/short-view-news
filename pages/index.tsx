import { useEffect, useState } from 'react';
import axios from 'axios';
import { isSafari } from 'react-device-detect';
import Seo from '@/components/Seo';
import styled from '@emotion/styled';
import { images } from '@/components/images';
import { rem } from '@/styles/designSystem';
import styles from '@/styles/pages.module.sass';
import content from '@/styles/content.module.sass';
import main from '@/styles/main.module.sass';
import AnchorLink from '@/components/AnchorLink';

interface Counts {
  youtube: number;
  naver: number;
  twitter: number;
}

type DataResponse = {
  description: string;
};

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(25),
  '& div[data-youtube] h2 i': {
    'body[data-theme="dark"] &': {
      background: `url(${images.tab.youtube.defaultLight}) no-repeat 50% 50%/contain`,
    },
    'body &, body[data-theme="light"] &': {
      background: `url(${images.tab.youtube.defaultDark}) no-repeat 50% 50%/contain`,
    },
  },
  '& div[data-naver] h2 i': {
    'body[data-theme="dark"] &': {
      background: `url(${images.tab.naver.defaultLight}) no-repeat 50% 50%/contain`,
    },
    'body &, body[data-theme="light"] &': {
      background: `url(${images.tab.naver.defaultDark}) no-repeat 50% 50%/contain`,
    },
  },
  '& div[data-twitter] h2 i': {
    'body[data-theme="dark"] &': {
      background: `url(${images.tab.twitter.defaultLight}) no-repeat 50% 50%/contain`,
    },
    'body &, body[data-theme="light"] &': {
      background: `url(${images.tab.twitter.defaultDark}) no-repeat 50% 50%/contain`,
    },
  },
});

const Apple = styled.article({
  '& i': {
    'body[data-theme="dark"] &': {
      background: `url(${images.misc.symbolLight}) no-repeat 50% 50%/contain`,
    },
    'body &, body[data-theme="light"] &': {
      background: `url(${images.misc.symbolDark}) no-repeat 50% 50%/contain`,
    },
  },
});

export default function Home() {
  const [data, setData] = useState<DataResponse | null>(null);
  const title = 'Home';

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`/api/pages?title=${title}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching page info:', error);
      }
    }

    fetchData();
  }, [title]);

  useEffect(() => {
    localStorage.removeItem('currentPage');
  }, []);

  const [count, setCount] = useState<Counts | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get<Counts>(`${process.env.NEXT_PUBLIC_API_URL}/api/contentTotalCount`);
        setCount(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  function formatNumber(value: number): string {
    return value.toLocaleString();
  }

  const renderCountInfo = () => {
    if (loading || error || !count) return <div>..</div>;
    return (
      <dl>
        <div>
          <dt>가져온 YouTube 뉴스</dt>
          <dd>{formatNumber(count.youtube)} 건</dd>
        </div>
        <div>
          <dt>가져온 NAVER 뉴스</dt>
          <dd>{formatNumber(count.naver)} 건</dd>
        </div>
        <div>
          <dt>가져온 Twitter 인용</dt>
          <dd>{formatNumber(count.twitter)} 건</dd>
        </div>
      </dl>
    );
  };

  const renderSafari = () => {
    if (isSafari) {
      return (
        <Apple className={main.apple}>
          <h2>애플 디바이스에서 앱 내려받기</h2>
          <p>아이폰, 아이패드, 맥에서 앱을 내려받을 수 있습니다.</p>
          <p>
            <span>
              아이폰, 아이패드에서는 사파리에서 <i />를 누르신 뒤,
            </span>{' '}
            <span>'홈 화면에 추가'를 누르시고</span>{' '}
            <span>맥의 사파리에서는 '파일' 메뉴 &gt; 'Dock에 추가'를 누르세요.</span>
          </p>
        </Apple>
      );
    }
    return null;
  };

  const timestamp = Date.now();

  return (
    <main className={`${content.content} ${styles.pages} ${styles.home} ${main.main}`}>
      <Seo
        pageTitle="숏뷰 뉴스 {short.view: news}"
        pageDescription="당신이 놓친 뉴스를 짧게 요약해 드려요"
        pageImg={`https://news.dev1stud.io/og-image.png?ts=${timestamp}`}
      />
      <div className={`${styles['pages-content']} ${main['main-content']}`}>
        <h1>
          <span>{`숏뷰 뉴스 {short.view: news}`}</span>
        </h1>
        {/* {data && <Container className={main.description} dangerouslySetInnerHTML={{ __html: data.description }} />} */}
        <Container className={main.description}>
          <div data-summary>
            <p>
              <span>YouTube와 NAVER 뉴스에서 기사를 스크랩하고</span>
              <span>기사에 짧은 코멘트를 달아서 보여주는 서비스,</span>
              <span>short view news 입니다.</span>
            </p>
          </div>
          <div data-youtube>
            <div>
              <h2>
                <i></i> <span>YouTube 뉴스</span>
              </h2>
              <p>
                <span>YouTube 영상 중, 언론사에서 올린 영상을 기준으로 가져오며</span>
                <span>Open Graph가 아닌 NEWS CURATORS가 직접</span>
                <span>제목과 내용을 영상에서 수동으로 가져 옵니다.</span>
              </p>
              <p>
                <span>과거에는 MBC, KBS, SBS, JTBC, YTN, EBS, OBS</span>
                <span>현재는 OBS를 제외하고 스크랩 합니다.</span>
                <span>2023년 11월 15일부터 KBS 제외하고 스크랩 합니다.</span>
              </p>
            </div>
          </div>
          <div data-naver>
            <div>
              <h2>
                <i></i> <span>NAVER 뉴스</span>
              </h2>
              <p>NAVER 뉴스는 Open Graph 기반의 데이터를 가져옵니다</p>
              <p>언론사에는 제약이 없습니다.</p>
              <p>소위 말하는 짤이 코멘트와 함께 첨부되어 서비스 됩니다.</p>
            </div>
          </div>
          <div data-twitter>
            <div>
              <h2>
                <i></i> <span>Twitter 인용</span>
              </h2>
              <p>Twitter 인용글은 큐레이터의 생각이 삽입되지 않습니다.</p>
              <p>주로 기사 트윗의 인용을 가져옵니다.</p>
              <p>
                <span>트윗에 달린 링크의 정보(오픈그래프)를 인식할 수 있을 때는</span>{' '}
                <span>링크의 정보를 가져와서 보여줍니다.</span>
              </p>
            </div>
          </div>
          <div data-fin>
            <div>
              <h2>업데이트 종료</h2>
              <p>본 서비스는 더 이상 업데이트 되지 않습니다.</p>
              <p>
                <span>{`숏뷰 뉴스{short.view: news}는`}</span> 숏뷰뉴스 short.view.new 이름으로 시즌2를 시작합니다.{' '}
                <span>
                  <AnchorLink href="https://shorts.dev1stud.io">여기</AnchorLink>로 오세요.
                </span>
              </p>
            </div>
          </div>
        </Container>
        {renderCountInfo()}
      </div>
    </main>
  );
}

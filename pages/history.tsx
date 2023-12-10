import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useMediaQuery } from 'react-responsive';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { YouTubeAPIResponse } from '@/utils/historyYouTube';
import { NaverAPIResponse } from '@/utils/historyNaver';
import Accordion from '@/components/Accordion';
import AccordionItem from '@/components/AccordionItem';
import YouTubeController from '@/components/YouTubeController';
import Opengraph from '@/components/Opengraph';
import Seo from '@/components/Seo';
import PageName from '@/components/PageName';
import styles from '@/styles/history.module.sass';
import tabs from '@/styles/tabs.module.sass';
import 'react-perfect-scrollbar/dist/css/styles.css';

export function useDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  const desktop = useMediaQuery({ query: '(min-width: 768px)' });
  useEffect(() => {
    setIsDesktop(desktop);
  }, [desktop]);
  return isDesktop;
}

export default function History() {
  const [youTubeData, setYouTubeData] = useState<YouTubeAPIResponse | null>(null);
  const [naverData, setNaverData] = useState<NaverAPIResponse | null>(null);

  useEffect(() => {
    async function fetchYouTubeData() {
      try {
        const response = await axios.get<YouTubeAPIResponse>('/api/historyYouTube');
        setYouTubeData(response.data);
      } catch (error) {
        console.error('Failed to fetch history from Notion', error);
      }
    }
    fetchYouTubeData();

    async function fetchNaverData() {
      try {
        const response = await axios.get<NaverAPIResponse>('/api/historyNaver');
        setNaverData(response.data);
      } catch (error) {
        console.error('Failed to fetch history from Notion', error);
      }
    }
    fetchNaverData();
  }, []);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return format(date, 'yyyy년 M월 d일', { locale: ko });
  }

  const isDesktop = useDesktop();
  const [activeArea, setActiveArea] = useState<number | null>(null);

  useEffect(() => {
    const currentTab = localStorage.getItem('currentHistory');

    if (currentTab === 'youTube') {
      setActiveArea(1);
    } else if (currentTab === 'naver') {
      setActiveArea(2);
    }

    localStorage.removeItem('currentPage');
    localStorage.setItem('currentPage', 'history');
  }, []);

  const handleTabChange = (tabNumber: number) => {
    setActiveArea(tabNumber);

    if (tabNumber === 1) {
      localStorage.setItem('currentHistory', 'youTube');
    } else if (tabNumber === 2) {
      localStorage.setItem('currentHistory', 'naver');
    } else {
      localStorage.removeItem('currentHistory');
    }
  };

  const handleRefresh = async () => {
    window.location.reload();
  };

  const timestamp = Date.now();

  return (
    <main className={styles.history}>
      <Seo
        pageTitle="사건/사고 히스토리"
        pageDescription="당신이 놓친 뉴스를 짧게 요약해 드려요"
        pageImg={`https://news.dev1stud.io/og-image.png?ts=${timestamp}`}
      />
      <div className={styles.refresh}>
        <PageName pageName="사건/사고 히스토리" />
        <button type="button" onClick={handleRefresh}>
          새로고침
        </button>
      </div>
      <div className={styles.container}>
        <div className={styles.list}>
          {!isDesktop && (
            <nav className={tabs.nav}>
              <ul>
                <li>
                  <button
                    type="button"
                    onClick={() => handleTabChange(1)}
                    className={`${activeArea === null || activeArea === 1 ? tabs.active : ''}`}
                  >
                    <span>YouTube 뉴스</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleTabChange(2)}
                    className={`${activeArea === 2 ? tabs.active : ''}`}
                  >
                    <span>NAVER 뉴스</span>
                  </button>
                </li>
              </ul>
            </nav>
          )}
          {(activeArea === null || activeArea === 1 || isDesktop) && (
            <PerfectScrollbar className={styles.articles}>
              {isDesktop && <h3>YouTube 기사</h3>}
              {youTubeData && (
                <Accordion>
                  {youTubeData.results
                    .sort(
                      (a: any, b: any) =>
                        new Date(b.properties.update).getTime() - new Date(a.properties.update).getTime(),
                    )
                    .map((item: any, index: number) => (
                      <AccordionItem header={item.properties.title} stat={item.properties.due} key={index}>
                        <figure>
                          <YouTubeController videoId={item.properties.video_id1} />
                          <figcaption>
                            <time>{formatDate(item.properties.datetime1)}</time>
                            <strong>{item.properties.subject1}</strong>
                            <p dangerouslySetInnerHTML={{ __html: item.properties.description1 }} />
                          </figcaption>
                        </figure>

                        {item.properties.video_id2 && (
                          <figure>
                            <YouTubeController videoId={item.properties.video_id2} />
                            <figcaption>
                              <time>{formatDate(item.properties.datetime2)}</time>
                              <strong>{item.properties.subject2}</strong>
                              <p dangerouslySetInnerHTML={{ __html: item.properties.description2 }} />
                            </figcaption>
                          </figure>
                        )}
                        {item.properties.video_id3 && (
                          <figure>
                            <YouTubeController videoId={item.properties.video_id3} />
                            <figcaption>
                              <time>{formatDate(item.properties.datetime3)}</time>
                              <strong>{item.properties.subject3}</strong>
                              <p dangerouslySetInnerHTML={{ __html: item.properties.description3 }} />
                            </figcaption>
                          </figure>
                        )}
                        {item.properties.video_id4 && (
                          <figure>
                            <YouTubeController videoId={item.properties.video_id4} />
                            <figcaption>
                              <time>{formatDate(item.properties.datetime4)}</time>
                              <strong>{item.properties.subject4}</strong>
                              <p dangerouslySetInnerHTML={{ __html: item.properties.description4 }} />
                            </figcaption>
                          </figure>
                        )}
                        {item.properties.video_id5 && (
                          <figure>
                            <YouTubeController videoId={item.properties.video_id5} />
                            <figcaption>
                              <time>{formatDate(item.properties.datetime5)}</time>
                              <strong>{item.properties.subject5}</strong>
                              <p dangerouslySetInnerHTML={{ __html: item.properties.description5 }} />
                            </figcaption>
                          </figure>
                        )}
                      </AccordionItem>
                    ))}
                </Accordion>
              )}
            </PerfectScrollbar>
          )}
          {(activeArea === 2 || isDesktop) && (
            <PerfectScrollbar className={styles.articles}>
              {isDesktop && <h3>NAVER 기사</h3>}
              {naverData && (
                <Accordion>
                  {naverData.results
                    .sort(
                      (a: any, b: any) =>
                        new Date(b.properties.update).getTime() - new Date(a.properties.update).getTime(),
                    )
                    .map((item: any, index: number) => (
                      <AccordionItem header={item.properties.title} stat={item.properties.due} key={index}>
                        <Opengraph
                          article_id={item.properties.article_id1}
                          datetime={formatDate(item.properties.datetime1)}
                        />
                        {item.properties.article_id2 && (
                          <Opengraph
                            article_id={item.properties.article_id2}
                            datetime={formatDate(item.properties.datetime2)}
                          />
                        )}
                        {item.properties.article_id3 && (
                          <Opengraph
                            article_id={item.properties.article_id3}
                            datetime={formatDate(item.properties.datetime3)}
                          />
                        )}
                        {item.properties.article_id4 && (
                          <Opengraph
                            article_id={item.properties.article_id4}
                            datetime={formatDate(item.properties.datetime4)}
                          />
                        )}
                        {item.properties.article_id5 && (
                          <Opengraph
                            article_id={item.properties.article_id5}
                            datetime={formatDate(item.properties.datetime5)}
                          />
                        )}
                        {item.properties.article_id6 && (
                          <Opengraph
                            article_id={item.properties.article_id6}
                            datetime={formatDate(item.properties.datetime6)}
                          />
                        )}
                        {item.properties.article_id7 && (
                          <Opengraph
                            article_id={item.properties.article_id7}
                            datetime={formatDate(item.properties.datetime7)}
                          />
                        )}
                        {item.properties.article_id8 && (
                          <Opengraph
                            article_id={item.properties.article_id8}
                            datetime={formatDate(item.properties.datetime8)}
                          />
                        )}
                        {item.properties.article_id9 && (
                          <Opengraph
                            article_id={item.properties.article_id9}
                            datetime={formatDate(item.properties.datetime9)}
                          />
                        )}
                        {item.properties.article_id10 && (
                          <Opengraph
                            article_id={item.properties.article_id10}
                            datetime={formatDate(item.properties.datetime10)}
                          />
                        )}
                        {item.properties.article_id11 && (
                          <Opengraph
                            article_id={item.properties.article_id11}
                            datetime={formatDate(item.properties.datetime11)}
                          />
                        )}
                        {item.properties.article_id12 && (
                          <Opengraph
                            article_id={item.properties.article_id12}
                            datetime={formatDate(item.properties.datetime12)}
                          />
                        )}
                        {item.properties.article_id13 && (
                          <Opengraph
                            article_id={item.properties.article_id13}
                            datetime={formatDate(item.properties.datetime13)}
                          />
                        )}
                        {item.properties.article_id14 && (
                          <Opengraph
                            article_id={item.properties.article_id14}
                            datetime={formatDate(item.properties.datetime14)}
                          />
                        )}
                        {item.properties.article_id15 && (
                          <Opengraph
                            article_id={item.properties.article_id15}
                            datetime={formatDate(item.properties.datetime15)}
                          />
                        )}
                        {item.properties.article_id16 && (
                          <Opengraph
                            article_id={item.properties.article_id16}
                            datetime={formatDate(item.properties.datetime16)}
                          />
                        )}
                        {item.properties.article_id17 && (
                          <Opengraph
                            article_id={item.properties.article_id17}
                            datetime={formatDate(item.properties.datetime17)}
                          />
                        )}
                        {item.properties.article_id18 && (
                          <Opengraph
                            article_id={item.properties.article_id18}
                            datetime={formatDate(item.properties.datetime18)}
                          />
                        )}
                        {item.properties.article_id19 && (
                          <Opengraph
                            article_id={item.properties.article_id19}
                            datetime={formatDate(item.properties.datetime19)}
                          />
                        )}
                        {item.properties.article_id120 && (
                          <Opengraph
                            article_id={item.properties.article_id120}
                            datetime={formatDate(item.properties.datetime120)}
                          />
                        )}
                      </AccordionItem>
                    ))}
                </Accordion>
              )}
            </PerfectScrollbar>
          )}
        </div>
      </div>
    </main>
  );
}

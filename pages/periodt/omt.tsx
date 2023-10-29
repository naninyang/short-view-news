import React, { useEffect, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import Image from 'next/image';
import Modal from 'react-modal';
import axios, { AxiosError } from 'axios';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { PeriodtOmt } from '@/types';
import AnchorLink from '@/components/AnchorLink';
import styled from '@emotion/styled';
import styles from '@/styles/periodts.module.sass';
import { images } from '@/images';
import { rem } from '@/styles/designSystem';

interface ContentComponentProps {
  text: string;
}

const LinkButton = styled.i({
  display: 'block',
  background: `url(${images.misc.outlink}) no-repeat 50% 50%/contain`,
});

const CrossButton = styled.i({
  display: 'block',
  'body[data-theme="dark"] &': {
    background: `url(${images.arrow.crossLight}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${images.arrow.crossDark}) no-repeat 50% 50%/contain`,
  },
});

Modal.setAppElement('#__next');

function PeriodtOmt() {
  const [waitingFor504, setWaitingFor504] = useState(false);

  const fetcher = async (url: string) => {
    try {
      const response = await axios.get(url);
      setWaitingFor504(false);
      return response.data;
    } catch (error) {
      if ((error as AxiosError).response?.status === 504) {
        setWaitingFor504(true);
      }
      throw error;
    }
  };

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/api/periodtOmt?start=${pageIndex * 20}&count=20`;
  };

  const { data, error, size, setSize } = useSWRInfinite(getKey, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 7000,
  });

  const [target, setTarget] = useState<HTMLElement | null | undefined>(null);

  const periodts = data ? [].concat(...data) : [];
  const isLoading = !data && !error;
  const isReachingEnd = data && data[data.length - 1]?.length < 20;

  const onIntersect: IntersectionObserverCallback = ([entry]) => {
    if (entry.isIntersecting && !isReachingEnd && !isLoading && (size === 0 || size === 1)) {
      setSize((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (!target) return;
    const observer = new IntersectionObserver(onIntersect);
    observer.observe(target);
    return () => observer && observer.disconnect();
  }, [target]);

  useEffect(() => {
    if (!target || isLoading) return;
  }, [target, isLoading]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    if (isModalOpen) {
      window.addEventListener('wheel', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });
    } else {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    }

    return () => {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    };
  }, [isModalOpen]);

  const handleRefresh = async () => {
    window.location.reload();
  };

  const ContentComponent: React.FC<ContentComponentProps> = ({ text }) => {
    const [renderedContent, setRenderedContent] = useState<React.ReactNode[]>([]);

    useEffect(() => {
      const fetchContentComponent = async () => {
        let tempContent = [];
        let ogContent = [];
        const parts = text.split(/(https?:\/\/[^\s]+|\n)/g);

        let currentTextGroup = [];
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          if (/https?:\/\/[^\s]+/.test(part)) {
            let ogData;
            try {
              const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/twt?url=${encodeURIComponent(part)}`,
              );
              ogData = response.data;
            } catch (error) {
              console.error('Failed to fetch OG data:', error);
            }

            currentTextGroup.push(
              <AnchorLink key={part} href={part}>
                {part}
              </AnchorLink>,
            );

            if (ogData && ogData.ogImage) {
              ogContent.push(
                <div className={styles['og-card']} key={`og-${part}`}>
                  <AnchorLink href={part}>
                    <Image
                      src={ogData.ogImage}
                      width={640}
                      height={480}
                      unoptimized
                      priority
                      alt=""
                      onClick={closeModal}
                    />
                    <div className={styles['og-info']}>
                      {ogData.ogCreator ? <cite>{ogData.ogCreator}</cite> : <cite>{ogData.ogSiteName}</cite>}
                      <strong>{ogData.ogTitle}</strong>
                      <p>{ogData.ogDescription}...</p>
                    </div>
                  </AnchorLink>
                </div>,
              );
            }
          } else if (part === '\n') {
            if (currentTextGroup.length) {
              tempContent.push(<p key={`text-${i}`}>{currentTextGroup}</p>);
              currentTextGroup = [];
            }
            tempContent.push(<br key={`br-${i}`} />);
          } else {
            currentTextGroup.push(part);
          }
        }

        if (currentTextGroup.length) {
          tempContent.push(<p key={`text-end`}>{currentTextGroup}</p>);
        }

        setRenderedContent([...tempContent, ...ogContent]);
      };

      fetchContentComponent();
    }, [text]);

    return <>{renderedContent}</>;
  };

  const [selectedThumbnail, setSelectedThumbnail] = useState(null);

  const handleThumbnailClick = (thumbnailUrl: any) => {
    setSelectedThumbnail(thumbnailUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedThumbnail(null);
    setIsModalOpen(false);
  };

  const modalContainer = {
    overlay: {
      zIndex: 1070,
      backgroundColor: `rgba(0, 0, 0, .7)`,
      backdropFilter: `saturate(180%) blur(${rem(20)})`,
      WebkitBackdropFilter: `saturate(180%) blur(${rem(20)})`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      inset: undefined,
      overflow: undefined,
      position: undefined,
      background: 'transparent',
      margin: 0,
      border: undefined,
      borderRadius: undefined,
      padding: undefined,
      width: '100%',
      maxWidth: rem(922),
      maxHeight: `calc(100dvh - ${rem(140)})`,
    },
  };

  return (
    <>
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Thumbnail Modal" style={modalContainer}>
        {selectedThumbnail && (
          <div className={styles['modal-thumbnail']}>
            <button type="button" onClick={closeModal}>
              <CrossButton />
              <span>닫기</span>
            </button>
            <Image src={selectedThumbnail} width={640} height={480} unoptimized priority alt="" onClick={closeModal} />
          </div>
        )}
      </Modal>
      {isLoading && (
        <div className={styles.loading}>
          <p>트윗을 가져오는 중입니다.</p>
        </div>
      )}
      {waitingFor504 && (
        <div className={styles.error}>
          <p>
            임시로 데이터를 불러 올 수 없는 상태입니다.
            <br />
            <button onClick={() => window.location.reload()}>다시 시도</button> 해 주세요 ㅠㅠ
            <br />
            (두어번 누르고 기다리시면 자동으로 불러옵니다.)
          </p>
        </div>
      )}
      {error && (
        <div className={styles.error}>
          <p>데이터를 불러오는데 실패했습니다.</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      )}
      {!isLoading && !error && (
        <div className={styles['periodt-content']}>
          <PullToRefresh onRefresh={handleRefresh}>
            <div className={`${styles['periodt-list']} ${styles['omt-list']}`}>
              {periodts.map((periodt: PeriodtOmt) => {
                const thumbnails = ['thumbnail1', 'thumbnail2', 'thumbnail3', 'thumbnail4'].filter(
                  (key) => periodt[key],
                );
                const originThumbnails = [
                  'thumbnailOrigin1',
                  'thumbnailOrigin2',
                  'thumbnailOrigin3',
                  'thumbnailOrigin4',
                ].filter((key) => periodt[key]);
                return (
                  <article key={periodt.idx}>
                    <div className={styles.profile}>
                      <cite>@{periodt.user}</cite>
                      <AnchorLink href={`https://twitter.com/${periodt.user}/status/${periodt.twit}`}>
                        <span>원본 링크</span>
                        <LinkButton />
                      </AnchorLink>
                    </div>
                    <div className={styles.content}>
                      <div className={styles.retweet}>
                        <div className={styles.description}>
                          <ContentComponent text={periodt.title} />
                        </div>
                        {thumbnails.length > 0 && (
                          <div className={styles.thumbnails}>
                            {thumbnails.map((thumbnailKey) => (
                              <div key={thumbnailKey} className={styles['thumbnail-item']}>
                                <button type="button" onClick={() => handleThumbnailClick(periodt[thumbnailKey])}>
                                  <img src={periodt[thumbnailKey]} alt="" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className={styles.origin}>
                        <div className={styles.profile}>
                          <cite>@{periodt.userOrigin}</cite>
                          <AnchorLink href={`https://twitter.com/${periodt.userOrigin}/status/${periodt.twitOrigin}`}>
                            <span>원본 링크</span>
                            <LinkButton />
                          </AnchorLink>
                        </div>
                        <div className={styles.context}>
                          <div className={styles.description}>
                            <ContentComponent text={periodt.description} />
                          </div>
                          {originThumbnails.length > 0 && (
                            <div className={styles.thumbnails}>
                              {originThumbnails.map((originThumbnailKey) => (
                                <div key={originThumbnailKey} className={styles['thumbnail-item']}>
                                  <button
                                    type="button"
                                    onClick={() => handleThumbnailClick(periodt[originThumbnailKey])}
                                  >
                                    <img src={periodt[originThumbnailKey]} alt="" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </PullToRefresh>
          {isReachingEnd !== undefined && (
            <div ref={setTarget} className={styles.ref}>
              {isReachingEnd === false && <p>트윗을 불러오는 중입니다.</p>}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default PeriodtOmt;

import React, { useRef } from 'react';
import styled from '@emotion/styled';
import YouTube, { YouTubeProps } from 'react-youtube';
import styles from '@/styles/watch.module.sass';
import { rem } from '@/styles/designSystem';

interface Props {
  videoId: string;
  isPlaylist?: boolean;
  titles?: string;
}

const Controllers = styled.div({
  '& strong': {
    display: 'block',
    padding: `${rem(5)} ${rem(15)}`,
    fontSize: rem(14),
    fontWeight: '700',
    color: 'var(--default-text)',
  },
  '& button': {
    backgroundColor: 'transparent',
    width: '100%',
    padding: `${rem(1)} ${rem(15)}`,
    textAlign: 'left',
    '& span': {
      maxWidth: '100%',
      padding: `${rem(2)} 0`,
      display: 'inline-block',
      borderBottom: '1px solid var(--border)',
      color: 'var(--txt-subject)',
      fontSize: rem(12),
      lineHeight: 1.5,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  },
});

const YouTubePlayer = ({ videoId, isPlaylist, titles }: Props) => {
  const playerRef = useRef<any>(null);

  const opts: YouTubeProps['opts'] = {
    width: 560,
    height: 315,
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      rel: 0,
    },
  };
  const playList: YouTubeProps['opts'] = {
    width: 560,
    height: 315,
    playerVars: {
      autoplay: 1,
      rel: 0,
      playlist: videoId,
      loop: 1,
    },
  };

  const onReady = (event: any) => {
    playerRef.current = event.target;
  };

  const handleChangeVideo = (videoId: string) => {
    if (playerRef.current) {
      playerRef.current.loadVideoById(videoId);
    }
  };

  const videoIdsArray = videoId ? videoId.split(',') : [];
  const titlesArray = titles ? titles.split(',') : [];

  return (
    <>
      {isPlaylist ? (
        <>
          <YouTube videoId={videoId} opts={playList} onReady={onReady} />
          <Controllers className={styles.controller}>
            <strong>수동으로 영상 넘기기</strong>
            {videoIdsArray.map((id, index) => (
              <button key={id} onClick={() => handleChangeVideo(id)}>
                <span>
                  {index + 1}. {titlesArray[index]}
                </span>
              </button>
            ))}
          </Controllers>
        </>
      ) : (
        <YouTube videoId={videoId} opts={opts} />
      )}
    </>
  );
};

export default YouTubePlayer;

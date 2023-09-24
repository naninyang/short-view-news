import styled from '@emotion/styled';
import React, { useState } from 'react';
import { mixIn, rem } from '@/styles/designSystem';
import { images } from '@/images';
import YouTubePlayer from './YouTubePlayer';

interface Props {
  videoId: string;
  thumbnailUrl: string;
}

const Container = styled.div({
  position: 'relative',
  aspectRatio: '1920 / 1080',
  overflow: 'hidden',
  '& img': {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    ...mixIn.imageRendering,
    '&:hover': {
      transition: 'all .4s cubic-bezier(.4,0,.2,1)',
      transform: 'scale(1.25)',
    },
  },
  '& button': {
    display: 'flex',
    position: 'absolute',
    top: 0,
    left: 0,
    background: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    border: 0,
    width: '100%',
    height: '100%',
    '&:hover i': {
      opacity: 1,
    },
    '& i': {
      transition: 'all .4s cubic-bezier(.4,0,.2,1)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(244, 246, 250, .7)',
      opacity: 0,
      borderRadius: rem(52),
      width: rem(52),
      height: rem(52),
      '&::before': {
        content: "''",
        display: 'block',
        width: rem(36),
        height: rem(36),
        background: `url(${images.misc.play}) no-repeat 50% 50%/contain`,
      },
    },
    '& span': {
      ...mixIn.screenReaderOnly,
    },
  },
  '& iframe': {
    border: 0,
    width: '100%',
    height: '100%',
  },
});

const YouTubeController = ({ videoId, thumbnailUrl }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <Container>
      {!isPlaying ? (
        <>
          <img src={thumbnailUrl} alt="" />
          <button type="button" onClick={handlePlay}>
            <i />
            <span>영상 재생하기</span>
          </button>
        </>
      ) : (
        <YouTubePlayer videoId={videoId} />
      )}
    </Container>
  );
};

export default YouTubeController;

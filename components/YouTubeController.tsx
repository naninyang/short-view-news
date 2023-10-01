import Image from 'next/image';
import styled from '@emotion/styled';
import React, { useState } from 'react';
import { isDesktop } from 'react-device-detect';
import { mixIn, rem } from '@/styles/designSystem';
import { images } from '@/images';
import YouTubePlayer from './YouTubePlayer';

interface Props {
  videoId: string;
}

const Container = styled.div<{ isDesktop?: boolean }>(({ isDesktop }) => ({
  position: 'relative',
  aspectRatio: '1920 / 1080',
  overflow: 'hidden',
  '&:hover img': {
    transform: isDesktop ? 'scale(1.05)' : undefined,
  },
  '& img': {
    transition: 'all .4s cubic-bezier(.4,0,.2,1)',
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    ...mixIn.imageRendering,
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
      opacity: isDesktop ? 1 : undefined,
    },
    '& i': {
      transition: 'all .4s cubic-bezier(.4,0,.2,1)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(244, 246, 250, .7)',
      opacity: isDesktop ? 0 : undefined,
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
  '& div': {
    width: '100%',
    height: '100%',
  },
  '& iframe': {
    border: 0,
    width: '100%',
    height: '100%',
  },
}));

const YouTubeController = ({ videoId }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <Container isDesktop={isDesktop}>
      {!isPlaying ? (
        <>
          <Image
            src={`https://i.ytimg.com/vi_webp/${videoId}/sddefault.webp`}
            width={640}
            height={480}
            unoptimized
            alt=""
          />
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

import React from 'react';
import styled from '@emotion/styled';
import YouTube, { YouTubeProps } from 'react-youtube';

interface Props {
  videoId: string;
}

const YouTubePlayer = ({ videoId }: Props) => {
  const opts: YouTubeProps['opts'] = {
    width: 560,
    height: 315,
    playerVars: {
      autoplay: 1,
    },
  };

  return <YouTube videoId={videoId} opts={opts} />;
};

export default YouTubePlayer;

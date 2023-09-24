import React from 'react';
import styled from '@emotion/styled';

interface Props {
  videoId: string;
}

const Container = styled.iframe({
  border: 0,
});

const YouTubePlayer = ({ videoId }: Props) => {
  return (
    <Container
      width="560"
      height="315"
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1"`}
      title="YouTube 비디오 플레이어"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
};

export default YouTubePlayer;

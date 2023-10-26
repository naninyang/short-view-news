import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';
import AnchorLink from './AnchorLink';
import { rem } from '@/styles/designSystem';

interface Props {
  article_id: string;
  datetime: string;
}

interface OpenGraphData {
  ogImage: string;
  ogCreator: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
}

const Container = styled.figure({
  display: 'flex',
  flexDirection: 'column-reverse',
  '& img': {
    display: 'block',
    width: '100%',
  },
});

const Opengraph = ({ article_id, datetime }: Props) => {
  const [openGraph, setOpenGraph] = useState<OpenGraphData | null>(null);

  useEffect(() => {
    async function fetchOpengraph() {
      try {
        const response = await axios.get(
          `/api/twt?url=${encodeURIComponent(`https://n.news.naver.com/article/${article_id}`)}`,
        );
        setOpenGraph(response.data);
      } catch (error) {
        console.error('Failed to fetch opengraph', error);
      }
    }
    fetchOpengraph();
  }, []);

  return (
    <Container>
      {openGraph && (
        <>
          <figcaption>
            <time>{datetime}</time>
            <img src={openGraph.ogImage} alt="" />
            <strong>
              {openGraph.ogCreator} / {openGraph.ogTitle}
            </strong>
            <p>
              {openGraph.ogDescription}... <AnchorLink href={openGraph.ogUrl}>새창에서 마저 읽기</AnchorLink>
            </p>
          </figcaption>
        </>
      )}
    </Container>
  );
};

export default Opengraph;

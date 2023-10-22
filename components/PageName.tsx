import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { mq, rem } from '@/styles/designSystem';
import { images } from '@/images';

interface Props {
  pageName: string;
}

const Container = styled.h2({
  display: 'flex',
  alignItems: 'center',
  gap: rem(5),
  padding: `${rem(15)} ${rem(20)}`,
  fontSize: rem(20),
  color: 'var(--default-text)',
  [mq.minSmall]: {
    padding: `${rem(15)} ${rem(25)}`,
  },
  '& i': {
    display: 'block',
    width: rem(25),
    height: rem(25),
    '&[data-page="/periodt"]': {
      'body &, body[data-theme="dark"] &': {
        background: `url(${images.tab.twitter.light}) no-repeat 50% 50%/contain`,
      },
      'body[data-theme="light"] &': {
        background: `url(${images.tab.twitter.dark}) no-repeat 50% 50%/contain`,
      },
    },
    '&[data-page="/articles"]': {
      'body &, body[data-theme="dark"] &': {
        background: `url(${images.tab.naver.light}) no-repeat 50% 50%/contain`,
      },
      'body[data-theme="light"] &': {
        background: `url(${images.tab.naver.dark}) no-repeat 50% 50%/contain`,
      },
    },
    '&[data-page="/watches"]': {
      'body &, body[data-theme="dark"] &': {
        background: `url(${images.tab.youtube.light}) no-repeat 50% 50%/contain`,
      },
      'body[data-theme="light"] &': {
        background: `url(${images.tab.youtube.dark}) no-repeat 50% 50%/contain`,
      },
    },
  },
});

const PageName = ({ pageName }: Props) => {
  const router = useRouter();
  return (
    <Container>
      <i data-page={router.pathname} /> <span>{pageName}</span>
    </Container>
  );
};

export default PageName;

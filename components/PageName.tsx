import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { mq, rem } from '@/styles/designSystem';
import { images } from './images';

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
  '& span': {
    lineHeight: 1,
  },
  '& i': {
    display: 'block',
    width: rem(25),
    height: rem(25),
    '&[data-page="/periodt"]': {
      'body[data-theme="dark"] &': {
        background: `url(${images.tab.twitter.defaultLight}) no-repeat 50% 50%/contain`,
      },
      'body &, body[data-theme="light"] &': {
        background: `url(${images.tab.twitter.defaultDark}) no-repeat 50% 50%/contain`,
      },
    },
    '&[data-page="/articles"]': {
      'body[data-theme="dark"] &': {
        background: `url(${images.tab.naver.defaultLight}) no-repeat 50% 50%/contain`,
      },
      'body &, body[data-theme="light"] &': {
        background: `url(${images.tab.naver.defaultDark}) no-repeat 50% 50%/contain`,
      },
    },
    '&[data-page="/watches"]': {
      'body[data-theme="dark"] &': {
        background: `url(${images.tab.youtube.defaultLight}) no-repeat 50% 50%/contain`,
      },
      'body &, body[data-theme="light"] &': {
        background: `url(${images.tab.youtube.defaultDark}) no-repeat 50% 50%/contain`,
      },
    },
    '&[data-page="/history"]': {
      'body[data-theme="dark"] &': {
        background: `url(${images.tab.history.defaultLight}) no-repeat 50% 50%/contain`,
      },
      'body &, body[data-theme="light"] &': {
        background: `url(${images.tab.history.defaultDark}) no-repeat 50% 50%/contain`,
      },
    },
    '&[data-page="/insteads"]': {
      'body[data-theme="dark"] &': {
        background: `url(${images.tab.preview.defaultLight}) no-repeat 50% 50%/contain`,
      },
      'body &, body[data-theme="light"] &': {
        background: `url(${images.tab.preview.defaultDark}) no-repeat 50% 50%/contain`,
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

import styled from '@emotion/styled';
import AnchorLink from './AnchorLink';
import { hex, rem, mixIn } from '@/styles/designSystem';
import { useRouter } from 'next/router';
import { images } from '@/images';

const Nav = styled.nav({
  position: 'fixed',
  bottom: 0,
  left: 0,
  display: 'flex',
  zIndex: 1020,
  justifyContent: 'center',
  backdropFilter: `saturate(180%) blur(${rem(20)})`,
  backgroundColor: 'var(--bg-primary-opacity)',
  paddingBottom: 'env(safe-area-inset-bottom)',
  width: '100%',
  '&::before': {
    content: "''",
    position: 'absolute',
    top: 0,
    display: 'block',
    width: '100%',
    height: '1px',
    backgroundColor: 'var(--border)',
  },
  '& ol': {
    display: 'flex',
    gap: rem(15),
    width: '100%',
  },
  '& li': {
    ...mixIn.col,
  },
  '& a': {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: rem(5),
    padding: `${rem(25)} 0`,
    textAlign: 'center',
    '& i': {
      display: 'inline-block',
      width: rem(24),
      height: rem(24),
      '&[data-icon="home"]': {
        'body &, body[data-theme="dark"] &': {
          background: `url(${images.tab.home.light}) no-repeat 50% 50%/contain`,
        },
        'body[data-theme="light"] &': {
          background: `url(${images.tab.home.dark}) no-repeat 50% 50%/contain`,
        },
      },
      '&[data-icon="youtube"]': {
        'body &, body[data-theme="dark"] &': {
          background: `url(${images.tab.youtube.light}) no-repeat 50% 50%/contain`,
        },
        'body[data-theme="light"] &': {
          background: `url(${images.tab.youtube.dark}) no-repeat 50% 50%/contain`,
        },
      },
      '&[data-icon="naver"]': {
        'body &, body[data-theme="dark"] &': {
          background: `url(${images.tab.naver.light}) no-repeat 50% 50%/contain`,
        },
        'body[data-theme="light"] &': {
          background: `url(${images.tab.naver.dark}) no-repeat 50% 50%/contain`,
        },
      },
    },
    '& span': {
      fontSize: rem(16),
      lineHeight: 1,
    },
  },
});

const MenuItem = styled.li<{ currentRouter?: boolean }>(({ currentRouter }) => ({
  '& a': {
    color: currentRouter ? hex.accent : 'var(--txt-subject)',
    fontWeight: currentRouter ? '900' : '400',
    '& i': {
      '&[data-icon="home"]': {
        background: currentRouter ? `url(${images.tab.home.active}) no-repeat 50% 50%/contain !important` : undefined,
      },
      '&[data-icon="youtube"]': {
        background: currentRouter
          ? `url(${images.tab.youtube.active}) no-repeat 50% 50%/contain !important`
          : undefined,
      },
      '&[data-icon="naver"]': {
        background: currentRouter ? `url(${images.tab.naver.active}) no-repeat 50% 50%/contain !important` : undefined,
      },
    },
  },
}));

export default function Services() {
  const router = useRouter();
  return (
    <Nav>
      <ol>
        <MenuItem currentRouter={router.pathname === '/' ? true : false}>
          <AnchorLink href="/">
            <i data-icon="home" />
            <span>Home</span>
          </AnchorLink>
        </MenuItem>
        <MenuItem currentRouter={router.pathname === '/watches' ? true : false}>
          <AnchorLink href="/watches">
            <i data-icon="youtube" />
            <span>YouTube</span>
          </AnchorLink>
        </MenuItem>
        <MenuItem currentRouter={router.pathname === '/articles' ? true : false}>
          <AnchorLink href="/articles">
            <i data-icon="naver" />
            <span>NAVER</span>
          </AnchorLink>
        </MenuItem>
      </ol>
    </Nav>
  );
}

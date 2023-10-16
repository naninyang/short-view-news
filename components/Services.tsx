import styled from '@emotion/styled';
import AnchorLink from './AnchorLink';
import { hex, rem, mixIn } from '@/styles/designSystem';
import { useRouter } from 'next/router';

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
    justifyContent: 'center',
    padding: `${rem(25)} 0`,
    fontSize: rem(16),
    lineHeight: 1,
    textAlign: 'center',
  },
});

const MenuItem = styled.li<{ currentRouter?: boolean }>(({ currentRouter }) => ({
  '& a': {
    borderTop: currentRouter ? `${rem(2)} solid ${hex.accent}` : `${rem(2)} solid transparent`,
    color: currentRouter ? hex.accent : 'var(--txt-subject)',
    fontWeight: currentRouter ? '900' : '400',
  },
}));

export default function Services() {
  const router = useRouter();
  return (
    <Nav>
      <ol>
        <MenuItem currentRouter={router.pathname === '/' ? true : false}>
          <AnchorLink href="/">Home</AnchorLink>
        </MenuItem>
        <MenuItem currentRouter={router.pathname === '/watches' ? true : false}>
          <AnchorLink href="/watches">YouTube</AnchorLink>
        </MenuItem>
        <MenuItem currentRouter={router.pathname === '/articles' ? true : false}>
          <AnchorLink href="/articles">NAVER</AnchorLink>
        </MenuItem>
      </ol>
    </Nav>
  );
}

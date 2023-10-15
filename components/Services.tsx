import styled from '@emotion/styled';
import AnchorLink from './AnchorLink';
import { hex, rem, mixIn } from '@/styles/designSystem';
import { useRouter } from 'next/router';

const Nav = styled.nav({
  position: 'fixed',
  bottom: 0,
  left: 0,
  display: 'flex',
  justifyContent: 'center',
  borderTop: `${rem(2)} solid var(--border)`,
  paddingBottom: 'env(safe-area-inset-bottom)',
  width: '100%',
  '& ol': {
    display: 'flex',
    gap: rem(15),
    width: '100%',
  },
  '& li': {
    ...mixIn.col,
  },
  '& a': {
    display: 'flex',
    justifyContent: 'center',
    padding: rem(15),
    fontSize: rem(16),
    lineHeight: 1,
    textAlign: 'center',
  },
});

const MenuItem = styled.li<{ currentRouter?: boolean }>(({ currentRouter }) => ({
  '& a': {
    borderTop: currentRouter ? `${rem(2)} solid ${hex.accent}` : `${rem(2)} solid transparent`,
    color: currentRouter ? hex.accent : 'var(--txt-subject)',
    fontWeight: currentRouter ? '700' : '400',
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

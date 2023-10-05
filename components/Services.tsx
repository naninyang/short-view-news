import styled from '@emotion/styled';
import AnchorLink from './AnchorLink';
import { hex, rem } from '@/styles/designSystem';
import { useRouter } from 'next/router';

const Nav = styled.nav({
  display: 'flex',
  justifyContent: 'center',
  paddingBottom: rem(15),
  '& ol': {
    display: 'flex',
    justifyContent: 'center',
    gap: rem(15),
    width: '100%',
    maxWidth: rem(575),
  },
  '& a': {
    display: 'inline-flex',
    padding: rem(5),
    fontSize: rem(16),
    lineHeight: 1,
  },
});

const MenuItem = styled.li<{ currentRouter?: boolean }>(({ currentRouter }) => ({
  '& a': {
    borderBottom: currentRouter ? `${rem(2)} solid ${hex.accent}` : `${rem(2)} solid transparent`,
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
          <AnchorLink href="/">YouTube</AnchorLink>
        </MenuItem>
        <MenuItem currentRouter={router.pathname === '/articles' ? true : false}>
          <AnchorLink href="/articles">NAVER</AnchorLink>
        </MenuItem>
      </ol>
    </Nav>
  );
}

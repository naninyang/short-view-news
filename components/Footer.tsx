import styled from '@emotion/styled';
import AnchorLink from './AnchorLink';
import { hex, mq, rem } from '@/styles/designSystem';

const Container = styled.footer({
  display: 'flex',
  transition: 'all .4s cubic-bezier(.4,0,.2,1)',
  padding: `
    ${rem(15)}
    calc(env(safe-area-inset-right) + ${rem(15)})
    calc(env(safe-area-inset-bottom) + ${rem(15)})
    calc(env(safe-area-inset-left) + ${rem(15)})
  `,
  [mq.maxMedium]: {
    flexDirection: 'column',
    gap: rem(5),
  },
  [mq.minLarge]: {
    justifyContent: 'space-between',
    padding: `
      ${rem(25)}
      calc(env(safe-area-inset-right) + ${rem(25)})
      calc(env(safe-area-inset-bottom) + ${rem(25)})
      calc(env(safe-area-inset-left) + ${rem(25)})
    `,
  },
  '& p, & a': {
    fontSize: rem(14),
    'body &, body[data-theme="dark"] &': {
      color: hex.light,
    },
    'body[data-theme="light"] &': {
      color: hex.dark,
    },
  },
  '& a': {
    textDecoration: 'underline',
  },
  '& ul': {
    display: 'flex',
    gap: rem(10),
    '& li': {
      display: 'flex',
      gap: rem(10),
      '&:first-of-type::after': {
        content: "'/'",
        display: 'block',
        'body &, body[data-theme="dark"] &': {
          color: hex.light,
        },
        'body[data-theme="light"] &': {
          color: hex.dark,
        },
      },
    },
  },
});

export default function Footer() {
  return (
    <Container>
      <p>Copyright © NEWS CURATORS. All Rights Reserved.</p>
      <ul>
        <li>
          <AnchorLink href="https://dev1stud.io/">DEV1L.studio</AnchorLink>
        </li>
        <li>
          <AnchorLink href="https://velog.io/@naninyang">chloe.log</AnchorLink>
        </li>
      </ul>
    </Container>
  );
}

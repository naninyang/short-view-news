import styled from '@emotion/styled';
import AnchorLink from './AnchorLink';
import { hex, mixIn, mq, rem } from '@/styles/designSystem';
import { images } from '@/images';
import { useEffect, useState } from 'react';

const Container = styled.header({
  display: 'flex',
  gap: rem(15),
  padding: rem(15),
  [mq.minLarge]: {
    gap: rem(25),
    padding: rem(25),
  },
  '& h1 a': {
    transition: 'all .4s cubic-bezier(.4,0,.2,1)',
    display: 'block',
    width: rem(196),
    height: rem(39),
    [mq.minLarge]: {
      width: rem(262),
      height: rem(52),
    },
    'body &, body[data-theme="dark"] &': {
      background: `url(${images.logo.light}) no-repeat 50% 50%/contain`,
    },
    'body[data-theme="light"] &': {
      background: `url(${images.logo.dark}) no-repeat 50% 50%/contain`,
    },
    '& span': {
      ...mixIn.screenReaderOnly,
    },
  },
  '& button': {
    transition: 'all .4s cubic-bezier(.4,0,.2,1)',
    display: 'block',
    border: 0,
    borderRadius: rem(39),
    width: rem(39),
    height: rem(39),
    [mq.minLarge]: {
      borderRadius: rem(52),
      width: rem(52),
      height: rem(52),
    },
    'body &, body[data-theme="dark"] &': {
      backgroundColor: hex.darkBackground,
    },
    'body[data-theme="light"] &': {
      backgroundColor: hex.lightBackground,
    },
    '& span': {
      ...mixIn.screenReaderOnly,
    },
  },
});

const ThemeChangeButton = styled.button<{ themeMode?: boolean }>(({ themeMode }) => ({
  background: themeMode
    ? `url(${images.mode.dark.nighttime}) no-repeat 50% 50%/${rem(27)} ${rem(27)}`
    : `url(${images.mode.light.daytime}) no-repeat 50% 50%/${rem(27)} ${rem(27)}`,
  [mq.minLarge]: {
    background: themeMode
      ? `url(${images.mode.dark.nighttime}) no-repeat 50% 50%/${rem(36)} ${rem(36)}`
      : `url(${images.mode.light.daytime}) no-repeat 50% 50%/${rem(36)} ${rem(36)}`,
  },
}));

export default function Header() {
  const [themeMode, setThemeMode] = useState<string>('dark');

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme');
    if (!savedTheme || (savedTheme !== 'dark' && savedTheme !== 'light')) {
      window.localStorage.setItem('theme', 'dark');
    } else {
      setThemeMode(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.body.dataset.theme = themeMode;
    window.localStorage.setItem('theme', themeMode);
  }, [themeMode]);

  const themeModeHandle = (event: React.MouseEvent) => {
    event.preventDefault();
    setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
  };

  return (
    <Container>
      <h1>
        <AnchorLink href="/">
          <span>short view news</span>
        </AnchorLink>
      </h1>
      <ThemeChangeButton type="button" themeMode={themeMode === 'dark'} onClick={themeModeHandle}>
        {themeMode === 'dark' ? <span>라이트 모드로 변경</span> : <span>라이트 모드로 변경</span>}
      </ThemeChangeButton>
    </Container>
  );
}

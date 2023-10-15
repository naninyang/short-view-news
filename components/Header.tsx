import { useEffect, useState } from 'react';
import { isDesktop } from 'react-device-detect';
import styled from '@emotion/styled';
import AnchorLink from './AnchorLink';
import { hex, mixIn, mq, rem } from '@/styles/designSystem';
import { images } from '@/images';

const Container = styled.header({
  backgroundColor: 'var(--bg-primary-opacity)',
  backdropFilter: `saturate(180%) blur(${rem(20)})`,
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 1030,
  display: 'flex',
  justifyContent: 'space-between',
  padding: `
    calc(env(safe-area-inset-top) + ${rem(15)})
    calc(env(safe-area-inset-right) + ${rem(15)})
    ${rem(15)}
    calc(env(safe-area-inset-left) + ${rem(15)})
  `,
  width: '100%',
  [mq.minLarge]: {
    padding: `
      calc(env(safe-area-inset-top) + ${rem(25)})
      calc(env(safe-area-inset-right) + ${rem(25)})
      ${rem(25)}
      calc(env(safe-area-inset-left) + ${rem(25)})
    `,
  },
});

const ThemeChangeButton = styled.button<{ themeMode?: boolean }>(({ themeMode }) => ({
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '50% 50%',
  backgroundSize: `${rem(27)} ${rem(27)}`,
  backgroundImage: themeMode ? `url(${images.mode.dark.nighttime})` : `url(${images.mode.light.daytime})`,
  [mq.minLarge]: {
    backgroundSize: `${rem(36)} ${rem(36)}`,
  },
}));

const Primary = styled.div<{ isDesktop?: boolean }>(({ isDesktop }) => ({
  display: 'flex',
  gap: rem(15),
  [mq.minLarge]: {
    gap: rem(25),
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
    transition: isDesktop ? 'all .4s cubic-bezier(.4,0,.2,1)' : undefined,
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
}));

const Secondary = styled.div();

const MenuButton = styled.button({
  background: 'none',
  width: rem(39),
  height: rem(39),
  [mq.minLarge]: {
    width: rem(52),
    height: rem(52),
  },
  '& i': {
    background: `url(${images.misc.menu}) no-repeat 50% 50%/contain`,
    display: 'inline-block',
    width: rem(27),
    height: rem(27),
    [mq.minLarge]: {
      width: rem(36),
      height: rem(36),
    },
  },
  '& span': {
    ...mixIn.screenReaderOnly,
  },
});

const Menu = styled.nav({
  position: 'fixed',
  zIndex: '1070',
  top: 0,
  left: 0,
  inset: '0px',
  display: 'flex',
  width: '100%',
  height: '100dvh',
  backdropFilter: `saturate(180%) blur(${rem(20)})`,
  transition: 'all .4s cubic-bezier(.4,0,.2,1)',
  background: 'var(--bg-primary-opacity)',
  opacity: 0,
  '&.expanded': {
    opacity: 1,
  },
});

const MenuContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(15),
  backgroundColor: 'var(--bg-primary)',
  transition: 'all .4s cubic-bezier(.4,0,.2,1)',
  transform: `translateX(${rem(270)})`,
  opacity: 0,
  padding: rem(15),
  width: rem(270),
  '.expanded &': {
    transform: `translateX(0)`,
    opacity: 1,
  },
  '& ol': {
    display: 'flex',
    flexDirection: 'column',
    gap: rem(10),
    flexGrow: '1',
    padding: `0 ${rem(10)}`,
    '& li a': {
      display: 'block',
      borderBottom: `${rem(2)} solid transparent`,
      padding: `${rem(10)} 0`,
      fontWeight: '700',
      color: 'var(--txt-blockquote)',
      '&:hover, &:focus': {
        borderBottom: `${rem(2)} solid var(--txt-blockquote)`,
      },
    },
  },
  '& ul': {
    display: 'flex',
    gap: rem(5),
    '& a': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: rem(25),
      height: rem(25),
      [mq.minLarge]: {
        width: rem(35),
        height: rem(35),
      },
      '& i': {
        display: 'inline-block',
        width: rem(20),
        height: rem(20),
        [mq.minLarge]: {
          width: rem(30),
          height: rem(30),
        },
      },
      '& span': {
        ...mixIn.screenReaderOnly,
      },
    },
  },
  '& p': {
    fontSize: rem(14),
    'body &, body[data-theme="dark"] &': {
      color: 'rgba(255, 255, 255, .2)',
    },
    'body[data-theme="light"] &': {
      color: 'rgba(0, 0, 0, .7)',
    },
  },
});

const Close = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
  '& button': {
    background: 'none',
    width: rem(39),
    height: rem(39),
    [mq.minLarge]: {
      width: rem(52),
      height: rem(52),
    },
    '& i': {
      background: `url(${images.misc.close}) no-repeat 50% 50%/contain`,
      display: 'inline-block',
      width: rem(27),
      height: rem(27),
      [mq.minLarge]: {
        width: rem(36),
        height: rem(36),
      },
    },
    '& span': {
      ...mixIn.screenReaderOnly,
    },
  },
});

const Postype = styled.i({
  'body &, body[data-theme="dark"] &': {
    background: `url(${images.services.postypeLight}) no-repeat 50% 50%/contain`,
  },
  'body[data-theme="light"] &': {
    background: `url(${images.services.postypeDark}) no-repeat 50% 50%/contain`,
  },
});

const Blog = styled.i<{ isDesktop?: boolean }>({
  'body &, body[data-theme="dark"] &': {
    background: `url(${images.services.blogLight}) no-repeat 50% 50%/contain`,
  },
  'body[data-theme="light"] &': {
    background: `url(${images.services.blogDark}) no-repeat 50% 50%/contain`,
  },
});

const Github = styled.i({
  'body &, body[data-theme="dark"] &': {
    background: `url(${images.services.githubLight}) no-repeat 50% 50%/contain`,
  },
  'body[data-theme="light"] &': {
    background: `url(${images.services.githubDark}) no-repeat 50% 50%/contain`,
  },
});

const Dimmed = styled.div({
  ...mixIn.col,
});

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

  const [menuState, setMenuState] = useState<'closed' | 'expanding' | 'expanded'>('closed');

  const openMenu = () => {
    setMenuState('expanding');
    setTimeout(() => setMenuState('expanded'), 400);
  };

  const closeMenu = () => {
    setMenuState('expanding');
    setTimeout(() => {
      setMenuState('closed');
    }, 400);
  };

  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    if (menuState !== 'closed') {
      window.addEventListener('wheel', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });
    } else if (menuState === 'closed') {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    }

    return () => {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    };
  }, [menuState]);

  return (
    <>
      <Container>
        <Primary isDesktop={isDesktop}>
          <h1>
            <AnchorLink href="/">
              <span>short view news</span>
            </AnchorLink>
          </h1>
          <ThemeChangeButton type="button" themeMode={themeMode === 'dark'} onClick={themeModeHandle}>
            {themeMode === 'dark' ? <span>라이트 모드로 변경</span> : <span>라이트 모드로 변경</span>}
          </ThemeChangeButton>
        </Primary>
        <Secondary>
          <MenuButton type="button" onClick={openMenu}>
            <i />
            <span>메뉴 열기</span>
          </MenuButton>
        </Secondary>
      </Container>
      {menuState !== 'closed' && (
        <Menu
          className={`${menuState === 'expanding' ? 'expanding' : ''} ${menuState === 'expanded' ? 'expanded' : ''}`}
        >
          <Dimmed onClick={closeMenu} />
          <MenuContainer>
            <Close>
              <button type="button" onClick={closeMenu}>
                <i />
                <span>메뉴 닫기</span>
              </button>
            </Close>
            <ol>
              <li>
                <AnchorLink href="/notice" onClick={closeMenu}>
                  안내사항
                </AnchorLink>
              </li>
              <li>
                <AnchorLink href="/contact-us" onClick={closeMenu}>
                  문의사항
                </AnchorLink>
              </li>
              <li>
                <AnchorLink href="/open-sources" onClick={closeMenu}>
                  오픈소스
                </AnchorLink>
              </li>
            </ol>
            <ul>
              <li>
                <AnchorLink href="https://dev-il-studio.postype.com">
                  <Postype />
                  <span>데빌 스튜디오</span>
                </AnchorLink>
              </li>
              <li>
                <AnchorLink href="https://dev1stud.io">
                  <Blog />
                  <span>데블런 스튜디오</span>
                </AnchorLink>
              </li>
              <li>
                <AnchorLink href="https://github.com/naninyang/short-view-new">
                  <Github />
                  <span>깃헙 레포</span>
                </AnchorLink>
              </li>
            </ul>
            <p>&copy; NEWS CURATORS, 2023</p>
          </MenuContainer>
        </Menu>
      )}
    </>
  );
}

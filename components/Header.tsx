import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import AnchorLink from './AnchorLink';
import { hex, mixIn, rem } from '@/styles/designSystem';
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
    calc(env(safe-area-inset-top) + ${rem(10)})
    calc(env(safe-area-inset-right) + ${rem(25)})
    ${rem(10)}
    calc(env(safe-area-inset-left) + ${rem(25)})
  `,
  width: '100%',
});

const ThemeChangeButton = styled.button<{ themeMode?: boolean }>(({ themeMode }) => ({
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '50% 50%',
  backgroundSize: `${rem(20)} ${rem(20)}`,
  backgroundImage: themeMode ? `url(${images.mode.dark.nighttime})` : `url(${images.mode.light.daytime})`,
}));

const Primary = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: rem(15),
  '& h1 a': {
    display: 'block',
    width: rem(151),
    height: rem(30),
    'body[data-theme="dark"] &': {
      background: `url(${images.logo.light}) no-repeat 50% 50%/contain`,
    },
    'body &, body[data-theme="light"] &': {
      background: `url(${images.logo.dark}) no-repeat 50% 50%/contain`,
    },
    '& span': {
      ...mixIn.screenReaderOnly,
    },
  },
  '& button': {
    display: 'block',
    border: 0,
    borderRadius: rem(25),
    width: rem(25),
    height: rem(25),
    'body[data-theme="dark"] &': {
      backgroundColor: hex.darkBackground,
    },
    'body &, body[data-theme="light"] &': {
      backgroundColor: hex.lightBackground,
    },
    '& span': {
      ...mixIn.screenReaderOnly,
    },
  },
});

const Secondary = styled.div();

const MenuButton = styled.button({
  display: 'flex',
  transition: 'background-color .4s cubic-bezier(.4,0,.2,1)',
  backgroundColor: 'var(--default-bg)',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid var(--border)',
  borderRadius: rem(5),
  width: rem(30),
  height: rem(30),
  '& i': {
    display: 'inline-block',
    width: rem(25),
    height: rem(25),
    'body[data-theme="dark"] &': {
      background: `url(${images.misc.menuLight}) no-repeat 50% 50%/contain`,
    },
    'body &, body[data-theme="light"] &': {
      background: `url(${images.misc.menuDark}) no-repeat 50% 50%/contain`,
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
  background: 'rgba(0, 0, 0, .7)',
  opacity: 0,
  '&.expanded': {
    opacity: 1,
  },
});

const MenuContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(15),
  backgroundColor: 'var(--default-bg)',
  transition: 'all .4s cubic-bezier(.4,0,.2,1)',
  transform: `translateX(${rem(270)})`,
  opacity: 0,
  padding: `calc(env(safe-area-inset-top) + ${rem(10)}) calc(env(safe-area-inset-right) + ${rem(
    25,
  )}) calc(env(safe-area-inset-bottom) + ${rem(25)}) ${rem(25)}`,
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
    '& li': {
      '& a': {
        position: 'relative',
        display: 'block',
        padding: `${rem(10)} 0`,
        fontSize: rem(20),
        fontWeight: '700',
        color: 'var(--txt-blockquote)',
        transition: 'all .4s cubic-bezier(.4,0,.2,1)',
        '&::before': {
          content: "''",
          display: 'block',
          position: 'absolute',
          opacity: 0,
          bottom: 0,
          left: 0,
          width: 0,
          height: rem(2),
          transition: 'all .4s cubic-bezier(.4,0,.2,1)',
        },
        '&:hover, &:focus': {
          color: hex.accent,
          '&::before': {
            backgroundColor: hex.accent,
            opacity: 1,
            width: '100%',
          },
        },
      },
      '& button': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: rem(2),
        transition: 'all .4s cubic-bezier(.4,0,.2,1)',
        background: 'transparent',
        marginTop: rem(20),
        border: `1px solid ${hex.accent}`,
        borderRadius: rem(5),
        padding: `${rem(10)} 0`,
        width: '100%',
        fontSize: rem(16),
        fontWeight: 700,
        color: hex.accent,
        '& s': {
          display: 'block',
          position: 'relative',
          width: rem(22),
          height: rem(22),
        },
        '& i': {
          transition: 'all .4s cubic-bezier(.4,0,.2,1)',
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'block',
          width: rem(22),
          height: rem(22),
        },
        '&:focus, &:hover': {
          background: hex.accent,
          color: hex.white,
          outline: '2px solid var(--default-text)',
        },
        '& .before': {
          background: `url(${images.home.downloadDefaultBefore}) no-repeat 50% 50%/contain`,
        },
        '&:hover, &:focus': {
          '& .before': {
            background: `url(${images.home.downloadHoverBefore}) no-repeat 50% 50%/contain`,
          },
        },
        '&.before': {
          '& .after': {
            background: `url(${images.home.downloadDefaultAfter}) no-repeat 50% 50%/contain`,
          },
          '&:hover, &:focus': {
            '& .after': {
              background: `url(${images.home.downloadHoverAfter}) no-repeat 50% 50%/contain`,
            },
          },
        },
        '&.after': {
          '& .after': {
            top: rem(-5),
            background: `url(${images.home.downloadDefaultAfter}) no-repeat 50% 50%/contain`,
          },
          '&:hover, &:focus': {
            '& .after': {
              background: `url(${images.home.downloadHoverAfter}) no-repeat 50% 50%/contain`,
            },
          },
        },
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
      '& i': {
        display: 'inline-block',
        width: rem(20),
        height: rem(20),
      },
      '& span': {
        ...mixIn.screenReaderOnly,
      },
    },
  },
  '& p': {
    fontSize: rem(14),
    'body[data-theme="dark"] &': {
      color: 'rgba(255, 255, 255, .5)',
    },
    'body &, body[data-theme="light"] &': {
      color: 'rgba(0, 0, 0, .5)',
    },
  },
});

const Close = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
  '& button': {
    background: 'none',
    width: rem(30),
    height: rem(30),
    '& i': {
      background: `url(${images.misc.close}) no-repeat 50% 50%/contain`,
      display: 'inline-block',
      width: rem(27),
      height: rem(27),
    },
    '& span': {
      ...mixIn.screenReaderOnly,
    },
  },
});

const Postype = styled.i({
  'body[data-theme="dark"] &': {
    background: `url(${images.services.postypeLight}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${images.services.postypeDark}) no-repeat 50% 50%/contain`,
  },
});

const Blog = styled.i({
  'body[data-theme="dark"] &': {
    background: `url(${images.services.blogLight}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${images.services.blogDark}) no-repeat 50% 50%/contain`,
  },
});

const Github = styled.i({
  'body[data-theme="dark"] &': {
    background: `url(${images.services.githubLight}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${images.services.githubDark}) no-repeat 50% 50%/contain`,
  },
});

const Dimmed = styled.div({
  ...mixIn.col,
});

export default function Header() {
  const [themeMode, setThemeMode] = useState<string>('light');
  useEffect(() => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setThemeMode(systemTheme);
  }, []);

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
    console.log(window.localStorage.getItem('theme'));
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

  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const onInstallPWA = () => {
    if (deferredPrompt) {
      const promptEvent = deferredPrompt as any;
      promptEvent.prompt();
      promptEvent.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  const [buttonClass, setButtonClass] = useState('before');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setButtonClass((prevClass) => (prevClass === 'before' ? 'after' : 'before'));
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  const router = useRouter();
  return (
    <>
      <Container>
        {router.pathname === '/' ||
        router.pathname === '/watches' ||
        router.pathname === '/articles' ||
        router.pathname === '/periodt' ? undefined : (
          <s />
        )}
        <Primary>
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
              {deferredPrompt && (
                <li>
                  <button type="button" className={buttonClass} onClick={onInstallPWA}>
                    <span>숏뷰 뉴스 앱 내려받기</span>
                    <s>
                      <i className="before" />
                      <i className="after" />
                    </s>
                  </button>
                </li>
              )}
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

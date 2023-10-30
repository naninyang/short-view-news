import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AppProps } from 'next/app';
import { Lato, Noto_Sans_KR } from 'next/font/google';
import Script from 'next/script';
import Header from '@/components/Header';
import Services from '@/components/Services';
import { GA_TRACKING_ID, pageview } from '@/lib/gtag';
import 'styles/globals.sass';

const fontLato = Lato({
  weight: ['100', '300', '400', '700', '900'],
  subsets: ['latin'],
});

const fontNoto = Noto_Sans_KR({
  weight: ['100', '300', '400', '700', '900'],
  subsets: ['cyrillic'],
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: any) => {
      pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, [router.events]);
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const registInit = async () => {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        registration.waiting?.postMessage('SKIP_WAITING');
      };
      registInit();
    }
  }, []);
  const noticePage = router.pathname.includes('/notice');
  const contactPage = router.pathname.includes('/contact-us');
  const openPage = router.pathname.includes('/open-sources');

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      sessionStorage.setItem('scrollPosition_' + router.asPath, window.scrollY.toString());
    };

    const handleRouteChangeComplete = (url: string) => {
      const savedScrollPosition = sessionStorage.getItem('scrollPosition_' + url);
      if (savedScrollPosition) {
        window.scrollTo(0, parseInt(savedScrollPosition));
      } else {
        window.scrollTo(0, 0);
      }
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <>
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
      <style jsx global>
        {`
          body,
          pre,
          input,
          button,
          textarea,
          select,
          legend {
            font-family: ${fontLato.style.fontFamily}, ${fontNoto.style.fontFamily}, -apple-system, BlinkMacSystemFont,
              system-ui, 'Apple SD Gothic Neo', 'Nanum Gothic', 'Malgun Gothic', sans-serif;
          }
        `}
      </style>
      <Header />
      <Component {...pageProps} />
      {noticePage || contactPage || openPage ? undefined : <Services />}
    </>
  );
}

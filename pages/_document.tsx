import { Html, Head, Main, NextScript } from 'next/document';
import { GA_TRACKING_ID } from '@/lib/gtag';

export default function Document() {
  return (
    <Html lang="ko-KR">
      <Head>
        <link color="#141414" href="/favicon/safari-pinned-tab.svg" rel="mask-icon" />
        <link href="/favicon/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
        <link href="/favicon/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
        <link href="/favicon/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
        <link href="/favicon/favicon.ico" rel="shortcut icon" />
        <link href="/manifest.json" rel="manifest" />
        <script src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

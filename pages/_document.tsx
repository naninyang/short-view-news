import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  const setThemeMode = `
    function getThemeMode() {
        const theme = window.localStorage.getItem('theme')
        return theme ? theme : 'dark'
    }
    document.body.dataset.theme = getThemeMode()
  `;

  return (
    <Html lang="ko-KR">
      <Head>
        <link href="/favicon/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
        <link href="/favicon/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
        <link href="/favicon/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
        <link href="/favicon/site.webmanifest" rel="manifest" />
        <link color="#000000" href="/favicon/safari-pinned-tab.svg" rel="mask-icon" />
        <link href="/favicon/favicon.ico" rel="shortcut icon" />
      </Head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: setThemeMode }} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

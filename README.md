# 숏뷰 뉴스 {short.view: news}

더 이상 업데이트 되지 않습니다.

Netlify CMS에서 Strapi로 변경하면서 저장소와 서비스 도메인을 이전하였습니다.

아카이빙을 위해서 news.dev1stud.io는 유지되지만 데이터 업데이트는 이루어지지 않습니다.

- 이전된 저장소: https://github.com/naninyang/short-view-news-frontend
- 이전된 도메인: https://shorts.dev1stud.io

> news.dev1stud.io와 다르게 이전된 서비스는 backend 코드가 공개되어 있습니다. (Based Strapi)

## 사용된 주요 기술

### Frontend - This repo

- Next.js w/ React
- react-device-detect
- react-modal w/ Route As Modal
- TypeScript
- Emotion
- SASS
- Google YouTube iframe API
- Masonry w/ Masonic
- Perfect Scrollbar
- pull-to-refresh (without Mutate Caching)
- PWA
- SWR w/ useSWRInfinite
- Vercel w/ serverless
- jsonwebtoken (for Github API Bearer)
- Notion Client (페이지 관리 및 History 페이지용으로 사용)
- baselime.io (for Vercel Serverless Console Notification)

### Web Opengraph Scrap API Server

- iconv
- cheerio (NAVER 링크 미리보기 & Twitter 트윗 링크 미리보기)
- open-graph-scraper (Preview 탭에서 링크 미리보기)

### Backend - Private repo

- Netlify CMS
- Netlify
- Git-gateway
- Github API (Github App & Github OAuth)

## 안내사항

### YouTube

각 기사의 제목은 YouTube 영상의 제목에서 직접 가져오며, 기사 내용은 '더보기'란을 참조하거나 자막/캡션 참조 또는 큐레이터 본인이 직접 뉴스를 듣고 일부를 발췌하여 작성됩니다.

### NAVER

네이버의 기사 내용이나 이미지는 cheerio를 사용하여 Meta 태그의 Opengraph 내용만 스크랩하여 가져옵니다.

또한 cheerio를 사용하여 가져온 데이터는 어떠한 데이터베이스로도 저장되지 않습니다. 모든 데이터는 캐싱이 되지만 서버에 저장되지 않고 사용자의 웹브라우저 또는 앱의 쿠키 및 로컬스토리지 한정하여 저장됩니다.

### Twitter(X)

트위터에서 Opengraph를 지원하지 않기에 유저 아이디, 트윗 내용은 큐레이터가 수동으로 수집(Puppeteer를 사용해서 강제로 가져올 수 있지만 숏뷰뉴스 백엔드 서버 리소스를 지나치게 잡아먹는 문제가 있어서 사용하지 않음)하며 트윗에 포함된 링크의 Opengraph는 cheerio를 사용하여 가져옵니다. 링크의 웹사이트가 CSR(Client Server Rendering)인 경우 가져오지 않습니다.

트윗에 포함된 이미지는 별도 저장하지 않고 트윗 서버에서 직접 가져오므로 트윗이 삭제되거나 계정이 플텍 계정으로 전환이 되면 이미지는 404가 됩니다. 현재는 이런 경우 수동으로 지웁니다.

## 주의사항 및 저작권

이 서비스는 Vercel, Netlify, Twitter(X), Google 그리고 NAVER와 관련이 없습니다.

큐레이터 본인의 생각이 들어간 부분은 언론사의 의견 또는 입장과 많이 다를 수 있으며, 큐레이터 본인의 생각은 큐레이터 개인의 의견일 뿐입니다.

뉴스 콘텐츠에 대한 저작권은 각 언론사에 있으며, 트위터 트윗에 대한 저작권은 각 사용자에게 있습니다.

# 숏뷰 뉴스 {short.view: news}

YouTube 및 NAVER 뉴스에 업로드 된 뉴스를 요약하고 큐레이터 본인의 생각을 짧게 보여주는 서비스입니다.

YouTube는 5분 미만의 짧은 뉴스를 가져오며, 아주 가끔 그 이상의 뉴스도 가져옵니다.

Twitter의 트윗은 큐레이팅하여 가져올 때는 큐레이터의 의견이 삽입되지 않습니다.

History 페이지의 콘텐츠는 사건/사고 위주로 가져옵니다.

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

- iconv (for EUC-KR)
- cheerio (EUC-KR 사용하는 웹사이트를 위해서 open-graph-scraper 사용 중지)

### Backend - Private repo

- Netlify CMS
- Netlify
- Git-gateway
- Github API (Github App & Github OAuth)

## Troubleshooting

이슈를 등록해 주시거나 [여기](https://news.dev1stud.io/contact-us)를 이용해 주세요.

## TO-DO

- 데이터 불러올 때 텍스트가 세로 가운데 정렬이 안되는 현상 해결 (최소 세로폭 설정 문제)
  - iOS, iPadOS 의 안전 공간 계산 문제로 복잡함

## Supported PWA App. Download

PWA 형태의 앱 다운로드를 지원합니다.

Google Chrome에서는 메뉴에 다운로드 링크가 있으며, Safari에서는 메인 화면에 내려받는 방법이 안내되어 있습니다.

MS Windows, Apple macOS, Android, iOS, iPadOS 등 대부분의 모던 디바이스를 지원합니다.

## 광고제안

### 광고 집행 영역

- YouTube 페이지에 광고를 집행하고 싶은 경우 `뉴스 아이템`에 게시됩니다. YouTube에 업로드 된 영상이 있어야 하고, 홍보하고 싶은 아이템이 웹사이트 혹은 앱 스토어라면 링크가 추가로 있어야 합니다. (링크만 있으면 어떤 것이든 가능)
- NAVER 페이지에 광고를 집행하고 싶은 경우 `일반 뉴스`에 게시됩니다. 네이버 뉴스에 광고 집행하고 싶은 아이템에 대한 기사가 있어야 합니다. 단, 기사가 연예란에 올라간 경우에는 `연예 뉴스`에 게시됩니다. 홍보 썸네일과 홍보하고자 하는 아이템의 링크를 추가로 있어야 합니다. (링크만 있으면 어떤 것이든 가능)

### 광고 집행 주의사항

- 19금 아이템은 반려됩니다.
- 의약품, 건강기능식품, 화장품 광고는 반려됩니다. (단, 앱 광고는 iOS, 안드로이드 앱 둘 다 입점이 되어 있다는 조건하에 집행 가능합니다.)

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

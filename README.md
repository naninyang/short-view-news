# 숏뷰 뉴스 {short.view: news}

YouTube 및 NAVER 뉴스에 업로드 된 뉴스를 요약하고 큐레이터 본인의 생각을 짧게 보여주는 서비스입니다.

YouTube는 5분 미만의 짧은 뉴스를 가져오며, 아주 가끔 그 이상의 뉴스도 가져옵니다.

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
- Notion Client (페이지 관리에 사용)

### NAVER News Opengraph API Server

- open-graph-scraper

### Backend - Private repo for ONLY Database

- Netlify CMS
- Netlify
- Git-gateway
- Github API (Github App & Github OAuth)

## Troubleshooting

- 간혈적으로 스크롤링 시 예전 데이터 추가로 가져오는 로직이 동작하지 않는 현상
  - 디버깅을 해보고 해결이 안되면 `더보기` 버튼 만들어서 해결
- 하단 탭 눌렀을 때 무조건 상단으로 이동하는 현상
- 네이버 뉴스 목록에서 캐시가 없을 때 간혈적으로 서버 에러가 뜨는 현상 (유튜브는 정상 동작)
  - 임시로 에러 메시지를 다르게 보여주게 처리함
  - 유튜브와 네이버 뉴스의 차이는 메타 데이터를 추가로 불러오냐의 차이일 뿐인데 왜 이런 현상이 네이버에서만 발생하는지 원인을 알 수 없음
  - 네이버 뉴스 Opengraph 크롤링 API를 외부 서버로 따로 빼냄
    - 웹브라우저에서 에러 뜨는 현상은 사라짐
    - PWA 앱에서만 발생하고 `Service Worker`에서 발생한다고 에러가 뜸 (실제로 PWA 앱에서만 발생함)
    - 원인과 해결책은 여전히 오리무중. (수정해주실 Collaborator 찾습니다)

## TO-DO

- 탭 눌렀을 때 스크롤 위치 기억하기
- NAVER 뉴스 목록 캐시 없을 때 디버깅

## 알림

### YouTube

각 기사의 제목은 YouTube 영상의 제목에서 직접 가져오며, 기사 내용은 '더보기'란을 참조하거나 자막/캡션 참조 또는 큐레이터 본인이 직접 기사를 듣고 일부를 발췌하여 작성됩니다.

### NAVER

cheerio를 사용하여 Opengraph 내용만 스크랩하여 가져옵니다. 단, 기사 작성 시간은 Opengraph에서 추출이 불가능하여 NAVER 뉴스 기사 페이지에서 직접 가져옵니다. 그 외에는 cheerio를 사용하지 않습니다.

또한 cheerio를 사용하여 가져온 데이터는 어떠한 데이터베이스로도 저장되지 않습니다. 추후에 캐싱할 예정이 있지만 이마저도 서버가 아닌 사용자의 디바이스에 '캐싱' 목적으로만 저장하여 불러오는 용도로 사용됩니다.

## 주의사항 및 저작권

이 서비스는 Vercel, Netlify, Google 그리고 NAVER와 관련이 없습니다.

큐레이터 본인의 생각이 들어간 부분은 언론사의 의견 또는 입장과 많이 다를 수 있으며, 큐레이터 본인의 생각은 큐레이터 개인의 사견입니다.

뉴스 콘텐츠에 대한 저작권은 각 언론사에 있습니다.

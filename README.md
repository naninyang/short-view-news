# 숏뷰 뉴스 {short.view: news}

YouTube 및 NAVER 뉴스에 업로드 된 뉴스를 요약하고 큐레이터 본인의 생각을 짧게 보여주는 서비스입니다.

YouTube는 5분 미만의 짧은 뉴스를 가져오며, 아주 가끔 그 이상의 뉴스도 가져옵니다.

YouTube 뉴스 목록과 NAVER 뉴스 목록은 Notion에서 관리됩니다.

## 사용된 주요 기술/기능 또는 패키지

- Next.js w/ React
- react-device-detect
- react-modal w/ Route As Modal
- TypeScript
- Emotion
- SASS
- Google YouTube iframe API
- Masonry w/ Masonic
- Perfect Scrollbar
- pull-to-refresh
- PWA
- SWR
- Notion Client
- cheerio

## Troubleshooting

### 발견된 문제점

#### 공통

- YouTube <-> NAVER News 링크 이동시 캐싱된 데이터가 아닌 모든 데이터를 새로 불러오는 현상

#### YouTube

- pull-to-refresh 동작해도 20건을 불러오고 더 이상 새로운 데이터를 제대로 못 불러오는 현상
- 모바일에서 백그라운드로 오래 둔 상태에서 되돌아왔을 때 캐싱 데이터를 사용하지 않고 데이터를 모두 새로 불러오는 현상

#### NAVER News

- 모달창과 Permalink 화면에서 Opengraph 가져오는 부분 딜레이가 발생하는 현상

### TO-DO

- NAVER News: 데이터 캐싱
- NAVER News: pull-to-refresh 적용
- NAVER News: sitemap.xml 작성

## 알림

### 공통

- 없음

### YouTube

각 기사의 제목은 YouTube 영상의 제목에서 직접 가져오며, 기사 내용은 '더보기'란을 참조하거나 자막/캡션 참조 또는 큐레이터 본인이 직접 기사를 듣고 일부를 발췌하여 작성됩니다.

### NAVER

cheerio를 사용하여 Opengraph 내용만 스크랩하여 가져옵니다. 단, 기사 작성 시간은 Opengraph에서 추출이 불가능하여 NAVER 뉴스 기사 페이지에서 직접 가져옵니다. 그 외에는 cheerio를 사용하지 않습니다.

또한 cheerio를 사용하여 가져온 데이터는 어떠한 데이터베이스로도 저장되지 않습니다. 추후에 캐싱할 예정이 있지만 이마저도 서버가 아닌 사용자의 디바이스에 '캐싱' 목적으로만 저장하여 불러오는 용도로 사용됩니다.

## 주의사항 및 저작권

이 서비스는 Vercel, Next.js, Notion, Google 그리고 NAVER와 관련이 없습니다.

큐레이터 본인의 생각이 들어간 부분은 언론사의 의견 또는 입장과 많이 다를 수 있으며, 큐레이터 본인의 생각은 큐레이터 개인의 사견입니다.

뉴스 콘텐츠에 대한 저작권은 각 언론사에 있습니다.

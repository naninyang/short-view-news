# 숏뷰 뉴스 {short.view: news}

YouTube 및 NAVER 뉴스에 업로드 된 뉴스를 요약하고 큐레이터 본인의 생각을 짧게 보여주는 서비스입니다.

YouTube는 5분 미만의 짧은 뉴스를 가져오며, 아주 가끔 그 이상의 뉴스도 가져옵니다.

YouTube 뉴스 목록은 Google Spreadsheets에서 관리하며 NAVER 뉴스 목록은 Notion에서 관리됩니다.

## 사용된 주요 기술/기능 또는 패키지

- Next.js w/ React
- react-device-detect
- react-modal w/ Route As Modal
- TypeScript
- Emotion
- SASS
- google-auth-library
- google-spreadsheet
- Google YouTube iframe API
- Masonry w/ Masonic
- Perfect Scrollbar
- pull-to-refresh
- PWA
- Notion Client
- cheerio

## Troubleshooting

발견된 문제점

- YouTube: pull-to-refresh 동작해도 새로운 데이터를 제대로 못 불러옴.
- YouTube: 모바일에서 백그라운드로 오래 둔 상태에서 되돌아왔을 때 캐싱 데이터를 사용하지 않고 데이터를 모두 새로 불러옴
- YouTube: 모달이 뜨거나 사라졌을 때 백그라운드 썸네일 이미지를 다시 불러옴
- 공통 : YouTube <-> NAVER News 링크 이동시 캐싱된 데이터가 아닌 모든 데이터를 새로 불러옴

TO-DO

- NAVER News: 데이터를 20건 씩 끊어서 받아오기
- NAVER News: 데이터 캐싱
- NAVER News: pull-to-refresh 적용
- NAVER News: sitemap.xml 작성

## 주의사항 및 저작권

이 서비스는 Vercel, Next.js, Notion, Google 그리고 NAVER와 관련이 없습니다.

큐레이터 본인의 생각이 들어간 부분은 언론사의 의견과 상관이 없습니다.

뉴스 콘텐츠에 대한 저작권은 각 언론사에 있습니다.

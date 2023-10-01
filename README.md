# 숏뷰 뉴스 {short.view: news}

YouTube에 업로드 된 뉴스를 요약하고 큐레이터 본인의 생각을 짧게 보여주는 서비스입니다.

5분 미만의 짧은 뉴스를 가져오며, 아주 가끔 그 이상의 뉴스도 가져옵니다.

뉴스 목록은 Google Spreadsheets에서 관리합니다.

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

## Troubleshooting

발견된 문제점

- pull-to-refresh 동작해도 새로운 데이터를 제대로 못 불러옴.
- Startup Image가 존재하나 불러오지 못함.
- PWA앱으로 사용할 때 해더가 상단에 붙음
- PWA앱으로 사용할 때 서버 에러가 뜸.

## 주의사항 및 저작권

이 서비스는 Vercel, Next.js, Google과 관련이 없습니다.

큐레이터 본인의 생각이 들어간 부분은 언론사의 의견과 상관이 없습니다.

뉴스 콘텐츠에 대한 저작권은 각 언론사에 있습니다.

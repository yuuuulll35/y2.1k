# Y2.1K

화성 이주 세계관 소개 페이지. 빌드 없는 정적 HTML.

## 구성

| 파일 | 내용 |
|---|---|
| `index.html` | 수신기 인트로 → 연대기 → 2127 |
| `archive.html` | 용어 · 거주구 도면 · 선발대 명부 |
| `style.css` | 스타일. 색은 맨 위 `:root` |
| `intro.js` | 인트로 연출, 효과음, 연대기 샷 전환 |
| `archive.js` | 거주구 데이터(`ZONES`), 명부(`TEAM`), 슬라이더, 팝업, 도식 애니메이션 |
| `stars.js` | 배경 별밭 |

## 수정 위치

- 교신 대사: `intro.js` 맨 위 `MESSAGES`
- 연대기 본문: `index.html`의 `<main id="log">`
- 거주구 설명: `archive.js`의 `ZONES`
- 선발대 명부: `archive.js`의 `TEAM`
- 용어 카드: `archive.html`의 `<article class="term">`

## 참고

- 폰트는 Google Fonts를 불러옵니다(온라인 필요).
- 인트로 효과음은 WebAudio 합성이며 첫 클릭 뒤부터 납니다.

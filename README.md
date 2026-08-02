# MealFit Web

Vite + React + TypeScript 기반 MealFit 웹 프로젝트입니다.

## Stack

- Yarn
- Vite
- React + TypeScript
- CSS Modules
- ESLint + Prettier

## Scripts

```bash
yarn
yarn dev
yarn build
yarn lint
yarn format
```

## Path alias

`@/` 는 `src/` 를 가리킵니다.

```ts
import App from '@/App'
```

## Folder Structure

```text
src/
  assets/icons/
  components/common/      # 공통 UI
  components/layout/      # Header, Footer, Layout
  constants/
  pages/home/HomePage.tsx
  pages/login/LoginPage.tsx
  pages/signup/SignupPage.tsx
  ...
  styles/
    index.css
    components/common/
    components/layout/
  App.tsx
  main.tsx
```

### 원칙

- **공통 UI** → `components/common/` (`Tag`, `MatchBadge`, `PagePlaceholder`)
- **레이아웃** → `components/layout/`
- **페이지** → `pages/{이름}/` (페이지 전용만)
- **아이콘** → `assets/icons/`
- **로고** → 텍스트 스타일 (헤더/푸터 CSS)
- **스타일** → 실제 CSS가 있을 때만 `styles/`에 같은 경로로 추가

```ts
import styles from '@/styles/components/layout/Header.module.css'
```

## Branch Convention

이슈를 먼저 만든 뒤, 해당 이슈 번호로 브랜치를 생성합니다.

형식: `{커밋유형}/#{이슈번호}/{구현내용}`

예시: `feat/#162/admin-vercel`

| 순서 | 의미 | 예시 |
| --- | --- | --- |
| 1 | 커밋 유형 (소문자) | `feat` |
| 2 | 이슈 번호 | `#162` |
| 3 | 무엇을 구현하는지 | `admin-vercel` |

## Commit Convention

### 1. 커밋 유형 지정

커밋 유형은 영어 대문자로 작성합니다.

| 커밋 유형 | 의미 |
| --- | --- |
| `Feat` | 새로운 기능 추가 |
| `Fix` | 버그 수정 |
| `Docs` | 문서 수정 |
| `Style` | 코드 formatting, 세미콜론 누락, 코드 자체의 변경이 없는 경우 |
| `Refactor` | 코드 리팩토링 |
| `Test` | 테스트 코드, 리팩토링 테스트 코드 추가 |
| `Chore` | 패키지 매니저 수정, 그 외 기타 수정 ex) `.gitignore` |
| `Design` | CSS 등 사용자 UI 디자인 변경 |
| `Comment` | 필요한 주석 추가 및 변경 |
| `Rename` | 파일 또는 폴더 명을 수정하거나 옮기는 작업만인 경우 |
| `Remove` | 파일을 삭제하는 작업만 수행한 경우 |
| `!BREAKING CHANGE` | 커다란 API 변경의 경우 |
| `!HOTFIX` | 급하게 치명적인 버그를 고쳐야 하는 경우 |

### 2. 제목과 본문을 빈 행으로 분리

- 커밋 유형 이후 제목과 본문은 한글로 작성하여 내용이 잘 전달될 수 있도록 할 것
- 본문에는 변경한 내용과 이유 설명 (어떻게보다는 무엇 & 왜를 설명)

### 3. 제목 첫 글자는 대문자로, 끝에는 `.` 금지

### 4. 제목은 영문 기준 50자 이내로 할 것

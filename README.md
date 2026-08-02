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

## CSS Modules

컴포넌트 스타일은 `ComponentName.module.css` 로 작성합니다.

```ts
import styles from './Button.module.css'
```

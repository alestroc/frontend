# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Type-check (tsc -b) then build for production
npm run lint      # Run ESLint across the project
npm run preview   # Preview the production build locally
```

There is no test runner configured.

## Stack

- **React 19** with TypeScript 5.9 (strict mode)
- **Vite 8** with `@vitejs/plugin-react` using Oxc for JSX transforms
- **Tailwind CSS** (PostCSS 7 compatible) — utility classes plus custom CSS variables for light/dark theming
- No routing library, no state management library

## Architecture

This is a single-page app shell. Entry: `index.html` → `src/main.tsx` → `src/App.tsx`.

- `src/index.css` — Tailwind directives + CSS custom properties for theming (light/dark via `prefers-color-scheme`)
- `src/App.css` — Component-level styles with responsive and dark-mode variants
- `src/assets/` — Static images (hero.png, react.svg, vite.svg)
- `public/` — Favicon and icon sprites

## TypeScript Config

`tsconfig.app.json` targets ES2023, uses `"moduleResolution": "bundler"`, and enables `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch`. Fix all TypeScript errors before committing — `npm run build` will fail otherwise.

## ESLint

Uses ESLint 9 flat config (`eslint.config.js`). Rules include `typescript-eslint/recommended`, `react-hooks/recommended`, and `react-refresh`. Run `npm run lint` to check; there is no auto-fix step configured.

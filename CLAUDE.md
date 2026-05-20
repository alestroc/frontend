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
- **Tailwind CSS v4** (`@import "tailwindcss"` in `src/index.css`) — utility classes only, dark theme forced globally (no `prefers-color-scheme` media query)
- **@dnd-kit/react** — drag & drop for sortable favorites
- **@mui/icons-material** — icon set (Add, Clear, etc.)
- **axios** — used only in `Login.tsx`; the rest of the app uses native `fetch`
- No routing library, no state management library

## Architecture

Single-page app. Entry: `index.html` → `src/main.tsx` → `src/App.tsx`. The app is dark-theme only (CSS variables in `:root` of `index.css` with `color-scheme: dark`).

### Folder layout

```
src/
├── App.tsx                  # Root orchestrator: auth check, data loading, error toast, modal
├── main.tsx                 # ReactDOM entry
├── index.css                # Tailwind import + CSS variables + global resets
├── config.ts                # Numeric constants (DEFAULT_MAX_HOURS, COMBOBOX_MAX_VISIBLE, TOAST_TTL_MS, ...)
├── types.ts                 # Shared TS interfaces (ApiSettings, TimeEntry, Commessa, Articolo, Favorite, ...)
├── components/
│   ├── Login.tsx            # Login form (uses axios + hardcoded backend URL)
│   ├── Sidebar.tsx          # Left nav with collapse, view picker, logout
│   ├── calendar/            # Calendar.tsx orchestrates MonthView/WeekView/DayView + CalendarCell + EntryBadge + CalendarNav
│   ├── favorites/           # Favorites.tsx + SortableItem.tsx (drag-and-drop via @dnd-kit)
│   └── modal/               # Modal.tsx assembler → SingleDayForm | MultiDayForm; shared EntryRowEditor, Combobox, EntryList, ConfirmDialog, SwitchButton
├── hooks/
│   ├── useEntriesByDay.ts          # Groups TimeEntry[] by YYYY-MM-DD
│   ├── useNeededs.ts               # Fetches commesse + articoli
│   ├── useSingleDayEntryForm.ts    # State + validate + save for "1 day, N commesse" mode
│   └── useMultiDayEntryForm.ts     # State + validate + save for "N days, 1 commessa" mode
├── functions/
│   ├── config.ts            # BASE_URL, DAYS_OF_WEEK, MONTHS, inputClass
│   ├── functions.ts         # checkIsLogged, checkLocalStorageData, deleteLocalStorageData, dateToKey, getWeekStart, createEmptyRow
│   ├── entries.ts           # getTimeEntries, addTimeEntries, addTimeEntriesByDays
│   ├── favorites.ts         # getFavorites, addFavorite, removeFavorite, reorderFavorite
│   ├── neededs.ts           # getNeededs (commesse + articoli)
│   └── settings.ts          # Reads window.appsettings injected by GET /api/getSettings
├── storage/
│   └── localData.ts         # readLocalData / writeLocalData / clearLocalData (localStorage wrapper around token+user+localid)
└── assets/                  # Logo + leftover Vite/React assets
```

### Auth & data flow

1. `Login.tsx` POSTs credentials to `http://studium.backend/api/login`, stores `{token, user, localid}` via `writeLocalData`.
2. `App.tsx` on mount calls `checkIsLogged()` (POST `/getNeededs` with the token); on success, fires `Promise.all` to load entries, settings, favorites, commesse, articoli.
3. All authed `fetch` calls read `{token, user, localid}` from `localStorage`. Token expires after 8h backend-side.
4. `processedFavorites` is derived in `App.tsx` via `useMemo` joining `rawFavorites` with `commesse` to resolve names.

### Modal

`Modal.tsx` is a thin assembler that switches between `SingleDayForm` and `MultiDayForm` via a `SwitchButton`. Both forms share `EntryRowEditor` (the row with commessa + articolo comboboxes; `isSingleDay` toggles the ore/nota inputs). Both have a sticky footer pinned at the bottom of the modal with `mt-auto sticky bottom-0`.

### Calendar

`Calendar.tsx` renders one of three views based on the `view` prop (`"Mensile"` | `"Settimanale"` | `"Giornata"`). Each view receives a `renderCell` render-prop that produces a `CalendarCell`. `CalendarCell` shows date number, `EntryBadge`s, and a total-hours footer (green at exactly maxHours, red otherwise). When used inside the modal (`isModal=true`), cells hide entries and badges to save space.

`EntryBadge` adapts to the view: truncated single line in `Mensile`, wrapped in `Settimanale`, multi-info inline row in `Giornata`.

### Accessibility

- `App.tsx` wraps content in `<main>` and the sidebar in `<nav>` with an h1.
- `Combobox` implements the WAI-ARIA combobox pattern (role, aria-expanded, aria-controls, aria-activedescendant, listbox/option).
- Calendar navigation buttons have explicit `aria-label`s; the chevrons are `aria-hidden`.
- Sortable favorite items have aria-labels on delete + drag handles.

## TypeScript Config

`tsconfig.app.json` targets ES2023, uses `"moduleResolution": "bundler"`, and enables `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch`. Fix all TypeScript errors before committing — `npm run build` will fail otherwise.

## ESLint

ESLint 9 flat config (`eslint.config.js`). Rules: `typescript-eslint/recommended`, `react-hooks/recommended`, `react-refresh`. Run `npm run lint`; no auto-fix step configured.

## Conventions

- UI strings are in Italian.
- All code comments and JSDoc are in Italian too.
- No `App.css` — global styles live in `src/index.css`; everything else is Tailwind utilities.
- DB-free frontend: state is local (`useState` / custom hooks), persistence is `localStorage` only.

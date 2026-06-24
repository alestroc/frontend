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
- **Tailwind CSS v4** (`@import "tailwindcss"` in `src/index.css`) — utility classes + custom design tokens via `@theme` block
- **@dnd-kit/react** — drag & drop for sortable favorites
- **@mui/icons-material** — icon set (Add, Clear, Star, Logout, ChevronLeft/Right, etc.)
- Native `fetch` for all HTTP calls (no axios)
- No routing library, no state management library

## Architecture

Single-page app. Entry: `index.html` → `src/main.tsx` → `src/App.tsx`. Supports light and dark themes (toggled by adding `.light` class on `<html>`).

### Folder layout

```
src/
├── App.tsx                  # Root orchestrator: auth check, data loading, error toast, modal, page routing (calendar | stats)
├── main.tsx                 # ReactDOM entry
├── index.css                # Tailwind import + @theme palette + .light override + typography setup
├── config.ts                # Numeric constants (DEFAULT_MAX_HOURS, COMBOBOX_MAX_VISIBLE, TOAST_TTL_MS, ...)
├── types.ts                 # Shared TS interfaces (ApiSettings, TimeEntry, Commessa, Articolo, Favorite, ...)
├── components/
│   ├── Login.tsx            # Login form
│   ├── Sidebar.tsx          # Left nav with collapse, action buttons, logout
│   ├── Logo.tsx             # Unified SVG logo (pictogram + "STUDIUM GROUP" text), uses currentColor
│   ├── ThemeToggle.tsx      # Sun/moon button, toggles .light on <html>, persists in localStorage
│   ├── calendar/            # Calendar.tsx orchestrates MonthView/WeekView/DayView + CalendarCell + EntryBadge + CalendarNav (select view picker + ThemeToggle)
│   ├── favorites/           # Favorites.tsx + SortableItem.tsx (drag-and-drop via @dnd-kit)
│   ├── modal/               # Modal.tsx assembler → SingleDayForm | MultiDayForm; shared EntryRowEditor, Combobox, EntryList, ConfirmDialog, SwitchButton
│   └── statistics/          # Statistics.tsx orchestrator → ProgressGoal (week/month progress bars), ExploreCommessa (interactive filter on entries), DownloadReport (xlsx export form)
├── hooks/
│   ├── useEntriesByDay.ts          # Groups TimeEntry[] by YYYY-MM-DD
│   ├── useNeededs.ts               # Fetches commesse + articoli
│   ├── useSingleDayEntryForm.ts    # State + validate + save for "1 day, N commesse" mode
│   └── useMultiDayEntryForm.ts     # State + validate + save for "N days, 1 commessa" mode
├── functions/
│   ├── config.ts            # BASE_URL, DAYS_OF_WEEK, MONTHS, inputClass
│   ├── functions.ts         # checkIsLogged, checkLocalStorageData, deleteLocalStorageData, dateToKey, getWeekStart, createEmptyRow
│   ├── entries.ts           # getEntries, addTimeEntries, addTimeEntriesByDays, exportTimeEntries (blob download)
│   ├── favorites.ts         # getFavorites, addFavorite, removeFavorites, reorderFavorite
│   ├── neededs.ts           # getNeededs (commesse + articoli)
│   └── settings.ts          # Reads window.appsettings injected by GET /api/getSettings
├── storage/
│   └── localData.ts         # readLocalData / writeLocalData / clearLocalData (localStorage wrapper around token+user+localid)
└── assets/                  # logo.svg + leftover Vite assets
```

### Auth & data flow

1. `Login.tsx` POSTs credentials to `/api/login`, stores `{token, user, localid}` via `writeLocalData`.
2. `App.tsx` on mount calls `checkIsLogged()` (POST `/getNeededs` with the token); on success, fires `Promise.all` to load entries, settings, favorites, commesse, articoli.
3. All authed `fetch` calls read `{token, user, localid}` from `localStorage`. Token expires after 8h backend-side.
4. `processedFavorites` is derived in `App.tsx` via `useMemo` joining `rawFavorites` with `commesse` to resolve names.
5. **First-access guard**: if `readLocalData()` is null (never logged in), no "Sessione scaduta" toast is shown — only if there's prior session data that turned invalid.

### Page routing

No router — `App.tsx` holds `currentPage: "calendar" | "stats"` state. Sidebar buttons swap pages; sidebar items change dynamically ("Registra Oggi" on calendar, "Calendario" on stats).

### Modal

`Modal.tsx` is a thin assembler that switches between `SingleDayForm` and `MultiDayForm` via a `SwitchButton`. Both forms share `EntryRowEditor` (the row with commessa + articolo comboboxes; `isSingleDay` toggles the ore/nota inputs). Both have a sticky footer pinned at the bottom of the modal with `mt-auto sticky bottom-0`.

`EntryList` (used in SingleDayForm) shows the existing entries for the day with a star button per row: yellow if the (commessa, articolo) pair is already a favorite (click removes), gray otherwise (click adds).

### Calendar

`Calendar.tsx` renders one of three views based on the `view` prop (`"Mensile"` | `"Settimanale"` | `"Giornata"`). Each view receives a `renderCell` render-prop that produces a `CalendarCell`. `CalendarCell` shows date number (circled if today), `EntryBadge`s, and a total-hours footer (green at exactly maxHours, red otherwise). When used inside the modal (`isModal=true`), cells hide entries and badges to save space.

`CalendarNav` includes the `<select>` to switch view (only outside modal) and the `ThemeToggle` button.

`EntryBadge` adapts to the view: truncated single line in `Mensile`, wrapped in `Settimanale`, multi-info inline row in `Giornata`.

### Statistics page

`Statistics.tsx` orchestrates three sections:
- **Weekly + Monthly ProgressGoal** cards — current hours vs target. Target is computed from working days × `settings.maxHours`; for the monthly target the upper bound is "today" (not end-of-month), so 100% means "in pari fino a oggi".
- **ExploreCommessa** — interactive filter on all `entries` in memory. Picks commessa via `Combobox`, optional articolo filter, date range (`Dal/Al` inputs + quick preset buttons), shows aggregates (tot ore, prima/ultima registrazione, conteggio) and an expandable table.
- **DownloadReport** — date range + optional commessa Combobox + Scarica Excel button. Calls `exportTimeEntries(from, to, commessa?)` which downloads a blob xlsx via synthetic link (`URL.createObjectURL` + click).

### Theming

The app uses a design-token system based on Tailwind v4's `@theme` block in `index.css`. Tokens are organized in three families:

- **A) THEME-BOUND** — change with theme (sfondi, testo, bordi). Override in `.light` block. Examples: `--color-base`, `--color-surface`, `--color-surface-raised`, `--color-surface-strong`, `--color-primary`, `--color-secondary`, `--color-muted`, `--color-divider`, `--color-divider-soft`.
- **B) FIXED** — identical in both themes (accent, semantic states, brand). Examples: `--color-accent`, `--color-accent-hover`, `--color-accent-soft`, `--color-success`, `--color-warning`, `--color-danger`, `--color-danger-soft`, `--color-danger-strong`, `--color-favorite`.
- **C) FORM-FIXED** — input surfaces always light (white islands on dark theme too). Examples: `--color-form`, `--color-form-elevated`.

Token names map to Tailwind utilities via prefix removal: `--color-primary` → `text-primary` / `bg-primary` / `border-primary` / `ring-primary`. Use semantic class names in components (`bg-surface text-primary border-divider`), not hardcoded slate values.

`ThemeToggle` (in `CalendarNav`) flips the `.light` class on `<html>` and saves the choice in `localStorage["app-theme"]`. On boot the saved preference is reapplied before the first render.

**Caveat — h1/h2 in index.css**: there are global `h1, h2` rules in the file (font-family, font-weight, font-size, margin). They live OUTSIDE Tailwind's `@layer`, so they win the cascade over `text-X` utility classes. Avoid adding `color` to those global rules (or move them into `@layer base`) — otherwise Tailwind text color utilities on h1/h2 will be silently ignored.

### Accessibility

- `App.tsx` wraps content in `<main>` and the sidebar in `<nav>`.
- `Combobox` implements the WAI-ARIA combobox pattern (role, aria-expanded, aria-controls, aria-activedescendant, listbox/option).
- Calendar navigation buttons have explicit `aria-label`s; the chevrons are `aria-hidden`.
- Sortable favorite items have aria-labels on delete + drag handles.
- `Logo` has `role="img"` and `aria-label="Studium Group"`.
- `ThemeToggle` has dynamic `aria-label` based on current theme.

## TypeScript Config

`tsconfig.app.json` targets ES2023, uses `"moduleResolution": "bundler"`, and enables `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch`. Fix all TypeScript errors before committing — `npm run build` will fail otherwise.

## ESLint

ESLint 9 flat config (`eslint.config.js`). Rules: `typescript-eslint/recommended`, `react-hooks/recommended`, `react-refresh`. Run `npm run lint`; no auto-fix step configured.

## Conventions

- UI strings are in Italian.
- All code comments and JSDoc are in Italian too.
- Components use Tailwind design tokens (`bg-base`, `text-primary`, etc.) rather than raw color classes (`bg-slate-900`, `text-white`). New components should follow the same convention so they automatically follow the theme.
- DB-free frontend: state is local (`useState` / custom hooks), persistence is `localStorage` only.
- Commit messages use a mix of conventional prefixes (`feat:`, `fix:`, `style:`, `chore:`, `refactor:`) + Italian descriptions.

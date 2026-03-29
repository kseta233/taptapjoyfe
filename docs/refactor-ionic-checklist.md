# Ionic Refactor Checklist

Source plan: [docs/refactor-ionic-plan.md](docs/refactor-ionic-plan.md)
Last updated: 2026-03-29 (Phase 7 + Tailwind-off start verified)

## Current Step

- Active: Phase 7 final validation
- Why: native projects are added/synced and run abstractions are validated; simulator/device smoke tests remain manual.

## Phase Status

- [x] Phase 1 - Dependencies and bootstrap
  - [x] React downgraded to 18.x
  - [x] Ionic and Capacitor dependencies installed
  - [x] Capacitor config file added
  - [x] Tailwind Vite plugin removed from [vite.config.ts](vite.config.ts)

- [x] Phase 2 - Theme setup
  - [x] Ionic theme variables added in [src/theme/variables.css](src/theme/variables.css)
  - [x] Animations centralized in [src/theme/animations.css](src/theme/animations.css)
  - [x] Ionic CSS imports wired in [src/main.tsx](src/main.tsx)
  - [x] Duplicate/unused Tailwind-only animation utilities removed
  - [x] Tailwind directives fully stripped from [src/styles/index.css](src/styles/index.css)

- [~] Phase 3 - App shell and routing
  - [x] IonApp + IonReactRouter + IonRouterOutlet setup in [src/App.tsx](src/App.tsx)
  - [x] Route map implemented (/ /lobby /room/:roomId /race /tug /result /tug-result)
  - [x] App-level reconnect and error overlays migrated to IonToast
  - [x] Route-level guard pages added for invalid states and unknown routes
  - [ ] GameContext provider introduced

- [x] Phase 4 - State machine to URL navigation
  - [x] Navigation moved into hook/domain (`useGame` drives `navigate`)
  - [x] Route sync moved away from App-level replace logic

- [x] Phase 5 - Screen migration
  - [x] HomeScreen presentation migrated
  - [x] GameLobbyScreen presentation migrated
  - [x] RoomScreen presentation migrated
  - [x] RaceScreen presentation migrated
  - [x] ResultScreen presentation migrated
  - [x] TugWarScreen presentation migrated
  - [x] TugWarResultScreen presentation migrated
  - [~] Tailwind utility usage minimized (still present by design for game visuals)

- [x] Phase 6 - Component migration
  - [x] PlayerCard migrated
  - [x] ProgressTrack migrated
  - [x] Countdown migrated
  - [x] RoomCode migrated
  - [x] TapButton haptics migrated to Capacitor fallback flow
  - [x] Legacy design-system module deleted

- [~] Phase 7 - Capacitor native build
  - [x] [capacitor.config.ts](capacitor.config.ts) present
  - [x] `npx cap add ios`
  - [x] `npx cap add android`
  - [x] `npx cap sync`
  - [x] `npx cap open ios` (workspace opens)
  - [x] `npx cap open android` (project path opens)
  - [x] Run abstractions added in [package.json](package.json): `run:web`, `run:pwa`, `run:ios`, `run:android`, `sync:native`
  - [x] `run:pwa` script validated
  - [ ] Device/simulator smoke test

- [~] Phase 8 - Cleanup and validation
  - [x] DesignSystemPreviewScreen removed
  - [x] Legacy design-system removed
  - [x] `npm run build` passes (verified 2026-03-29)
  - [x] Basic route smoke pass done in dev server
  - [ ] End-to-end game flow smoke test (home -> lobby -> room -> game -> result)

## Verification Snapshot (2026-03-29)

- [x] Build verification: `npm run build` passes
- [x] PWA verification: `npm run preview` serves production app (home screen visible)
- [x] Router verification: [src/App.tsx](src/App.tsx) contains `IonRouterOutlet` and `RouteGuard`
- [x] Phase 4 verification: navigation sync now lives in [src/hooks/useGame/domain.ts](src/hooks/useGame/domain.ts) and route mapping helper in [src/hooks/useGame/data.ts](src/hooks/useGame/data.ts)
- [x] Legacy DS verification: no remaining imports from deleted design-system module
- [x] Native setup verification: [ios](ios) and [android](android) projects exist and sync succeeded
- [x] Tailwind plugin removal verification: [vite.config.ts](vite.config.ts) no longer imports `@tailwindcss/vite`
- [x] Tailwind directive removal verification: [src/styles/index.css](src/styles/index.css) no longer imports Tailwind

## Next Actions

1. Run simulator/device smoke tests from Xcode and Android Studio, then mark Phase 7 complete.
2. Continue replacing compatibility utility classes in [src/styles/utilities.css](src/styles/utilities.css) with screen-scoped CSS as follow-up hardening.

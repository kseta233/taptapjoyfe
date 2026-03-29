
Analyzing your answers...

Q: What's the target platform for this Ionic app?
A: Both - Web deploy stays + Capacitor native builds side-by-side
Q: Ionic requires React Router. How should we handle the current phase-based state machine?
A: Migrate to URL routing - Each game phase becomes a real URL (/lobby, /room/:id, /race, etc.) — cleaner, proper Ionic nav stack
Q: The app has a custom dark design system (Button, Card, Badge, etc). What should happen to it?
A: Replace with Ionic components + Ionic dark theme - IonButton, IonCard, IonBadge, etc. — fully Ionic UI, lose the custom DS
Now I have enough context to create a comprehensive plan. Let me save it and present it.

Created memory file plan.md

Plan: Migrate FE to Ionic Framework
What & Why: Swap the custom React + Tailwind design system for @ionic/react components with Ionic dark theme, migrate the phase-based state machine to proper URL routing (required by Ionic), and add Capacitor for iOS/Android native distribution alongside the existing Vercel web deploy.

Phases

Phase 1 — Dependencies & Bootstrap
Downgrade react + react-dom to ^18 (Ionic does not officially support React 19 — blocking risk)
Add @ionic/react, @ionic/react-router, ionicons
Add react-router-dom@6 (peer dep for IonReactRouter)
Add @capacitor/core, @capacitor/cli, @capacitor/haptics
Add @capacitor/ios, @capacitor/android
Remove @tailwindcss/vite from vite.config.ts
Phase 2 — Theme Setup
Create src/theme/variables.css — map existing dark design tokens to Ionic CSS variables:
--ion-background-color: #0a0e1a, --ion-color-primary: #6366f1, --ion-card-background: #1a2035, etc.
Create src/theme/animations.css — relocate the 7 @keyframes blocks and .animate-* / .snapshot-mode classes (orphaned from Tailwind removal)
Strip Tailwind directives from index.css; keep only base resets (touch-action, user-select, overflow: hidden, -webkit-tap-highlight-color)
Import both theme files in main.tsx alongside Ionic core CSS bundles
Phase 3 — App Shell (IonApp + Routing)
Create src/context/GameContext.tsx — wraps useGame() and exposes via React Context (parallel with Phase 2)
Create src/context/useGameContext.ts — consumer hook
Rewrite App.tsx: IonApp > GameContextProvider > IonReactRouter > IonRouterOutlet with routes:
Path	Screen
/	HomeScreen
/lobby	GameLobbyScreen
/room/:roomId	RoomScreen
/race	RaceScreen
/tug	TugWarScreen
/result	ResultScreen
/tug-result	TugWarResultScreen
Keep the existing reconnect banner + error toast in the app shell as Ionic toast/alert overlays (IonToast)
Phase 4 — State Machine → URL Navigation
Accept a navigate function in useGame domain; replace phase transitions with navigate() calls (depends on Phase 3):
selectGame → navigate('/lobby')
room.joined event → navigate('/room/:id')
room.state { status: playing } → navigate('/race') or navigate('/tug')
race.finished / tug.finished → navigate('/result') or navigate('/tug-result')
backToHome / leaveRoom → navigate('/')
Game state (room, raceProgress, tugState, etc.) moves to GameContext, read in each screen via useGameContext()
Phase 5 — Screen Migration (can parallelise all 7)
For each of the 7 screens, update presentation.tsx:

Wrap in IonPage > IonHeader (optional) > IonContent
Replace <Button> → <IonButton color="primary" fill="solid|outline|clear">
Replace <Card> → <IonCard><IonCardContent>
Replace <Badge> → <IonBadge color="success|warning|danger...">
Replace <Input> → <IonInput fill="outline" label="...">
Replace <Typography> → <IonText> wrapping standard headings / <IonLabel>
Remove all Tailwind utility classes; switch to inline styles or scoped CSS modules for custom layout
Preserve animate-* classes (still valid from animations.css)
HomeScreen: IonPage + IonContent + IonButton appearance="tile" equivalent → IonButton fill="solid" with custom color
GameLobbyScreen: IonList > IonItem for room rows; IonSearchbar optional
RoomScreen: IonList > IonItem for player list, IonChip or IonBadge for ready status
RaceScreen: Progress bars stay custom CSS (no Ionic equivalent); TapButton stays custom
TugWarScreen: Fully custom layout (rope viz) stays custom; IonPage wrapper only
ResultScreen: IonList > IonItem for rankings
Phase 6 — Component Migration (parallel with Phase 5)
PlayerCard: keep structure, replace Card/Badge/Typography with Ionic equivalents
ProgressTrack: keep progress bar logic, replace Card with IonCard
Countdown: no changes needed (pure CSS animation overlay)
TapButton/domain.ts: replace navigator.vibrate(10) → Haptics.impact({ style: ImpactStyle.Light }) from @capacitor/haptics
RoomCode: replace Button with IonButton
Delete src/design-system/ folder after all usages are migrated
Phase 7 — Capacitor Native Build
Run npx cap init "TapTapJoy" "com.tapTapJoy.app" — creates capacitor.config.ts pointing webDir: 'dist'
Update vite.config.ts — no changes needed (already outputs to dist/)
Run npx cap add ios && npx cap add android
Run npm run build && npx cap sync — copies web assets to native projects
Test on iOS Simulator + Android Emulator
Phase 8 — Cleanup & Validation
Delete src/design-system/ folder
Run npm run build → must be ✓ zero errors
Test all 7 game phases in browser
npx cap open ios + npx cap open android — smoke test on device
Relevant files

package.json — dependency updates (Phase 1)
vite.config.ts — remove Tailwind plugin
main.tsx — Ionic CSS imports + IonApp
App.tsx — full rewrite with IonReactRouter
domain.ts — navigate integration
index.css — strip Tailwind, keep resets
fe/src/theme/ (new) — Ionic variable overrides + animations
fe/src/context/ (new) — GameContext
All 8 screen presentation.tsx files
All 5 component files under src/components/
design-system — delete in Phase 8
Verification

npm run build → zero TypeScript and Vite errors after each phase
npm run dev → browser smoke test: complete game flow (home → lobby → room → race → result → home)
Ionic dark theme applied: no white flash, correct --ion-background-color on all screens
Custom animations (animate-countdown-pop, animate-float, animate-tap-scale) still work
Haptics: test on real device or simulator after Capacitor build
npx cap sync && npx cap open ios → app loads, plays full game round
Further Considerations

React 19 downgrade — Ionic's React bindings are peer-tested against React 18. Staying on 19 risks subtle hook compatibility bugs. Recommend react@18.3.1. If keeping 19, this must be tested carefully before Phase 5.
Tailwind removal scope — Phases 5+6 touch every single JSX file. This is the riskiest phase in terms of regressions. Recommend doing it screen-by-screen with a build check after each, rather than all-at-once.
DesignSystemPreviewScreen — This screen exists purely to preview the custom DS. Once the DS is deleted it becomes obsolete. Plan includes deleting it in Phase 8, unless you want to rebuild it to showcase Ionic component variants instead.
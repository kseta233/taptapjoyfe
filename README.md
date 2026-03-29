# TapTapJoy FE

## Environment flavors

The frontend uses Vite environment files from this folder (`fe/`).

- Development values are in [`.env.development`](.env.development)
- Production values are in [`.env.production`](.env.production)
- Template reference is in [`.env.example`](.env.example)

Supported variables:

- `VITE_WS_URL`: WebSocket endpoint (required)
- `VITE_HTTPS_URL`: HTTP/HTTPS API endpoint (optional, preferred)
- `VITE_API_URL`: backward-compatible alias for `VITE_HTTPS_URL`

If `VITE_HTTPS_URL`/`VITE_API_URL` is not set, the app derives API URL from `VITE_WS_URL`.

## Build and run commands

Run all commands from `fe/`.

- Web dev server: `npm run run:web`
- PWA preview (development flavor): `npm run run:pwa:dev`
- PWA preview (production flavor): `npm run run:pwa:prod`
- iOS (development flavor): `npm run run:ios:dev`
- iOS (production flavor): `npm run run:ios:prod`
- Android (development flavor): `npm run run:android:dev`
- Android (production flavor): `npm run run:android:prod`
- Android APK/AAB pipeline flavors:
   - `npm run build:android:dev` -> `devDebug` variant (`com.taptapjoy.app.dev`)
   - `npm run build:android:prod` -> `prodRelease` variant (`com.taptapjoy.app`)

## Native flavor separation

Android flavor mapping:

- `dev` flavor
   - `applicationId`: `com.taptapjoy.app.dev`
   - app name: `TapTapJoy Dev`
   - icon distinction: darker launcher background color
   - intended for local/backend development
- `prod` flavor
   - `applicationId`: `com.taptapjoy.app`
   - app name: `TapTapJoy`
   - intended for production builds

iOS flavor mapping (configuration based):

- `Debug` configuration (development flavor)
   - bundle id: `com.taptapjoy.app.dev`
   - display name: `TapTapJoy Dev`
   - icon distinction: `DEV` banner (AppIconDev)
- `Release` configuration (production flavor)
   - bundle id: `com.taptapjoy.app`
   - display name: `TapTapJoy`

When opening in Xcode via `npm run run:ios:dev` or `npm run run:ios:prod`, select:

- Debug for development flavor
- Release for production flavor (Archive/TestFlight/App Store)

## Changing endpoints

1. Edit `.env.development` for local/dev backend endpoints.
2. Edit `.env.production` for production endpoints.
3. Rebuild and sync before opening native projects:
   - iOS: `npm run run:ios:dev` or `npm run run:ios:prod`
   - Android: `npm run run:android:dev` or `npm run run:android:prod`
4. For Android Studio, choose Build Variant:
   - `devDebug` for development flavor
   - `prodRelease` for production flavor

Vite injects `VITE_*` at build time, so any endpoint change requires a new build and `cap sync` for native apps.

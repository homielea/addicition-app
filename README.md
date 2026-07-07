# Relapse Autopsy

An addiction/behavior-change app built around one idea: **your slip is intel, not
failure.** Right after a slip, a 60-second, shame-free, 3-step debrief (trigger →
underlying feeling → optional note) feeds a personal **danger map** of your top
triggers, underlying feelings, and risky times of day — which then drives prevention
nudges. The progress metric ("insight reps") only ever goes up; logging a slip
*increases* it. There are no streaks and nothing to reset.

Built from the concept spec in
[`docs/concept-specs/relapse-autopsy.md`](docs/concept-specs/relapse-autopsy.md).
The full set of brainstorm concept specs lives in
[`docs/concept-specs/`](docs/concept-specs/).

## Stack

- [Expo](https://expo.dev) SDK 57 · React Native · TypeScript (strict)
- `expo-router` for navigation
- `zustand` (+ `persist`) for state, persisted locally to AsyncStorage — no backend,
  no accounts, data never leaves the device

## MVP feature map (spec → code)

| Spec item | Where |
| --- | --- |
| Low-friction "I slipped — log it" entry | `app/index.tsx` (big primary button) |
| 60-second 3-step autopsy | `app/autopsy.tsx` |
| Danger map: ranked triggers + risky times | `app/danger-map.tsx`, `src/insights.ts` |
| Prevention nudges derived from the map | `app/nudges.tsx`, `src/insights.ts` |
| No-reset "insight reps" metric | `src/store.ts` (`insightReps`, append-only) |
| Onboarding (behavior pick + ground rules) | `app/onboarding.tsx` |

## Run it

```bash
npm install
npm start        # Expo dev server (scan QR with Expo Go)
npm run web      # run in the browser
npm run typecheck
```

## End-to-end verification

The browser journey that verified this app during development is committed,
not ephemeral. With the app running on web:

```bash
npx expo start --web --port 8090   # terminal 1
npm run e2e                          # terminal 2
```

`e2e/verify.mjs` drives the full first-run journey in a real browser and
asserts the product's promises, not just that screens render. `PORT`
overrides the port; `PW_CHROMIUM` points at a chromium binary when
playwright's own download isn't available.

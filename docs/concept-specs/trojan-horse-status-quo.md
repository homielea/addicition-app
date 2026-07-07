# Trojan Horse — Status-Quo Snapshot (for Fable 5)

**One-liner:** A "quit the habit" app for men that fixes the habit by quietly building
emotional regulation — therapy's results, none of therapy's branding.

**Status:** This is the concept we're actively building. Unlike the other specs (concept
stage), Trojan Horse already has a full doc package + scaffold. This file is a *snapshot* of
where it stands right now, so Fable 5 can extend it without contradicting decisions already made.

## Decisions locked
- **Concept:** #1 pick from the verified niche ranking (men's emotional health, non-therapy framing).
- **Stack:** Expo (SDK 56) + React Native + TypeScript. Private repo (`trojan-horse`, codename).
- **Wedge keyword:** "how to stop watching porn" / "porn addiction help" (~30,749/mo, US).
- **Product principles (non-negotiable):** no "therapy" language; the self-awareness metric is
  append-only and never resets; slips count as data; performance/coach framing; privacy/local-first.

## What already exists
- **Scaffold + runnable core-loop skeleton** (`App.tsx`): anti-streak "self-awareness reps"
  counter + urge button → 60-second intervention. Typechecks clean.
- **Full agent-ready doc package** (`docs/`): PRD, ARCHITECTURE (expo-router, Zustand,
  AsyncStorage, Anthropic-via-backend), DESIGN system, BACKLOG (T-001→T-012), and per-feature
  specs F1–F8.
- **AGENTS.md** repo instructions (imported by CLAUDE.md).

## Feature map
- **MVP:** F1 urge loop · F2 anti-streak metric · F3 relapse autopsy + danger map · F4
  onboarding · F5 local persistence.
- **Fast-follow (v1.1):** F6 AI late-night check-in (incl. **F6a Future-Self Anchor** — the
  check-in anchors to the man the user says he's becoming, not to a slip count) · F7 gym-framed
  paywall (RevenueCat) · F8 conditioning level.

## Open questions (founder to decide)
Final product name (retire "Trojan Horse"); exact pricing; the AI model id at build time
(default: latest Anthropic Claude via backend proxy); backend (Supabase assumed).

## Fable 5 build prompt
> Trojan Horse is a men's habit-quitting app that smuggles in emotional-regulation skills under
> performance framing (never says "therapy"; the progress metric only goes up; slips count as
> data). Its signature v1.1 feature is an 11pm AI check-in anchored to the user's self-authored
> "future self." Given this locked concept (paste the sections above), do ONE of: (a) generate
> 10 product names + taglines to replace the "Trojan Horse" codename; (b) write a realistic
> sample 11pm check-in transcript that uses the future-self anchor as curiosity, never shame;
> or (c) design the onboarding that sets up the anchor capture downstream. Voice: sharp male
> friend, coach not clinician, zero wellness-speak.

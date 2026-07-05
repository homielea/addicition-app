# Relapse Autopsy

An addiction/behavior-change app built around one idea: **a slip is the single most
valuable data event in recovery — not a failure.**

Right after a slip, the app runs a fast, shame-free 60-second debrief (trigger →
underlying feeling → optional note). Those debriefs aggregate into a personal
**danger map** of your top triggers and riskiest times of day, which powers
prevention nudges. The progress metric — **insight reps** — only ever goes up:
slips count as data, so there is no streak to shatter and no reason to delete
the app on a bad night.

Built from the concept spec in [`docs/specs/relapse-autopsy.md`](docs/specs/relapse-autopsy.md).

## Running the app

The app lives in [`app/`](app/) — a local-first React + TypeScript web app
(Vite). All data stays in the browser (localStorage); there is no backend and
no account.

```bash
cd app
npm install
npm run dev       # dev server
npm run build     # production build
```

## Product principles

- **No shame, ever.** Logging a slip is one tap and the copy never scolds.
- **The metric only goes up.** Insight reps count check-ins *and* slips — a slip
  is a rep, because you learned something.
- **The map must do something.** The danger map isn't journaling; it drives
  concrete prevention nudges for your top triggers and risky hours.
- **Private by default.** Local-first, no real names, no cloud.

## Docs

`docs/specs/` contains the full set of product-concept specs from the brainstorm
session this app came out of (menopause/midlife, lucid dreaming, emotional
intelligence, and behavioral-addiction concepts, plus a verified niche ranking).
See [`docs/specs/README.md`](docs/specs/README.md) for the index. This repo
implements **Relapse Autopsy**; the Trojan Horse concept is being built
separately in its own repo.

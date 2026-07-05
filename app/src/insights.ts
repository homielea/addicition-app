import type { DebriefEvent } from './types'

export interface RankedItem {
  label: string
  count: number
  share: number // 0..1 of all events
}

export interface TimeBand {
  label: string
  startHour: number // inclusive, 24h
  count: number
}

export const TIME_BANDS: ReadonlyArray<{ label: string; startHour: number }> = [
  { label: '12–3am', startHour: 0 },
  { label: '3–6am', startHour: 3 },
  { label: '6–9am', startHour: 6 },
  { label: '9am–12', startHour: 9 },
  { label: '12–3pm', startHour: 12 },
  { label: '3–6pm', startHour: 15 },
  { label: '6–9pm', startHour: 18 },
  { label: '9pm–12', startHour: 21 },
]

function rank(events: DebriefEvent[], pick: (e: DebriefEvent) => string): RankedItem[] {
  const counts = new Map<string, number>()
  for (const e of events) {
    const key = pick(e).trim()
    if (!key) continue
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  const total = events.length || 1
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count, share: count / total }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
}

export function rankedTriggers(events: DebriefEvent[]): RankedItem[] {
  return rank(events, (e) => e.trigger)
}

export function rankedFeelings(events: DebriefEvent[]): RankedItem[] {
  return rank(events, (e) => e.feeling)
}

export function timeBandCounts(events: DebriefEvent[]): TimeBand[] {
  const bands = TIME_BANDS.map((b) => ({ ...b, count: 0 }))
  for (const e of events) {
    const hour = new Date(e.at).getHours()
    bands[Math.floor(hour / 3)].count += 1
  }
  return bands
}

export function riskiestBand(events: DebriefEvent[]): TimeBand | null {
  const bands = timeBandCounts(events)
  const max = bands.reduce((a, b) => (b.count > a.count ? b : a), bands[0])
  return max.count > 0 ? max : null
}

/** How many close calls (urges that didn't become slips) vs slips. */
export function closeCallRate(events: DebriefEvent[]): number | null {
  if (events.length === 0) return null
  return events.filter((e) => e.kind === 'close-call').length / events.length
}

export interface Nudge {
  title: string
  body: string
}

const TRIGGER_PLAYS: Record<string, string> = {
  Stress:
    'Stress builds for hours before it tips you over. When you notice your jaw or shoulders tight, that is the moment — step outside for two minutes before you decide anything.',
  Boredom:
    'Boredom is the urge wearing a disguise. Keep one specific 10-minute activity pre-chosen (a walk route, a playlist, a task) so you never have to invent an alternative in the moment.',
  Loneliness:
    'The urge shows up when you feel disconnected. Text one person — not about this, about anything. Connection is the counter-move.',
  Conflict:
    'Slips after arguments are about discharge, not desire. After a fight, give yourself a 30-minute buffer somewhere that is not your usual slip location.',
  Tiredness:
    'Your willpower is chemistry, and it is gone when you are exhausted. Treat bedtime as prevention: getting to sleep 30 minutes earlier is worth more than any resolution.',
  Alcohol:
    'Drinking dissolves the pause between urge and action. Decide your plan for after drinks before the first one, while the deciding part of you is still online.',
  'Late-night scrolling':
    'Scrolling in bed is the on-ramp. Charge the phone outside the bedroom, or set an app timer that ends the session before the risky window opens.',
  'Saw a cue':
    'Cues are ambushes — you cannot argue with them, only exit. Practice the 10-second move: close it, stand up, change rooms. Speed beats willpower.',
  Celebration:
    '"I earned it" is the most polite trigger. Pick a real reward in advance so the win already has somewhere to go.',
  'Being alone at home':
    'Alone at home is your highest-exposure setting. On nights you know you will be alone, plan the evening in advance — vagueness is where slips live.',
}

/**
 * Turn the danger map into concrete if-then plays. Rule-based on the top
 * triggers and the riskiest time band — the map has to *do* something.
 */
export function buildNudges(events: DebriefEvent[]): Nudge[] {
  const nudges: Nudge[] = []
  const triggers = rankedTriggers(events)
  const band = riskiestBand(events)
  const feelings = rankedFeelings(events)

  for (const t of triggers.slice(0, 3)) {
    nudges.push({
      title: `Your ${nudges.length === 0 ? '#1' : 'repeat'} trigger: ${t.label.toLowerCase()}`,
      body:
        TRIGGER_PLAYS[t.label] ??
        `“${t.label}” shows up in ${t.count} of your debriefs. Write one if-then plan for it: “If ${t.label.toLowerCase()} hits, then I will ___” — decided now, not in the moment.`,
    })
  }

  if (band) {
    nudges.push({
      title: `Your risky window: ${band.label}`,
      body: `${band.count} of your ${events.length} logged moments landed between ${band.label}. Put one obstacle inside that window — a planned activity, a changed environment, a device out of reach. You are not fighting the whole day, just this stretch.`,
    })
  }

  const topFeeling = feelings[0]
  if (topFeeling && topFeeling.count >= 2) {
    nudges.push({
      title: `Underneath it: feeling ${topFeeling.label.toLowerCase()}`,
      body: `“${topFeeling.label}” keeps showing up under your triggers. The habit has been your fastest way to change that feeling. Next urge, try naming it out loud first — “I'm ${topFeeling.label.toLowerCase()} right now” — and give it 90 seconds before deciding.`,
    })
  }

  return nudges
}

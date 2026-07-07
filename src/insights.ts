import { Feeling, Slip, TimeBucket, Trigger } from './types';

export function bucketFor(at: number): TimeBucket {
  const h = new Date(at).getHours();
  if (h >= 5 && h < 12) return 'Morning';
  if (h >= 12 && h < 17) return 'Afternoon';
  if (h >= 17 && h < 22) return 'Evening';
  return 'Late night';
}

export interface Ranked<T extends string> {
  key: T;
  count: number;
  share: number; // 0..1 of total slips
}

function rank<T extends string>(keys: T[], total: number): Ranked<T>[] {
  const counts = new Map<T, number>();
  for (const k of keys) counts.set(k, (counts.get(k) ?? 0) + 1);
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count, share: total ? count / total : 0 }))
    .sort((a, b) => b.count - a.count);
}

export function rankedTriggers(slips: Slip[]): Ranked<Trigger>[] {
  return rank(
    slips.map((s) => s.trigger),
    slips.length
  );
}

export function rankedFeelings(slips: Slip[]): Ranked<Feeling>[] {
  return rank(
    slips.map((s) => s.feeling),
    slips.length
  );
}

export function rankedBuckets(slips: Slip[]): Ranked<TimeBucket>[] {
  return rank(
    slips.map((s) => bucketFor(s.at)),
    slips.length
  );
}

const TRIGGER_TACTICS: Record<Trigger, string> = {
  Stress:
    'Your top trigger is stress. Before your usual pressure points, take two minutes to write down the one thing actually stressing you — naming it drains some of its pull.',
  Boredom:
    'Boredom is your top trigger. Line up one specific, easy-to-start activity for your dead hours — the urge feeds on "nothing to do."',
  Loneliness:
    'Loneliness shows up before most of your slips. Text one person before your risky window opens — connection ahead of time beats willpower in the moment.',
  Conflict:
    'Conflict is your top trigger. After a hard conversation, give yourself a 20-minute buffer — walk, shower, anything — before you’re alone with a screen or a craving.',
  Tired:
    'Being run-down is your top trigger. Guard your sleep like it’s part of recovery — because for you, it is. An earlier night is a prevention tool.',
  'Saw a cue':
    'Cues are your top trigger. Map where they ambush you (apps, routes, shelves) and add one layer of friction to each — the goal is a speed bump, not a wall.',
  Celebration:
    'Good moods are your risky moods. Decide in advance how you’ll celebrate wins — the slip sneaks in when "I earned this" makes the call for you.',
  'No idea yet':
    'Your triggers are still fuzzy — that’s normal early on. Keep logging autopsies; the pattern usually shows itself within a handful of entries.',
};

const BUCKET_TACTICS: Record<TimeBucket, string> = {
  Morning:
    'Mornings are your risky window. Build a first-hour routine that doesn’t leave you idle and alone — momentum early carries the whole day.',
  Afternoon:
    'Afternoons are your risky window. Plan a mid-day break on purpose — a walk or a change of scene — so the slump doesn’t choose for you.',
  Evening:
    'Evenings are your risky window. Decide before 5pm what tonight looks like — an unplanned evening is where your slips live.',
  'Late night':
    'Late night is your risky window. Set a hard shutdown time and make your wind-down boring and predictable — nothing good is happening for you after it.',
};

export interface Nudge {
  title: string;
  body: string;
}

export function nudgesFrom(slips: Slip[]): Nudge[] {
  if (slips.length === 0) {
    return [
      {
        title: 'No data yet — and that’s fine',
        body: 'Nudges here are built from your own autopsies, not generic advice. After your first log, this screen starts working for you.',
      },
    ];
  }
  const out: Nudge[] = [];
  const trigger = rankedTriggers(slips)[0];
  const bucket = rankedBuckets(slips)[0];
  const feeling = rankedFeelings(slips)[0];

  out.push({
    title: `Top trigger: ${trigger.key.toLowerCase()}`,
    body: TRIGGER_TACTICS[trigger.key],
  });
  out.push({
    title: `Risky window: ${bucket.key.toLowerCase()}`,
    body: BUCKET_TACTICS[bucket.key],
  });
  out.push({
    title: `Underneath it: ${feeling.key.toLowerCase()}`,
    body: `“${feeling.key}” keeps showing up under your slips. Next time you notice it, treat it as an early warning light — the urge is usually about 20 minutes behind it.`,
  });
  return out;
}

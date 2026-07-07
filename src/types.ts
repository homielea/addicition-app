export type Behavior =
  | 'drinking'
  | 'porn'
  | 'gambling'
  | 'vaping'
  | 'doomscrolling'
  | 'other';

export const BEHAVIOR_LABELS: Record<Behavior, string> = {
  drinking: 'Drinking',
  porn: 'Porn',
  gambling: 'Gambling',
  vaping: 'Vaping',
  doomscrolling: 'Doomscrolling',
  other: 'Something else',
};

export const TRIGGERS = [
  'Stress',
  'Boredom',
  'Loneliness',
  'Conflict',
  'Tired',
  'Saw a cue',
  'Celebration',
  'No idea yet',
] as const;
export type Trigger = (typeof TRIGGERS)[number];

export const FEELINGS = [
  'Anxious',
  'Numb',
  'Lonely',
  'Angry',
  'Restless',
  'Sad',
  'Empty',
  'Ashamed',
] as const;
export type Feeling = (typeof FEELINGS)[number];

export interface Slip {
  id: string;
  at: number; // epoch ms
  trigger: Trigger;
  feeling: Feeling;
  note?: string;
}

export type TimeBucket = 'Morning' | 'Afternoon' | 'Evening' | 'Late night';

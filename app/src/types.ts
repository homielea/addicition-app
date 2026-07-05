export type EventKind = 'slip' | 'close-call'

export interface DebriefEvent {
  id: string
  kind: EventKind
  /** ISO timestamp of when the slip/close call happened (not when it was logged). */
  at: string
  trigger: string
  feeling: string
  note?: string
}

export interface AppState {
  habit: string | null
  events: DebriefEvent[]
}

export type Screen = 'home' | 'autopsy' | 'map' | 'prevent'

export const TRIGGERS = [
  'Stress',
  'Boredom',
  'Loneliness',
  'Conflict',
  'Tiredness',
  'Alcohol',
  'Late-night scrolling',
  'Saw a cue',
  'Celebration',
  'Being alone at home',
] as const

export const FEELINGS = [
  'Anxious',
  'Numb',
  'Lonely',
  'Restless',
  'Angry',
  'Ashamed',
  'Sad',
  'Overwhelmed',
  'Empty',
  'Wired',
] as const

export const HABITS = [
  'Porn',
  'Doomscrolling',
  'Gambling',
  'Vaping',
  'Drinking',
  'Weed',
] as const

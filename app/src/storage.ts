import type { AppState } from './types'

const KEY = 'relapse-autopsy/v1'

const EMPTY: AppState = { habit: null, events: [] }

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw) as AppState
    if (typeof parsed !== 'object' || parsed === null || !Array.isArray(parsed.events)) {
      return EMPTY
    }
    return { habit: parsed.habit ?? null, events: parsed.events }
  } catch {
    return EMPTY
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function eraseState(): void {
  localStorage.removeItem(KEY)
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Behavior, Feeling, Slip, Trigger } from './types';

interface State {
  behavior: Behavior | null;
  customBehavior: string;
  slips: Slip[];
  // The one number that only goes up. Every completed autopsy adds a rep —
  // slips are data, so logging one *increases* progress. Never reset anywhere.
  insightReps: number;
  hydrated: boolean;

  setBehavior: (behavior: Behavior, custom?: string) => void;
  logSlip: (entry: { trigger: Trigger; feeling: Feeling; note?: string }) => void;
  setHydrated: () => void;
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      behavior: null,
      customBehavior: '',
      slips: [],
      insightReps: 0,
      hydrated: false,

      setBehavior: (behavior, custom) =>
        set({ behavior, customBehavior: custom ?? '' }),

      logSlip: ({ trigger, feeling, note }) =>
        set((s) => ({
          slips: [
            ...s.slips,
            {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              at: Date.now(),
              trigger,
              feeling,
              note: note?.trim() || undefined,
            },
          ],
          insightReps: s.insightReps + 1,
        })),

      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'relapse-autopsy-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ behavior, customBehavior, slips, insightReps }) => ({
        behavior,
        customBehavior,
        slips,
        insightReps,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

export function behaviorLabel(s: Pick<State, 'behavior' | 'customBehavior'>): string {
  if (!s.behavior) return '';
  if (s.behavior === 'other') return s.customBehavior || 'your habit';
  return s.behavior;
}

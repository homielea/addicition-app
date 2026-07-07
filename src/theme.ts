// The debrief room. Cold night-navy, steel hairlines, and one accent —
// signal amber — reserved for intel: the reps, the step tags, the stamp.
// The user is the investigator here, never the suspect.
//
// Contrast floors are load-bearing (see the family UX audit): text ≥4.5:1
// on its actual ground, controls ≥3:1. Every pair below clears 5.7:1.

import { TextStyle } from 'react-native';

export const colors = {
  bg: '#10161F', // cold ink — the map room at 2am
  card: '#18202B',
  cardRaised: '#1E2833',
  border: '#2C3846', // steel hairline
  grid: '#1B2430', // plotting-paper lines (decorative only)
  text: '#E9EDF2',
  muted: '#9AA7B4', // steel — 6.7:1 even on raised cards
  accent: '#E9A83E', // signal amber: intel moments only
  accentInk: '#10161F', // ink on amber controls — 8.8:1
  amber: '#E9A83E', // step tags share the intel accent
  danger: '#D97561', // trigger bands — 5.8:1 on ink
  steelBlue: '#7FADC9', // feeling bands
};

export const font = {
  display: 'BarlowSemiCondensed_700Bold',
  displayMedium: 'BarlowSemiCondensed_600SemiBold',
  mono: 'IBMPlexMono_500Medium',
  monoRegular: 'IBMPlexMono_400Regular',
};

// Case-file voice: condensed display for headings, mono for anything
// "typed into the record" (eyebrows, counts, tags), quiet system body.
export const type: Record<'display' | 'title' | 'body' | 'caption' | 'eyebrow' | 'mono', TextStyle> = {
  display: { fontFamily: font.display, fontSize: 30, lineHeight: 34, letterSpacing: 0.2, color: colors.text },
  title: { fontFamily: font.displayMedium, fontSize: 19, lineHeight: 24, color: colors.text },
  body: { fontSize: 15, lineHeight: 22, color: colors.text },
  caption: { fontSize: 13, lineHeight: 19, color: colors.muted },
  eyebrow: {
    fontFamily: font.mono,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.accent,
  },
  mono: { fontFamily: font.mono, fontSize: 13, lineHeight: 19, color: colors.muted },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Squared corners: report sections, not bubbles.
export const radius = {
  sm: 4,
  md: 6,
  lg: 8,
  pill: 999,
};

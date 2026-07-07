import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, type } from './theme';

export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * Every screen opens like a case file: a mono eyebrow naming the record,
 * a hairline rule, then the condensed display title.
 */
export function CaseHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <View style={styles.caseHeader}>
      <Text style={type.eyebrow}>{eyebrow}</Text>
      <View style={styles.rule} />
      <Text style={[type.display, styles.caseTitle]}>{title}</Text>
      {sub ? <Text style={[type.body, styles.caseSub]}>{sub}</Text> : null}
    </View>
  );
}

export function Title({ children }: { children: React.ReactNode }) {
  return <Text style={[type.display, styles.title]}>{children}</Text>;
}

export function Subtitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.subtitle}>{children}</Text>;
}

/** Faint plotting-paper lines — terrain being charted, not decoration on top. */
function GridLines() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {[0.25, 0.5, 0.75].map((t) => (
        <View key={`h${t}`} style={[styles.gridH, { top: `${t * 100}%` }]} />
      ))}
      {[0.25, 0.5, 0.75].map((t) => (
        <View key={`v${t}`} style={[styles.gridV, { left: `${t * 100}%` }]} />
      ))}
    </View>
  );
}

export function Card({
  children,
  style,
  grid,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  grid?: boolean;
}) {
  return (
    <View style={[styles.card, style]}>
      {grid ? <GridLines /> : null}
      {children}
    </View>
  );
}

/** Selection chips styled as evidence tags: squared, mono, lowercase. */
export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function Button({
  label,
  onPress,
  kind = 'primary',
  disabled,
}: {
  label: string;
  onPress: () => void;
  kind?: 'primary' | 'ghost' | 'big';
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.button,
        kind === 'ghost' && styles.buttonGhost,
        kind === 'big' && styles.buttonBig,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          kind === 'ghost' && styles.buttonTextGhost,
          kind === 'big' && styles.buttonTextBig,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function ChipRow({ children }: { children: React.ReactNode }) {
  return <View style={styles.chipRow}>{children}</View>;
}

/**
 * The signature: insight reps as an investigator's tally. Four strokes and
 * a diagonal strike make five. A streak can reset; a tally can only be
 * added to — which is the whole promise of the number.
 */
export function TallyBoard({ count }: { count: number }) {
  const MAX_MARKS = 30;
  const shown = Math.min(count, MAX_MARKS);
  const groups: number[] = [];
  for (let left = shown; left > 0; left -= 5) groups.push(Math.min(5, left));

  return (
    <View
      style={styles.tallyWrap}
      accessibilityRole="image"
      accessibilityLabel={`${count} insight ${count === 1 ? 'rep' : 'reps'} tallied`}
    >
      {count === 0 ? (
        <View style={styles.tallyEmptyRow}>
          <View style={styles.tallyGhostMark} />
          <Text style={type.mono}>the first mark is waiting</Text>
        </View>
      ) : (
        <View style={styles.tallyRow}>
          {groups.map((n, gi) => (
            <View key={gi} style={styles.tallyGroup}>
              {Array.from({ length: Math.min(n, 4) }, (_, i) => (
                <View key={i} style={styles.tallyMark} />
              ))}
              {n === 5 ? <View style={styles.tallyStrike} /> : null}
            </View>
          ))}
          {count > MAX_MARKS ? <Text style={styles.tallyMore}>+{count - MAX_MARKS}</Text> : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
  },
  caseHeader: { marginBottom: spacing.lg },
  rule: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  caseTitle: { marginTop: spacing.xs },
  caseSub: { color: colors.muted, marginTop: spacing.sm },
  title: { marginBottom: spacing.sm },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  gridH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: colors.grid },
  gridV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: colors.grid },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: radius.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.cardRaised,
    borderColor: colors.accent,
  },
  chipText: { color: colors.text, fontSize: 14, fontFamily: 'IBMPlexMono_400Regular' },
  chipTextSelected: { color: colors.accent, fontFamily: 'IBMPlexMono_500Medium' },
  button: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  buttonBig: {
    paddingVertical: 22,
    borderRadius: radius.lg,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: {
    color: colors.accentInk,
    fontSize: 15,
    fontFamily: 'BarlowSemiCondensed_600SemiBold',
    letterSpacing: 0.4,
  },
  buttonTextBig: { fontSize: 19 },
  buttonTextGhost: { color: colors.text },
  pressed: { opacity: 0.75 },
  tallyWrap: { marginVertical: spacing.sm, minHeight: 34, justifyContent: 'center' },
  tallyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    rowGap: spacing.sm,
  },
  tallyGroup: {
    flexDirection: 'row',
    gap: 5,
    height: 30,
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 2,
  },
  tallyMark: {
    width: 3,
    height: 26,
    borderRadius: 1.5,
    backgroundColor: colors.accent,
    transform: [{ rotate: '4deg' }],
  },
  tallyStrike: {
    position: 'absolute',
    left: -3,
    right: -3,
    top: 13,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.accent,
    transform: [{ rotate: '-24deg' }],
  },
  tallyGhostMark: {
    width: 3,
    height: 22,
    borderRadius: 1.5,
    backgroundColor: colors.border,
    transform: [{ rotate: '4deg' }],
  },
  tallyEmptyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  tallyMore: { ...type.mono, color: colors.accent },
});

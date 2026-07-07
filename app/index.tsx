import { Redirect, router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { nudgesFrom } from '../src/insights';
import { behaviorLabel, useStore } from '../src/store';
import { colors, font, spacing, type } from '../src/theme';
import { Button, Card, CaseHeader, Screen, TallyBoard } from '../src/ui';

export default function Home() {
  const hydrated = useStore((s) => s.hydrated);
  const behavior = useStore((s) => s.behavior);
  const customBehavior = useStore((s) => s.customBehavior);
  const insightReps = useStore((s) => s.insightReps);
  const slips = useStore((s) => s.slips);

  if (!hydrated) return null;
  if (!behavior) return <Redirect href="/onboarding" />;

  const nudge = nudgesFrom(slips)[0];
  const label = behaviorLabel({ behavior, customBehavior });

  return (
    <Screen>
      <CaseHeader
        eyebrow={`field log · ${label}`}
        title="Relapse Autopsy"
        sub="Slips are intel here. Every one you log makes future urges easier to see coming."
      />

      <Card grid style={styles.metricCard}>
        <Text style={styles.metricNumber}>{insightReps}</Text>
        <Text style={styles.metricLabel}>
          insight {insightReps === 1 ? 'rep' : 'reps'}
        </Text>
        <TallyBoard count={insightReps} />
        <Text style={styles.metricHint}>
          This number only goes up. Every debrief — including after a slip — adds a
          rep. There is nothing to reset.
        </Text>
      </Card>

      <Button label="I slipped — log it" kind="big" onPress={() => router.push('/autopsy')} />
      <Text style={styles.noJudgment}>
        No judgment on the other side of that button. 60 seconds, three questions, done.
      </Text>

      <View style={styles.linksRow}>
        <View style={styles.linkCol}>
          <Button label="Danger map" kind="ghost" onPress={() => router.push('/danger-map')} />
        </View>
        <View style={styles.linkCol}>
          <Button label="Prevention" kind="ghost" onPress={() => router.push('/nudges')} />
        </View>
      </View>

      <Card>
        <Text style={styles.nudgeTitle}>{nudge.title}</Text>
        <Text style={styles.nudgeBody}>{nudge.body}</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  metricCard: { alignItems: 'center', paddingVertical: spacing.lg },
  metricNumber: {
    color: colors.accent,
    fontSize: 56,
    lineHeight: 60,
    fontFamily: font.display,
  },
  metricLabel: {
    ...type.mono,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  metricHint: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  noJudgment: {
    color: colors.muted,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
  },
  linksRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  linkCol: { flex: 1 },
  nudgeTitle: { ...type.eyebrow, marginBottom: spacing.xs },
  nudgeBody: { color: colors.text, fontSize: 15, lineHeight: 22 },
});

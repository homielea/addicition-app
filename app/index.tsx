import { Redirect, router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { nudgesFrom } from '../src/insights';
import { behaviorLabel, useStore } from '../src/store';
import { colors, spacing } from '../src/theme';
import { Button, Card, Screen, Subtitle, Title } from '../src/ui';

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
      <Title>Relapse Autopsy</Title>
      <Subtitle>Stepping back from {label}. Slips are intel here.</Subtitle>

      <Card style={styles.metricCard}>
        <Text style={styles.metricNumber}>{insightReps}</Text>
        <Text style={styles.metricLabel}>
          insight {insightReps === 1 ? 'rep' : 'reps'}
        </Text>
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
  metricCard: { alignItems: 'center', paddingVertical: spacing.xl },
  metricNumber: { color: colors.accent, fontSize: 64, fontWeight: '800' },
  metricLabel: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  metricHint: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
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
  nudgeTitle: { color: colors.amber, fontSize: 14, fontWeight: '700', marginBottom: spacing.xs },
  nudgeBody: { color: colors.text, fontSize: 15, lineHeight: 22 },
});

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ranked, rankedBuckets, rankedFeelings, rankedTriggers } from '../src/insights';
import { useStore } from '../src/store';
import { colors, radius, spacing } from '../src/theme';
import { Card, Screen, Subtitle, Title } from '../src/ui';

function RankedBars<T extends string>({
  title,
  data,
  barColor,
}: {
  title: string;
  data: Ranked<T>[];
  barColor: string;
}) {
  return (
    <Card>
      <Text style={styles.sectionTitle}>{title}</Text>
      {data.map((row) => (
        <View key={row.key} style={styles.row}>
          <View style={styles.rowHeader}>
            <Text style={styles.rowLabel}>{row.key}</Text>
            <Text style={styles.rowCount}>
              {row.count}× · {Math.round(row.share * 100)}%
            </Text>
          </View>
          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                { width: `${Math.max(6, Math.round(row.share * 100))}%`, backgroundColor: barColor },
              ]}
            />
          </View>
        </View>
      ))}
    </Card>
  );
}

export default function DangerMap() {
  const slips = useStore((s) => s.slips);

  if (slips.length === 0) {
    return (
      <Screen>
        <Title>Nothing mapped yet.</Title>
        <Subtitle>
          The danger map is built from your autopsies. After your first log, your top
          triggers, underlying feelings, and risky hours show up here — ranked, so you
          know exactly what to watch for.
        </Subtitle>
      </Screen>
    );
  }

  return (
    <Screen>
      <Title>Your danger map</Title>
      <Subtitle>
        {slips.length} {slips.length === 1 ? 'debrief' : 'debriefs'}, ranked into
        patterns. This is what your urges look like from above.
      </Subtitle>
      <RankedBars title="Top triggers" data={rankedTriggers(slips)} barColor={colors.danger} />
      <RankedBars title="Risky times of day" data={rankedBuckets(slips)} barColor={colors.amber} />
      <RankedBars title="Feelings underneath" data={rankedFeelings(slips)} barColor={colors.accent} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  row: { marginBottom: spacing.md },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  rowLabel: { color: colors.text, fontSize: 15 },
  rowCount: { color: colors.muted, fontSize: 13 },
  track: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.cardRaised,
    overflow: 'hidden',
  },
  fill: { height: 8, borderRadius: radius.pill },
});

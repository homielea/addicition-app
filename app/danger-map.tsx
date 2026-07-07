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
  totalSlips,
}: {
  title: string;
  data: Ranked<T>[];
  barColor: string;
  totalSlips: number;
}) {
  // One or two logs can't support percentages — "stress · 100%" off a single
  // debrief reads as a verdict, not a pattern. Shares and bars wait for n≥3.
  const showShares = totalSlips >= 3;
  return (
    <Card>
      <Text style={styles.sectionTitle}>{title}</Text>
      {data.map((row) => (
        <View key={row.key} style={styles.row}>
          <View style={styles.rowHeader}>
            <Text style={styles.rowLabel}>{row.key}</Text>
            <Text style={styles.rowCount}>
              {showShares ? `${row.count}× · ${Math.round(row.share * 100)}%` : `${row.count}×`}
            </Text>
          </View>
          {showShares && (
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  { width: `${Math.max(6, Math.round(row.share * 100))}%`, backgroundColor: barColor },
                ]}
              />
            </View>
          )}
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
        {slips.length === 1
          ? 'One debrief so far — early sightings, not yet a pattern. A couple more and the ranking starts meaning something.'
          : slips.length === 2
            ? 'Two debriefs so far — early sightings, not yet a pattern. One more and the ranking starts meaning something.'
            : `${slips.length} debriefs, ranked into patterns. This is what your urges look like from above.`}
      </Subtitle>
      <RankedBars
        title="Top triggers"
        data={rankedTriggers(slips)}
        barColor={colors.danger}
        totalSlips={slips.length}
      />
      <RankedBars
        title="Risky times of day"
        data={rankedBuckets(slips)}
        barColor={colors.amber}
        totalSlips={slips.length}
      />
      <RankedBars
        title="Feelings underneath"
        data={rankedFeelings(slips)}
        barColor={colors.accent}
        totalSlips={slips.length}
      />
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

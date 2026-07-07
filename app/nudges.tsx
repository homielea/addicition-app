import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { nudgesFrom } from '../src/insights';
import { useStore } from '../src/store';
import { colors, spacing, type } from '../src/theme';
import { Card, CaseHeader, Screen } from '../src/ui';

export default function Nudges() {
  const slips = useStore((s) => s.slips);
  const nudges = nudgesFrom(slips);

  return (
    <Screen>
      <CaseHeader
        eyebrow="countermeasures"
        title="Prevention"
        sub="Not generic advice — these are built from your own danger map and update with every debrief."
      />
      {nudges.map((n) => (
        <Card key={n.title}>
          <Text style={styles.nudgeTitle}>{n.title}</Text>
          <Text style={styles.nudgeBody}>{n.body}</Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  nudgeTitle: {
    ...type.eyebrow,
    marginBottom: spacing.xs,
  },
  nudgeBody: { color: colors.text, fontSize: 15, lineHeight: 22 },
});

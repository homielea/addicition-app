import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useStore } from '../src/store';
import { colors, radius, spacing } from '../src/theme';
import { Behavior, BEHAVIOR_LABELS } from '../src/types';
import { Button, Card, Chip, ChipRow, Screen, Subtitle, Title } from '../src/ui';

const BEHAVIORS = Object.keys(BEHAVIOR_LABELS) as Behavior[];

export default function Onboarding() {
  const setBehavior = useStore((s) => s.setBehavior);
  const [picked, setPicked] = useState<Behavior | null>(null);
  const [custom, setCustom] = useState('');

  const canContinue = picked !== null && (picked !== 'other' || custom.trim().length > 0);

  return (
    <Screen>
      <Title>Your slip is intel, not failure.</Title>
      <Subtitle>
        Most apps lose you the day you slip. This one gets more useful. Every slip
        becomes a 60-second debrief, and every debrief sharpens your personal danger
        map — so the next urge has less room to work with.
      </Subtitle>

      <Card>
        <Text style={styles.rule}>Three ground rules:</Text>
        <Text style={styles.ruleItem}>1. No streaks. Your progress number never resets.</Text>
        <Text style={styles.ruleItem}>2. No shame. Logging a slip counts as progress.</Text>
        <Text style={styles.ruleItem}>3. No sermons. Just your own data, working for you.</Text>
      </Card>

      <Text style={styles.question}>What are you stepping back from?</Text>
      <ChipRow>
        {BEHAVIORS.map((b) => (
          <Chip
            key={b}
            label={BEHAVIOR_LABELS[b]}
            selected={picked === b}
            onPress={() => setPicked(b)}
          />
        ))}
      </ChipRow>

      {picked === 'other' && (
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Name it in your own words"
            placeholderTextColor={colors.muted}
            value={custom}
            onChangeText={setCustom}
          />
        </View>
      )}

      <Button
        label="Start"
        disabled={!canContinue}
        onPress={() => {
          if (!picked) return;
          setBehavior(picked, custom);
          router.replace('/');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  rule: { color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: spacing.sm },
  ruleItem: { color: colors.muted, fontSize: 15, lineHeight: 24 },
  question: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  inputWrap: { marginBottom: spacing.lg },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    color: colors.text,
    padding: spacing.md,
    fontSize: 16,
  },
});

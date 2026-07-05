import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { useStore } from '../src/store';
import { colors, radius, spacing } from '../src/theme';
import { Feeling, FEELINGS, Trigger, TRIGGERS } from '../src/types';
import { Button, Card, Chip, ChipRow, Screen, Subtitle, Title } from '../src/ui';

type Step = 'trigger' | 'feeling' | 'note' | 'done';

export default function Autopsy() {
  const logSlip = useStore((s) => s.logSlip);
  const insightReps = useStore((s) => s.insightReps);

  const [step, setStep] = useState<Step>('trigger');
  const [trigger, setTrigger] = useState<Trigger | null>(null);
  const [feeling, setFeeling] = useState<Feeling | null>(null);
  const [note, setNote] = useState('');

  if (step === 'trigger') {
    return (
      <Screen>
        <Title>Okay. It happened.</Title>
        <Subtitle>
          You’re here, which is the whole game. Three quick questions — this is a
          debrief, not a confession.
        </Subtitle>
        <Text style={styles.stepLabel}>1 of 3 · What set it off?</Text>
        <ChipRow>
          {TRIGGERS.map((t) => (
            <Chip key={t} label={t} selected={trigger === t} onPress={() => setTrigger(t)} />
          ))}
        </ChipRow>
        <Button label="Next" disabled={!trigger} onPress={() => setStep('feeling')} />
      </Screen>
    );
  }

  if (step === 'feeling') {
    return (
      <Screen>
        <Title>Under the trigger.</Title>
        <Subtitle>
          The trigger is the spark; the feeling is the fuel. What was actually going
          on underneath?
        </Subtitle>
        <Text style={styles.stepLabel}>2 of 3 · What were you feeling?</Text>
        <ChipRow>
          {FEELINGS.map((f) => (
            <Chip key={f} label={f} selected={feeling === f} onPress={() => setFeeling(f)} />
          ))}
        </ChipRow>
        <Button label="Next" disabled={!feeling} onPress={() => setStep('note')} />
        <Button label="Back" kind="ghost" onPress={() => setStep('trigger')} />
      </Screen>
    );
  }

  if (step === 'note') {
    return (
      <Screen>
        <Title>Anything worth remembering?</Title>
        <Subtitle>
          Optional. One line for future-you: where you were, what you’d try instead,
          anything.
        </Subtitle>
        <Text style={styles.stepLabel}>3 of 3 · Note (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Home alone after the call with Dad"
          placeholderTextColor={colors.muted}
          value={note}
          onChangeText={setNote}
          multiline
        />
        <Button
          label="Log it"
          onPress={() => {
            if (!trigger || !feeling) return;
            logSlip({ trigger, feeling, note });
            setStep('done');
          }}
        />
        <Button label="Back" kind="ghost" onPress={() => setStep('feeling')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Title>+1 insight rep.</Title>
      <Subtitle>
        That slip is now working for you. It’s on your danger map, and your prevention
        nudges just got a little sharper.
      </Subtitle>
      <Card style={styles.doneCard}>
        <Text style={styles.doneNumber}>{insightReps}</Text>
        <Text style={styles.doneLabel}>total insight reps — still climbing</Text>
      </Card>
      <Button label="See the danger map" onPress={() => router.replace('/danger-map')} />
      <Button label="Done" kind="ghost" onPress={() => router.dismissTo('/')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  stepLabel: {
    color: colors.amber,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    color: colors.text,
    padding: spacing.md,
    fontSize: 16,
    minHeight: 90,
    textAlignVertical: 'top',
    marginBottom: spacing.lg,
  },
  doneCard: { alignItems: 'center', paddingVertical: spacing.lg },
  doneNumber: { color: colors.accent, fontSize: 48, fontWeight: '800' },
  doneLabel: { color: colors.muted, fontSize: 14 },
});

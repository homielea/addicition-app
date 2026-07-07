import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useStore } from '../src/store';
import { colors, font, radius, spacing, type } from '../src/theme';
import { Feeling, FEELINGS, Trigger, TRIGGERS } from '../src/types';
import { Button, Card, Chip, ChipRow, Screen, Subtitle, TallyBoard, Title } from '../src/ui';

type Step = 'trigger' | 'feeling' | 'note' | 'done';

function StepTag({ n, label }: { n: number; label: string }) {
  return (
    <View style={styles.stepRow}>
      <Text style={styles.stepQ}>{`Q${n} / 3`}</Text>
      <View style={styles.stepRule} />
      <Text style={styles.stepLabel}>{label}</Text>
    </View>
  );
}

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
        <StepTag n={1} label="What set it off?" />
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
        <StepTag n={2} label="What were you feeling?" />
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
        <StepTag n={3} label="Note (optional)" />
        <TextInput
          style={styles.input}
          accessibilityLabel="Note for future you"
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
      <Card grid style={styles.doneCard}>
        <Text style={styles.doneStamp}>logged · on the record</Text>
        <Text style={styles.doneNumber}>{insightReps}</Text>
        <TallyBoard count={insightReps} />
        <Text style={styles.doneLabel}>total insight reps — still climbing</Text>
      </Card>
      <Button label="See the danger map" onPress={() => router.replace('/danger-map')} />
      <Button label="Done" kind="ghost" onPress={() => router.dismissTo('/')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  stepQ: { ...type.eyebrow },
  stepRule: { width: 24, height: 1, backgroundColor: colors.border },
  stepLabel: { ...type.title, flexShrink: 1 },
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
  doneStamp: { ...type.eyebrow, marginBottom: spacing.sm },
  doneNumber: {
    color: colors.accent,
    fontSize: 44,
    lineHeight: 48,
    fontFamily: font.display,
  },
  doneLabel: { color: colors.muted, fontSize: 13, marginTop: spacing.xs },
});

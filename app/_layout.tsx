import {
  BarlowSemiCondensed_600SemiBold,
  BarlowSemiCondensed_700Bold,
} from '@expo-google-fonts/barlow-semi-condensed';
import {
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
} from '@expo-google-fonts/ibm-plex-mono';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { colors, font } from '../src/theme';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    BarlowSemiCondensed_600SemiBold,
    BarlowSemiCondensed_700Bold,
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
  });

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
          headerTitleStyle: { fontFamily: font.displayMedium, fontSize: 18 },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen
          name="autopsy"
          options={{ title: 'Debrief', presentation: 'modal' }}
        />
        <Stack.Screen name="danger-map" options={{ title: 'Danger map' }} />
        <Stack.Screen name="nudges" options={{ title: 'Prevention' }} />
      </Stack>
    </>
  );
}

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { RosterProvider } from '@/store/roster';
import { colors } from '@/theme';

export default function RootLayout() {
  return (
    <RosterProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.ink,
          headerTitleStyle: {
            fontWeight: '800',
            fontSize: 22,
            color: colors.ink,
          },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.bg },
          headerBackButtonDisplayMode: 'minimal',
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Tip Split' }} />
        <Stack.Screen name="payout" options={{ title: 'Split' }} />
        <Stack.Screen name="results" options={{ title: 'Split' }} />
      </Stack>
    </RosterProvider>
  );
}

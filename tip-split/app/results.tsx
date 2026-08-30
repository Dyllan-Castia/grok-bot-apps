import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BigButton } from '@/components/BigButton';
import { formatPayoutText } from '@/lib/formatPayout';
import { formatUsd } from '@/lib/money';
import { clearPayoutResult, getPayoutResult } from '@/store/payoutSession';
import { colors, radius, space, type } from '@/theme';

export default function ResultsScreen() {
  const router = useRouter();
  const result = getPayoutResult();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!result) {
      router.replace('/');
    }
  }, [result, router]);

  const text = useMemo(
    () =>
      result
        ? formatPayoutText({
            envelopeCents: result.envelopeCents,
            people: result.people,
          })
        : '',
    [result],
  );

  if (!result) {
    return <View style={styles.safe} />;
  }

  const shareSum = result.people.reduce((sum, person) => sum + person.cents, 0);

  async function copyText() {
    await Clipboard.setStringAsync(text);
    setCopied(true);
  }

  async function shareText() {
    try {
      await Share.share({ message: text });
    } catch {
      await copyText();
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.list}>
        <Text style={styles.kicker}>Envelope {formatUsd(result.envelopeCents)}</Text>
        <Text style={styles.help}>
          Each share is in dollars. Together they add up to {formatUsd(shareSum)}.
        </Text>
        {result.people.map((person) => (
          <View key={person.id} style={styles.card}>
            <Text style={styles.name}>{person.name}</Text>
            <Text style={styles.money} accessibilityRole="text">
              {formatUsd(person.cents)}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <BigButton label={copied ? 'Copied' : 'Copy'} variant="secondary" onPress={() => void copyText()} />
        <BigButton label="Share" variant="secondary" onPress={() => void shareText()} />
        <BigButton
          hero
          label="Done"
          onPress={() => {
            clearPayoutResult();
            router.replace('/');
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  list: {
    padding: space.lg,
    gap: space.md,
    paddingBottom: space.xl,
  },
  kicker: {
    fontSize: type.title,
    fontWeight: '800',
    color: colors.ink,
  },
  help: {
    fontSize: type.body,
    color: colors.muted,
    lineHeight: 28,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 2,
    borderColor: colors.line,
    paddingVertical: space.lg,
    paddingHorizontal: space.md,
  },
  name: {
    fontSize: type.name,
    fontWeight: '800',
    color: colors.ink,
  },
  money: {
    fontSize: type.money,
    fontWeight: '800',
    color: colors.ink,
    lineHeight: 64,
    letterSpacing: -1,
  },
  footer: {
    paddingHorizontal: space.lg,
    paddingBottom: space.lg,
    paddingTop: space.sm,
    gap: space.sm,
    borderTopWidth: 2,
    borderTopColor: colors.line,
    backgroundColor: colors.bg,
  },
});

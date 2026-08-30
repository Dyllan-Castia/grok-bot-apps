import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BigButton } from '@/components/BigButton';
import { parseHours, parseUsdToCents } from '@/lib/money';
import { splitTips } from '@/lib/split';
import { setPayoutResult } from '@/store/payoutSession';
import { useRoster } from '@/store/roster';
import { colors, radius, space, tap, type } from '@/theme';
import type { StaffMember } from '@/types';

export default function PayoutScreen() {
  const router = useRouter();
  const { staff } = useRoster();
  const [included, setIncluded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(staff.map((member) => [member.id, true])),
  );
  const [hours, setHours] = useState<Record<string, string>>({});
  const [envelope, setEnvelope] = useState('');

  const selected = staff.filter((member) => included[member.id]);

  const parsed = useMemo(() => {
    const envelopeCents = parseUsdToCents(envelope);
    const people = selected.map((member) => ({
      member,
      hours: parseHours(hours[member.id] ?? ''),
    }));
    const hoursValid = people.every((row) => row.hours !== null);
    const positiveHours = people.some((row) => (row.hours ?? 0) > 0);
    return {
      envelopeCents,
      people,
      hoursValid,
      canSplit: envelopeCents !== null && hoursValid && positiveHours,
    };
  }, [envelope, hours, selected]);

  function toggle(member: StaffMember) {
    setIncluded((current) => ({ ...current, [member.id]: !current[member.id] }));
  }

  function onSplit() {
    if (!parsed.canSplit || parsed.envelopeCents === null) {
      return;
    }
    const entries = parsed.people.map((row) => ({
      id: row.member.id,
      hours: row.hours ?? 0,
    }));
    const shares = splitTips(parsed.envelopeCents, entries);
    const shareById = Object.fromEntries(shares.map((share) => [share.id, share.cents]));
    setPayoutResult({
      envelopeCents: parsed.envelopeCents,
      people: parsed.people.map((row) => ({
        id: row.member.id,
        name: row.member.name,
        hours: row.hours ?? 0,
        cents: shareById[row.member.id] ?? 0,
      })),
    });
    router.push('/results');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.list} keyboardShouldPersistTaps="handled">
          <Text style={styles.kicker}>Who is in this payout?</Text>
          <Text style={styles.help}>
            Leave someone off if they were not on the floor. Type each person’s total hours for
            the whole period.
          </Text>
          {staff.map((member) => {
            const isIn = Boolean(included[member.id]);
            return (
              <View key={member.id} style={[styles.card, !isIn && styles.cardOff]}>
                <Pressable
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isIn }}
                  onPress={() => toggle(member)}
                  style={styles.includeRow}
                >
                  <View style={[styles.box, isIn && styles.boxOn]}>
                    <Text style={[styles.check, isIn && styles.checkOn]}>{isIn ? '✓' : ''}</Text>
                  </View>
                  <Text style={styles.name}>{member.name}</Text>
                </Pressable>
                {isIn ? (
                  <View style={styles.hoursBlock}>
                    <Text style={styles.label}>Hours</Text>
                    <TextInput
                      value={hours[member.id] ?? ''}
                      onChangeText={(value) =>
                        setHours((current) => ({ ...current, [member.id]: value }))
                      }
                      placeholder="0"
                      placeholderTextColor={colors.muted}
                      keyboardType="decimal-pad"
                      inputMode="decimal"
                      style={styles.input}
                    />
                  </View>
                ) : null}
              </View>
            );
          })}

          <View style={styles.card}>
            <Text style={styles.label}>Envelope</Text>
            <Text style={styles.helpTight}>Count the cash. Type the total tips.</Text>
            <View style={styles.moneyRow}>
              <Text style={styles.dollar}>$</Text>
              <TextInput
                value={envelope}
                onChangeText={setEnvelope}
                placeholder="0.00"
                placeholderTextColor={colors.muted}
                keyboardType="decimal-pad"
                inputMode="decimal"
                style={[styles.input, styles.moneyInput]}
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <BigButton hero label="Split" disabled={!parsed.canSplit} onPress={onSplit} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
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
    marginBottom: space.xs,
  },
  helpTight: {
    fontSize: type.label,
    color: colors.muted,
    lineHeight: 24,
    marginBottom: space.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 2,
    borderColor: colors.line,
    padding: space.md,
    gap: space.sm,
  },
  cardOff: {
    opacity: 0.55,
  },
  includeRow: {
    minHeight: tap.min,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  box: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: colors.espresso,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  boxOn: {
    backgroundColor: colors.espresso,
  },
  check: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.espresso,
  },
  checkOn: {
    color: colors.cream,
  },
  name: {
    flex: 1,
    fontSize: type.name,
    fontWeight: '800',
    color: colors.ink,
  },
  hoursBlock: {
    gap: 6,
  },
  label: {
    fontSize: type.label,
    fontWeight: '800',
    color: colors.ink,
  },
  input: {
    minHeight: tap.min,
    borderWidth: 2,
    borderColor: colors.inputBorder,
    borderRadius: radius.input,
    backgroundColor: colors.inputBg,
    paddingHorizontal: space.md,
    fontSize: type.name,
    fontWeight: '800',
    color: colors.ink,
  },
  moneyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  dollar: {
    fontSize: type.money,
    fontWeight: '800',
    color: colors.ink,
    lineHeight: 64,
  },
  moneyInput: {
    flex: 1,
    fontSize: 40,
  },
  footer: {
    paddingHorizontal: space.lg,
    paddingBottom: space.lg,
    paddingTop: space.sm,
    borderTopWidth: 2,
    borderTopColor: colors.line,
    backgroundColor: colors.bg,
  },
});

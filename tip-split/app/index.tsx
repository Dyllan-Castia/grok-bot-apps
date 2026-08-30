import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BigButton } from '@/components/BigButton';
import { ConfirmModal } from '@/components/ConfirmModal';
import { NameModal } from '@/components/NameModal';
import { StaffCard } from '@/components/StaffCard';
import { useRoster } from '@/store/roster';
import { colors, space, type } from '@/theme';
import type { StaffMember } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
  const { staff, ready, addStaff, renameStaff, removeStaff } = useRoster();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [removing, setRemoving] = useState<StaffMember | null>(null);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.espresso} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.list} keyboardShouldPersistTaps="handled">
        <Text style={styles.kicker}>Staff</Text>
        <Text style={styles.help}>
          Names stay on this phone. Hours come from payroll — type them in when you split.
        </Text>
        {staff.length === 0 ? (
          <Text style={styles.empty}>Add staff before you split tips.</Text>
        ) : (
          staff.map((member) => (
            <StaffCard
              key={member.id}
              member={member}
              onEdit={() => setEditing(member)}
              onRemove={() => setRemoving(member)}
            />
          ))
        )}
        <BigButton label="Add name" variant="secondary" onPress={() => setAdding(true)} />
      </ScrollView>
      <View style={styles.footer}>
        <BigButton
          hero
          label="Split tips"
          disabled={staff.length === 0}
          onPress={() => router.push('/payout')}
        />
      </View>

      <NameModal
        visible={adding}
        title="Add staff"
        onCancel={() => setAdding(false)}
        onSave={(name) => {
          void addStaff(name);
          setAdding(false);
        }}
      />
      <NameModal
        visible={Boolean(editing)}
        title="Edit name"
        initialName={editing?.name ?? ''}
        onCancel={() => setEditing(null)}
        onSave={(name) => {
          if (editing) {
            void renameStaff(editing.id, name);
          }
          setEditing(null);
        }}
      />
      <ConfirmModal
        visible={Boolean(removing)}
        title={removing ? `Remove ${removing.name}?` : 'Remove?'}
        body="They will come off the staff list on this phone."
        confirmLabel="Remove"
        onCancel={() => setRemoving(null)}
        onConfirm={() => {
          if (removing) {
            void removeStaff(removing.id);
          }
          setRemoving(null);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: space.xs,
  },
  empty: {
    fontSize: type.body,
    color: colors.muted,
    lineHeight: 28,
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

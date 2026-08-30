import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, space, type } from '@/theme';
import type { StaffMember } from '@/types';
import { BigButton } from '@/components/BigButton';

type Props = {
  member: StaffMember;
  onEdit: () => void;
  onRemove: () => void;
};

export function StaffCard({ member, onEdit, onRemove }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{member.name}</Text>
      <View style={styles.row}>
        <View style={styles.half}>
          <BigButton label="Edit" variant="secondary" onPress={onEdit} />
        </View>
        <View style={styles.half}>
          <BigButton label="Remove" variant="danger" onPress={onRemove} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 2,
    borderColor: colors.line,
    padding: space.md,
    gap: space.md,
  },
  name: {
    fontSize: type.name,
    fontWeight: '800',
    color: colors.ink,
  },
  row: {
    flexDirection: 'row',
    gap: space.sm,
  },
  half: {
    flex: 1,
  },
});

import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, space, type } from '@/theme';
import { BigButton } from '@/components/BigButton';

type Props = {
  visible: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  visible,
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.card} onPress={() => undefined}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
          <View style={styles.actions}>
            <BigButton label="Keep them" variant="secondary" onPress={onCancel} />
            <BigButton label={confirmLabel} variant="danger" onPress={onConfirm} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: space.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: space.lg,
    gap: space.md,
  },
  title: {
    fontSize: type.title,
    fontWeight: '800',
    color: colors.ink,
  },
  body: {
    fontSize: type.body,
    color: colors.muted,
    lineHeight: 28,
  },
  actions: {
    gap: space.sm,
    marginTop: space.sm,
  },
});

import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radius, space, tap, type } from '@/theme';
import { BigButton } from '@/components/BigButton';

type Props = {
  visible: boolean;
  title: string;
  initialName?: string;
  onSave: (name: string) => void;
  onCancel: () => void;
};

export function NameModal({ visible, title, initialName = '', onSave, onCancel }: Props) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (visible) {
      setName(initialName);
    }
  }, [visible, initialName]);

  const trimmed = name.trim();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.card} onPress={() => undefined}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.label}>Name</Text>
          <TextInput
            autoFocus
            value={name}
            onChangeText={setName}
            placeholder="First name"
            placeholderTextColor={colors.muted}
            autoCapitalize="words"
            autoCorrect={false}
            maxLength={40}
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={() => {
              if (trimmed) {
                onSave(trimmed);
              }
            }}
          />
          <View style={styles.actions}>
            <BigButton label="Save" onPress={() => onSave(trimmed)} disabled={!trimmed} />
            <BigButton label="Cancel" variant="ghost" onPress={onCancel} />
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
    gap: space.sm,
  },
  title: {
    fontSize: type.title,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: space.xs,
  },
  label: {
    fontSize: type.label,
    fontWeight: '700',
    color: colors.muted,
  },
  input: {
    minHeight: tap.min,
    borderWidth: 2,
    borderColor: colors.inputBorder,
    borderRadius: radius.input,
    backgroundColor: colors.inputBg,
    paddingHorizontal: space.md,
    fontSize: type.name,
    fontWeight: '700',
    color: colors.ink,
  },
  actions: {
    gap: space.sm,
    marginTop: space.sm,
  },
});

import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, tap, type } from '@/theme';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: Variant;
  hero?: boolean;
};

export function BigButton({
  label,
  onPress,
  disabled = false,
  variant = 'primary',
  hero = false,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        hero ? styles.hero : styles.regular,
        styles[variant],
        pressed && !disabled ? styles[`${variant}Pressed`] : null,
        disabled ? styles.disabled : null,
      ]}
    >
      <Text style={[styles.label, styles[`${variant}Label`], disabled ? styles.disabledLabel : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  regular: {
    minHeight: tap.min,
  },
  hero: {
    minHeight: tap.hero,
  },
  primary: {
    backgroundColor: colors.espresso,
  },
  primaryPressed: {
    backgroundColor: colors.espressoPressed,
  },
  primaryLabel: {
    color: colors.cream,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.espresso,
  },
  secondaryPressed: {
    backgroundColor: '#F3E6D8',
  },
  secondaryLabel: {
    color: colors.espresso,
  },
  danger: {
    backgroundColor: colors.dangerBg,
    borderWidth: 2,
    borderColor: colors.danger,
  },
  dangerPressed: {
    backgroundColor: '#F8D4D4',
  },
  dangerLabel: {
    color: colors.danger,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  ghostPressed: {
    backgroundColor: '#F3E6D8',
  },
  ghostLabel: {
    color: colors.espresso,
  },
  disabled: {
    backgroundColor: colors.disabled,
    borderColor: colors.disabled,
  },
  label: {
    fontSize: type.button,
    fontWeight: '800',
  },
  disabledLabel: {
    color: '#6B5A4C',
  },
});

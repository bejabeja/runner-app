import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, radius } from '../theme';
import { useTheme } from '../ThemeContext';

export function AppButton({ label, onPress, variant = 'primary', icon, disabled }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const isPrimary = variant === 'primary';
  return (
    <TouchableOpacity
      style={[isPrimary ? styles.primary : styles.secondary, disabled && styles.muted]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {icon && (
        <Ionicons name={icon} size={20} color={isPrimary ? colors.onPrimary : colors.primary} />
      )}
      <Text style={isPrimary ? styles.primaryText : styles.secondaryText}>{label}</Text>
    </TouchableOpacity>
  );
}

const makeStyles = (colors) => StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.full,
    width: '100%',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  secondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.primary,
    width: '100%',
    justifyContent: 'center',
  },
  muted: { opacity: 0.55 },
  primaryText: { color: colors.onPrimary, fontWeight: '700', fontSize: 16 },
  secondaryText: { color: colors.primary, fontWeight: '700', fontSize: 15 },
});

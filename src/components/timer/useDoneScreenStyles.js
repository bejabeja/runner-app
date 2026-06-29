import { StyleSheet } from 'react-native';
import { spacing, typography } from '../../theme';
import { useTheme } from '../../ThemeContext';

export function useDoneScreenStyles() {
  const { colors } = useTheme();
  return { styles: makeStyles(colors), colors };
}

const makeStyles = (colors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  doneScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  doneEmoji: { fontSize: 72 },
  doneTitle: { ...typography.h2, textAlign: 'center' },
  doneSub: { ...typography.bodySmall, textAlign: 'center', marginTop: -spacing.xs },
});

import { StyleSheet } from 'react-native';
import { radius, spacing, typography } from '../../theme';
import { useTheme } from '../../ThemeContext';

export function useSettingsStyles() {
  const { colors } = useTheme();
  return { styles: makeStyles(colors), colors };
}

const makeStyles = (colors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.xxl },

  screenTitle: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: spacing.lg },
  sectionHeader: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.xs, marginLeft: spacing.xs },

  card: { backgroundColor: colors.surface, borderRadius: radius.xl, overflow: 'hidden', marginBottom: spacing.lg },

  langRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.md, gap: spacing.md,
  },
  langFlag: { fontSize: 24 },
  langLabel: { fontSize: 15, fontWeight: '600', color: colors.text },

  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.md, gap: spacing.md,
  },
  rowIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { fontSize: 15, fontWeight: '600' },
  rowSublabel: { fontSize: 12, marginTop: 2, color: colors.textSecondary },

  divider: { height: 1, marginLeft: 38 + spacing.md * 2, backgroundColor: colors.border },
});

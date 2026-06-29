import { StyleSheet } from 'react-native';
import { radius, spacing, typography } from '../../theme';
import { useTheme } from '../../ThemeContext';

export function useAddRunStyles() {
  const { colors } = useTheme();
  return { styles: makeStyles(colors), colors };
}

const makeStyles = (colors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: colors.text },

  content: { padding: spacing.md, gap: spacing.md },
  section: { gap: spacing.xs },
  label: { ...typography.label, color: colors.textSecondary },

  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  arrowBtn: {
    width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surfaceElevated, borderRadius: radius.md,
  },
  arrowDisabled: { opacity: 0.3 },
  dateText: {
    flex: 1, fontSize: 16, fontWeight: '700', color: colors.text,
    textAlign: 'center', paddingHorizontal: spacing.sm,
  },

  stepBtn: {
    width: 44, height: 44, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surfaceElevated, borderRadius: radius.md,
  },
  stepBtnText: { fontSize: 24, fontWeight: '300', color: colors.text, lineHeight: 28 },
  stepValue: { fontSize: 20, fontWeight: '700', color: colors.text, minWidth: 110, textAlign: 'center' },
  paceHint: { fontSize: 12, fontWeight: '600', color: colors.primary, textAlign: 'center', marginTop: spacing.sm },

  feelingRow: { flexDirection: 'row', gap: spacing.sm },
  feelingBtn: {
    flex: 1, alignItems: 'center', paddingVertical: spacing.sm,
    backgroundColor: colors.surface, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: colors.border,
  },
  feelingBtnActive: { borderColor: colors.primary, backgroundColor: colors.surfaceElevated },
  feelingEmoji: { fontSize: 24, marginBottom: 2 },
  feelingLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  feelingLabelActive: { color: colors.primary },

  notesInput: {
    backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, color: colors.text, fontSize: 15,
    minHeight: 80, textAlignVertical: 'top',
  },

  sessionRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: colors.border,
    padding: spacing.md, marginBottom: spacing.xs,
  },
  sessionRowActive: { borderColor: colors.primary, backgroundColor: colors.surfaceElevated },
  sessionCheck: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  sessionCheckActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  sessionTitle: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 2 },
  sessionTitleActive: { color: colors.primary },
  sessionDesc: { fontSize: 12, color: colors.textSecondary },
  sessionDist: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
});

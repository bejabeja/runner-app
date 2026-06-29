import { StyleSheet } from 'react-native';
import { radius, spacing, typography } from '../../theme';
import { useTheme } from '../../ThemeContext';

export function useHistoryStyles() {
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
  headerTitle: { fontSize: 22, fontWeight: '800', color: colors.text },
  content: { padding: spacing.md },

  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  statCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.md, alignItems: 'center', gap: 3,
  },
  statVal: { fontSize: 20, fontWeight: '800', color: colors.text },
  statLbl: { fontSize: 11, fontWeight: '600', color: colors.textSecondary, textAlign: 'center' },

  section: { marginBottom: spacing.lg },
  sectionLabel: { ...typography.label, marginBottom: spacing.sm },

  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  chartImproving: { fontSize: 12, fontWeight: '700', color: colors.success },
  chartCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, gap: spacing.sm },
  chartBar: { width: '100%', borderRadius: 3 },
  chartBarLabel: { fontSize: 9, fontWeight: '800', color: colors.primary, marginBottom: 3 },
  chartFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chartFooterText: { fontSize: 11, color: colors.textSecondary },
  chartBest: { fontSize: 11, fontWeight: '700', color: colors.primary },

  weekGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  weekCell: {
    width: 52, height: 52, borderRadius: radius.md,
    backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border, gap: 2,
  },
  weekCellDone: { backgroundColor: colors.success + '18', borderColor: colors.success + '55' },
  weekCellCurrent: { borderColor: colors.primary, borderWidth: 2 },
  weekCellNum: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
  weekCellNumDone: { color: colors.success, fontSize: 16 },
  weekCellNumCurrent: { color: colors.primary },
  weekCellPct: { fontSize: 10, color: colors.textSecondary, fontWeight: '600' },

  runRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.sm,
  },
  runLeft: { flex: 1 },
  runDate: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 3 },
  runMeta: { fontSize: 13, color: colors.textSecondary },
  runNotes: { fontSize: 12, color: colors.textSecondary, marginTop: 2, fontStyle: 'italic' },
  runFeeling: { fontSize: 24, marginLeft: spacing.sm },

  emptyState: { alignItems: 'center', padding: spacing.xl, gap: spacing.sm },
  emptyText: { fontSize: 15, fontWeight: '600', color: colors.text, textAlign: 'center' },
  emptySubtext: { fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
});

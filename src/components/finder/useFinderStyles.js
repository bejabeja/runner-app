import { StyleSheet } from 'react-native';
import { radius, spacing, typography } from '../../theme';
import { useTheme } from '../../ThemeContext';

export function useFinderStyles() {
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
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: colors.text },

  stepRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  stepDotActive: { width: 24, backgroundColor: colors.primary },
  stepDotDone: { backgroundColor: colors.primary + '66' },

  content: { padding: spacing.md, paddingBottom: spacing.xxl },

  question: {
    fontSize: 22, fontWeight: '800', color: colors.text,
    marginBottom: spacing.lg, lineHeight: 30,
  },

  options: { gap: spacing.sm },
  optCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optCardSelected: { borderColor: colors.primary, backgroundColor: colors.surfaceElevated },
  optIcon: {
    width: 48, height: 48, borderRadius: radius.lg,
    backgroundColor: colors.primary + '18',
    alignItems: 'center', justifyContent: 'center',
  },
  optIconSelected: { backgroundColor: colors.primary },
  optLabel: { fontSize: 16, fontWeight: '600', color: colors.text, flex: 1 },
  optLabelSelected: { color: colors.primary },
  optSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  optCheck: { marginLeft: 'auto' },

  recPill: {
    backgroundColor: colors.warning + '22', borderRadius: 99,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  recPillText: { fontSize: 10, fontWeight: '700', color: colors.warning },

  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.warning + '18',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.warning + '44',
  },
  noteText: { flex: 1, fontSize: 13, color: colors.text, lineHeight: 20 },

  planCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: spacing.md,
    borderWidth: 1.5,
  },
  planColorBar: { width: 5 },
  planBody: { flex: 1, padding: spacing.md },
  planTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  planName: { fontSize: 18, fontWeight: '800', color: colors.text, flex: 1 },
  diffPill: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.full },
  diffText: { fontSize: 11, fontWeight: '700' },
  planDesc: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.sm },
  planMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  planMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  planMetaText: { ...typography.bodySmall },
  planMetaDot: { ...typography.bodySmall, color: colors.textSecondary },

  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md + 2,
    borderRadius: radius.full,
    marginBottom: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },

  allPlansBtn: { alignItems: 'center', paddingVertical: spacing.sm },
  allPlansBtnText: { fontSize: 14, color: colors.textSecondary, fontWeight: '600' },

  datePicker: {
    backgroundColor: colors.surface, borderRadius: radius.xl,
    padding: spacing.md, marginBottom: spacing.md,
    borderWidth: 1, borderColor: colors.border,
  },
  datePickerLabel: {
    fontSize: 11, fontWeight: '700', color: colors.textSecondary,
    letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: spacing.sm,
  },
  dateRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surfaceElevated, borderRadius: radius.lg,
    overflow: 'hidden', borderWidth: 1, borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  dateArrowBtn: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  dateTxt: { flex: 1, textAlign: 'center', fontSize: 15, fontWeight: '700', color: colors.text },
  dateChipRow: { flexDirection: 'row', gap: spacing.sm },
  dateChip: {
    flex: 1, alignItems: 'center', paddingVertical: spacing.xs + 2,
    borderRadius: radius.full, borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
  },
  dateChipActive: { borderColor: colors.primary, backgroundColor: colors.primary + '18' },
  dateChipTxt: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  dateChipTxtActive: { color: colors.primary },
});

import { StyleSheet } from 'react-native';
import { radius, spacing, typography } from '../../theme';
import { useTheme } from '../../ThemeContext';

export function useSessionDoneStyles() {
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
  closeBtn: { position: 'absolute', top: spacing.md, right: spacing.md },
  doneEmoji: { fontSize: 72 },
  doneTitle: { ...typography.h2, textAlign: 'center' },
  doneSub: { ...typography.bodySmall, textAlign: 'center', marginTop: -spacing.xs },
  distAdjust: { width: '100%', alignItems: 'center', gap: spacing.sm },
  distAdjustLabel: { ...typography.label },
  distStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
    overflow: 'hidden',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  distStepBtn: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  distStepVal: { flex: 1, textAlign: 'center', fontSize: 22, fontWeight: '800', color: colors.text },
  feelingSection: { width: '100%', alignItems: 'center', gap: spacing.sm },
  feelingQuestion: { fontSize: 15, fontWeight: '600', color: colors.text },
  feelingRow: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center' },
  feelingBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 4,
  },
  feelingBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceElevated,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  feelingEmoji: { fontSize: 28 },
  feelingLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  feelingLabelActive: { color: colors.primary },
});

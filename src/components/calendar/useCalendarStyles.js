import { StyleSheet, useWindowDimensions } from 'react-native';
import { radius, spacing } from '../../theme';
import { useTheme } from '../../ThemeContext';

export function useCalendarStyles() {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const s = width < 360 ? 0.9 : width > 414 ? 1.08 : 1;
  return { styles: makeCalStyles(colors, s), colors };
}

const makeCalStyles = (colors, s = 1) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface, borderRadius: radius.xl,
    paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.sm,
    marginBottom: spacing.md,
  },
  calNavRow: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: spacing.sm,
  },
  calMonthBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    gap: spacing.sm, paddingVertical: 2,
  },
  todayChip: {
    backgroundColor: colors.primary + '22', borderRadius: radius.full,
    paddingHorizontal: 7, paddingVertical: 2, borderWidth: 1, borderColor: colors.primary + '44',
  },
  todayChipText: { fontSize: 10, fontWeight: '700', color: colors.primary },
  monthLabel: { fontSize: Math.round(15 * s), fontWeight: '700', color: colors.text, textTransform: 'capitalize' },
  row: { flexDirection: 'row', justifyContent: 'space-around', marginTop: spacing.xs },
  cell: { flex: 1, alignItems: 'center', paddingVertical: 3 },
  dayLabel: { fontSize: 10, fontWeight: '600', color: colors.textSecondary, letterSpacing: 0.2 },
  circle: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: 'transparent',
  },
  dateNum: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
  selDot: { width: 4, height: 4, borderRadius: 2, marginTop: 2, backgroundColor: 'transparent' },
  activeWeekRow: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    marginHorizontal: -4,
    paddingHorizontal: 4,
    marginTop: 0,
    paddingTop: spacing.xs,
  },
  weekDropBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: colors.surfaceElevated, borderRadius: radius.full,
    paddingHorizontal: spacing.sm, paddingVertical: 3,
    borderWidth: 1, borderColor: colors.border,
  },
  weekDropText: { fontSize: 11, fontWeight: '700', color: colors.textSecondary },
  pickerOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    backgroundColor: colors.background, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.md, paddingBottom: 32, paddingTop: spacing.sm,
    maxHeight: 480,
  },
  pickerHandle: {
    width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border,
    alignSelf: 'center', marginBottom: spacing.md,
  },
  pickerItem: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border,
  },
  pickerItemActive: { opacity: 1 },
  pickerItemWeek: { fontSize: 14, fontWeight: '700', color: colors.text, minWidth: 80 },
  pickerItemRange: { flex: 1, fontSize: 13, color: colors.textSecondary },
});

import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { radius, spacing } from '../../theme';
import { useTheme } from '../../ThemeContext';

export function useHomeStyles() {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const s = width < 360 ? 0.9 : width > 414 ? 1.08 : 1;
  return { styles: makeStyles(colors, s), colors };
}

export function StatCell({ value, label }) {
  const { styles } = useHomeStyles();
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={styles.statCellValue}>{value}</Text>
      <Text style={styles.statCellLabel}>{label}</Text>
    </View>
  );
}

const makeStyles = (colors, s = 1) => {
  const fs = (n) => Math.round(n * s);
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    scroll: { flex: 1 },
    content: { paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.xxl },

    header: {
      flexDirection: 'row', alignItems: 'flex-start',
      justifyContent: 'space-between', marginBottom: spacing.md,
    },
    greeting: { fontSize: fs(20), fontWeight: '800', color: colors.text, marginBottom: 2 },
    dateLabel: { fontSize: 13, fontWeight: '500', color: colors.textSecondary, textTransform: 'capitalize' },
    streakLabel: { fontSize: fs(14), fontWeight: '700', color: colors.text, marginTop: 4 },
    statCellValue: { fontSize: fs(20), fontWeight: '800', color: colors.text, marginBottom: 2 },
    statCellLabel: { fontSize: 10, fontWeight: '700', color: colors.textSecondary, letterSpacing: 0.8, textTransform: 'uppercase' },

    heroCard: {
      backgroundColor: colors.surfaceElevated, borderRadius: radius.xxl,
      marginBottom: spacing.md, overflow: 'hidden',
      borderWidth: 1, borderColor: colors.border,
      shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18, shadowRadius: 16, elevation: 4,
    },
    heroStripe: { height: 4, backgroundColor: colors.primary },
    heroContent: { padding: spacing.lg, gap: spacing.sm },
    heroHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xs },
    heroMetaText: { fontSize: 11, fontWeight: '700', color: colors.primary, letterSpacing: 1.2, textTransform: 'uppercase' },
    heroMetaMins: {
      fontSize: 11, fontWeight: '700', color: colors.textSecondary,
      backgroundColor: colors.border, borderRadius: radius.full,
      paddingHorizontal: spacing.sm, paddingVertical: 2,
    },
    heroWeatherText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
    heroTitle: { fontSize: fs(22), fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
    heroStats: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.md },
    heroStatDist: { fontSize: fs(34), fontWeight: '800', color: colors.text, letterSpacing: -1 },
    heroStatInterval: { fontSize: fs(14), fontWeight: '600', color: colors.textSecondary },
    phaseBar: { flexDirection: 'row', height: 6, borderRadius: 3, overflow: 'hidden', marginVertical: spacing.xs },
    phaseSegment: { height: '100%' },
    startBtn: {
      backgroundColor: colors.primary, borderRadius: radius.full,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      paddingVertical: spacing.md, gap: spacing.sm, marginTop: spacing.xs,
    },
    startBtnText: { color: '#fff', fontWeight: '800', fontSize: fs(16) },

    statsRow: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: colors.surface, borderRadius: radius.xl,
      paddingVertical: spacing.md, paddingHorizontal: spacing.md, marginBottom: spacing.md,
    },
    statDivider: { width: 1, height: 32, backgroundColor: colors.border },

    congratCard: {
      backgroundColor: colors.surface, borderRadius: radius.xl,
      marginBottom: spacing.md, overflow: 'hidden',
      borderWidth: 1, borderColor: colors.success + '30',
    },
    congratStripe: { height: 4, backgroundColor: colors.success },
    congratContent: { padding: spacing.lg, gap: spacing.sm },
    congratHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xs },
    congratLabel: { fontSize: 10, fontWeight: '700', color: colors.success, letterSpacing: 1.2 },
    congratWeatherText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
    congratTitle: { fontSize: fs(22), fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
    congratSub: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
    congratWeekRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
    congratDots: { flexDirection: 'row', gap: 5 },
    congratDot: {
      width: 10, height: 10, borderRadius: 5,
      backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.textSecondary + '50',
    },
    congratDotDone: { backgroundColor: colors.success, borderColor: colors.success },
    congratWeekText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
    congratDivider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xs },
    congratNext: { flexDirection: 'row', alignItems: 'center' },
    congratNextPlay: {
      width: 34, height: 34, borderRadius: 17,
      borderWidth: 1.5, borderColor: colors.success + '66',
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'transparent', overflow: 'hidden',
    },

    restCard: {
      backgroundColor: colors.surface, borderRadius: radius.xl,
      padding: spacing.lg, marginBottom: spacing.md, gap: spacing.sm,
    },
    restHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xs },
    restLabel: { fontSize: 10, fontWeight: '700', color: colors.textSecondary, letterSpacing: 1.2, textTransform: 'uppercase' },
    restWeatherText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
    restTitle: { fontSize: fs(18), fontWeight: '800', color: colors.text },
    restSub: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
    weekDotsRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
    weekDots: { flexDirection: 'row', gap: 5 },
    weekDot: {
      width: 10, height: 10, borderRadius: 5,
      backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.textSecondary + '50',
    },
    weekDotDone: { backgroundColor: colors.success, borderColor: colors.success },
    weekDotText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
    restDivider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xs },
    restNext: { flexDirection: 'row', alignItems: 'center' },
    restNextPlay: {
      width: 34, height: 34, borderRadius: 17,
      borderWidth: 1.5, borderColor: colors.primary + '55',
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'transparent', overflow: 'hidden',
    },
    nextLabel: { fontSize: 10, fontWeight: '700', color: colors.primary, letterSpacing: 1, marginBottom: 3 },
    nextTitle: { fontSize: fs(14), fontWeight: '700', color: colors.text },

    noPlanCard: {
      backgroundColor: colors.surfaceElevated, borderRadius: radius.xl,
      marginBottom: spacing.md, overflow: 'hidden',
      borderWidth: 1, borderColor: colors.border,
    },
    noPlanContent: { padding: spacing.lg, gap: spacing.sm },
    noPlanLabel: { fontSize: 10, fontWeight: '700', color: colors.primary, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: spacing.xs },
    noPlanTitle: { fontSize: fs(20), fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
    noPlanSub: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
    noPlanBtn: {
      backgroundColor: colors.primary, borderRadius: radius.full,
      flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
      paddingVertical: spacing.sm + 4, paddingHorizontal: spacing.lg,
      alignSelf: 'flex-start', marginTop: spacing.xs,
    },
    noPlanBtnText: { color: '#fff', fontWeight: '800', fontSize: fs(15) },

    pendingSection: {
      backgroundColor: colors.surface, borderRadius: radius.xl,
      paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.xs,
      marginBottom: spacing.md, borderWidth: 1, borderColor: 'rgba(255,92,0,0.25)',
    },
    pendingSectionLabel: { fontSize: 10, fontWeight: '700', color: colors.primary, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: spacing.xs },
    pendingRow: {
      flexDirection: 'row', alignItems: 'center',
      paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.sm,
    },
    pendingDay: { fontSize: 10, fontWeight: '700', color: colors.textSecondary, letterSpacing: 0.8, marginBottom: 2 },
    pendingType: { fontSize: fs(14), fontWeight: '700', color: colors.text },
    pendingDist: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
    pendingPlay: {
      width: 32, height: 32, borderRadius: 16,
      borderWidth: 1.5, borderColor: colors.primary + '66',
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'transparent', overflow: 'hidden',
    },

    progressCard: {
      backgroundColor: colors.surface, borderRadius: radius.xl,
      paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.md, marginBottom: spacing.md,
    },
    progressHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
    progressLabel: { fontSize: 10, fontWeight: '700', color: colors.textSecondary, letterSpacing: 1, textTransform: 'uppercase' },
    progressCount: { fontSize: 12, fontWeight: '700', color: colors.text },
    progressTrack: { height: 4, backgroundColor: colors.border, borderRadius: radius.full, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: radius.full },

    missedSecBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: spacing.xs, paddingVertical: spacing.sm,
    },
    missedSecBtnText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },

    pastRunRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs, flexWrap: 'wrap' },
    pastRunStat: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
    pastRunFeeling: { fontSize: 20 },

    changeDayBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 4 },
    changeDayText: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },

    pickerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
    dayPickerSheet: {
      backgroundColor: colors.background, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
      paddingHorizontal: spacing.md, paddingBottom: 32, paddingTop: spacing.sm,
    },
    dayPickerHandle: {
      width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border,
      alignSelf: 'center', marginBottom: spacing.md,
    },
    dayPickerTitle: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.md, letterSpacing: 0.5, textTransform: 'uppercase' },
    dayPickerGrid: { flexDirection: 'row', justifyContent: 'space-between' },
    dayPickerCell: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, gap: 3, borderRadius: radius.md },
    dayPickerCellActive: { backgroundColor: colors.primary + '18' },
    dayPickerCellPast: { opacity: 0.45 },
    dayPickerAbbr: { fontSize: 10, fontWeight: '700', color: colors.textSecondary, letterSpacing: 0.5 },
    dayPickerDate: { fontSize: 16, fontWeight: '700', color: colors.text },
    dayPickerTodayDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.success },
  });
};

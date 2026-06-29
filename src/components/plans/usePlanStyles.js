import { StyleSheet } from 'react-native';
import { DIFFICULTY_COLOR, radius, spacing, typography } from '../../theme';
import { useTheme } from '../../ThemeContext';

export function usePlanStyles() {
  const { colors } = useTheme();
  return { styles: makeStyles(colors), colors };
}

const makeStyles = (colors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  summary: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  summaryLabel: {
    fontSize: 12, fontWeight: '700', color: colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2,
  },
  summaryName: { fontSize: 20, fontWeight: '700', color: colors.text },
  abandonBtn: {
    paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.error + '80',
  },
  abandonText: { color: colors.error, fontWeight: '600', fontSize: 12 },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 17, fontWeight: '700', color: colors.text },
  statLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, height: 28, backgroundColor: colors.border },
  progressTrack: { height: 6, backgroundColor: colors.border, borderRadius: radius.full, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: radius.full },

  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    backgroundColor: colors.background,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  weekHeaderLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  weekHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  weekLabel: { fontSize: 11, fontWeight: '800', color: colors.textSecondary, letterSpacing: 0.8 },
  weekFocus: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  weekCount: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },

  sessionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  checkbox: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, marginTop: 1,
  },
  sessionInfo: { flex: 1 },
  sessionTopRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 2,
  },
  sessionDay: { fontSize: 14, fontWeight: '700', color: colors.text },
  sessionDist: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  sessionType: { fontSize: 13, color: colors.textSecondary, marginBottom: 2 },
  sessionMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2, fontWeight: '500' },
  sessionPhases: { fontSize: 11, color: colors.textSecondary, marginTop: 3, fontStyle: 'italic' },
  doneText: { color: colors.textSecondary, textDecorationLine: 'line-through' },

  sectionDivider: { height: 1, backgroundColor: colors.border, marginTop: 1 },

  finderBanner: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginBottom: spacing.lg,
  },
  finderBannerBody: { flex: 1 },
  finderBannerTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 2 },
  finderBannerSub: { fontSize: 12, color: colors.textSecondary, lineHeight: 17 },
  finderBannerBtn: { fontSize: 13, fontWeight: '700', color: colors.primary, marginTop: spacing.xs },

  browseContent: { padding: spacing.md, paddingBottom: spacing.xxl },
  browseHero: { alignItems: 'center', paddingVertical: spacing.xl, marginBottom: spacing.md },
  browseHeroEmoji: { fontSize: 56, marginBottom: spacing.sm },
  browseHeroTitle: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: spacing.xs },
  browseHeroSub: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  recommendedPill: {
    backgroundColor: colors.warning + '22', borderRadius: radius.full,
    paddingHorizontal: spacing.sm, paddingVertical: 3,
    borderWidth: 1, borderColor: colors.warning + '55',
  },
  recommendedText: { fontSize: 10, fontWeight: '700', color: colors.warning },
  browseCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  browseColorBar: { width: 4 },
  browseCardBody: { flex: 1, padding: spacing.md },
  browseCardTop: {
    flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: spacing.xs,
  },
  browseName: { fontSize: 16, fontWeight: '700', color: colors.text, flex: 1, marginRight: spacing.sm },
  diffPill: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.full },
  diffText: { fontSize: 11, fontWeight: '600' },
  browseDesc: { ...typography.body, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.sm },
  browseMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.md },
  browseMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  browseMetaText: { ...typography.bodySmall },
  browseMetaDot: { ...typography.bodySmall, color: colors.textSecondary },
  startBtn: { paddingVertical: spacing.sm + 2, borderRadius: radius.full, alignItems: 'center' },
  startBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  celebrationOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center',
    justifyContent: 'center', padding: spacing.xl,
  },
  celebrationCard: {
    backgroundColor: colors.surface, borderRadius: radius.xl,
    padding: spacing.xl, alignItems: 'center', gap: spacing.md,
    width: '100%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 24, elevation: 12,
  },
  celebrationEmoji: { fontSize: 72 },
  celebrationTitle: { ...typography.h2, textAlign: 'center' },
  celebrationSub: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: -spacing.xs },
  celebrationBtn: {
    backgroundColor: colors.primary, borderRadius: radius.full,
    paddingVertical: spacing.md, paddingHorizontal: spacing.xl,
    marginTop: spacing.xs, width: '100%', alignItems: 'center',
  },
  celebrationBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

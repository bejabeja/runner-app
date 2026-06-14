import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../theme';
import { getActivePlan, getLastRun } from '../storage/storage';
import { getProgress } from '../storage/progress';
import { getTodaysWorkout } from '../utils/todaysWorkout';
import { TRAINING_PLANS } from '../data/trainingPlans';
import { parseIntervals } from '../utils/parseIntervals';

const FEELING_EMOJI = { easy: '😌', good: '💪', hard: '🔥' };

const formatRelativeDate = (iso) => {
  const d = new Date(iso);
  const diffDays = Math.floor((Date.now() - d) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'hoy';
  if (diffDays === 1) return 'ayer';
  return d.toLocaleDateString('es-ES', { weekday: 'long' });
};

const DAY_ORDER = { 'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Jueves': 4, 'Viernes': 5, 'Sábado': 6, 'Domingo': 0 };
const WEEK_DAYS = [
  { label: 'L', js: 1 }, { label: 'M', js: 2 }, { label: 'X', js: 3 }, { label: 'J', js: 4 },
  { label: 'V', js: 5 }, { label: 'S', js: 6 }, { label: 'D', js: 0 },
];

// Returns total estimated minutes for a session description
const getEstimatedMins = (description) => {
  const intervals = parseIntervals(description);
  if (!intervals) return null;
  const total = intervals.reduce((s, iv) => s + (iv.duration || 0), 0);
  return total > 0 ? Math.round(total / 60) : null;
};

// Returns phase chips for the hero card: [{label, bg, color}]
const getPhaseChips = (description) => {
  const intervals = parseIntervals(description);
  if (!intervals || intervals.length === 0) return null;
  const chips = [];
  let i = 0;
  while (i < intervals.length) {
    const iv = intervals[i];
    const dur = iv.duration ? Math.round(iv.duration / 60) : 0;
    if (iv.type === 'warmup') {
      chips.push({ label: `${dur}' calienta`, bg: 'rgba(217,119,6,0.25)', color: '#FBBF24' });
      i++;
    } else if (iv.type === 'cooldown') {
      chips.push({ label: `${dur}' enfría`, bg: 'rgba(124,58,237,0.25)', color: '#C4B5FD' });
      i++;
    } else if (iv.type === 'run' && iv.totalReps && i + 1 < intervals.length && intervals[i + 1]?.type === 'walk') {
      const walkDur = Math.round(intervals[i + 1].duration / 60);
      chips.push({ label: `${dur}'/${walkDur}' ×${iv.totalReps}`, bg: 'rgba(255,255,255,0.18)', color: '#fff' });
      i += iv.totalReps * 2;
    } else if (iv.type === 'run') {
      chips.push({ label: `Corre ${dur}'`, bg: 'rgba(255,255,255,0.18)', color: '#fff' });
      i++;
    } else if (iv.type === 'walk') {
      chips.push({ label: `Camina ${dur}'`, bg: 'rgba(37,99,235,0.25)', color: '#93C5FD' });
      i++;
    } else {
      i++;
    }
  }
  return chips.length > 0 ? chips : null;
};

// Returns the next upcoming session after today in the current week
const getNextWorkout = (weekSchedule, activePlanData, weekNum) => {
  if (!weekSchedule || !activePlanData) return null;
  const todayJs = new Date().getDay();
  const remaining = weekSchedule.sessions
    .map((s, idx) => ({ ...s, sessionIdx: idx }))
    .filter((s) => {
      const d = DAY_ORDER[s.day];
      return d !== todayJs && (todayJs === 0 ? d > 0 : d > todayJs);
    })
    .sort((a, b) => DAY_ORDER[a.day] - DAY_ORDER[b.day]);
  if (!remaining.length) return null;
  return { ...remaining[0], week: weekNum, planId: activePlanData.planId };
};

export default function HomeScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [todaysWorkout, setTodaysWorkout] = useState(null);
  const [nextWorkout, setNextWorkout] = useState(null);
  const [activePlanData, setActivePlanData] = useState(null);
  const [planObj, setPlanObj] = useState(null);
  const [weekNum, setWeekNum] = useState(null);
  const [weekProgress, setWeekProgress] = useState({});
  const [allProgress, setAllProgress] = useState({});
  const [lastRun, setLastRun] = useState(null);

  const load = useCallback(async () => {
    const activePlan = await getActivePlan();
    if (!activePlan) {
      setActivePlanData(null); setPlanObj(null); setTodaysWorkout(null); setNextWorkout(null); setWeekNum(null);
      return;
    }
    const plan = TRAINING_PLANS.find((p) => p.id === activePlan.planId);
    const week = Math.min(
      Math.floor((Date.now() - new Date(activePlan.startDate)) / (1000 * 60 * 60 * 24 * 7)) + 1,
      plan?.weeks || 1
    );
    const progress = await getProgress();
    const wProg = progress[activePlan.planId]?.[week] || {};
    const weekSched = plan?.schedule.find((w) => w.week === week);
    const todayW = getTodaysWorkout(plan, activePlan);
    const nextW = getNextWorkout(weekSched, activePlan, week);
    setActivePlanData(activePlan);
    setPlanObj(plan);
    setWeekNum(week);
    setWeekProgress(wProg);
    setAllProgress(progress);
    setTodaysWorkout(todayW);
    setNextWorkout(nextW);
    setLastRun(await getLastRun());
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';

  const weekSchedule = planObj && weekNum ? planObj.schedule.find((w) => w.week === weekNum) : null;

  // Build a set of training day names for calendar
  const trainingDayNames = new Set(weekSchedule?.sessions.map((s) => s.day) || []);
  const doneDayNames = new Set(
    weekSchedule?.sessions
      .filter((_, idx) => !!weekProgress[idx])
      .map((s) => s.day) || []
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Section A: Header row ── */}
        {activePlanData && weekNum && (
          <View style={styles.header}>
            <Text style={styles.greeting}>{greeting}</Text>
            <View style={styles.weekPill}>
              <Text style={styles.weekPillText}>S{weekNum}</Text>
            </View>
          </View>
        )}

        {/* ── Section B: Hero card ── */}
        {todaysWorkout ? (
          /* Training day */
          <View style={styles.heroCard}>
            {/* Top row */}
            <View style={styles.heroTopRow}>
              <Text style={styles.heroTopLabel}>ENTRENO DE HOY</Text>
              {(() => {
                const mins = getEstimatedMins(todaysWorkout.description);
                return mins ? (
                  <View style={styles.minsPill}>
                    <Text style={styles.minsPillText}>~{mins} min</Text>
                  </View>
                ) : null;
              })()}
            </View>

            {/* Session type */}
            <Text style={styles.heroTitle}>{todaysWorkout.type}</Text>

            {/* Phase chips */}
            {(() => {
              const chips = getPhaseChips(todaysWorkout.description);
              return chips ? (
                <View style={styles.chipsRow}>
                  {chips.map((chip, idx) => (
                    <View key={idx} style={[styles.chip, { backgroundColor: chip.bg }]}>
                      <Text style={[styles.chipText, { color: chip.color }]}>{chip.label}</Text>
                    </View>
                  ))}
                </View>
              ) : null;
            })()}

            {/* Stats row */}
            <Text style={styles.heroStats}>
              {todaysWorkout.distance} km · Semana {weekNum} de {planObj?.weeks}
            </Text>

            {/* Start button */}
            <TouchableOpacity
              style={styles.startBtn}
              onPress={() => navigation.navigate('IntervalTimer', {
                session: todaysWorkout,
                planId: todaysWorkout.planId,
                week: todaysWorkout.week,
                sessionIdx: todaysWorkout.sessionIdx,
              })}
              activeOpacity={0.85}
            >
              <Text style={styles.startBtnText}>Empezar</Text>
              <Ionicons name="arrow-forward" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        ) : activePlanData ? (
          /* Rest day */
          <View style={styles.restCard}>
            <Ionicons name="moon" size={28} color={colors.textSecondary} />
            <Text style={styles.restTitle}>Descanso hoy</Text>
            <Text style={styles.restSub}>Tu cuerpo se recupera y se hace más fuerte.</Text>
            {nextWorkout && (
              <View style={styles.nextRow}>
                <Ionicons name="calendar-outline" size={15} color={colors.textSecondary} />
                <Text style={styles.nextText}>
                  Próximo: <Text style={styles.nextBold}>{nextWorkout.day}</Text>
                  {' · '}{nextWorkout.type}
                </Text>
              </View>
            )}
          </View>
        ) : (
          /* No plan */
          <View style={styles.noPlanCard}>
            <Ionicons name="trophy-outline" size={32} color={colors.primary} />
            <Text style={styles.noPlanTitle}>Tu camino al 5K empieza aquí</Text>
            <Text style={styles.noPlanSub}>Elige un plan y te guiaremos cada día</Text>
            <TouchableOpacity
              style={styles.noPlanBtn}
              onPress={() => navigation.navigate('Plans')}
              activeOpacity={0.85}
            >
              <Text style={styles.noPlanBtnText}>Ver planes →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Last run recap ── */}
        {lastRun && (
          <View style={styles.lastRunCard}>
            <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.lastRunText}>
              {'Última: '}
              <Text style={styles.lastRunBold}>{formatRelativeDate(lastRun.date)}</Text>
              {` · ${Math.round(lastRun.duration / 60)} min`}
              {lastRun.feeling ? `  ${FEELING_EMOJI[lastRun.feeling]}` : ''}
            </Text>
          </View>
        )}

        {/* ── Section C: Week calendar ── */}
        {activePlanData && weekSchedule && (
          <View style={styles.calendarSection}>
            <Text style={styles.sectionLabel}>ESTA SEMANA</Text>
            <View style={styles.calendarRow}>
              {WEEK_DAYS.map(({ label, js }) => {
                const todayJs = new Date().getDay();
                const isToday = js === todayJs;
                const dayName = Object.keys(DAY_ORDER).find((k) => DAY_ORDER[k] === js);
                const isTraining = !!dayName && trainingDayNames.has(dayName);
                const isDone = !!dayName && doneDayNames.has(dayName);

                return (
                  <View key={label} style={styles.calDayCol}>
                    {isTraining ? (
                      isDone ? (
                        /* Done training day: filled success circle */
                        <View style={[styles.calCircle, styles.calCircleDone]}>
                          <Ionicons name="checkmark" size={14} color="#fff" />
                        </View>
                      ) : isToday ? (
                        /* Today + training: primary ring with faint fill */
                        <View style={[styles.calCircle, styles.calCircleToday]}>
                          <Text style={styles.calLabelToday}>{label}</Text>
                        </View>
                      ) : (
                        /* Upcoming training: outlined primary circle */
                        <View style={[styles.calCircle, styles.calCircleTraining]}>
                          <Text style={styles.calLabelTraining}>{label}</Text>
                        </View>
                      )
                    ) : (
                      /* Rest day: dim label, no circle */
                      <View style={styles.calCircleEmpty}>
                        <Text style={[styles.calLabelRest, isToday && styles.calLabelRestToday]}>{label}</Text>
                      </View>
                    )}
                    <Text style={[
                      styles.calDayLabel,
                      isToday && styles.calDayLabelToday,
                      isTraining && !isToday && styles.calDayLabelTraining,
                    ]}>
                      {label}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* ── Section D: Journey progress ── */}
        {activePlanData && planObj && weekNum && (() => {
          const planId = activePlanData.planId;
          const totalDone = planObj.schedule.reduce((acc, w) =>
            acc + Object.values(allProgress[planId]?.[w.week] || {}).filter(Boolean).length, 0);
          const totalKm = planObj.schedule.reduce((acc, w) =>
            acc + w.sessions.reduce((s, session, idx) =>
              s + (allProgress[planId]?.[w.week]?.[idx] ? (parseFloat(session.distance) || 0) : 0), 0), 0);
          return (
            <>
              <View style={styles.progressSection}>
            <Text style={styles.sectionLabel}>PROGRESO</Text>
            <View style={styles.progressRow}>
              <Text style={styles.progressWeekText}>Semana {weekNum}</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${(weekNum / planObj.weeks) * 100}%` }]} />
              </View>
              <View style={styles.progressEnd}>
                <Ionicons name="trophy" size={14} color={colors.primary} />
                <Text style={styles.progressEndText}>5K</Text>
              </View>
            </View>
            <Text style={styles.progressSub}>
              {planObj.weeks - weekNum > 0
                ? `${planObj.weeks - weekNum} semanas para completar el plan`
                : '¡Plan completado!'}
            </Text>
          </View>

              {totalDone > 0 && (
                <TouchableOpacity
                  style={styles.statsPillsRow}
                  onPress={() => navigation.navigate('History')}
                  activeOpacity={0.75}
                >
                  <View style={styles.statsPill}>
                    <Text style={styles.statsPillValue}>{totalDone}</Text>
                    <Text style={styles.statsPillLabel}>sesiones</Text>
                  </View>
                  <View style={styles.statsPillDivider} />
                  <View style={styles.statsPill}>
                    <Text style={styles.statsPillValue}>{totalKm.toFixed(1)}</Text>
                    <Text style={styles.statsPillLabel}>km totales</Text>
                  </View>
                  <View style={{ paddingRight: spacing.sm, justifyContent: 'center' }}>
                    <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                  </View>
                </TouchableOpacity>
              )}
            </>
          );
        })()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },

  // ── Section A: Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  greeting: { fontSize: 24, fontWeight: '800', color: colors.text },
  weekPill: {
    backgroundColor: colors.primary + '22',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.primary + '55',
  },
  weekPillText: { color: colors.primary, fontWeight: '800', fontSize: 13 },

  // ── Section B: Hero card (training day) ──
  heroCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  heroTopLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  minsPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  minsPillText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  heroTitle: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: spacing.sm },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  chip: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  chipText: { fontSize: 12, fontWeight: '600' },
  heroStats: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
    marginBottom: spacing.md,
  },
  startBtn: {
    backgroundColor: '#fff',
    borderRadius: radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    gap: spacing.sm,
  },
  startBtnText: { color: colors.primary, fontWeight: '800', fontSize: 17 },

  // ── Section B: Rest day card ──
  restCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.success,
    gap: spacing.xs,
  },
  restTitle: { ...typography.h2, marginTop: spacing.xs },
  restSub: { ...typography.bodySmall, lineHeight: 20 },
  nextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  nextText: { fontSize: 13, color: colors.textSecondary },
  nextBold: { fontWeight: '700', color: colors.text },

  // ── Section B: No plan card ──
  noPlanCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  noPlanTitle: { fontSize: 20, fontWeight: '700', color: colors.text },
  noPlanSub: { ...typography.bodySmall, lineHeight: 20 },
  noPlanBtn: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.xl,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  noPlanBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },

  // ── Last run recap ──
  lastRunCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    marginBottom: spacing.md,
  },
  lastRunText: { fontSize: 13, color: colors.textSecondary, flex: 1 },
  lastRunBold: { fontWeight: '700', color: colors.text },

  // ── Section C: Week calendar ──
  calendarSection: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  calDayCol: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  calCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calCircleDone: {
    backgroundColor: colors.success,
  },
  calCircleToday: {
    backgroundColor: colors.primary + '33',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  calCircleTraining: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  calCircleEmpty: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calLabelToday: { fontSize: 13, fontWeight: '800', color: colors.primary },
  calLabelTraining: { fontSize: 13, fontWeight: '700', color: colors.primary },
  calLabelRest: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
  calLabelRestToday: { color: colors.text, fontWeight: '700' },
  calDayLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  calDayLabelToday: { color: colors.primary, fontWeight: '800' },
  calDayLabelTraining: { color: colors.text, fontWeight: '600' },

  // ── Section D: Journey progress ──
  progressSection: {
    marginBottom: spacing.lg,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  progressWeekText: { fontSize: 13, fontWeight: '700', color: colors.text, minWidth: 68 },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  progressEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    minWidth: 36,
    justifyContent: 'flex-end',
  },
  progressEndText: { fontSize: 12, fontWeight: '700', color: colors.primary },
  progressSub: { ...typography.bodySmall },

  // ── Section E: Stats pills ──
  statsPillsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  statsPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statsPillDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  statsPillValue: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 2 },
  statsPillLabel: { fontSize: 11, fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
});

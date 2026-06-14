import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, radius, typography } from '../theme';
import { TRAINING_PLANS } from '../data/trainingPlans';
import { getActivePlan, setActivePlan, clearActivePlan } from '../storage/storage';
import { getProgress, toggleSession, clearProgress } from '../storage/progress';
import { parseIntervals, getPhaseSummaryText } from '../utils/parseIntervals';

const getEstimatedMins = (description) => {
  const intervals = parseIntervals(description);
  if (!intervals) return null;
  const total = intervals.reduce((s, iv) => s + (iv.duration || 0), 0);
  return total > 0 ? Math.round(total / 60) : null;
};

const confirm = (title, message, onConfirm) => {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
  } else {
    Alert.alert(title, message, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Confirmar', onPress: onConfirm },
    ]);
  }
};

const DIFFICULTY_COLOR = {
  'Principiante': '#48BB78',
  'Intermedio': '#4299E1',
  'Avanzado': '#9F7AEA',
};

export default function PlansScreen({ navigation }) {
  const [activePlan, setActivePlanState] = useState(null);
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [progress, setProgress] = useState({});
  const [celebration, setCelebration] = useState(null);

  useFocusEffect(useCallback(() => {
    Promise.all([getActivePlan(), getProgress()]).then(([plan, prog]) => {
      setActivePlanState(plan);
      setProgress(prog);
      if (plan) {
        const planObj = TRAINING_PLANS.find((p) => p.id === plan.planId);
        const week = Math.min(
          Math.floor((Date.now() - new Date(plan.startDate)) / (1000 * 60 * 60 * 24 * 7)) + 1,
          planObj?.weeks || 1
        );
        setExpandedWeek(`w${week}`);
      }
    });
  }, []));

  const handleSelectPlan = (plan) => {
    confirm(
      `¿Iniciar "${plan.name}"?`,
      `Plan de ${plan.weeks} semanas para llegar a ${plan.goal}.`,
      async () => {
        const data = { planId: plan.id, startDate: new Date().toISOString() };
        await setActivePlan(data);
        setActivePlanState(data);
        setExpandedWeek('w1');
      }
    );
  };

  const handleDeactivate = () => {
    confirm(
      'Abandonar plan',
      '¿Seguro? Se perderá el progreso registrado.',
      async () => {
        if (activePlan) await clearProgress(activePlan.planId);
        await clearActivePlan();
        setActivePlanState(null);
        setProgress({});
        setExpandedWeek(null);
      }
    );
  };

  const handleToggleSession = async (planId, weekNum, idx) => {
    const updated = await toggleSession(planId, weekNum, idx);
    setProgress({ ...updated });
    const plan = TRAINING_PLANS.find((p) => p.id === planId);
    const weekSchedule = plan?.schedule.find((w) => w.week === weekNum);
    if (weekSchedule) {
      const total = weekSchedule.sessions.length;
      const done = Object.values(updated[planId]?.[weekNum] || {}).filter(Boolean).length;
      if (done >= total) setCelebration(weekNum);
    }
  };

  const isSessionDone = (planId, week, idx) => !!(progress[planId]?.[week]?.[idx]);

  const weekDoneCount = (planId, week) =>
    Object.values(progress[planId]?.[week] || {}).filter(Boolean).length;

  const currentPlan = activePlan ? TRAINING_PLANS.find((p) => p.id === activePlan.planId) : null;
  const currentWeek = activePlan
    ? Math.min(
        Math.floor((Date.now() - new Date(activePlan.startDate)) / (1000 * 60 * 60 * 24 * 7)) + 1,
        currentPlan?.weeks || 1
      )
    : null;

  const totalSessionsDone = currentPlan
    ? currentPlan.schedule.reduce((acc, w) => acc + weekDoneCount(currentPlan.id, w.week), 0)
    : 0;
  const totalSessions = currentPlan
    ? currentPlan.schedule.reduce((acc, w) => acc + w.sessions.length, 0)
    : 0;
  const progressPct = totalSessions > 0 ? totalSessionsDone / totalSessions : 0;

  // ── Active plan view ──────────────────────────────────────────────────────
  if (currentPlan) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Plan summary */}
          <View style={styles.summary}>
            <View style={styles.summaryTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.summaryLabel}>{currentPlan.goal}</Text>
                <Text style={styles.summaryName}>{currentPlan.name}</Text>
              </View>
              <TouchableOpacity onPress={handleDeactivate} style={styles.abandonBtn}>
                <Text style={styles.abandonText}>Abandonar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>Semana {currentWeek}</Text>
                <Text style={styles.statLabel}>de {currentPlan.weeks}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{totalSessionsDone}/{totalSessions}</Text>
                <Text style={styles.statLabel}>sesiones</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{Math.round(progressPct * 100)}%</Text>
                <Text style={styles.statLabel}>completado</Text>
              </View>
            </View>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, {
                width: `${progressPct * 100}%`,
                backgroundColor: currentPlan.color,
              }]} />
            </View>
          </View>

          {/* Week sections */}
          {currentPlan.schedule.map((week) => {
            const weekKey = `w${week.week}`;
            const isExpanded = expandedWeek === weekKey;
            const isCurrent = week.week === currentWeek;
            const done = weekDoneCount(currentPlan.id, week.week);
            const total = week.sessions.length;
            const allDone = done === total;

            return (
              <View key={weekKey}>
                {/* Week header */}
                <TouchableOpacity
                  style={[styles.weekHeader, isCurrent && { borderLeftColor: currentPlan.color, backgroundColor: colors.surfaceElevated }]}
                  onPress={() => setExpandedWeek(isExpanded ? null : weekKey)}
                  activeOpacity={0.6}
                >
                  <View style={styles.weekHeaderLeft}>
                    {allDone
                      ? <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                      : <Text style={[styles.weekLabel, isCurrent && { color: currentPlan.color }]}>
                          SEMANA {week.week}
                        </Text>
                    }
                    <Text style={[
                      styles.weekFocus,
                      allDone && { color: colors.success },
                      isCurrent && !allDone && { color: currentPlan.color },
                    ]}>
                      {allDone ? 'Completada' : week.focus}
                    </Text>
                  </View>
                  <View style={styles.weekHeaderRight}>
                    <Text style={[styles.weekCount, allDone && { color: colors.success }]}>
                      {done}/{total}
                    </Text>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color={colors.textSecondary}
                    />
                  </View>
                </TouchableOpacity>

                {/* Sessions */}
                {isExpanded && week.sessions.map((session, idx) => {
                  const sessionDone = isSessionDone(currentPlan.id, week.week, idx);
                  const openTimer = () => navigation.navigate('IntervalTimer', {
                    session,
                    planId: currentPlan.id,
                    week: week.week,
                    sessionIdx: idx,
                  });
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={styles.sessionRow}
                      onPress={openTimer}
                      activeOpacity={0.7}
                    >
                      <View style={styles.sessionInfo}>
                        <View style={styles.sessionTopRow}>
                          <Text style={[styles.sessionDay, sessionDone && styles.doneText]}>
                            {session.day}
                          </Text>
                          <Text style={[styles.sessionDist, sessionDone && styles.doneText]}>
                            {session.distance} km
                          </Text>
                        </View>
                        <Text style={[styles.sessionType, sessionDone && styles.doneText]}>
                          {session.type}
                        </Text>
                        {(() => {
                          const mins = getEstimatedMins(session.description);
                          return mins ? (
                            <Text style={[styles.sessionMeta, sessionDone && styles.doneText]}>
                              ~{mins} min · {session.distance} km
                            </Text>
                          ) : (
                            <Text style={[styles.sessionMeta, sessionDone && styles.doneText]}>
                              {session.distance} km
                            </Text>
                          );
                        })()}
                        {(() => {
                          const summary = getPhaseSummaryText(session.description);
                          return summary ? (
                            <Text style={styles.sessionPhases}>{summary}</Text>
                          ) : null;
                        })()}
                      </View>

                      <TouchableOpacity
                        style={[styles.checkbox, sessionDone && {
                          backgroundColor: colors.success,
                          borderColor: colors.success,
                        }]}
                        onPress={() => handleToggleSession(currentPlan.id, week.week, idx)}
                        hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                      >
                        {sessionDone
                          ? <Ionicons name="checkmark" size={13} color="#fff" />
                          : <Ionicons name="ellipse-outline" size={13} color={colors.textSecondary} />
                        }
                      </TouchableOpacity>

                      <Ionicons name="play-circle" size={30} color={currentPlan.color} style={{ marginLeft: spacing.xs }} />
                    </TouchableOpacity>
                  );
                })}

                <View style={styles.sectionDivider} />
              </View>
            );
          })}

          <View style={{ height: spacing.xxl }} />
        </ScrollView>

        {/* Week celebration overlay */}
        {celebration && (
          <View style={styles.celebrationOverlay}>
            <View style={styles.celebrationCard}>
              <Text style={styles.celebrationEmoji}>🏆</Text>
              <Text style={styles.celebrationTitle}>¡Semana {celebration} completada!</Text>
              <Text style={styles.celebrationSub}>
                {celebration < currentPlan.weeks
                  ? `Preparado para la semana ${celebration + 1}`
                  : '¡Lo lograste! Plan completado'}
              </Text>
              <TouchableOpacity style={styles.celebrationBtn} onPress={() => setCelebration(null)}>
                <Text style={styles.celebrationBtnText}>
                  {celebration < currentPlan.weeks ? 'A por la siguiente semana 💪' : '¡Ver mi progreso! 🎉'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    );
  }

  // ── Browse view (no active plan) ─────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.browseContent} showsVerticalScrollIndicator={false}>
        <View style={styles.browseHero}>
          <Text style={styles.browseHeroEmoji}>🏃</Text>
          <Text style={styles.browseHeroTitle}>Tu primer 5K</Text>
          <Text style={styles.browseHeroSub}>8 semanas · 3 días/semana · Sin experiencia necesaria</Text>
        </View>

        {TRAINING_PLANS.map((plan, planIndex) => {
          const diffColor = DIFFICULTY_COLOR[plan.difficulty] || colors.primary;
          return (
            <View key={plan.id} style={styles.browseCard}>
              <View style={[styles.browseColorBar, { backgroundColor: plan.color }]} />
              <View style={styles.browseCardBody}>
                <View style={styles.browseCardTop}>
                  <Text style={styles.browseName}>{plan.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                    {planIndex === 0 && (
                      <View style={styles.recommendedPill}>
                        <Text style={styles.recommendedText}>⭐ Popular</Text>
                      </View>
                    )}
                    <View style={[styles.diffPill, { backgroundColor: diffColor + '20' }]}>
                      <Text style={[styles.diffText, { color: diffColor }]}>{plan.difficulty}</Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.browseDesc}>{plan.description}</Text>

                <View style={styles.browseMeta}>
                  <View style={styles.browseMetaItem}>
                    <Ionicons name="calendar-outline" size={13} color={colors.textSecondary} />
                    <Text style={styles.browseMetaText}>{plan.weeks} semanas</Text>
                  </View>
                  <Text style={styles.browseMetaDot}>·</Text>
                  <View style={styles.browseMetaItem}>
                    <Ionicons name="trophy-outline" size={13} color={colors.textSecondary} />
                    <Text style={styles.browseMetaText}>{plan.goal}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.startBtn, { backgroundColor: plan.color }]}
                  onPress={() => handleSelectPlan(plan)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.startBtnText}>Empezar este plan</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  // ── Active plan ──
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
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  summaryName: { fontSize: 20, fontWeight: '700', color: colors.text },
  abandonBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.error + '80',
  },
  abandonText: { color: colors.error, fontWeight: '600', fontSize: 12 },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 17, fontWeight: '700', color: colors.text },
  statLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, height: 28, backgroundColor: colors.border },
  progressTrack: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
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
  weekLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.8,
  },
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
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  sessionInfo: { flex: 1 },
  sessionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  sessionDay: { fontSize: 14, fontWeight: '700', color: colors.text },
  sessionDist: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  sessionType: { fontSize: 13, color: colors.textSecondary, marginBottom: 2 },
  sessionMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2, fontWeight: '500' },
  sessionPhases: { fontSize: 11, color: colors.textSecondary, marginTop: 3, fontStyle: 'italic' },
  doneText: { color: colors.textSecondary, textDecorationLine: 'line-through' },

  sectionDivider: { height: 1, backgroundColor: colors.border, marginTop: 1 },

  // ── Browse view ──
  browseContent: { padding: spacing.md, paddingBottom: spacing.xxl },
  browseHero: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.md,
  },
  browseHeroEmoji: { fontSize: 56, marginBottom: spacing.sm },
  browseHeroTitle: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: spacing.xs },
  browseHeroSub: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  recommendedPill: {
    backgroundColor: colors.warning + '22',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colors.warning + '55',
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
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

  // ── Celebration overlay ──
  celebrationOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  celebrationCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  celebrationEmoji: { fontSize: 72 },
  celebrationTitle: { ...typography.h2, textAlign: 'center' },
  celebrationSub: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: -spacing.xs },
  celebrationBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xs,
    width: '100%',
    alignItems: 'center',
  },
  celebrationBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

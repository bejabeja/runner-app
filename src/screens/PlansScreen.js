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

export default function PlansScreen() {
  const [activePlan, setActivePlanState] = useState(null);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [progress, setProgress] = useState({});

  useFocusEffect(useCallback(() => {
    Promise.all([getActivePlan(), getProgress()]).then(([plan, prog]) => {
      setActivePlanState(plan);
      setProgress(prog);
      if (plan) setExpandedPlan(plan.planId);
    });
  }, []));

  const handleSelectPlan = (plan) => {
    confirm(
      `¿Activar "${plan.name}"?`,
      `Plan de ${plan.weeks} semanas para tu objetivo de ${plan.goal}.`,
      async () => {
        const data = { planId: plan.id, startDate: new Date().toISOString() };
        await setActivePlan(data);
        setActivePlanState(data);
        setExpandedPlan(plan.id);
      }
    );
  };

  const handleDeactivate = () => {
    confirm(
      'Abandonar plan',
      '¿Seguro? Se borrará tu progreso.',
      async () => {
        if (activePlan) await clearProgress(activePlan.planId);
        await clearActivePlan();
        setActivePlanState(null);
        setProgress({});
      }
    );
  };

  const handleToggleSession = async (planId, week, idx) => {
    const updated = await toggleSession(planId, week, idx);
    setProgress({ ...updated });
  };

  const isSessionDone = (planId, week, idx) =>
    !!(progress[planId]?.[week]?.[idx]);

  const weekCompletedCount = (planId, week, total) => {
    const w = progress[planId]?.[week] || {};
    return Object.values(w).filter(Boolean).length;
  };

  const currentPlan = activePlan ? TRAINING_PLANS.find((p) => p.id === activePlan.planId) : null;
  const currentWeek = activePlan
    ? Math.min(
        Math.floor((Date.now() - new Date(activePlan.startDate)) / (1000 * 60 * 60 * 24 * 7)) + 1,
        currentPlan?.weeks || 1
      )
    : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[typography.h2, { marginBottom: spacing.lg }]}>Planes de entrenamiento</Text>

        {currentPlan && (
          <View style={[styles.activeBanner, { borderLeftColor: currentPlan.color }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.activeBannerLabel}>PLAN ACTIVO</Text>
              <Text style={styles.activeBannerTitle}>{currentPlan.name}</Text>
              <Text style={styles.activeBannerWeek}>
                Semana {currentWeek} de {currentPlan.weeks}
              </Text>
            </View>
            <TouchableOpacity onPress={handleDeactivate} style={styles.abandonBtn}>
              <Text style={styles.abandonBtnText}>Abandonar</Text>
            </TouchableOpacity>
          </View>
        )}

        {TRAINING_PLANS.map((plan) => {
          const isExpanded = expandedPlan === plan.id;
          const isActive = activePlan?.planId === plan.id;

          return (
            <View key={plan.id} style={[styles.planCard, isActive && { borderColor: plan.color, borderWidth: 2 }]}>
              <TouchableOpacity
                style={styles.planHeader}
                onPress={() => setExpandedPlan(isExpanded ? null : plan.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.goalBadge, { backgroundColor: plan.color }]}>
                  <Text style={styles.goalBadgeText}>{plan.goal}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: spacing.sm }}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planMeta}>{plan.weeks} semanas · {plan.difficulty}</Text>
                </View>
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.planBody}>
                  <Text style={styles.planDescription}>{plan.description}</Text>

                  {!isActive && (
                    <TouchableOpacity
                      style={[styles.startBtn, { backgroundColor: plan.color }]}
                      onPress={() => handleSelectPlan(plan)}
                    >
                      <Ionicons name="play-circle-outline" size={18} color="#fff" />
                      <Text style={styles.startBtnText}>Iniciar este plan</Text>
                    </TouchableOpacity>
                  )}

                  <Text style={[typography.label, { marginTop: spacing.md, marginBottom: spacing.sm }]}>
                    PROGRAMA SEMANAL
                  </Text>

                  {plan.schedule.map((week) => {
                    const weekKey = `${plan.id}-w${week.week}`;
                    const isWeekExpanded = expandedWeek === weekKey;
                    const isCurrent = isActive && week.week === currentWeek;
                    const isPast = isActive && week.week < currentWeek;
                    const done = weekCompletedCount(plan.id, week.week, week.sessions.length);
                    const total = week.sessions.length;
                    const weekComplete = done === total;

                    return (
                      <View
                        key={weekKey}
                        style={[
                          styles.weekCard,
                          isCurrent && styles.weekCardCurrent,
                          weekComplete && styles.weekCardDone,
                        ]}
                      >
                        <TouchableOpacity
                          style={styles.weekHeader}
                          onPress={() => setExpandedWeek(isWeekExpanded ? null : weekKey)}
                        >
                          {isCurrent && (
                            <View style={[styles.badge, { backgroundColor: plan.color }]}>
                              <Text style={styles.badgeText}>Esta semana</Text>
                            </View>
                          )}
                          {weekComplete && (
                            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                          )}
                          <Text style={[styles.weekTitle, isPast && !weekComplete && styles.textMuted]}>
                            Semana {week.week}
                          </Text>
                          <Text style={[styles.weekFocus, isPast && !weekComplete && styles.textMuted]}>
                            {week.focus}
                          </Text>
                          {isActive && (
                            <Text style={styles.weekProgress}>{done}/{total}</Text>
                          )}
                          <Ionicons
                            name={isWeekExpanded ? 'chevron-up' : 'chevron-down'}
                            size={16}
                            color={colors.textSecondary}
                          />
                        </TouchableOpacity>

                        {isWeekExpanded && (
                          <View style={styles.sessionsContainer}>
                            {week.sessions.map((session, idx) => {
                              const done = isSessionDone(plan.id, week.week, idx);
                              return (
                                <View key={idx} style={[styles.session, done && styles.sessionDone]}>
                                  <TouchableOpacity
                                    style={[styles.checkbox, done && { backgroundColor: colors.success, borderColor: colors.success }]}
                                    onPress={() => isActive && handleToggleSession(plan.id, week.week, idx)}
                                    disabled={!isActive}
                                  >
                                    {done && <Ionicons name="checkmark" size={14} color="#fff" />}
                                  </TouchableOpacity>
                                  <View style={{ flex: 1 }}>
                                    <View style={styles.sessionRow}>
                                      <Text style={[styles.sessionDay, done && styles.textDone]}>{session.day}</Text>
                                      <Text style={[styles.sessionType, done && styles.textDone]}>{session.type}</Text>
                                      <Text style={[styles.sessionDist, done && { color: colors.success }]}>
                                        {session.distance} km
                                      </Text>
                                    </View>
                                    <Text style={[styles.sessionDesc, done && styles.textDone]}>
                                      {session.description}
                                    </Text>
                                  </View>
                                </View>
                              );
                            })}
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  activeBanner: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  activeBannerLabel: { ...typography.label, color: colors.primary, marginBottom: 2 },
  activeBannerTitle: { ...typography.h3 },
  activeBannerWeek: { ...typography.bodySmall, marginTop: 2 },
  abandonBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.error,
  },
  abandonBtnText: { color: colors.error, fontWeight: '600', fontSize: 13 },
  planCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  planHeader: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  goalBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    minWidth: 52,
    alignItems: 'center',
  },
  goalBadgeText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  planName: { ...typography.body, fontWeight: '600' },
  planMeta: { ...typography.bodySmall, marginTop: 2 },
  planBody: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  planDescription: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  startBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  weekCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  weekCardCurrent: { borderColor: colors.primary, backgroundColor: colors.primary + '05' },
  weekCardDone: { borderColor: colors.success, backgroundColor: colors.success + '08' },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    gap: spacing.xs,
  },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: radius.full },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  weekTitle: { fontWeight: '700', fontSize: 14, color: colors.text },
  weekFocus: { ...typography.bodySmall, flex: 1 },
  weekProgress: { fontSize: 12, fontWeight: '700', color: colors.textSecondary },
  textMuted: { color: colors.textSecondary },
  sessionsContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  session: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  sessionDone: { opacity: 0.6 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  sessionRow: { flexDirection: 'row', gap: spacing.xs, alignItems: 'center', flexWrap: 'wrap' },
  sessionDay: { fontWeight: '600', fontSize: 13, color: colors.text, minWidth: 80 },
  sessionType: { ...typography.bodySmall, flex: 1 },
  sessionDist: { fontWeight: '700', fontSize: 13, color: colors.primary },
  sessionDesc: { ...typography.bodySmall, marginTop: 2, lineHeight: 18 },
  textDone: { textDecorationLine: 'line-through', color: colors.textSecondary },
});

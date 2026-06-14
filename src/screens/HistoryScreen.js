import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, radius, typography } from '../theme';
import { getRuns, getActivePlan } from '../storage/storage';
import { getProgress } from '../storage/progress';
import { TRAINING_PLANS } from '../data/trainingPlans';

const FEELING_EMOJI = { easy: '😌', good: '💪', hard: '🔥' };

const formatDate = (iso) => {
  const d = new Date(iso);
  const diff = Math.floor((Date.now() - d) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Ayer';
  if (diff < 7) return d.toLocaleDateString('es-ES', { weekday: 'long' });
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};

const fmtTime = (secs) => {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  if (h > 0) return `${h}h ${m}min`;
  return `${m} min`;
};

export default function HistoryScreen({ navigation }) {
  const [runs, setRuns] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [planObj, setPlanObj] = useState(null);
  const [progress, setProgress] = useState({});

  useFocusEffect(useCallback(() => {
    const load = async () => {
      const [r, ap] = await Promise.all([getRuns(), getActivePlan()]);
      setRuns(r);
      setActivePlan(ap);
      if (ap) {
        const plan = TRAINING_PLANS.find((p) => p.id === ap.planId);
        setPlanObj(plan);
        const prog = await getProgress();
        setProgress(prog);
      }
    };
    load();
  }, []));

  const totalKm = runs.reduce((s, r) => s + (r.distance || 0), 0);
  const totalSecs = runs.reduce((s, r) => s + (r.duration || 0), 0);

  const weekDoneCount = (planId, week) =>
    Object.values(progress[planId]?.[week] || {}).filter(Boolean).length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi progreso</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* ── Stats summary ── */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{runs.length}</Text>
            <Text style={styles.statLbl}>sesiones</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{totalKm.toFixed(1)}</Text>
            <Text style={styles.statLbl}>km totales</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{fmtTime(totalSecs)}</Text>
            <Text style={styles.statLbl}>tiempo total</Text>
          </View>
        </View>

        {/* ── Plan week grid ── */}
        {planObj && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>SEMANAS DEL PLAN</Text>
            <View style={styles.weekGrid}>
              {planObj.schedule.map((w) => {
                const done = weekDoneCount(planObj.id, w.week);
                const total = w.sessions.length;
                const allDone = done === total;
                const currentWeekNum = activePlan
                  ? Math.min(Math.floor((Date.now() - new Date(activePlan.startDate)) / (1000 * 60 * 60 * 24 * 7)) + 1, planObj.weeks)
                  : 0;
                const isCurrent = w.week === currentWeekNum;
                const isPast = w.week < currentWeekNum;
                return (
                  <View
                    key={w.week}
                    style={[
                      styles.weekCell,
                      allDone && styles.weekCellDone,
                      isCurrent && styles.weekCellCurrent,
                    ]}
                  >
                    <Text style={[
                      styles.weekCellNum,
                      allDone && styles.weekCellNumDone,
                      isCurrent && styles.weekCellNumCurrent,
                    ]}>
                      {allDone ? '✓' : `S${w.week}`}
                    </Text>
                    {(isCurrent || isPast) && (
                      <Text style={[styles.weekCellPct, allDone && { color: colors.success }]}>
                        {done}/{total}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* ── Run list ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ENTRENAMIENTOS</Text>
          {runs.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="fitness-outline" size={40} color={colors.textSecondary} />
              <Text style={styles.emptyText}>Aún no has guardado entrenamientos.</Text>
              <Text style={styles.emptySubtext}>Completa tu primera sesión y aparecerá aquí.</Text>
            </View>
          ) : (
            runs.map((run) => (
              <View key={run.id} style={styles.runRow}>
                <View style={styles.runLeft}>
                  <Text style={styles.runDate}>{formatDate(run.date)}</Text>
                  <Text style={styles.runMeta}>
                    {fmtTime(run.duration)} · {(run.distance || 0).toFixed(1)} km
                    {run.pace ? `  ·  ${Math.floor(run.pace / 60)}'${String(run.pace % 60).padStart(2, '0')}"/km` : ''}
                  </Text>
                  {run.notes ? <Text style={styles.runNotes}>{run.notes}</Text> : null}
                </View>
                {run.feeling ? (
                  <Text style={styles.runFeeling}>{FEELING_EMOJI[run.feeling] || ''}</Text>
                ) : null}
              </View>
            ))
          )}
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  content: { padding: spacing.md },

  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: 3,
  },
  statVal: { fontSize: 20, fontWeight: '800', color: colors.text },
  statLbl: { fontSize: 11, fontWeight: '600', color: colors.textSecondary, textAlign: 'center' },

  section: { marginBottom: spacing.lg },
  sectionLabel: { ...typography.label, marginBottom: spacing.sm },

  weekGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  weekCell: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: 2,
  },
  weekCellDone: { backgroundColor: colors.success + '18', borderColor: colors.success + '55' },
  weekCellCurrent: { borderColor: colors.primary, borderWidth: 2 },
  weekCellNum: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
  weekCellNumDone: { color: colors.success, fontSize: 16 },
  weekCellNumCurrent: { color: colors.primary },
  weekCellPct: { fontSize: 10, color: colors.textSecondary, fontWeight: '600' },

  runRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
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

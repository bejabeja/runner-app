import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, Alert, Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../theme';
import { getRuns } from '../storage/storage';
import { getWeeklyGoal, setWeeklyGoal } from '../storage/goal';
import { formatDuration, formatPace, getWeekStart } from '../utils/format';
import RunCard from '../components/RunCard';
import StatCard from '../components/StatCard';
import WeeklyProgress from '../components/WeeklyProgress';

export default function HomeScreen({ navigation }) {
  const [runs, setRuns] = useState([]);
  const [weeklyGoal, setWeeklyGoalState] = useState(30);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const [data, goal] = await Promise.all([getRuns(), getWeeklyGoal()]);
    setRuns(data);
    setWeeklyGoalState(goal);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleGoalChange = (km) => setWeeklyGoalState(km);

  const handleSetGoalWeb = () => {
    Alert.alert(
      'Objetivo semanal',
      `Objetivo actual: ${weeklyGoal} km. ¿Cuál quieres poner?`,
      [5, 10, 20, 30, 40, 50, 60].map((km) => ({
        text: `${km} km`,
        onPress: async () => {
          await setWeeklyGoal(km);
          setWeeklyGoalState(km);
        },
      })).concat([{ text: 'Cancelar', style: 'cancel' }])
    );
  };

  const totalDistance = runs.reduce((acc, r) => acc + r.distance, 0);
  const totalDuration = runs.reduce((acc, r) => acc + r.duration, 0);
  const avgPace = runs.length > 0 ? runs.reduce((acc, r) => acc + r.pace, 0) / runs.length : 0;

  const weekStart = getWeekStart();
  const weeklyKm = runs
    .filter((r) => new Date(r.date) >= weekStart)
    .reduce((acc, r) => acc + r.distance, 0);

  const recentRuns = runs.slice(0, 3);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting} 👋</Text>
            <Text style={styles.subtitle}>
              {runs.length === 0 ? '¡Empieza tu primera carrera!' : `${runs.length} carrera${runs.length > 1 ? 's' : ''} registrada${runs.length > 1 ? 's' : ''}`}
            </Text>
          </View>
          <View style={styles.headerBtns}>
            <TouchableOpacity style={styles.timerBtn} onPress={() => navigation.navigate('Timer')}>
              <Ionicons name="timer-outline" size={22} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.logBtn} onPress={() => navigation.navigate('LogRun')}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <WeeklyProgress
          current={weeklyKm}
          goal={weeklyGoal}
          onGoalChange={handleGoalChange}
          onEditWeb={Platform.OS === 'web' ? handleSetGoalWeb : undefined}
        />

        <View style={styles.statsRow}>
          <StatCard icon="map-outline" value={`${totalDistance.toFixed(1)} km`} label="Total km" color={colors.primary} style={{ marginRight: spacing.sm / 2 }} />
          <StatCard icon="time-outline" value={formatDuration(totalDuration)} label="Tiempo total" color="#4299E1" style={{ marginHorizontal: spacing.sm / 4 }} />
          <StatCard icon="speedometer-outline" value={avgPace > 0 ? formatPace(avgPace) : '--:--'} label="Ritmo medio" color="#9F7AEA" style={{ marginLeft: spacing.sm / 2 }} />
        </View>

        {recentRuns.length > 0 ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={typography.h3}>Últimas carreras</Text>
              <TouchableOpacity onPress={() => navigation.navigate('History')}>
                <Text style={styles.seeAll}>Ver todas</Text>
              </TouchableOpacity>
            </View>
            {recentRuns.map((run) => (
              <RunCard key={run.id} run={run} compact />
            ))}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏃</Text>
            <Text style={styles.emptyTitle}>¡Aún no hay carreras!</Text>
            <Text style={styles.emptyDesc}>Usa el cronómetro o el botón + para registrar tu primera carrera</Text>
            <View style={styles.emptyBtns}>
              <TouchableOpacity style={styles.ctaBtn} onPress={() => navigation.navigate('Timer')}>
                <Ionicons name="timer-outline" size={18} color="#fff" />
                <Text style={styles.ctaBtnText}>Cronómetro</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.ctaBtn, styles.ctaBtnSecondary]} onPress={() => navigation.navigate('LogRun')}>
                <Ionicons name="add" size={18} color={colors.primary} />
                <Text style={[styles.ctaBtnText, { color: colors.primary }]}>Manual</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.planBanner} onPress={() => navigation.navigate('Plans')}>
          <Ionicons name="trophy-outline" size={24} color={colors.primary} />
          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <Text style={styles.planBannerTitle}>¿Tienes un objetivo?</Text>
            <Text style={styles.planBannerDesc}>Elige un plan de entrenamiento</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: { ...typography.h2 },
  subtitle: { ...typography.bodySmall, marginTop: 2 },
  headerBtns: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  timerBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  statsRow: { flexDirection: 'row', marginBottom: spacing.lg },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  seeAll: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xl },
  emptyIcon: { fontSize: 64, marginBottom: spacing.md },
  emptyTitle: { ...typography.h3, marginBottom: spacing.xs },
  emptyDesc: { ...typography.bodySmall, textAlign: 'center', marginBottom: spacing.lg },
  emptyBtns: { flexDirection: 'row', gap: spacing.sm },
  ctaBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  ctaBtnSecondary: {
    backgroundColor: colors.primary + '15',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ctaBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  planBanner: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  planBannerTitle: { ...typography.body, fontWeight: '600' },
  planBannerDesc: { ...typography.bodySmall, marginTop: 2 },
});

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { colors, spacing, radius, typography } from '../theme';
import { getRuns } from '../storage/storage';
import { formatPace, formatDistance, formatDuration, formatDateShort, getWeekStart } from '../utils/format';
import StatCard from '../components/StatCard';

const SCREEN_W = Dimensions.get('window').width;
const CHART_W = SCREEN_W - spacing.md * 2;

const chartConfig = {
  backgroundGradientFrom: colors.surface,
  backgroundGradientTo: colors.surface,
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`,
  labelColor: () => colors.textSecondary,
  style: { borderRadius: radius.lg },
  propsForBackgroundLines: { strokeDasharray: '', stroke: colors.border, strokeWidth: 1 },
};

export default function StatsScreen() {
  const [runs, setRuns] = useState([]);

  useFocusEffect(useCallback(() => {
    getRuns().then(setRuns);
  }, []));

  if (runs.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}><Text style={typography.h2}>Estadísticas</Text></View>
        <View style={styles.empty}>
          <Text style={{ fontSize: 64, marginBottom: spacing.md }}>📊</Text>
          <Text style={typography.h3}>Sin datos aún</Text>
          <Text style={[typography.bodySmall, { marginTop: spacing.xs, textAlign: 'center' }]}>
            Registra carreras para ver tus estadísticas aquí
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalDistance = runs.reduce((acc, r) => acc + r.distance, 0);
  const totalDuration = runs.reduce((acc, r) => acc + r.duration, 0);
  const avgPace = runs.reduce((acc, r) => acc + r.pace, 0) / runs.length;
  const bestPace = Math.min(...runs.map((r) => r.pace).filter(Boolean));
  const longestRun = Math.max(...runs.map((r) => r.distance));

  const weeklyData = buildWeeklyData(runs, 8);
  const paceData = buildPaceData(runs, 10);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[typography.h2, { marginBottom: spacing.lg }]}>Estadísticas</Text>

        <Text style={[typography.label, { marginBottom: spacing.sm }]}>RESUMEN TOTAL</Text>
        <View style={styles.statsGrid}>
          <StatCard icon="map-outline" value={`${totalDistance.toFixed(1)} km`} label="Total distancia" color={colors.primary} style={styles.gridCard} />
          <StatCard icon="trophy-outline" value={formatDistance(longestRun)} label="Mejor rodaje" color="#ECC94B" style={styles.gridCard} />
          <StatCard icon="time-outline" value={formatDuration(totalDuration)} label="Tiempo total" color="#4299E1" style={styles.gridCard} />
          <StatCard icon="speedometer-outline" value={formatPace(bestPace) + ' /km'} label="Mejor ritmo" color="#9F7AEA" style={styles.gridCard} />
          <StatCard icon="trending-up-outline" value={formatPace(avgPace) + ' /km'} label="Ritmo medio" color="#48BB78" style={styles.gridCard} />
          <StatCard icon="footsteps-outline" value={runs.length.toString()} label="Total carreras" color="#FC8181" style={styles.gridCard} />
        </View>

        {weeklyData.labels.length > 1 && (
          <>
            <Text style={[typography.label, { marginTop: spacing.lg, marginBottom: spacing.sm }]}>KM POR SEMANA</Text>
            <View style={styles.chartCard}>
              <BarChart
                data={weeklyData}
                width={CHART_W - spacing.md * 2}
                height={180}
                chartConfig={chartConfig}
                style={styles.chart}
                showValuesOnTopOfBars
                fromZero
                yAxisSuffix=" km"
                withInnerLines
                flatColor
              />
            </View>
          </>
        )}

        {paceData.labels.length > 1 && (
          <>
            <Text style={[typography.label, { marginTop: spacing.lg, marginBottom: spacing.sm }]}>EVOLUCIÓN DEL RITMO (min/km)</Text>
            <View style={styles.chartCard}>
              <Text style={styles.chartNote}>Últimas {paceData.labels.length} carreras — menor = más rápido</Text>
              <LineChart
                data={paceData}
                width={CHART_W - spacing.md * 2}
                height={180}
                chartConfig={{
                  ...chartConfig,
                  color: (opacity = 1) => `rgba(66, 153, 225, ${opacity})`,
                }}
                style={styles.chart}
                bezier
                withDots
                withInnerLines
                fromZero={false}
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function buildWeeklyData(runs, numWeeks) {
  const weeks = [];
  const now = new Date();
  for (let i = numWeeks - 1; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - i * 7 - now.getDay() + 1);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    const dist = runs
      .filter((r) => {
        const d = new Date(r.date);
        return d >= weekStart && d <= weekEnd;
      })
      .reduce((acc, r) => acc + r.distance, 0);
    weeks.push({ label: formatDateShort(weekStart.toISOString()), dist });
  }
  const recent = weeks.filter((_, i) => i >= numWeeks - 6);
  return {
    labels: recent.map((w) => w.label),
    datasets: [{ data: recent.map((w) => parseFloat(w.dist.toFixed(1))) }],
  };
}

function buildPaceData(runs, limit) {
  const recent = [...runs].reverse().slice(-limit);
  return {
    labels: recent.map((r) => formatDateShort(r.date)),
    datasets: [{
      data: recent.map((r) => parseFloat((r.pace / 60).toFixed(2))),
    }],
  };
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  header: { paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.sm },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  gridCard: { width: (SCREEN_W - spacing.md * 2 - spacing.sm * 2) / 3 - 1, marginRight: 0, marginLeft: 0 },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  chart: { borderRadius: radius.md, marginLeft: -spacing.sm },
  chartNote: { ...typography.bodySmall, marginBottom: spacing.sm },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
});

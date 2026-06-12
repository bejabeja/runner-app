import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme';
import { setWeeklyGoal } from '../storage/goal';

export default function WeeklyProgress({ current, goal, onGoalChange, onEditWeb }) {
  const pct = Math.min(current / goal, 1);
  const remaining = Math.max(goal - current, 0);
  const done = pct >= 1;

  const handleEdit = () => {
    if (onEditWeb) { onEditWeb(); return; }
    Alert.prompt(
      'Objetivo semanal',
      'Kilómetros por semana',
      async (val) => {
        const km = parseFloat(val);
        if (km > 0) {
          await setWeeklyGoal(km);
          onGoalChange(km);
        }
      },
      'plain-text',
      String(goal),
      'numeric'
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="flag-outline" size={16} color={done ? colors.success : colors.primary} />
          <Text style={styles.title}>Objetivo semanal</Text>
        </View>
        <TouchableOpacity onPress={handleEdit} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <Ionicons name="pencil-outline" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.numbers}>
        <Text style={[styles.current, done && { color: colors.success }]}>
          {current.toFixed(1)} km
        </Text>
        <Text style={styles.goal}>/ {goal} km</Text>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: done ? colors.success : colors.primary }]} />
      </View>

      <Text style={styles.sub}>
        {done ? '¡Objetivo completado esta semana! 🎉' : `${remaining.toFixed(1)} km para tu meta`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  title: { ...typography.label, marginLeft: 4 },
  numbers: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs, marginBottom: spacing.sm },
  current: { fontSize: 22, fontWeight: '700', color: colors.primary },
  goal: { ...typography.bodySmall },
  track: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  fill: { height: '100%', borderRadius: radius.full },
  sub: { ...typography.bodySmall },
});

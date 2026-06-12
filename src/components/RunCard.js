import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme';
import { formatDuration, formatPace, formatDistance, formatDate } from '../utils/format';

const FEELING_CONFIG = {
  great: { label: 'Genial', color: colors.great },
  good: { label: 'Bien', color: colors.good },
  ok: { label: 'Normal', color: colors.ok },
  tired: { label: 'Cansado', color: colors.tired },
};

export default function RunCard({ run, onDelete, compact = false }) {
  const feeling = FEELING_CONFIG[run.feeling];

  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <View style={styles.header}>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.date}>{formatDate(run.date)}</Text>
          {feeling && (
            <View style={[styles.feelingBadge, { backgroundColor: feeling.color + '20' }]}>
              <Text style={[styles.feelingText, { color: feeling.color }]}>{feeling.label}</Text>
            </View>
          )}
        </View>
        {onDelete && (
          <TouchableOpacity onPress={() => onDelete(run.id)} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <Ionicons name="trash-outline" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.stats}>
        <StatItem icon="map-outline" value={formatDistance(run.distance)} label="Distancia" />
        <View style={styles.divider} />
        <StatItem icon="time-outline" value={formatDuration(run.duration)} label="Tiempo" />
        <View style={styles.divider} />
        <StatItem icon="speedometer-outline" value={`${formatPace(run.pace)} /km`} label="Ritmo" />
      </View>
      {run.notes ? (
        <Text style={styles.notes} numberOfLines={2}>{run.notes}</Text>
      ) : null}
    </View>
  );
}

function StatItem({ icon, value, label }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardCompact: {
    padding: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  date: {
    ...typography.bodySmall,
    marginLeft: 4,
  },
  feelingBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    marginLeft: spacing.xs,
  },
  feelingText: {
    fontSize: 11,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    ...typography.label,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
  notes: {
    ...typography.bodySmall,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
});

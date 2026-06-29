import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../i18n';
import { spacing } from '../../theme';
import { getSessionSummary } from '../../utils/sessionSummary';
import { useHomeStyles } from './useHomeStyles';

export default function WeekPendingCard({ sessions, onStart }) {
  const { styles, colors } = useHomeStyles();
  const { t } = useLanguage();
  return (
    <View style={styles.congratCard}>
      <View style={[styles.congratStripe, { backgroundColor: colors.primary }]} />
      <View style={styles.congratContent}>
        <View style={styles.congratHeader}>
          <Text style={[styles.congratLabel, { color: colors.primary }]}>{t('home.weekPending')}</Text>
        </View>
        {sessions.map((s, i) => {
          const summary = getSessionSummary(s.description);
          const dayAbbr = (t('days.' + s.day + '.abbr') || s.day).toUpperCase();
          return (
            <TouchableOpacity
              key={i}
              style={[styles.congratNext, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, paddingTop: spacing.sm }]}
              onPress={() => onStart(s)}
              activeOpacity={0.8}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.nextLabel}>{dayAbbr}</Text>
                <Text style={styles.nextTitle}>{t('plans.sessionType.' + s.type)}</Text>
                <Text style={[styles.congratSub, { fontSize: 12, marginTop: 2 }]}>
                  {s.distance} km{summary?.estimatedMins ? ` · ${t('home.estMins', { n: summary.estimatedMins })}` : ''}
                </Text>
              </View>
              <View style={[styles.congratNextPlay, { borderColor: colors.primary + '66' }]}>
                <Ionicons name="play" size={15} color={colors.primary} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

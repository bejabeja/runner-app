import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../i18n';
import { useHomeStyles } from './useHomeStyles';

export default function UpcomingCard({ session, dayAbbr, workoutSummary, onStart, onChangeDay }) {
  const { styles, colors } = useHomeStyles();
  const { t } = useLanguage();
  return (
    <View style={styles.congratCard}>
      <View style={[styles.congratStripe, { backgroundColor: colors.primary }]} />
      <View style={styles.congratContent}>
        <View style={styles.congratHeader}>
          <Text style={[styles.congratLabel, { color: colors.primary }]}>
            {t('home.upcoming.label')} · {dayAbbr}
          </Text>
        </View>
        <Text style={styles.congratTitle}>{t('plans.sessionType.' + session.type)}</Text>
        <Text style={styles.congratSub}>
          {session.distance} km
          {workoutSummary?.estimatedMins ? ` · ${t('home.estMins', { n: workoutSummary.estimatedMins })}` : ''}
          {workoutSummary?.intervalSummary ? ` · ${workoutSummary.intervalSummary}` : ''}
        </Text>
        {workoutSummary?.phaseBar ? (
          <View style={styles.phaseBar}>
            {workoutSummary.phaseBar.map((seg, i) => (
              <View key={i} style={[styles.phaseSegment, { flex: seg.flex, backgroundColor: seg.color }]} />
            ))}
          </View>
        ) : null}
        <View style={styles.congratDivider} />
        <TouchableOpacity style={styles.congratNext} onPress={() => onStart(session)} activeOpacity={0.85}>
          <Text style={[styles.nextLabel, { flex: 1 }]}>{t('home.upcoming.start')}</Text>
          <View style={[styles.congratNextPlay, { borderColor: colors.primary + '66' }]}>
            <Ionicons name="play" size={15} color={colors.primary} />
          </View>
        </TouchableOpacity>
        {onChangeDay && (
          <>
            <View style={styles.congratDivider} />
            <TouchableOpacity style={styles.changeDayBtn} onPress={onChangeDay} activeOpacity={0.8}>
              <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.changeDayText}>{t('home.changeDay')}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

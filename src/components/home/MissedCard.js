import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../i18n';
import { useHomeStyles } from './useHomeStyles';

export default function MissedCard({ session, dayAbbr, workoutSummary, onMarkDone, onStart }) {
  const { styles, colors } = useHomeStyles();
  const { t } = useLanguage();
  const warnColor = colors.warning || colors.primary;
  return (
    <View style={[styles.congratCard, { borderColor: warnColor + '30' }]}>
      <View style={[styles.congratStripe, { backgroundColor: warnColor }]} />
      <View style={styles.congratContent}>
        <View style={styles.congratHeader}>
          <Text style={[styles.congratLabel, { color: warnColor }]}>
            {t('home.missed.label')} · {dayAbbr}
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
          <Text style={[styles.nextLabel, { flex: 1, color: warnColor }]}>{t('home.start')}</Text>
          <View style={[styles.congratNextPlay, { borderColor: warnColor + '66' }]}>
            <Ionicons name="play" size={15} color={warnColor} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.missedSecBtn} onPress={() => onMarkDone(session)} activeOpacity={0.8}>
          <Ionicons name="checkmark-circle-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.missedSecBtnText}>{t('home.missed.markDone')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

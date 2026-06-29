import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../i18n';
import { spacing } from '../../theme';
import { useHomeStyles } from './useHomeStyles';

export default function HeroCard({ workoutToStart, workoutSummary, missedWorkouts, todaysWorkout, onStart, weather }) {
  const { styles, colors } = useHomeStyles();
  const { t } = useLanguage();
  const isPending = missedWorkouts.length > 0 && !todaysWorkout;
  return (
    <TouchableOpacity style={styles.heroCard} onPress={() => onStart(workoutToStart)} activeOpacity={0.92}>
      <View style={styles.heroStripe} />
      <View style={styles.heroContent}>
        <View style={styles.heroHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Text style={[styles.heroMetaText, isPending && { color: colors.warning }]}>
              {isPending ? t('home.missedLabel') : t('home.todayLabel')}
            </Text>
            {workoutSummary?.estimatedMins ? (
              <Text style={styles.heroMetaMins}>{t('home.estMins', { n: workoutSummary.estimatedMins })}</Text>
            ) : null}
          </View>
          {weather ? <Text style={styles.heroWeatherText}>{weather.emoji} {weather.temp}°C</Text> : null}
        </View>

        <Text style={styles.heroTitle} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.75}>
          {t('plans.sessionType.' + workoutToStart.type)}
        </Text>

        <View style={styles.heroStats}>
          <Text style={styles.heroStatDist}>{workoutToStart.distance} km</Text>
          {workoutSummary?.intervalSummary ? (
            <Text style={styles.heroStatInterval}>{workoutSummary.intervalSummary}</Text>
          ) : null}
        </View>

        {workoutSummary?.phaseBar ? (
          <View style={styles.phaseBar}>
            {workoutSummary.phaseBar.map((seg, i) => (
              <View key={i} style={[styles.phaseSegment, { flex: seg.flex, backgroundColor: seg.color }]} />
            ))}
          </View>
        ) : null}

        <View style={styles.startBtn}>
          <Ionicons name="play" size={22} color="#fff" />
          <Text style={styles.startBtnText}>{t('home.start')}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

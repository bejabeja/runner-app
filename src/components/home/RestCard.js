import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../i18n';
import { useHomeStyles } from './useHomeStyles';

export default function RestCard({ weekDoneSessions, weekTotalSessions, weekKm, nextWorkout, onStart, weather }) {
  const { styles, colors } = useHomeStyles();
  const { t } = useLanguage();
  return (
    <View style={styles.restCard}>
      <View style={styles.restHeader}>
        <Text style={styles.restLabel}>{t('home.rest.label')}</Text>
        {weather ? <Text style={styles.restWeatherText}>{weather.emoji} {weather.temp}°C</Text> : null}
      </View>

      <Text style={styles.restTitle}>{t('home.rest.title')}</Text>
      <Text style={styles.restSub}>{t('home.rest.sub')}</Text>

      {weekTotalSessions > 0 && (
        <View style={styles.weekDotsRow}>
          <View style={styles.weekDots}>
            {Array.from({ length: weekTotalSessions }, (_, i) => (
              <View key={i} style={[styles.weekDot, i < weekDoneSessions && styles.weekDotDone]} />
            ))}
          </View>
          <Text style={styles.weekDotText}>
            {weekDoneSessions}/{weekTotalSessions}
            {weekKm > 0 ? ` · ${weekKm.toFixed(1)} km` : ''}
          </Text>
        </View>
      )}

      {nextWorkout && (
        <>
          <View style={styles.restDivider} />
          <TouchableOpacity style={styles.restNext} onPress={() => onStart(nextWorkout)} activeOpacity={0.85}>
            <View style={{ flex: 1 }}>
              <Text style={styles.nextLabel}>{t('home.nextPrefix')} · {(t('days.' + nextWorkout.day + '.abbr') || nextWorkout.day).toUpperCase()}</Text>
              <Text style={styles.nextTitle}>{t('plans.sessionType.' + nextWorkout.type)}</Text>
            </View>
            <View style={styles.restNextPlay}>
              <Ionicons name="play" size={15} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

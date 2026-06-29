import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../i18n';
import { useHomeStyles } from './useHomeStyles';

export default function CongratCard({ todayCompletedSession, weekDoneSessions, weekTotalSessions, weekKm, nextWorkout, onStart, weather }) {
  const { styles, colors } = useHomeStyles();
  const { t } = useLanguage();
  return (
    <View style={styles.congratCard}>
      <View style={styles.congratStripe} />
      <View style={styles.congratContent}>
        <View style={styles.congratHeader}>
          <Text style={styles.congratLabel}>{t('home.congrat.label')}</Text>
          {weather && (
            <Text style={styles.congratWeatherText}>{weather.emoji} {weather.temp}°C</Text>
          )}
        </View>

        <Text style={styles.congratTitle}>{t('home.congrat.title')}</Text>
        {todayCompletedSession && (
          <Text style={styles.congratSub}>
            {t('plans.sessionType.' + todayCompletedSession.type)}
            {todayCompletedSession.distance ? ` · ${todayCompletedSession.distance} km` : ''}
          </Text>
        )}

        {weekTotalSessions > 0 && (
          <View style={styles.congratWeekRow}>
            <View style={styles.congratDots}>
              {Array.from({ length: weekTotalSessions }, (_, i) => (
                <View
                  key={i}
                  style={[styles.congratDot, i < weekDoneSessions && styles.congratDotDone]}
                />
              ))}
            </View>
            <Text style={styles.congratWeekText}>
              {weekDoneSessions}/{weekTotalSessions}
              {weekKm > 0 ? ` · ${weekKm.toFixed(1)} km` : ''}
            </Text>
          </View>
        )}

        {nextWorkout && (
          <>
            <View style={styles.congratDivider} />
            <TouchableOpacity style={styles.congratNext} onPress={() => onStart(nextWorkout)} activeOpacity={0.85}>
              <View style={{ flex: 1 }}>
                <Text style={styles.nextLabel}>
                  {t('home.nextPrefix')} · {(t('days.' + nextWorkout.day + '.abbr') || nextWorkout.day).toUpperCase()}
                </Text>
                <Text style={styles.nextTitle}>{t('plans.sessionType.' + nextWorkout.type)}</Text>
              </View>
              <View style={styles.congratNextPlay}>
                <Ionicons name="play" size={15} color={colors.success} />
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

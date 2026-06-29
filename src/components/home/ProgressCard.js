import { Text, View } from 'react-native';
import { useLanguage } from '../../i18n';
import { useHomeStyles } from './useHomeStyles';

export default function ProgressCard({ activePlanData, totalSessions, doneSessions, progressPct }) {
  const { styles } = useHomeStyles();
  const { t } = useLanguage();
  if (!activePlanData || totalSessions === 0) return null;
  return (
    <View style={styles.progressCard}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>{t('home.planProgress')}</Text>
        <Text style={styles.progressCount}>
          {t('home.sessionsOf', { done: doneSessions, total: totalSessions })}
        </Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.max(2, Math.round(progressPct * 100))}%` }]} />
      </View>
    </View>
  );
}

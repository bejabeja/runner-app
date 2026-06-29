import { Text, View } from 'react-native';
import { useLanguage } from '../../i18n';
import { FEELING_EMOJI } from '../../utils/constants';
import { formatDuration } from '../../utils/format';
import { useHomeStyles } from './useHomeStyles';

export default function PastCompletedCard({ session, dayAbbr, run }) {
  const { styles } = useHomeStyles();
  const { t } = useLanguage();
  return (
    <View style={styles.congratCard}>
      <View style={styles.congratStripe} />
      <View style={styles.congratContent}>
        <View style={styles.congratHeader}>
          <Text style={styles.congratLabel}>{t('home.pastDone.label')} · {dayAbbr}</Text>
        </View>
        <Text style={styles.congratTitle}>{t('plans.sessionType.' + session.type)}</Text>
        <Text style={styles.congratSub}>
          {session.distance ? `${session.distance} km` : ''}
        </Text>
        {run && (
          <View style={styles.pastRunRow}>
            <Text style={styles.pastRunStat}>{formatDuration(run.duration)}</Text>
            {run.distance > 0 && <Text style={styles.pastRunStat}>· {run.distance.toFixed(1)} km</Text>}
            {run.feeling && <Text style={styles.pastRunFeeling}>{FEELING_EMOJI[run.feeling]}</Text>}
          </View>
        )}
      </View>
    </View>
  );
}

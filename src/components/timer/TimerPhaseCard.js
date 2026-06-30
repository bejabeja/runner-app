import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { useLanguage } from '../../i18n';
import { formatDuration, formatMMSS } from '../../utils/format';
import { useTimerStyles } from './useTimerStyles';

export default function TimerPhaseCard({ status, config, hasParsed, currentPhase, phaseRemaining, phaseDuration, totalElapsed, session, paceTip }) {
  const { styles } = useTimerStyles();
  const { t } = useLanguage();
  return (
    <View style={styles.timerBlock}>
      <View style={[
        styles.phaseCard,
        status !== 'idle' && styles.phaseCardActive,
      ]}>
        {hasParsed && (
          <>
            <Ionicons name={config.icon} size={36} color={status !== 'idle' ? '#fff' : config.bg} />
            <Text style={[styles.phaseLabel, status !== 'idle' && { color: '#fff' }, status === 'idle' && { color: config.bg }]}>
              {t('phases.' + currentPhase?.type)}
            </Text>
          </>
        )}

        <Text style={[styles.timerBig, status !== 'idle' && { color: '#fff' }]}>
          {phaseRemaining !== null ? formatMMSS(phaseRemaining) : formatDuration(totalElapsed)}
        </Text>

        {phaseDuration && (
          <Text style={[styles.timerSub, status !== 'idle' && { color: 'rgba(255,255,255,0.7)' }]}>
            {t('timer.of')} {formatMMSS(phaseDuration)}
          </Text>
        )}

        {phaseDuration && (
          <View style={[styles.phaseTrack, status !== 'idle' && { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
            <View style={[
              styles.phaseFill,
              {
                width: `${Math.min(((phaseDuration - (phaseRemaining || 0)) / phaseDuration) * 100, 100)}%`,
                backgroundColor: status !== 'idle' ? '#fff' : config.bg,
              }
            ]} />
          </View>
        )}

        {session.targetPace && currentPhase?.type === 'run' && status !== 'idle' && (
          <View style={styles.targetPaceRow}>
            <Ionicons name="speedometer-outline" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.targetPaceText}>{t('timer.targetPaceLabel', { pace: session.targetPace })}</Text>
          </View>
        )}

        {paceTip && (
          <View style={styles.paceTipRow}>
            <Text style={styles.paceTipText}>💬 {paceTip}</Text>
          </View>
        )}
      </View>

      <Text style={styles.totalTimer}>{t('timer.totalLabel')}: {formatDuration(totalElapsed)}</Text>
    </View>
  );
}

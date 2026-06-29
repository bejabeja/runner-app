import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../i18n';
import { useTimerStyles } from './useTimerStyles';

export default function TimerControls({ status, config, hasParsed, intervals, phaseIdx, beginCountdown, pause, resume, skipPhase, completeLap, finishEarly, currentPhase }) {
  const { styles, colors } = useTimerStyles();
  const { t } = useLanguage();
  return (
    <View style={styles.controls}>
      {status === 'idle' && (
        <TouchableOpacity style={[styles.bigPlayBtn, { backgroundColor: hasParsed ? config.bg : colors.primary }]} onPress={beginCountdown}>
          <Ionicons name="play" size={36} color="#fff" />
          <Text style={styles.bigPlayText}>{t('timer.start')}</Text>
        </TouchableOpacity>
      )}

      {status === 'running' && (
        <View style={styles.controlRow}>
          {currentPhase?.isLap ? (
            <TouchableOpacity style={[styles.mainBtn, { backgroundColor: '#fff' }]} onPress={completeLap}>
              <Ionicons name="flag" size={28} color={config.bg} />
              <Text style={[styles.mainBtnText, { color: config.bg }]}>{t('timer.lapDone')}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.mainBtn, { backgroundColor: 'rgba(255,255,255,0.25)' }]} onPress={pause}>
              <Ionicons name="pause" size={28} color="#fff" />
              <Text style={[styles.mainBtnText, { color: '#fff' }]}>{t('timer.pause')}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {status === 'paused' && (
        <View style={styles.controlRow}>
          <TouchableOpacity style={[styles.mainBtn, { backgroundColor: colors.primary }]} onPress={resume}>
            <Ionicons name="play" size={28} color="#fff" />
            <Text style={[styles.mainBtnText, { color: '#fff' }]}>{t('timer.resume')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {(status === 'running' || status === 'paused') && hasParsed && phaseIdx + 1 < intervals.length && (
        <TouchableOpacity style={styles.skipBtn} onPress={skipPhase}>
          <Text style={[styles.skipText, { color: 'rgba(255,255,255,0.8)' }]}>{t('timer.skipPhase')} →</Text>
        </TouchableOpacity>
      )}

      {(status === 'running' || status === 'paused') && (
        <TouchableOpacity style={styles.finishBtn} onPress={finishEarly}>
          <Text style={[styles.finishText, { color: 'rgba(255,255,255,0.7)' }]}>{t('timer.finish')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

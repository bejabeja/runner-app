import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../i18n';
import { useTimerStyles } from './useTimerStyles';

export default function TimerControls({ status, config, hasParsed, intervals, phaseIdx, beginCountdown, pause, resume, skipPhase, completeLap, finishEarly, currentPhase }) {
  const { styles, colors } = useTimerStyles();
  const { t } = useLanguage();
  const isActive = status === 'running' || status === 'paused';
  const hasNextPhase = hasParsed && phaseIdx + 1 < intervals.length;

  return (
    <View style={styles.controls}>
      {status === 'idle' && (
        <TouchableOpacity style={[styles.bigPlayBtn, { backgroundColor: hasParsed ? config.bg : colors.primary }]} onPress={beginCountdown}>
          <Ionicons name="play" size={36} color="#fff" />
          <Text style={styles.bigPlayText}>{t('timer.start')}</Text>
        </TouchableOpacity>
      )}

      {isActive && (
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.sideBtn} onPress={finishEarly}>
            <Ionicons name="stop-circle-outline" size={22} color="rgba(255,255,255,0.65)" />
            <Text style={styles.sideBtnText}>{t('timer.finish')}</Text>
          </TouchableOpacity>

          {currentPhase?.isLap ? (
            <TouchableOpacity style={[styles.mainBtn, { backgroundColor: '#fff' }]} onPress={completeLap}>
              <Ionicons name="flag" size={28} color={config.bg} />
              <Text style={[styles.mainBtnText, { color: config.bg }]}>{t('timer.lapDone')}</Text>
            </TouchableOpacity>
          ) : status === 'running' ? (
            <TouchableOpacity style={[styles.mainBtn, { backgroundColor: 'rgba(255,255,255,0.25)' }]} onPress={pause}>
              <Ionicons name="pause" size={28} color="#fff" />
              <Text style={[styles.mainBtnText, { color: '#fff' }]}>{t('timer.pause')}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.mainBtn, { backgroundColor: colors.primary }]} onPress={resume}>
              <Ionicons name="play" size={28} color="#fff" />
              <Text style={[styles.mainBtnText, { color: '#fff' }]}>{t('timer.resume')}</Text>
            </TouchableOpacity>
          )}

          {hasNextPhase ? (
            <TouchableOpacity style={styles.sideBtn} onPress={skipPhase}>
              <Ionicons name="play-skip-forward" size={22} color="rgba(255,255,255,0.8)" />
              <Text style={styles.sideBtnText}>{t('timer.skipPhase')}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.sideBtn} />
          )}
        </View>
      )}
    </View>
  );
}

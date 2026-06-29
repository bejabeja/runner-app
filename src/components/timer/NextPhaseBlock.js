import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { useLanguage } from '../../i18n';
import { useTimerStyles } from './useTimerStyles';

export default function NextPhaseBlock({ nextPhase, nextConfig }) {
  const { styles } = useTimerStyles();
  const { t } = useLanguage();
  return (
    <View style={styles.nextBlock}>
      <Text style={styles.nextLabel}>{t('timer.upNext')}</Text>
      <View style={[styles.nextCard, { borderLeftColor: nextConfig.bg }]}>
        <Ionicons name={nextConfig.icon} size={18} color={nextConfig.bg} />
        <Text style={styles.nextText}>{t('phases.' + nextPhase?.type)}</Text>
        {nextPhase.duration && (
          <Text style={styles.nextDuration}>{Math.round(nextPhase.duration / 60)} min</Text>
        )}
      </View>
    </View>
  );
}

import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { useLanguage } from '../../i18n';
import { useTimerStyles } from './useTimerStyles';

export default function IdlePlanView({ groupedPhases, totalEstMins }) {
  const { styles } = useTimerStyles();
  const { t } = useLanguage();
  return (
    <View style={styles.planView}>
      <Text style={styles.planViewLabel}>{t('timer.planToday')}</Text>
      {groupedPhases.map((group) => (
        <View key={group.key} style={styles.planRow}>
          <View style={[styles.planRowBar, {
            backgroundColor: group.type === 'interval' ? group.runCfg.bg : group.cfg.bg,
          }]} />
          <View style={styles.planRowBody}>
            {group.type === 'interval' ? (
              <View style={styles.planRowLeft}>
                <Ionicons name={group.runCfg.icon} size={15} color={group.runCfg.bg} />
                <Text style={styles.planRowName}>{t('phases.run')}</Text>
                <Text style={styles.planRowSlash}>/</Text>
                <Ionicons name={group.walkCfg.icon} size={15} color={group.walkCfg.bg} />
                <Text style={styles.planRowName}>{t('phases.walk')}</Text>
              </View>
            ) : (
              <View style={styles.planRowLeft}>
                <Ionicons name={group.cfg.icon} size={15} color={group.cfg.bg} />
                <Text style={styles.planRowName}>{t('phases.' + group.type)}</Text>
              </View>
            )}
            <Text style={styles.planRowDur}>
              {group.type === 'interval'
                ? `${Math.round(group.runDuration / 60)}'/${Math.round(group.walkDuration / 60)}' ×${group.reps}`
                : `${Math.round((group.duration || 0) / 60)} min`}
            </Text>
          </View>
        </View>
      ))}
      <View style={styles.planViewTotal}>
        <Text style={styles.planViewTotalLabel}>{t('timer.estDuration')}</Text>
        <Text style={styles.planViewTotalValue}>~{totalEstMins} min</Text>
      </View>
    </View>
  );
}

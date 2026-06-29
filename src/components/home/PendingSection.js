import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../i18n';
import { useHomeStyles } from './useHomeStyles';

export default function PendingSection({ extraMissed, onStart }) {
  const { styles, colors } = useHomeStyles();
  const { t } = useLanguage();
  return (
    <View style={styles.pendingSection}>
      <Text style={styles.pendingSectionLabel}>{t('home.alsoPending')}</Text>
      {extraMissed.map((w, idx) => (
        <TouchableOpacity key={idx} style={styles.pendingRow} onPress={() => onStart(w)} activeOpacity={0.85}>
          <View style={{ flex: 1 }}>
            <Text style={styles.pendingDay}>{(t('days.' + w.day + '.abbr') || w.day).toUpperCase()}</Text>
            <Text style={styles.pendingType} numberOfLines={1}>{t('plans.sessionType.' + w.type)}</Text>
          </View>
          <Text style={styles.pendingDist}>{w.distance} km</Text>
          <View style={styles.pendingPlay}>
            <Ionicons name="play" size={14} color={colors.primary} />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

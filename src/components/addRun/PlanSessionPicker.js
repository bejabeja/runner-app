import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../i18n';
import { useAddRunStyles } from './useAddRunStyles';

export default function PlanSessionPicker({ sessions, selected, onSelect }) {
  const { styles, colors } = useAddRunStyles();
  const { t } = useLanguage();
  return (
    <>
      {sessions.map(s => {
        const isSelected = selected?.globalIdx === s.globalIdx;
        return (
          <TouchableOpacity
            key={s.globalIdx}
            style={[styles.sessionRow, isSelected && styles.sessionRowActive]}
            onPress={() => onSelect(isSelected ? null : s)}
            activeOpacity={0.7}
          >
            <View style={[styles.sessionCheck, isSelected && styles.sessionCheckActive]}>
              {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sessionTitle, isSelected && styles.sessionTitleActive]}>
                {t('history.addRun.week', { n: s.originalWeek })} · {s.day}
              </Text>
              <Text style={styles.sessionDesc} numberOfLines={1}>{s.description}</Text>
            </View>
            <Text style={styles.sessionDist}>{s.distance} km</Text>
          </TouchableOpacity>
        );
      })}
    </>
  );
}

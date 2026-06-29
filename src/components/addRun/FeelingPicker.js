import { Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../i18n';
import { FEELING_EMOJI } from '../../utils/constants';
import { useAddRunStyles } from './useAddRunStyles';

const FEELINGS = ['easy', 'good', 'hard'];

export default function FeelingPicker({ value, onChange }) {
  const { styles } = useAddRunStyles();
  const { t } = useLanguage();
  return (
    <View style={styles.feelingRow}>
      {FEELINGS.map(f => (
        <TouchableOpacity
          key={f}
          style={[styles.feelingBtn, value === f && styles.feelingBtnActive]}
          onPress={() => onChange(f)}
        >
          <Text style={styles.feelingEmoji}>{FEELING_EMOJI[f]}</Text>
          <Text style={[styles.feelingLabel, value === f && styles.feelingLabelActive]}>
            {t(`timer.feelings.${f}`)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

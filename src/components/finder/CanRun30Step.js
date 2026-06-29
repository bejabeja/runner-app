import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../i18n';
import { useFinderStyles } from './useFinderStyles';

const OPTIONS = [
  { key: true, icon: 'checkmark-circle-outline', labelKey: 'finder.canRun30Yes' },
  { key: false, icon: 'close-circle-outline', labelKey: 'finder.canRun30No' },
];

export default function CanRun30Step({ canRun30, onSelect }) {
  const { styles, colors } = useFinderStyles();
  const { t } = useLanguage();
  return (
    <>
      <Text style={styles.question}>{t('finder.q3')}</Text>
      <View style={styles.options}>
        {OPTIONS.map(({ key, icon, labelKey }) => (
          <TouchableOpacity
            key={String(key)}
            style={[styles.optCard, canRun30 === key && styles.optCardSelected]}
            onPress={() => onSelect(key)}
            activeOpacity={0.75}
          >
            <View style={[styles.optIcon, canRun30 === key && styles.optIconSelected]}>
              <Ionicons name={icon} size={24} color={canRun30 === key ? '#fff' : colors.primary} />
            </View>
            <Text style={[styles.optLabel, canRun30 === key && styles.optLabelSelected]}>
              {t(labelKey)}
            </Text>
            {canRun30 === key && (
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} style={styles.optCheck} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}

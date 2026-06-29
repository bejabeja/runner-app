import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../i18n';
import { useFinderStyles } from './useFinderStyles';

export default function ExperienceStep({ exp, onSelect }) {
  const { styles, colors } = useFinderStyles();
  const { t } = useLanguage();
  const options = [
    { key: 'none', icon: 'bed-outline', label: t('finder.expNone') },
    { key: 'some', icon: 'walk-outline', label: t('finder.expSome') },
    { key: 'regular', icon: 'fitness-outline', label: t('finder.expRegular') },
  ];
  return (
    <>
      <Text style={styles.question}>{t('finder.q1')}</Text>
      <View style={styles.options}>
        {options.map(opt => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.optCard, exp === opt.key && styles.optCardSelected]}
            onPress={() => onSelect(opt.key)}
            activeOpacity={0.75}
          >
            <View style={[styles.optIcon, exp === opt.key && styles.optIconSelected]}>
              <Ionicons name={opt.icon} size={24} color={exp === opt.key ? '#fff' : colors.primary} />
            </View>
            <Text style={[styles.optLabel, exp === opt.key && styles.optLabelSelected]}>{opt.label}</Text>
            {exp === opt.key && <Ionicons name="checkmark-circle" size={20} color={colors.primary} style={styles.optCheck} />}
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}

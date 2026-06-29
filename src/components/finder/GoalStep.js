import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../i18n';
import { useFinderStyles } from './useFinderStyles';

export default function GoalStep({ goal, onSelect }) {
  const { styles, colors } = useFinderStyles();
  const { t } = useLanguage();
  const options = [
    { key: '5k', icon: 'flag-outline', label: t('finder.goal5k'), sub: '5K' },
    { key: '10k', icon: 'trophy-outline', label: t('finder.goal10k'), sub: '10K' },
    { key: 'half', icon: 'medal-outline', label: t('finder.goalHalf'), sub: '21.1K' },
    { key: 'marathon', icon: 'ribbon-outline', label: t('finder.goalMarathon'), sub: '42.2K' },
  ];
  return (
    <>
      <Text style={styles.question}>{t('finder.q2')}</Text>
      <View style={styles.options}>
        {options.map(opt => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.optCard, goal === opt.key && styles.optCardSelected]}
            onPress={() => onSelect(opt.key)}
            activeOpacity={0.75}
          >
            <View style={[styles.optIcon, goal === opt.key && styles.optIconSelected]}>
              <Ionicons name={opt.icon} size={24} color={goal === opt.key ? '#fff' : colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.optLabel, goal === opt.key && styles.optLabelSelected]}>{opt.label}</Text>
              <Text style={styles.optSub}>{opt.sub}</Text>
            </View>
            {goal === opt.key && <Ionicons name="checkmark-circle" size={20} color={colors.primary} style={styles.optCheck} />}
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}

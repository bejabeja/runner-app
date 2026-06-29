import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { TRAINING_PLANS } from '../../data/trainingPlans';
import { useLanguage } from '../../i18n';
import { getTotalVirtualWeeks } from '../../utils/virtualSchedule';
import { useFinderStyles } from './useFinderStyles';

const DAY_COUNTS = [2, 3, 4, 5];

export default function DaySelectionStep({ result, daysPerWeek, onSelect }) {
  const { styles, colors } = useFinderStyles();
  const { t } = useLanguage();
  const rPlan = TRAINING_PLANS.find(p => p.id === result.planId);
  const recDpw = rPlan?.defaultDaysPerWeek || 3;
  const options = DAY_COUNTS.map(n => ({
    n,
    label: t(`finder.days${n}Label`),
    weeks: rPlan ? getTotalVirtualWeeks(rPlan, n) : '-',
  }));

  return (
    <>
      <Text style={styles.question}>{t('finder.daysQ')}</Text>
      <View style={styles.options}>
        {options.map(opt => {
          const isRec = opt.n === recDpw;
          const isSel = daysPerWeek === opt.n;
          return (
            <TouchableOpacity
              key={opt.n}
              style={[styles.optCard, isSel && styles.optCardSelected]}
              onPress={() => onSelect(opt.n)}
              activeOpacity={0.75}
            >
              <View style={[styles.optIcon, isSel && styles.optIconSelected]}>
                <Text style={{ fontSize: 20, fontWeight: '800', color: isSel ? '#fff' : colors.primary }}>{opt.n}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.optLabel, isSel && styles.optLabelSelected]}>{opt.label}</Text>
                <Text style={styles.optSub}>{opt.weeks} {t('finder.weeks')}</Text>
              </View>
              {isRec && !isSel && (
                <View style={styles.recPill}>
                  <Text style={styles.recPillText}>{t('plans.daysSetup.recommended')}</Text>
                </View>
              )}
              {isSel && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}

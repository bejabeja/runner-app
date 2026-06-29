import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CanRun30Step from '../components/finder/CanRun30Step';
import DaySelectionStep from '../components/finder/DaySelectionStep';
import ExperienceStep from '../components/finder/ExperienceStep';
import GoalStep from '../components/finder/GoalStep';
import ResultStep from '../components/finder/ResultStep';
import { useFinderStyles } from '../components/finder/useFinderStyles';
import { TRAINING_PLANS } from '../data/trainingPlans';
import { useLanguage } from '../i18n';
import { setActivePlan } from '../storage/storage';
import { DIFFICULTY_COLOR } from '../theme';
import { confirm } from '../utils/confirm';
import { recommend } from '../utils/planRecommend';
import { getNextMonday } from '../utils/dateHelpers';
import { DEFAULT_WEEKDAYS, getTotalVirtualWeeks } from '../utils/virtualSchedule';

const TOTAL_STEPS = 5;

export default function PlanFinderScreen({ navigation }) {
  const { styles, colors } = useFinderStyles();
  const { t } = useLanguage();

  const [step, setStep] = useState(0);
  const [exp, setExp] = useState(null);
  const [goal, setGoal] = useState(null);
  const [canRun30, setCanRun30] = useState(null);
  const [daysPerWeek, setDpw] = useState(null);
  const [result, setResult] = useState(null);
  const [startDate, setStartDate] = useState(getNextMonday);

  const handleExpSelect = (key) => {
    setExp(key);
    setTimeout(() => setStep(1), 220);
  };

  const handleGoalSelect = (key) => {
    setGoal(key);
    setTimeout(() => setStep(2), 220);
  };

  const handleCanRun30Select = (value) => {
    setCanRun30(value);
    setResult(recommend(exp, goal, value));
    setTimeout(() => setStep(3), 220);
  };

  const handleDaysSelect = (n) => {
    setDpw(n);
    setTimeout(() => setStep(4), 220);
  };

  const handleStartPlan = () => {
    const plan = TRAINING_PLANS.find(p => p.id === result.planId);
    const dpw = daysPerWeek || plan?.defaultDaysPerWeek || 3;
    confirm(
      t('finder.startTitle', { name: t('plans.name.' + plan?.id) }),
      t('finder.startMsg', { weeks: getTotalVirtualWeeks(plan, dpw) }),
      async () => {
        await setActivePlan({ planId: plan.id, startDate: startDate.toISOString(), daysPerWeek: dpw, weekdays: DEFAULT_WEEKDAYS[dpw] });
        navigation.goBack();
      },
      { cancelText: t('finder.cancel'), confirmText: t('finder.start') },
    );
  };

  const resultPlan = result ? TRAINING_PLANS.find(p => p.id === result.planId) : null;
  const diffColor = resultPlan ? (DIFFICULTY_COLOR[resultPlan.difficulty] || colors.primary) : colors.primary;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => step === 0 ? navigation.goBack() : setStep(s => s - 1)}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <Ionicons name={step === 0 ? 'close' : 'chevron-back'} size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('finder.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.stepRow}>
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <View key={i} style={[styles.stepDot, i === step && styles.stepDotActive, i < step && styles.stepDotDone]} />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {step === 0 && <ExperienceStep exp={exp} onSelect={handleExpSelect} />}
        {step === 1 && <GoalStep goal={goal} onSelect={handleGoalSelect} />}
        {step === 2 && <CanRun30Step canRun30={canRun30} onSelect={handleCanRun30Select} />}
        {step === 3 && result && <DaySelectionStep result={result} daysPerWeek={daysPerWeek} onSelect={handleDaysSelect} />}
        {step === 4 && resultPlan && (
          <ResultStep
            resultPlan={resultPlan}
            result={result}
            daysPerWeek={daysPerWeek}
            diffColor={diffColor}
            startDate={startDate}
            onChangeDate={setStartDate}
            onStart={handleStartPlan}
            onSeeAll={() => navigation.goBack()}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

import { useEffect, useState } from 'react';
import ActivePlanView from '../components/plans/ActivePlanView';
import BrowsePlansView from '../components/plans/BrowsePlansView';
import { usePlanWithProgress } from '../hooks/usePlanWithProgress';
import { useLanguage } from '../i18n';
import { clearActivePlan, setActivePlan } from '../storage/plan';
import { clearPlanProgress, isSessionDone, toggleSession } from '../storage/progress';
import { TRAINING_PLANS } from '../data/trainingPlans';
import { confirm } from '../utils/confirm';
import { flattenSessions, getCurrentVirtualWeek } from '../utils/virtualSchedule';

export default function PlansScreen({ navigation }) {
  const { t } = useLanguage();
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [celebration, setCelebration] = useState(null);

  const { activePlanData: activePlan, plan: currentPlan, progress, reload } = usePlanWithProgress();
  const currentWeek = activePlan && currentPlan ? getCurrentVirtualWeek(activePlan, currentPlan) : null;

  useEffect(() => {
    if (currentPlan) setExpandedWeek(`w${currentWeek}`);
  }, [currentPlan?.id]);

  const handleSelectPlan = (plan) => {
    confirm(
      t('plans.alert.startTitle', { name: t('plans.name.' + plan.id) }),
      t('plans.alert.startMsg', { weeks: plan.weeks, goal: plan.goal }),
      async () => {
        await setActivePlan({ planId: plan.id, startDate: new Date().toISOString() });
        setExpandedWeek('w1');
        reload();
      },
      { cancelText: t('plans.alert.cancel'), confirmText: t('plans.alert.confirm') },
    );
  };

  const handleDeactivate = () => {
    confirm(
      t('plans.alert.abandonTitle'),
      t('plans.alert.abandonMsg'),
      async () => {
        if (activePlan) await clearPlanProgress(activePlan.planId);
        await clearActivePlan();
        setExpandedWeek(null);
        reload();
      },
      { cancelText: t('plans.alert.cancel'), confirmText: t('plans.alert.confirm') },
    );
  };

  const handleToggleSession = async (planId, globalIdx, weekNum) => {
    const updated = await toggleSession(planId, globalIdx);
    reload();
    const plan = TRAINING_PLANS.find((p) => p.id === planId);
    const weekSchedule = plan?.schedule.find((w) => w.week === weekNum);
    if (weekSchedule) {
      const flat = flattenSessions(plan);
      const weekSessions = flat.filter(s => s.originalWeek === weekNum);
      const done = weekSessions.filter(s => isSessionDone(updated, planId, s.globalIdx)).length;
      if (done >= weekSchedule.sessions.length) setCelebration(weekNum);
    }
  };

  if (currentPlan) {
    return (
      <ActivePlanView
        plan={currentPlan}
        progress={progress}
        expandedWeek={expandedWeek}
        setExpandedWeek={setExpandedWeek}
        celebration={celebration}
        setCelebration={setCelebration}
        currentWeek={currentWeek}
        onDeactivate={handleDeactivate}
        onToggleSession={handleToggleSession}
        navigation={navigation}
      />
    );
  }

  return <BrowsePlansView onSelectPlan={handleSelectPlan} onFinderPress={() => navigation.navigate('PlanFinder')} />;
}

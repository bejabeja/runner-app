import { TRAINING_PLANS } from '../data/trainingPlans';
import { getActivePlan } from '../storage/plan';
import { getProgress } from '../storage/progress';

export const loadPlanBundle = async () => {
  const [activePlanData, progress] = await Promise.all([getActivePlan(), getProgress()]);
  const plan = activePlanData
    ? TRAINING_PLANS.find(p => p.id === activePlanData.planId) ?? null
    : null;
  return { activePlanData, plan, progress };
};

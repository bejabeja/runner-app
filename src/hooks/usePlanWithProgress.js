import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { loadPlanBundle } from '../utils/planBundle';

export function usePlanWithProgress() {
  const [activePlanData, setActivePlanData] = useState(null);
  const [plan, setPlan] = useState(null);
  const [progress, setProgress] = useState({});

  const reload = useCallback(async () => {
    const { activePlanData: planData, plan: planObj, progress: prog } = await loadPlanBundle();
    setActivePlanData(planData);
    setPlan(planObj);
    setProgress(prog);
  }, []);

  useFocusEffect(useCallback(() => { reload(); }, [reload]));

  return { activePlanData, plan, progress, reload };
}

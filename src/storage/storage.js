import store from './asyncStorageAdapter';

const RUNS_KEY = '@runner_app:runs';
const ACTIVE_PLAN_KEY = '@runner_app:active_plan';

export const getRuns = async () => {
  try {
    const json = await store.getItem(RUNS_KEY);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
};

export const saveRun = async (run) => {
  const runs = await getRuns();
  const updated = [run, ...runs].sort((a, b) => new Date(b.date) - new Date(a.date));
  await store.setItem(RUNS_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteRun = async (id) => {
  const runs = await getRuns();
  const updated = runs.filter((r) => r.id !== id);
  await store.setItem(RUNS_KEY, JSON.stringify(updated));
  return updated;
};

export const getActivePlan = async () => {
  try {
    const json = await store.getItem(ACTIVE_PLAN_KEY);
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
};

export const setActivePlan = async (planData) => {
  await store.setItem(ACTIVE_PLAN_KEY, JSON.stringify(planData));
};

export const clearActivePlan = async () => {
  await store.removeItem(ACTIVE_PLAN_KEY);
};

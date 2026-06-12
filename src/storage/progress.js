import store from './asyncStorageAdapter';

const KEY = '@runner_app:plan_progress';

export const getProgress = async () => {
  const json = await store.getItem(KEY);
  return json ? JSON.parse(json) : {};
};

export const toggleSession = async (planId, week, sessionIdx) => {
  const progress = await getProgress();
  if (!progress[planId]) progress[planId] = {};
  if (!progress[planId][week]) progress[planId][week] = {};
  const current = progress[planId][week][sessionIdx];
  progress[planId][week][sessionIdx] = !current;
  await store.setItem(KEY, JSON.stringify(progress));
  return progress;
};

export const clearProgress = async (planId) => {
  const progress = await getProgress();
  delete progress[planId];
  await store.setItem(KEY, JSON.stringify(progress));
};

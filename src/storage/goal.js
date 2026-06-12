import store from './asyncStorageAdapter';

const GOAL_KEY = '@runner_app:weekly_goal';

export const getWeeklyGoal = async () => {
  const val = await store.getItem(GOAL_KEY);
  return val ? parseFloat(val) : 30;
};

export const setWeeklyGoal = async (km) => {
  await store.setItem(GOAL_KEY, String(km));
};

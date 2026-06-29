import store from './asyncStorageAdapter';
import { STORAGE_KEYS } from './keys';
import { logError } from '../utils/logError';
import { writeJson } from './storageHelper';

const KEY = STORAGE_KEYS.PROGRESS;

export const isSessionDone = (progress, planId, globalIdx) =>
  !!(progress[planId]?.[globalIdx]);

export const getProgress = async () => {
  try {
    const json = await store.getItem(KEY);
    if (!json) return {};
    const data = JSON.parse(json);
    // Migrate old format { planId: { weekNum: { sessionIdx: bool } } } → { planId: { globalIdx: bool } }
    const migrated = {};
    for (const [planId, val] of Object.entries(data)) {
      const firstVal = Object.values(val)[0];
      migrated[planId] = (firstVal !== null && typeof firstVal === 'object') ? {} : val;
    }
    return migrated;
  } catch (e) {
    logError('getProgress', e);
    return {};
  }
};

export const toggleSession = async (planId, globalIdx) => {
  const progress = await getProgress();
  const planProgress = progress[planId] ?? {};
  const updated = {
    ...progress,
    [planId]: { ...planProgress, [globalIdx]: !planProgress[globalIdx] },
  };
  await writeJson(KEY, updated);
  return updated;
};

export const clearPlanProgress = async (planId) => {
  const progress = await getProgress();
  const { [planId]: _, ...updated } = progress;
  await writeJson(KEY, updated);
};

export const clearAllProgress = () => writeJson(KEY, {});

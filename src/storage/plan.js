import { STORAGE_KEYS } from './keys';
import { readJson, writeJson, deleteJson } from './storageHelper';

const KEY = STORAGE_KEYS.ACTIVE_PLAN;

export const getActivePlan = () => readJson(KEY, null);

export const setActivePlan = (planData) => writeJson(KEY, planData);

export const clearActivePlan = () => deleteJson(KEY);

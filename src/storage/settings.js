import { STORAGE_KEYS } from './keys';
import { readJson, writeJson } from './storageHelper';
import store from './asyncStorageAdapter';
import { logError } from '../utils/logError';

export const getLanguagePref = async () => {
  try {
    const v = await store.getItem(STORAGE_KEYS.LANGUAGE);
    return v || 'es';
  } catch (e) {
    logError('getLanguagePref', e);
    return 'es';
  }
};

export const setLanguagePref = (lang) => store.setItem(STORAGE_KEYS.LANGUAGE, lang);

export const getOnboardingDone = () => readJson(STORAGE_KEYS.ONBOARDING, false);

export const setOnboardingDone = () => writeJson(STORAGE_KEYS.ONBOARDING, true);

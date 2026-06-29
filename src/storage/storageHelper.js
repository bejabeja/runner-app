import { logError } from '../utils/logError';
import store from './asyncStorageAdapter';

export const readJson = async (key, fallback = null) => {
  try {
    const json = await store.getItem(key);
    return json ? JSON.parse(json) : fallback;
  } catch (e) {
    logError(key, e);
    return fallback;
  }
};

export const writeJson = async (key, value) => {
  try {
    await store.setItem(key, JSON.stringify(value));
  } catch (e) {
    logError(key, e);
  }
};

export const deleteJson = (key) => store.removeItem(key);

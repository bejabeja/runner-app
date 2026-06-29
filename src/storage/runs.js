import { STORAGE_KEYS } from './keys';
import { readJson, writeJson } from './storageHelper';
import store from './asyncStorageAdapter';

const KEY = STORAGE_KEYS.RUNS;

export const getRuns = () => readJson(KEY, []);

const toMs = (date) => (date ? new Date(date).getTime() : 0);

export const saveRun = async (run) => {
  const runs = await getRuns();
  const updated = [run, ...runs].sort((a, b) => toMs(b.date) - toMs(a.date));
  await writeJson(KEY, updated);
  return updated;
};

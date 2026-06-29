import { formatISODate } from './format';

/**
 * Calculate the current run streak: consecutive calendar days (ending today or yesterday)
 * with at least one run.
 */
export const getStreak = (runs) => {
  if (!runs || runs.length === 0) return 0;

  const runDates = new Set(runs.map(r => formatISODate(r.date)));

  const today = new Date();
  const todayStr = formatISODate(today);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatISODate(yesterday);

  let startStr;
  if (runDates.has(todayStr)) {
    startStr = todayStr;
  } else if (runDates.has(yesterdayStr)) {
    startStr = yesterdayStr;
  } else {
    return 0;
  }

  let streak = 0;
  const cursor = new Date(startStr + 'T12:00:00');
  while (true) {
    if (!runDates.has(formatISODate(cursor))) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

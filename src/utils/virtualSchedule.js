import { isSessionDone } from '../storage/progress';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// JS weekday → Spanish day name (used as i18n key)
export const JS_DAY_TO_NAME = {
  0: 'Domingo', 1: 'Lunes', 2: 'Martes', 3: 'Miércoles',
  4: 'Jueves',  5: 'Viernes', 6: 'Sábado',
};

// Default training days per count (JS day numbers)
export const DEFAULT_WEEKDAYS = {
  2: [2, 6],          // Tue, Sat
  3: [1, 3, 5],       // Mon, Wed, Fri
  4: [1, 3, 5, 0],    // Mon, Wed, Fri, Sun
  5: [1, 2, 3, 5, 6], // Mon, Tue, Wed, Fri, Sat
};

// Flatten all plan sessions into an ordered array with a globalIdx
const getDpw = (activePlanData, plan) =>
  activePlanData?.daysPerWeek || plan?.defaultDaysPerWeek || 3;

export const flattenSessions = (plan) => {
  let idx = 0;
  return plan.schedule.flatMap(week =>
    week.sessions.map(session => ({
      ...session,
      globalIdx: idx++,
      originalWeek: week.week,
      originalFocus: week.focus,
    }))
  );
};

// Rechunk flat sessions into virtual weeks of daysPerWeek sessions each.
// Each session's `day` field is overridden with the weekday name for its slot.
export const getVirtualSchedule = (plan, daysPerWeek) => {
  const dpw = getDpw({ daysPerWeek }, plan);
  const weekdays = DEFAULT_WEEKDAYS[dpw] || DEFAULT_WEEKDAYS[3];
  const flat = flattenSessions(plan);
  const weeks = [];
  for (let i = 0; i < flat.length; i += dpw) {
    const sessions = flat.slice(i, i + dpw).map((s, slot) => ({
      ...s,
      day: JS_DAY_TO_NAME[weekdays[slot]] || s.day,
    }));
    weeks.push({
      week: Math.floor(i / dpw) + 1,
      focus: sessions[0]?.originalFocus || '',
      sessions,
    });
  }
  return weeks;
};

export const getTotalVirtualWeeks = (plan, daysPerWeek) => {
  const dpw = getDpw({ daysPerWeek }, plan);
  const total = plan.schedule.reduce((sum, w) => sum + w.sessions.length, 0);
  return Math.ceil(total / dpw);
};

export const getCurrentVirtualWeek = (activePlanData, plan, today = new Date()) => {
  const dpw = getDpw(activePlanData, plan);
  const weeksSince = Math.floor(
    (today.getTime() - new Date(activePlanData.startDate)) / WEEK_MS
  );
  return Math.min(weeksSince + 1, getTotalVirtualWeeks(plan, dpw));
};

export const getTodaysWorkout = (plan, activePlanData, progress, today = new Date()) => {
  if (!plan || !activePlanData) return null;
  const dpw = getDpw(activePlanData, plan);
  const weekdays = activePlanData.weekdays || DEFAULT_WEEKDAYS[dpw] || DEFAULT_WEEKDAYS[3];
  const todayJs = today.getDay();
  const slotIdx = weekdays.indexOf(todayJs);
  if (slotIdx === -1) return null;

  const vWeek = getCurrentVirtualWeek(activePlanData, plan, today);
  const schedule = getVirtualSchedule(plan, dpw);
  const weekData = schedule[vWeek - 1];
  if (!weekData) return null;

  const session = weekData.sessions[slotIdx];
  if (!session) return null;
  if (isSessionDone(progress, activePlanData.planId, session.globalIdx)) return null;

  return { ...session, week: vWeek, sessionIdx: session.globalIdx, planId: activePlanData.planId, daysPerWeek: dpw };
};

export const getMissedWorkouts = (plan, activePlanData, progress, today = new Date()) => {
  if (!plan || !activePlanData) return [];
  const dpw = getDpw(activePlanData, plan);
  const weekdays = activePlanData.weekdays || DEFAULT_WEEKDAYS[dpw] || DEFAULT_WEEKDAYS[3];
  const todayJs = today.getDay();
  const todaySlot = weekdays.indexOf(todayJs);

  const vWeek = getCurrentVirtualWeek(activePlanData, plan, today);
  const schedule = getVirtualSchedule(plan, dpw);
  const weekData = schedule[vWeek - 1];
  if (!weekData) return [];

  const cutoff = todaySlot === -1 ? weekData.sessions.length : todaySlot;

  return weekData.sessions
    .slice(0, cutoff)
    .filter(s => !isSessionDone(progress, activePlanData.planId, s.globalIdx))
    .map(s => ({ ...s, week: vWeek, sessionIdx: s.globalIdx, planId: activePlanData.planId, daysPerWeek: dpw }));
};

// First undone session from the current virtual week onward, excluding today's slot
export const getNextWorkout = (plan, activePlanData, progress, today = new Date()) => {
  if (!plan || !activePlanData) return null;
  const dpw = getDpw(activePlanData, plan);
  const weekdays = activePlanData.weekdays || DEFAULT_WEEKDAYS[dpw] || DEFAULT_WEEKDAYS[3];
  const todayJs = today.getDay();
  const todaySlot = weekdays.indexOf(todayJs);
  const vWeek = getCurrentVirtualWeek(activePlanData, plan, today);
  const todayGlobalIdx = todaySlot >= 0 ? (vWeek - 1) * dpw + todaySlot : -1;
  const currentWeekStart = (vWeek - 1) * dpw;

  const flat = flattenSessions(plan);
  const next = flat.find(s =>
    s.globalIdx >= currentWeekStart &&
    s.globalIdx !== todayGlobalIdx &&
    !isSessionDone(progress, activePlanData.planId, s.globalIdx)
  );
  if (!next) return null;

  const nextVWeek = Math.floor(next.globalIdx / dpw) + 1;
  return { ...next, week: nextVWeek, sessionIdx: next.globalIdx, planId: activePlanData.planId, daysPerWeek: dpw };
};

export const isVirtualWeekComplete = (updated, planId, virtualWeek, plan, dpw) => {
  const schedule = getVirtualSchedule(plan, dpw);
  const weekData = schedule[virtualWeek - 1];
  if (!weekData) return false;
  return weekData.sessions.every(s => isSessionDone(updated, planId, s.globalIdx));
};

export const isPlanComplete = (updated, planId, plan) => {
  if (!plan) return false;
  return flattenSessions(plan).every(s => isSessionDone(updated, planId, s.globalIdx));
};

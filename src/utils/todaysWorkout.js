const DAY_MAP = {
  'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Jueves': 4,
  'Viernes': 5, 'Sábado': 6, 'Domingo': 0,
};

export const getTodaysWorkout = (plan, activePlanData) => {
  if (!plan || !activePlanData) return null;
  const today = new Date().getDay();
  const weekNum = Math.min(
    Math.floor((Date.now() - new Date(activePlanData.startDate)) / (1000 * 60 * 60 * 24 * 7)) + 1,
    plan.weeks
  );
  const weekSchedule = plan.schedule.find((w) => w.week === weekNum);
  if (!weekSchedule) return null;
  const sessionIdx = weekSchedule.sessions.findIndex((s) => DAY_MAP[s.day] === today);
  const session = sessionIdx >= 0 ? weekSchedule.sessions[sessionIdx] : null;
  return session
    ? { ...session, week: weekNum, sessionIdx, planId: activePlanData.planId }
    : null;
};

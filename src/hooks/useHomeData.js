import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { getRuns } from '../storage/runs';
import { getWeekStart } from '../utils/format';
import { getMondayOf, toDateString, isSameDay } from '../utils/dateHelpers';
import { loadPlanBundle } from '../utils/planBundle';
import { getStreak } from '../utils/streak';
import {
  DEFAULT_WEEKDAYS,
  getCurrentVirtualWeek,
  getMissedWorkouts,
  getNextWorkout,
  getTodaysWorkout,
  getTotalVirtualWeeks,
  getVirtualSchedule,
  JS_DAY_TO_NAME,
} from '../utils/virtualSchedule';

export function useHomeData() {
  const [activePlanData, setActivePlanData] = useState(null);
  const [plan, setPlan] = useState(null);
  const [weekNum, setWeekNum] = useState(null);
  const [planProgress, setPlanProgress] = useState({});
  const [todaysWorkout, setTodaysWorkout] = useState(null);
  const [nextWorkout, setNextWorkout] = useState(null);
  const [missedWorkouts, setMissedWorkouts] = useState([]);
  const [runs, setRuns] = useState([]);
  const [streak, setStreak] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [{ activePlanData: planData, plan: planObj, progress }, allRuns] = await Promise.all([
        loadPlanBundle(), getRuns(),
      ]);
      setRuns(allRuns);
      setStreak(getStreak(allRuns));
      if (!planData) {
        setActivePlanData(null); setPlan(null); setWeekNum(null);
        setPlanProgress({}); setTodaysWorkout(null);
        setNextWorkout(null); setMissedWorkouts([]);
        return;
      }
      const vWeek = planObj ? getCurrentVirtualWeek(planData, planObj) : null;
      setActivePlanData(planData);
      setPlan(planObj);
      setWeekNum(vWeek);
      setPlanProgress(progress[planData.planId] || {});
      setTodaysWorkout(getTodaysWorkout(planObj, planData, progress));
      setNextWorkout(getNextWorkout(planObj, planData, progress));
      setMissedWorkouts(getMissedWorkouts(planObj, planData, progress));
    } catch (e) {
      setError(e);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  // ── Derived values (computed here to keep HomeScreen presentation-only) ──

  const dpw = activePlanData?.daysPerWeek || plan?.defaultDaysPerWeek || 3;
  const vWeekSchedule = plan && weekNum ? getVirtualSchedule(plan, dpw)[weekNum - 1] : null;
  const totalVirtualWeeks = plan ? getTotalVirtualWeeks(plan, dpw) : null;

  const workoutToStart = todaysWorkout || (missedWorkouts.length > 0 ? missedWorkouts[0] : null);
  const hasActionableWorkout = !!workoutToStart;
  const extraMissed = todaysWorkout ? missedWorkouts : missedWorkouts.slice(1);

  const totalSessions = plan
    ? plan.schedule.reduce((sum, w) => sum + w.sessions.length, 0)
    : 0;
  const doneSessions = Object.values(planProgress).filter(Boolean).length;
  const progressPct = totalSessions > 0 ? doneSessions / totalSessions : 0;

  const totalRunKm = runs.reduce((s, r) => s + (r.distance || 0), 0);
  const weekStartMs = getWeekStart().getTime();
  const weekKm = runs
    .filter(r => new Date(r.date).getTime() >= weekStartMs)
    .reduce((s, r) => s + (r.distance || 0), 0);

  const weekDoneSessions = vWeekSchedule
    ? vWeekSchedule.sessions.filter(s => !!planProgress[s.globalIdx]).length
    : 0;
  const weekTotalSessions = vWeekSchedule ? vWeekSchedule.sessions.length : 0;

  const now = new Date();
  const hour = now.getHours();
  const greetKey = hour < 12 ? 'home.goodMorning' : hour < 20 ? 'home.goodAfternoon' : 'home.goodEvening';

  const showStats = !!activePlanData && (doneSessions > 0 || runs.length > 0);

  const weekdays = activePlanData?.weekdays || DEFAULT_WEEKDAYS[dpw] || DEFAULT_WEEKDAYS[3];
  const monday = getMondayOf(now);
  const weekCalendar = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dayJs = d.getDay();
    const dayName = JS_DAY_TO_NAME[dayJs];
    const slotIdx = weekdays.indexOf(dayJs);
    const session = slotIdx >= 0 && vWeekSchedule && slotIdx < vWeekSchedule.sessions.length
      ? vWeekSchedule.sessions[slotIdx]
      : null;
    const isDone = session ? !!planProgress[session.globalIdx] : false;
    const isToday = isSameDay(d, now);
    return { dayName, dateNum: d.getDate(), date: toDateString(d), isTraining: !!session, isDone, isToday, session };
  });

  const todayEntry = weekCalendar.find(d => d.isToday);
  const isTodayDone = !!(todayEntry?.isTraining && todayEntry?.isDone);
  const todayCompletedSession = isTodayDone ? todayEntry.session : null;

  return {
    // Raw data
    activePlanData, plan, weekNum, planProgress,
    todaysWorkout, nextWorkout, missedWorkouts,
    runs, streak, refreshing, onRefresh, error,
    // Derived
    dpw, vWeekSchedule, totalVirtualWeeks,
    workoutToStart, hasActionableWorkout, extraMissed,
    totalSessions, doneSessions, progressPct,
    totalRunKm, weekKm,
    weekDoneSessions, weekTotalSessions,
    greetKey, showStats,
    weekCalendar, isTodayDone, todayCompletedSession,
  };
}

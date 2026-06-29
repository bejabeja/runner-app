import { useCallback, useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Modal, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CalendarCard from '../components/CalendarCard';
import { StatCell, useHomeStyles } from '../components/home/useHomeStyles';
import CongratCard from '../components/home/CongratCard';
import DayRestCard from '../components/home/DayRestCard';
import HeroCard from '../components/home/HeroCard';
import MissedCard from '../components/home/MissedCard';
import NoPlanCard from '../components/home/NoPlanCard';
import PastCompletedCard from '../components/home/PastCompletedCard';
import PendingSection from '../components/home/PendingSection';
import ProgressCard from '../components/home/ProgressCard';
import RestCard from '../components/home/RestCard';
import UpcomingCard from '../components/home/UpcomingCard';
import WeekPendingCard from '../components/home/WeekPendingCard';
import { useHomeData } from '../hooks/useHomeData';
import { useWeather } from '../hooks/useWeather';
import { useLanguage } from '../i18n';
import { toggleSession } from '../storage/progress';
import { getMondayOf, parseDateString, toDateString, weeksBetween } from '../utils/dateHelpers';
import { getSessionSummary } from '../utils/sessionSummary';
import { getVirtualSchedule, JS_DAY_TO_NAME } from '../utils/virtualSchedule';

export default function HomeScreen({ navigation }) {
  const { styles, colors } = useHomeStyles();
  const { t, lang } = useLanguage();
  const locale = lang === 'en' ? 'en-US' : 'es-ES';

  const { weather } = useWeather();

  const {
    activePlanData, plan: planObj, weekNum,
    todaysWorkout, nextWorkout, missedWorkouts,
    runs: allRuns, streak, refreshing, onRefresh,
    totalVirtualWeeks, dpw,
    workoutToStart, hasActionableWorkout, extraMissed,
    totalSessions, doneSessions, progressPct,
    totalRunKm, weekKm, weekDoneSessions, weekTotalSessions,
    greetKey, showStats, weekCalendar,
    planProgress, isTodayDone, todayCompletedSession,
  } = useHomeData();

  const [selectedDateStr, setSelectedDateStr] = useState(() => toDateString(new Date()));
  const [selectedDayDataCache, setSelectedDayDataCache] = useState(null);
  const [dayPickerVisible, setDayPickerVisible] = useState(false);

  const onSelectDay = useCallback((dayData) => {
    if (!dayData) {
      setSelectedDateStr(toDateString(new Date()));
      setSelectedDayDataCache(null);
      return;
    }
    setSelectedDateStr(dayData.date);
    setSelectedDayDataCache(dayData);
  }, []);

  const selectedDayData = useMemo(() => {
    const fromWeek = weekCalendar.find(d => d.date === selectedDateStr);
    return fromWeek ?? selectedDayDataCache;
  }, [selectedDateStr, weekCalendar, selectedDayDataCache]);

  const todayDateStr = weekCalendar.find(d => d.isToday)?.date ?? toDateString(new Date());
  const isSelectedToday = selectedDateStr === todayDateStr;
  const isPastDay = selectedDateStr < todayDateStr;
  const isFutureDay = selectedDateStr > todayDateStr;

  const runForSelectedDay = selectedDayData?.date
    ? allRuns.find(r => r.date.startsWith(selectedDayData.date)) ?? null
    : null;

  const selectedDayAbbr = selectedDayData
    ? (t('days.' + selectedDayData.dayName + '.abbr') || selectedDayData.dayName).toUpperCase()
    : '';

  const selectedWorkoutSummary = selectedDayData?.session
    ? getSessionSummary(selectedDayData.session.description)
    : null;

  const pendingSessionsForSelectedWeek = useMemo(() => {
    if (!planObj || !activePlanData || !selectedDateStr) return [];
    const schedule = getVirtualSchedule(planObj, dpw);
    const selMonday = getMondayOf(parseDateString(selectedDateStr));
    const startMonday = getMondayOf(new Date(activePlanData.startDate));
    const weeksSince = weeksBetween(startMonday, selMonday);
    const vWeek = weeksSince + 1;
    if (vWeek < 1 || vWeek > schedule.length) return [];
    return schedule[vWeek - 1].sessions
      .filter(s => !planProgress[s.globalIdx])
      .map(s => ({ ...s, planId: activePlanData.planId, week: vWeek, daysPerWeek: dpw }));
  }, [planObj, activePlanData, planProgress, dpw, selectedDateStr]);

  const weekDaysForPicker = useMemo(() => {
    if (!selectedDateStr) return [];
    const monday = getMondayOf(parseDateString(selectedDateStr));
    const today = toDateString(new Date());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const date = toDateString(d);
      const inCal = weekCalendar.find(w => w.date === date);
      return {
        date,
        dayName: JS_DAY_TO_NAME[d.getDay()],
        dateNum: d.getDate(),
        isTraining: inCal?.isTraining ?? false,
        isDone: inCal?.isDone ?? false,
        isToday: date === today,
        isPast: date < today,
      };
    });
  }, [selectedDateStr, weekCalendar]);

  const dateLabel = new Date().toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'short' });
  const workoutSummary = workoutToStart ? getSessionSummary(workoutToStart.description) : null;

  const startWorkout = (workout) => navigation.navigate('IntervalTimer', {
    session: workout,
    planId: workout.planId,
    sessionIdx: workout.sessionIdx,
    week: workout.week,
    daysPerWeek: workout.daysPerWeek,
  });

  const startSessionFromCalendar = (session) => navigation.navigate('IntervalTimer', {
    session: { ...session, planId: activePlanData?.planId },
    planId: activePlanData?.planId,
    sessionIdx: session.globalIdx,
    week: selectedDayData?.vWeek ?? weekNum,
    daysPerWeek: dpw,
  });

  const markMissedDone = async (session) => {
    if (!activePlanData) return;
    await toggleSession(activePlanData.planId, session.globalIdx);
    onRefresh();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{t(greetKey)}</Text>
            <Text style={styles.dateLabel}>{dateLabel}</Text>
            {streak > 0 && (
              <Text style={styles.streakLabel}>{t(streak === 1 ? 'home.streakOne' : 'home.streakOther', { n: streak })}</Text>
            )}
          </View>
        </View>

        {/* ── Calendar ── */}
        <CalendarCard
          weekCalendar={weekCalendar}
          activePlanData={activePlanData}
          planProgress={planProgress}
          plan={planObj}
          planObj={planObj}
          weekNum={weekNum}
          totalVirtualWeeks={totalVirtualWeeks}
          selectedDate={selectedDateStr}
          onSelectDay={onSelectDay}
        />

        {/* ── Main action card ── */}
        {!activePlanData ? (
          <NoPlanCard onPress={() => navigation.navigate('PlanFinder')} />
        ) : isSelectedToday ? (
          hasActionableWorkout ? (
            <HeroCard
              workoutToStart={workoutToStart}
              workoutSummary={workoutSummary}
              missedWorkouts={missedWorkouts}
              todaysWorkout={todaysWorkout}
              onStart={startWorkout}
              weather={weather}
            />
          ) : isTodayDone ? (
            <CongratCard
              todayCompletedSession={todayCompletedSession}
              weekDoneSessions={weekDoneSessions}
              weekTotalSessions={weekTotalSessions}
              weekKm={weekKm}
              nextWorkout={nextWorkout}
              onStart={startWorkout}
              weather={weather}
            />
          ) : (
            <RestCard
              weekDoneSessions={weekDoneSessions}
              weekTotalSessions={weekTotalSessions}
              weekKm={weekKm}
              nextWorkout={nextWorkout}
              onStart={startWorkout}
              weather={weather}
            />
          )
        ) : isFutureDay ? (
          selectedDayData?.isTraining ? (
            <UpcomingCard
              session={selectedDayData.session}
              dayAbbr={selectedDayAbbr}
              workoutSummary={selectedWorkoutSummary}
              onStart={startSessionFromCalendar}
              onChangeDay={() => setDayPickerVisible(true)}
            />
          ) : pendingSessionsForSelectedWeek.length > 0 ? (
            <WeekPendingCard
              sessions={pendingSessionsForSelectedWeek}
              onStart={startSessionFromCalendar}
            />
          ) : (
            <DayRestCard dayAbbr={selectedDayAbbr} />
          )
        ) : isPastDay ? (
          selectedDayData?.isTraining ? (
            selectedDayData.isDone ? (
              <PastCompletedCard
                session={selectedDayData.session}
                dayAbbr={selectedDayAbbr}
                run={runForSelectedDay}
              />
            ) : (
              <MissedCard
                session={selectedDayData.session}
                dayAbbr={selectedDayAbbr}
                workoutSummary={selectedWorkoutSummary}
                onMarkDone={markMissedDone}
                onStart={startSessionFromCalendar}
              />
            )
          ) : pendingSessionsForSelectedWeek.length > 0 ? (
            <WeekPendingCard
              sessions={pendingSessionsForSelectedWeek}
              onStart={startSessionFromCalendar}
            />
          ) : (
            <DayRestCard dayAbbr={selectedDayAbbr} />
          )
        ) : null}

        {/* ── Stats strip ── */}
        {showStats && (
          <View style={styles.statsRow}>
            <StatCell value={doneSessions} label={t('home.statsSessionsLbl')} />
            <View style={styles.statDivider} />
            <StatCell value={totalRunKm > 0 ? totalRunKm.toFixed(1) : '-'} label={t('home.statsKmLbl')} />
            <View style={styles.statDivider} />
            <StatCell value={streak > 0 ? `${streak} 🔥` : '-'} label={t('home.statsStreakLbl')} />
          </View>
        )}

        {/* ── Extra pending workouts (today view only) ── */}
        {isSelectedToday && extraMissed.length > 0 && (
          <PendingSection extraMissed={extraMissed} onStart={startWorkout} />
        )}

        {/* ── Plan progress ── */}
        <ProgressCard
          activePlanData={activePlanData}
          totalSessions={totalSessions}
          doneSessions={doneSessions}
          progressPct={progressPct}
        />
      </ScrollView>

      <Modal visible={dayPickerVisible} transparent animationType="fade" onRequestClose={() => setDayPickerVisible(false)}>
        <TouchableOpacity style={styles.pickerOverlay} activeOpacity={1} onPress={() => setDayPickerVisible(false)}>
          <View style={styles.dayPickerSheet}>
            <View style={styles.dayPickerHandle} />
            <Text style={styles.dayPickerTitle}>{t('home.changeDayTitle')}</Text>
            <View style={styles.dayPickerGrid}>
              {weekDaysForPicker.map(day => {
                const isSelected = day.date === selectedDateStr;
                const dayAbbr = (t('days.' + day.dayName + '.abbr') || day.dayName).toUpperCase();
                return (
                  <TouchableOpacity
                    key={day.date}
                    style={[styles.dayPickerCell, isSelected && styles.dayPickerCellActive, day.isPast && styles.dayPickerCellPast]}
                    onPress={() => { setSelectedDateStr(day.date); setSelectedDayDataCache(null); setDayPickerVisible(false); }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.dayPickerAbbr, isSelected && { color: colors.primary }]}>{dayAbbr}</Text>
                    <Text style={[styles.dayPickerDate, isSelected && { color: colors.primary }]}>{day.dateNum}</Text>
                    {day.isToday && <View style={styles.dayPickerTodayDot} />}
                    {day.isDone && <Ionicons name="checkmark" size={10} color={colors.success} />}
                    {day.isTraining && !day.isDone && <View style={[styles.dayPickerTodayDot, { backgroundColor: colors.primary }]} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

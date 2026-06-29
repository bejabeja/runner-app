import { useCallback, useEffect, useRef, useState } from 'react';
import { Vibration } from 'react-native';
import { setActionHandler, showLiveTimer, stopLiveTimer } from '../services/liveTimerNotification';
import { toggleSession } from '../storage/progress';
import { saveRun } from '../storage/runs';
import { generateId } from '../utils/id';
import { activate as activateKeepAwake, deactivate as deactivateKeepAwake } from '../utils/keepAwake';
import { getGroupedPhases, PHASE_CONFIG } from '../utils/parseIntervals';
import {
  cancelPhaseNotifications, requestNotificationPermission, schedulePhaseNotifications,
} from '../utils/phaseNotifications';
import { playCountdown, playDone, playPhaseChange, playStart as playStartSound, unlockAudio } from '../utils/sound';
import {
  COUNTDOWN_START, COUNTDOWN_TICK_MS,
  TIMER_TICK_MS, VIBRATION_COUNTDOWN,
  VIBRATION_DONE, VIBRATION_PHASE_CHANGE, VIBRATION_START,
} from '../utils/timerConstants';
import { isPlanComplete, isVirtualWeekComplete } from '../utils/virtualSchedule';
import { useLanguage } from '../i18n';

export function useIntervalTimer(intervals, { planId, sessionIdx, plan, week, daysPerWeek, session }) {
  const hasParsed = intervals.length > 0;
  const { lang: language } = useLanguage();
  const notifGrantedRef = useRef(false);

  const [status, setStatus] = useState('idle');
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [phaseElapsed, setPhaseElapsed] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [lapsCompleted, setLapsCompleted] = useState(0);
  const [feeling, setFeeling] = useState('good');
  const [weekComplete, setWeekComplete] = useState(false);
  const [planComplete, setPlanComplete] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [actualDist, setActualDist] = useState(session.distance || 0);
  const [shouldNavigateBack, setShouldNavigateBack] = useState(false);

  const intervalRef = useRef(null);
  const startRef = useRef(null);
  const accTotalRef = useRef(0);
  const accPhaseRef = useRef(0);
  const phaseIdxRef = useRef(0);
  const langRef = useRef(language);
  const pauseFnRef = useRef(null);
  const resumeFnRef = useRef(null);
  const skipFnRef = useRef(null);

  const currentPhase = hasParsed ? intervals[phaseIdx] : null;
  const phaseDuration = currentPhase?.duration;
  const phaseRemaining = phaseDuration ? Math.max(phaseDuration - phaseElapsed, 0) : null;

  // Derived display values
  const config = currentPhase ? PHASE_CONFIG[currentPhase.type] : PHASE_CONFIG.run;
  const nextPhase = hasParsed && phaseIdx + 1 < intervals.length ? intervals[phaseIdx + 1] : null;
  const nextConfig = nextPhase ? PHASE_CONFIG[nextPhase.type] : null;
  const showDots = hasParsed && intervals.length <= 16;
  const groupedPhases = hasParsed ? getGroupedPhases(intervals) : null;
  const totalEstMins = hasParsed
    ? Math.round(intervals.reduce((s, iv) => s + (iv.duration || 0), 0) / 60)
    : null;

  const advancePhase = useCallback(() => {
    accPhaseRef.current = 0;
    setPhaseElapsed(0);
    setPhaseIdx((prev) => {
      phaseIdxRef.current = prev + 1;
      return prev + 1;
    });
  }, []);

  const tick = useCallback(() => {
    const now = Date.now();
    const elapsed = accTotalRef.current + Math.floor((now - startRef.current) / 1000);
    const phElapsed = accPhaseRef.current + Math.floor((now - startRef.current) / 1000);
    setTotalElapsed(elapsed);
    setPhaseElapsed(phElapsed);
    const phase = intervals[phaseIdxRef.current];
    if (phase) {
      const rem = phase.duration ? Math.max(phase.duration - phElapsed, 0) : null;
      showLiveTimer({
        phaseType: phase.type,
        lang: langRef.current,
        remaining: rem,
        totalElapsed: elapsed,
        isPaused: false,
        hasNext: phaseIdxRef.current + 1 < intervals.length,
      }).catch(() => {});
    }
  }, [intervals]);

  // Timer tick
  useEffect(() => {
    if (status !== 'running') return;
    intervalRef.current = setInterval(tick, TIMER_TICK_MS);
    return () => clearInterval(intervalRef.current);
  }, [status, tick]);

  // Auto-advance when phase ends
  useEffect(() => {
    if (status === 'running' && phaseRemaining === 0 && phaseDuration !== null) {
      clearInterval(intervalRef.current);
      accTotalRef.current = totalElapsed;
      if (phaseIdx + 1 >= intervals.length) {
        setStatus('done');
      } else {
        advancePhase();
        startRef.current = Date.now();
        intervalRef.current = setInterval(tick, TIMER_TICK_MS);
      }
    }
  }, [phaseRemaining]);

  const scheduleNotifs = (fromPhaseIdx, alreadyElapsed) => {
    if (!hasParsed || !notifGrantedRef.current) return;
    schedulePhaseNotifications(intervals, fromPhaseIdx, alreadyElapsed, language);
  };

  const start = async () => {
    activateKeepAwake();
    startRef.current = Date.now();
    setStatus('running');
    playStartSound();
    Vibration.vibrate(VIBRATION_START);
    if (!notifGrantedRef.current) {
      notifGrantedRef.current = await requestNotificationPermission();
    }
    scheduleNotifs(0, 0);
    const phase = intervals[0];
    if (phase) {
      showLiveTimer({
        phaseType: phase.type,
        lang: language,
        remaining: phase.duration ?? null,
        totalElapsed: 0,
        isPaused: false,
        hasNext: intervals.length > 1,
      }).catch(() => {});
    }
  };

  const beginCountdown = () => {
    unlockAudio();
    setCountdown(COUNTDOWN_START);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setCountdown(null);
      start();
      return;
    }
    playCountdown();
    Vibration.vibrate(VIBRATION_COUNTDOWN);
    const timer = setTimeout(() => setCountdown((c) => c - 1), COUNTDOWN_TICK_MS);
    return () => clearTimeout(timer);
  }, [countdown]);

  const pause = () => {
    clearInterval(intervalRef.current);
    accTotalRef.current = totalElapsed;
    accPhaseRef.current = phaseElapsed;
    setStatus('paused');
    cancelPhaseNotifications();
    const phase = intervals[phaseIdx];
    if (phase) {
      showLiveTimer({
        phaseType: phase.type,
        lang: language,
        remaining: phaseRemaining,
        totalElapsed,
        isPaused: true,
        hasNext: phaseIdx + 1 < intervals.length,
      }).catch(() => {});
    }
  };

  const resume = () => {
    startRef.current = Date.now();
    setStatus('running');
    scheduleNotifs(phaseIdx, phaseElapsed);
    const phase = intervals[phaseIdx];
    if (phase) {
      showLiveTimer({
        phaseType: phase.type,
        lang: language,
        remaining: phaseRemaining,
        totalElapsed,
        isPaused: false,
        hasNext: phaseIdx + 1 < intervals.length,
      }).catch(() => {});
    }
  };

  pauseFnRef.current = pause;
  resumeFnRef.current = resume;

  const skipPhase = () => {
    clearInterval(intervalRef.current);
    accTotalRef.current = totalElapsed;
    accPhaseRef.current = 0;
    setPhaseElapsed(0);
    const nextIdx = phaseIdx + 1;
    if (nextIdx >= intervals.length) {
      setStatus('done');
      cancelPhaseNotifications();
      return;
    }
    advancePhase();
    startRef.current = Date.now();
    if (status !== 'running') setStatus('running');
    intervalRef.current = setInterval(tick, TIMER_TICK_MS);
    scheduleNotifs(nextIdx, 0);
  };

  skipFnRef.current = skipPhase;

  const completeLap = () => {
    setLapsCompleted((l) => l + 1);
    skipPhase();
  };

  const finishEarly = () => setStatus('done');

  const checkCompletion = (updated) => {
    if (plan && isPlanComplete(updated, planId, plan)) {
      setPlanComplete(true);
    } else if (plan && week && isVirtualWeekComplete(updated, planId, week, plan, daysPerWeek)) {
      setWeekComplete(true);
    } else {
      setShouldNavigateBack(true);
    }
  };

  const handleMarkDone = async () => {
    const updated = await toggleSession(planId, sessionIdx);
    checkCompletion(updated);
  };

  const handleSaveRun = async () => {
    try {
      await saveRun({
        id: generateId(),
        date: new Date().toISOString(),
        distance: actualDist,
        duration: totalElapsed,
        pace: actualDist > 0 ? Math.round(totalElapsed / actualDist) : 0,
        notes: `${session.type}, plan`,
        feeling: feeling || 'good',
      });
    } catch (_) {
      // saveRun failing shouldn't block marking the session done
    }
    const updated = await toggleSession(planId, sessionIdx);
    checkCompletion(updated);
  };

  // Sync refs
  useEffect(() => { langRef.current = language; }, [language]);

  // Register notification action handler (pause/resume/skip from lock screen)
  useEffect(() => {
    setActionHandler((actionId) => {
      if (actionId === 'pause') pauseFnRef.current?.();
      else if (actionId === 'resume') resumeFnRef.current?.();
      else if (actionId === 'skip') skipFnRef.current?.();
    });
    return () => setActionHandler(null);
  }, []);

  // Sound + vibration on phase change
  useEffect(() => {
    if (status === 'running' && phaseIdx > 0) {
      playPhaseChange(currentPhase?.type);
      Vibration.vibrate(VIBRATION_PHASE_CHANGE);
    }
  }, [phaseIdx]);

  // Countdown beeps (last 3 seconds of phase)
  useEffect(() => {
    if (status === 'running' && phaseRemaining !== null && phaseRemaining <= 3 && phaseRemaining > 0) {
      playCountdown();
    }
  }, [phaseRemaining, status]);

  // Session complete audio + haptic
  useEffect(() => {
    if (status === 'done') {
      playDone();
      deactivateKeepAwake();
      Vibration.vibrate(VIBRATION_DONE);
      cancelPhaseNotifications();
      stopLiveTimer().catch(() => {});
    }
  }, [status]);

  useEffect(() => () => {
    clearInterval(intervalRef.current);
    deactivateKeepAwake();
    cancelPhaseNotifications();
    stopLiveTimer().catch(() => {});
  }, []);

  return {
    status,
    phaseIdx,
    totalElapsed,
    lapsCompleted,
    feeling, setFeeling,
    weekComplete,
    planComplete,
    shouldNavigateBack,
    countdown,
    actualDist, setActualDist,
    currentPhase,
    phaseDuration,
    phaseRemaining,
    hasParsed,
    config,
    nextPhase,
    nextConfig,
    showDots,
    groupedPhases,
    totalEstMins,
    beginCountdown,
    pause,
    resume,
    skipPhase,
    completeLap,
    finishEarly,
    handleMarkDone,
    handleSaveRun,
  };
}

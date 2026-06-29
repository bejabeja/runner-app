import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const TIME_INTERVAL = Notifications.SchedulableTriggerInputTypes?.TIME_INTERVAL ?? 'timeInterval';

const PHASE_LABELS = {
  es: { run: '🏃 ¡Corre!', walk: '🚶 ¡Camina!', warmup: '🔥 ¡Calienta!', cooldown: '❄️ Vuelta calma', rest: '⏸ ¡Descansa!' },
  en: { run: '🏃 Run!',    walk: '🚶 Walk!',     warmup: '🔥 Warm up!',   cooldown: '❄️ Cool down',   rest: '⏸ Rest!'     },
};

const DONE_LABEL = {
  es: { title: '¡Sesión completada! 💪', body: '¡Buen trabajo!' },
  en: { title: 'Workout complete! 💪',   body: 'Great job!'     },
};

let _scheduledIds = [];

const isSupported = () => Platform.OS !== 'web';

export const requestNotificationPermission = async () => {
  if (!isSupported()) return false;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

export const cancelPhaseNotifications = async () => {
  if (!isSupported() || _scheduledIds.length === 0) return;
  await Promise.all(_scheduledIds.map(id =>
    Notifications.cancelScheduledNotificationAsync(id).catch(() => {}),
  ));
  _scheduledIds = [];
};

const schedule = async (content, seconds) => {
  const id = await Notifications.scheduleNotificationAsync({
    content: { sound: true, ...content },
    trigger: { type: TIME_INTERVAL, seconds: Math.max(1, Math.round(seconds)) },
  });
  return id;
};

// Schedule a notification for each upcoming phase change and the session end.
// currentPhaseIdx + alreadyElapsedSecs describe where we are right now.
export const schedulePhaseNotifications = async (intervals, currentPhaseIdx, alreadyElapsedSecs, lang = 'es') => {
  if (!isSupported()) return;
  await cancelPhaseNotifications();

  const currentDuration = intervals[currentPhaseIdx]?.duration;
  if (!currentDuration) return; // lap-based phase — durations unknown

  const labels = PHASE_LABELS[lang] || PHASE_LABELS.es;
  const done = DONE_LABEL[lang] || DONE_LABEL.es;
  const ids = [];

  if (__DEV__) {
    // Test notification to confirm the system is working (fires 5s after start)
    try {
      const id = await schedule({ title: '🔔 Notificaciones activas', body: 'Las notificaciones de fases funcionan.' }, 5);
      ids.push(id);
    } catch (e) { console.warn('[notif] test failed:', e); }
  }

  // Seconds until current phase ends
  let delayFromNow = currentDuration - alreadyElapsedSecs;

  for (let i = currentPhaseIdx + 1; i < intervals.length; i++) {
    const phase = intervals[i];

    if (delayFromNow > 1) {
      try {
        const id = await schedule(
          { title: labels[phase.type] || phase.label || '—', body: phase.label || '' },
          delayFromNow,
        );
        ids.push(id);
      } catch (e) { console.warn('[notif] schedule failed:', e); }
    }

    if (!phase.duration) break; // lap-based — can't predict remaining phases
    delayFromNow += phase.duration;
  }

  // Session complete notification
  if (delayFromNow > 1) {
    try {
      const id = await schedule({ title: done.title, body: done.body }, delayFromNow);
      ids.push(id);
    } catch (e) { console.warn('[notif] done schedule failed:', e); }
  }

  _scheduledIds = ids;
};

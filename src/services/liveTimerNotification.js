import { Platform } from 'react-native';

// Notifee is a native module — not available in Expo Go.
// All functions below are no-ops when it's missing.
let notifee = null;
let AndroidImportance = {};
let EventType = {};
try {
  const mod = require('@notifee/react-native');
  notifee = mod.default;
  AndroidImportance = mod.AndroidImportance;
  EventType = mod.EventType;
} catch (_) {}

const NOTIF_ID = 'runner-live-timer';
const CHANNEL_ID = 'live-timer';

let _stopServiceFn = null;
let _actionHandlerFn = null;

const PHASE_LABELS = {
  es: { run: 'Corriendo', walk: 'Caminando', warmup: 'Calentando', cooldown: 'Vuelta calma', rest: 'Descansando' },
  en: { run: 'Running',   walk: 'Walking',   warmup: 'Warming up', cooldown: 'Cool down',    rest: 'Rest'       },
};

const PHASE_COLORS = {
  run: '#E53935', walk: '#43A047', warmup: '#FB8C00', cooldown: '#1E88E5', rest: '#757575',
};

function fmt(s) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export function setActionHandler(fn) {
  _actionHandlerFn = fn;
}

// Must be called once at app startup (in index.js) before any foreground notification is shown.
export function registerForegroundService() {
  if (Platform.OS !== 'android' || !notifee) return;
  notifee.registerForegroundService(() =>
    new Promise(resolve => { _stopServiceFn = resolve; })
  );
}

// Must be called once at app startup (in index.js).
export function setupListeners() {
  if (Platform.OS !== 'android' || !notifee) return () => {};
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.ACTION_PRESS) _actionHandlerFn?.(detail.pressAction.id);
  });
  return notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.ACTION_PRESS) _actionHandlerFn?.(detail.pressAction.id);
  });
}

async function ensureChannel() {
  if (!notifee) return;
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Entreno en vivo',
    importance: AndroidImportance.HIGH,
    vibration: false,
  });
}

export async function showLiveTimer({ phaseType, lang = 'es', remaining, totalElapsed, isPaused, hasNext }) {
  if (Platform.OS !== 'android') return;
  await ensureChannel();

  const labels = PHASE_LABELS[lang] || PHASE_LABELS.es;
  const phaseLabel = labels[phaseType] || phaseType;
  const title = isPaused ? `<b>${phaseLabel}</b> · Pausado` : `<b>${phaseLabel}</b>`;
  const body = remaining != null
    ? `${fmt(remaining)} restante · Total ${fmt(totalElapsed)}`
    : `Total ${fmt(totalElapsed)}`;

  await notifee.displayNotification({
    id: NOTIF_ID,
    title,
    body,
    android: {
      channelId: CHANNEL_ID,
      asForegroundService: true,
      ongoing: true,
      onlyAlertOnce: true,
      color: PHASE_COLORS[phaseType] || '#FF6B35',
      colorized: true,
      pressAction: { id: 'open', launchActivity: 'default' },
      actions: [
        {
          title: isPaused ? '▶ Reanudar' : '⏸ Pausar',
          pressAction: { id: isPaused ? 'resume' : 'pause' },
        },
        ...(hasNext ? [{ title: '⏭ Siguiente', pressAction: { id: 'skip' } }] : []),
      ],
    },
  });
}

export async function stopLiveTimer() {
  if (Platform.OS !== 'android' || !notifee) return;
  await notifee.cancelNotification(NOTIF_ID).catch(() => {});
  _stopServiceFn?.();
  _stopServiceFn = null;
}

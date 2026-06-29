export const formatDuration = (totalSeconds) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
};

export const formatPace = (secondsPerKm) => {
  if (!secondsPerKm || secondsPerKm === Infinity) return '--:--';
  const m = Math.floor(secondsPerKm / 60);
  const s = Math.round(secondsPerKm % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
};

export const calcPace = (distanceKm, durationSeconds) => {
  if (!distanceKm || distanceKm === 0) return 0;
  return Math.round(durationSeconds / distanceKm);
};

export const formatDistance = (km) => {
  if (km >= 10) return `${km.toFixed(1)} km`;
  return `${km.toFixed(2)} km`;
};

export const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
};

export const formatDateShort = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};

export const parseDurationInput = (input) => {
  const clean = input.trim().replace(/\s/g, '');
  const parts = clean.split(':').map(Number);
  if (parts.some(isNaN)) return null;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return null;
};

export const formatRelativeDate = (iso, { t, locale, todayKey, yesterdayKey, fullDate = true }) => {
  const d = new Date(iso);
  const diff = Math.floor((Date.now() - d) / (1000 * 60 * 60 * 24));
  if (diff === 0) return t(todayKey);
  if (diff === 1) return t(yesterdayKey);
  if (diff < 7) return d.toLocaleDateString(locale, { weekday: 'long' });
  return fullDate
    ? d.toLocaleDateString(locale, { day: 'numeric', month: 'short' })
    : d.toLocaleDateString(locale, { weekday: 'long' });
};

export const formatMMSS = (secs) => {
  if (secs === null || secs === undefined) return '--:--';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export const formatISODate = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const getWeekStart = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

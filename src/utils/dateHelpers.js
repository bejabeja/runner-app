export const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Monday of the week containing `date`, set to noon (avoids DST boundary issues).
export const getMondayOf = (date = new Date()) => {
  const d = new Date(date);
  const off = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - off);
  d.setHours(12, 0, 0, 0);
  return d;
};

// Local YYYY-MM-DD string for a Date object. Safer than toISOString().slice(0,10)
// which returns UTC and can shift the day near midnight in non-UTC timezones.
export const toDateString = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Parse a YYYY-MM-DD string as a local noon Date to avoid UTC-shift issues.
export const parseDateString = (dateStr) => new Date(dateStr + 'T12:00:00');

// Signed number of weeks from mondayA to mondayB (positive = B is in the future).
export const weeksBetween = (mondayA, mondayB) =>
  Math.round((mondayB.getTime() - mondayA.getTime()) / WEEK_MS);

// True when two Date objects fall on the same calendar day.
export const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

// Returns a Date set to noon on the day that was `daysAgo` days before today.
export const dateFromDaysAgo = (daysAgo) => {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - daysAgo);
  return d;
};

// Returns a Date set to noon on the next Monday (today if today is Monday).
export const getNextMonday = () => {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  const day = d.getDay(); // 0=Sun, 1=Mon, …, 6=Sat
  const daysToAdd = day === 1 ? 0 : day === 0 ? 1 : 8 - day;
  d.setDate(d.getDate() + daysToAdd);
  return d;
};

import { parseIntervals, PHASE_BAR_COLORS } from './parseIntervals';
import { SECS_PER_MIN } from './timerConstants';

const getTotalDuration = (intervals) =>
  intervals.reduce((s, iv) => s + (iv.duration || 0), 0);

export const getEstimatedMins = (description) => {
  const intervals = parseIntervals(description);
  if (!intervals) return null;
  const total = getTotalDuration(intervals);
  return total > 0 ? Math.round(total / SECS_PER_MIN) : null;
};

// Returns an array of { flex, color } segments for a proportional phase bar, or null.
export const getPhaseBar = (description, intervals = parseIntervals(description)) => {
  if (!intervals || intervals.length === 0) return null;
  const totalDuration = getTotalDuration(intervals);
  if (totalDuration === 0) return null;
  const merged = [];
  for (const iv of intervals) {
    const prev = merged[merged.length - 1];
    if (prev && prev.type === iv.type) {
      prev.duration += iv.duration || 0;
    } else {
      merged.push({ type: iv.type, duration: iv.duration || 0 });
    }
  }
  return merged.map(seg => ({
    flex: seg.duration / totalDuration,
    color: PHASE_BAR_COLORS[seg.type] || 'rgba(255,255,255,0.4)',
  }));
};

// Returns a compact interval summary string like "8 × 1'/2'" or null.
export const getIntervalSummary = (description, intervals = parseIntervals(description)) => {
  if (!intervals) return null;
  const rep = intervals.find(iv => iv.type === 'run' && iv.totalReps);
  if (!rep) return null;
  const runMins = Math.round(rep.duration / SECS_PER_MIN);
  const walkIdx = intervals.indexOf(rep) + 1;
  const walkMins = walkIdx < intervals.length && intervals[walkIdx]?.type === 'walk'
    ? Math.round(intervals[walkIdx].duration / SECS_PER_MIN)
    : null;
  return walkMins ? `${rep.totalReps} × ${runMins}'/${walkMins}'` : `${rep.totalReps} × ${runMins}'`;
};

// Parses description once and returns all summary values together.
export const getSessionSummary = (description) => {
  const intervals = parseIntervals(description);
  return {
    estimatedMins: intervals
      ? Math.round(getTotalDuration(intervals) / SECS_PER_MIN) || null
      : null,
    phaseBar: getPhaseBar(description, intervals),
    intervalSummary: getIntervalSummary(description, intervals),
  };
};

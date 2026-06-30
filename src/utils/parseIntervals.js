// Parses a session description into a list of timed intervals.
// Returns null if the description can't be parsed (fallback to freeform stopwatch).

import { SECS_PER_MIN } from './timerConstants';

// Named regex patterns — one per format variant, ordered most-specific first.
const RE_COMPOUND_ALTERNATE = /(\d+) min calentamiento \+ [Aa]lterna (\d+) min corriendo y (\d+) min caminando [×x] (\d+) \+ (\d+) min vuelta calma/;
const RE_ALTERNATE = /[Aa]lterna (\d+) min corriendo y (\d+) min caminando [×x] (\d+)/;
const RE_RUN_WALK_RUN = /[Cc]orre (\d+) min, camina (\d+) min, corre (\d+) min/;
const RE_STRUCTURED = /(\d+) min calentamiento \+ (\d+) min (.*?) \+ (\d+) min vuelta calma/;
const RE_DISTANCE_INTERVALS = /(\d+)[×x](\d+)m.*?(\d+)s descanso/;
const RE_FARTLEK = /(\d+) min r[áa]pido \/ (\d+) min suave [×x] (\d+)/;
const RE_SIMPLE_MIN = /(\d+) min/;
const RE_VERB_MIN = /([Tt]rote|[Cc]orre|[Cc]amina).*?(\d+) min/;

export const parseIntervals = (description) => {
  if (!description) return null;
  const d = description;

  // "X min calentamiento + Alterna Y min corriendo y Z min caminando × N + W min vuelta calma"
  const compoundAlt = d.match(RE_COMPOUND_ALTERNATE);
  if (compoundAlt) {
    const warmupSecs = parseInt(compoundAlt[1]) * SECS_PER_MIN;
    const runSecs = parseInt(compoundAlt[2]) * SECS_PER_MIN;
    const walkSecs = parseInt(compoundAlt[3]) * SECS_PER_MIN;
    const reps = parseInt(compoundAlt[4]);
    const cooldownSecs = parseInt(compoundAlt[5]) * SECS_PER_MIN;
    const intervals = [{ type: 'warmup', duration: warmupSecs, label: 'Calentamiento' }];
    for (let i = 0; i < reps; i++) {
      intervals.push({ type: 'run', duration: runSecs, label: `Correr ${compoundAlt[2]} min`, rep: i + 1, totalReps: reps });
      intervals.push({ type: 'walk', duration: walkSecs, label: `Caminar ${compoundAlt[3]} min`, rep: i + 1, totalReps: reps });
    }
    intervals.push({ type: 'cooldown', duration: cooldownSecs, label: 'Vuelta calma' });
    return intervals;
  }

  // "Alterna X min corriendo y Y min caminando × Z repeticiones"
  const altMatch = d.match(RE_ALTERNATE);
  if (altMatch) {
    const run = parseInt(altMatch[1]) * SECS_PER_MIN;
    const walk = parseInt(altMatch[2]) * SECS_PER_MIN;
    const reps = parseInt(altMatch[3]);
    const intervals = [];
    for (let i = 0; i < reps; i++) {
      intervals.push({ type: 'run', duration: run, label: `Correr ${altMatch[1]} min`, rep: i + 1, totalReps: reps });
      intervals.push({ type: 'walk', duration: walk, label: `Caminar ${altMatch[2]} min`, rep: i + 1, totalReps: reps });
    }
    return intervals;
  }

  // "Corre X min, camina Y min, corre Z min"
  const correCamMatch = d.match(RE_RUN_WALK_RUN);
  if (correCamMatch) {
    return [
      { type: 'run', duration: parseInt(correCamMatch[1]) * SECS_PER_MIN, label: `Correr ${correCamMatch[1]} min` },
      { type: 'walk', duration: parseInt(correCamMatch[2]) * SECS_PER_MIN, label: `Caminar ${correCamMatch[2]} min` },
      { type: 'run', duration: parseInt(correCamMatch[3]) * SECS_PER_MIN, label: `Correr ${correCamMatch[3]} min` },
    ];
  }

  // "X min calentamiento + Y min ... + Z min vuelta calma"
  const structMatch = d.match(RE_STRUCTURED);
  if (structMatch) {
    return [
      { type: 'warmup', duration: parseInt(structMatch[1]) * SECS_PER_MIN, label: 'Calentamiento' },
      { type: 'run', duration: parseInt(structMatch[2]) * SECS_PER_MIN, label: structMatch[3].trim() },
      { type: 'cooldown', duration: parseInt(structMatch[4]) * SECS_PER_MIN, label: 'Vuelta calma' },
    ];
  }

  // "N×Xm a ritmo ... con Ys descanso"
  const distMatch = d.match(RE_DISTANCE_INTERVALS);
  if (distMatch) {
    const reps = parseInt(distMatch[1]);
    const dist = parseInt(distMatch[2]);
    const rest = parseInt(distMatch[3]);
    const intervals = [];
    for (let i = 0; i < reps; i++) {
      intervals.push({ type: 'run', duration: null, label: `${dist}m rápido`, rep: i + 1, totalReps: reps, isLap: true });
      if (i < reps - 1) {
        intervals.push({ type: 'rest', duration: rest, label: `Descanso ${rest}s`, rep: i + 1, totalReps: reps });
      }
    }
    return intervals;
  }

  // "Fartlek: X min rápido / Y min suave × Z"
  const fartlekMatch = d.match(RE_FARTLEK);
  if (fartlekMatch) {
    const fast = parseInt(fartlekMatch[1]) * SECS_PER_MIN;
    const easy = parseInt(fartlekMatch[2]) * SECS_PER_MIN;
    const reps = parseInt(fartlekMatch[3]);
    const intervals = [];
    for (let i = 0; i < reps; i++) {
      intervals.push({ type: 'run', duration: fast, label: `Rápido ${fartlekMatch[1]} min`, rep: i + 1, totalReps: reps });
      intervals.push({ type: 'walk', duration: easy, label: `Suave ${fartlekMatch[2]} min`, rep: i + 1, totalReps: reps });
    }
    return intervals;
  }

  // Simple continuous: "Corre X min" / "X min a ritmo..." / "Trote X min" / "X min muy suave"
  const simpleMatch = d.match(RE_SIMPLE_MIN) || d.match(RE_VERB_MIN);
  if (simpleMatch) {
    const mins = parseInt(d.match(RE_SIMPLE_MIN)?.[1]);
    if (mins) {
      const isWalk = /^[Cc]amina\b/i.test(d);
      return [{ type: isWalk ? 'walk' : 'run', duration: mins * SECS_PER_MIN, label: `${mins} minutos` }];
    }
  }

  return null;
};

export const PHASE_CONFIG = {
  run: { label: 'CORRER', bg: '#C2410C', secondary: '#9A3412', icon: 'fitness-outline' },
  walk: { label: 'CAMINAR', bg: '#1D4ED8', secondary: '#1E40AF', icon: 'walk-outline' },
  warmup: { label: 'CALENTAMIENTO', bg: '#B45309', secondary: '#92400E', icon: 'flame-outline' },
  cooldown: { label: 'VUELTA CALMA', bg: '#6D28D9', secondary: '#5B21B6', icon: 'snow-outline' },
  rest: { label: 'DESCANSO', bg: '#059669', secondary: '#047857', icon: 'pause-outline' },
};

// Light RGBA overlays for the phase bar on the hero card (dark surface context).
// Kept separate from PHASE_CONFIG.bg which are solid colors for the timer screen.
export const PHASE_BAR_COLORS = {
  warmup: 'rgba(251,191,36,0.75)',
  run: 'rgba(255,255,255,0.92)',
  walk: 'rgba(147,197,253,0.85)',
  cooldown: 'rgba(196,181,253,0.85)',
  rest: 'rgba(255,255,255,0.2)',
};

export const getGroupedPhases = (intervals) => {
  if (!intervals || intervals.length === 0) return null;
  const groups = [];
  let i = 0;
  while (i < intervals.length) {
    const iv = intervals[i];
    const cfg = PHASE_CONFIG[iv.type] || PHASE_CONFIG.run;
    if (iv.type === 'run' && iv.totalReps && intervals[i + 1]?.type === 'walk') {
      groups.push({
        key: `interval-${i}`,
        type: 'interval',
        runDuration: iv.duration,
        walkDuration: intervals[i + 1].duration,
        reps: iv.totalReps,
        runCfg: PHASE_CONFIG.run,
        walkCfg: PHASE_CONFIG.walk,
      });
      i += iv.totalReps * 2;
    } else {
      groups.push({ key: `${iv.type}-${i}`, type: iv.type, duration: iv.duration, cfg });
      i++;
    }
  }
  return groups;
};

const DEFAULT_SUMMARY_LABELS = { warmup: 'Calienta', cooldown: 'Enfría', run: 'Corre', walk: 'Camina' };

export const getPhaseSummaryText = (description, labels = DEFAULT_SUMMARY_LABELS) => {
  const intervals = parseIntervals(description);
  if (!intervals || intervals.length === 0) return null;
  const L = { ...DEFAULT_SUMMARY_LABELS, ...labels };
  const parts = [];
  let i = 0;
  while (i < intervals.length) {
    const iv = intervals[i];
    const dur = iv.duration ? Math.round(iv.duration / SECS_PER_MIN) : 0;
    if (iv.type === 'warmup') { parts.push(`${L.warmup} ${dur}'`); i++; }
    else if (iv.type === 'cooldown') { parts.push(`${L.cooldown} ${dur}'`); i++; }
    else if (iv.type === 'run' && iv.totalReps && intervals[i + 1]?.type === 'walk') {
      const w = Math.round(intervals[i + 1].duration / SECS_PER_MIN);
      parts.push(`${dur}'/${w}' ×${iv.totalReps}`);
      i += iv.totalReps * 2;
    } else if (iv.type === 'run') { parts.push(`${L.run} ${dur}'`); i++; }
    else if (iv.type === 'walk') { parts.push(`${L.walk} ${dur}'`); i++; }
    else { i++; }
  }
  return parts.length > 0 ? parts.join(' · ') : null;
};

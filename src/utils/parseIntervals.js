// Parses a session description into a list of timed intervals.
// Returns null if the description can't be parsed (fallback to freeform stopwatch).

export const parseIntervals = (description) => {
  const d = description;

  // "X min calentamiento + Alterna Y min corriendo y Z min caminando × N + W min vuelta calma"
  const compoundAlt = d.match(
    /(\d+) min calentamiento \+ [Aa]lterna (\d+) min corriendo y (\d+) min caminando [×x] (\d+) \+ (\d+) min vuelta calma/
  );
  if (compoundAlt) {
    const warmupSecs = parseInt(compoundAlt[1]) * 60;
    const runSecs = parseInt(compoundAlt[2]) * 60;
    const walkSecs = parseInt(compoundAlt[3]) * 60;
    const reps = parseInt(compoundAlt[4]);
    const cooldownSecs = parseInt(compoundAlt[5]) * 60;
    const intervals = [{ type: 'warmup', duration: warmupSecs, label: 'Calentamiento' }];
    for (let i = 0; i < reps; i++) {
      intervals.push({ type: 'run', duration: runSecs, label: `Correr ${compoundAlt[2]} min`, rep: i + 1, totalReps: reps });
      intervals.push({ type: 'walk', duration: walkSecs, label: `Caminar ${compoundAlt[3]} min`, rep: i + 1, totalReps: reps });
    }
    intervals.push({ type: 'cooldown', duration: cooldownSecs, label: 'Vuelta calma' });
    return intervals;
  }

  // "Alterna X min corriendo y Y min caminando × Z repeticiones"
  const altMatch = d.match(/[Aa]lterna (\d+) min corriendo y (\d+) min caminando [×x] (\d+)/);
  if (altMatch) {
    const run = parseInt(altMatch[1]) * 60;
    const walk = parseInt(altMatch[2]) * 60;
    const reps = parseInt(altMatch[3]);
    const intervals = [];
    for (let i = 0; i < reps; i++) {
      intervals.push({ type: 'run', duration: run, label: `Correr ${altMatch[1]} min`, rep: i + 1, totalReps: reps });
      intervals.push({ type: 'walk', duration: walk, label: `Caminar ${altMatch[2]} min`, rep: i + 1, totalReps: reps });
    }
    return intervals;
  }

  // "Corre X min, camina Y min, corre Z min"
  const correCamMatch = d.match(/[Cc]orre (\d+) min, camina (\d+) min, corre (\d+) min/);
  if (correCamMatch) {
    return [
      { type: 'run', duration: parseInt(correCamMatch[1]) * 60, label: `Correr ${correCamMatch[1]} min` },
      { type: 'walk', duration: parseInt(correCamMatch[2]) * 60, label: `Caminar ${correCamMatch[2]} min` },
      { type: 'run', duration: parseInt(correCamMatch[3]) * 60, label: `Correr ${correCamMatch[3]} min` },
    ];
  }

  // "X min calentamiento + Y min ... + Z min vuelta calma"
  const structMatch = d.match(/(\d+) min calentamiento \+ (\d+) min (.*?) \+ (\d+) min vuelta calma/);
  if (structMatch) {
    return [
      { type: 'warmup', duration: parseInt(structMatch[1]) * 60, label: 'Calentamiento' },
      { type: 'run', duration: parseInt(structMatch[2]) * 60, label: structMatch[3].trim() },
      { type: 'cooldown', duration: parseInt(structMatch[4]) * 60, label: 'Vuelta calma' },
    ];
  }

  // "N×Xm a ritmo ... con Ys descanso"
  const distMatch = d.match(/(\d+)[×x](\d+)m.*?(\d+)s descanso/);
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
  const fartlekMatch = d.match(/(\d+) min r[áa]pido \/ (\d+) min suave [×x] (\d+)/);
  if (fartlekMatch) {
    const fast = parseInt(fartlekMatch[1]) * 60;
    const easy = parseInt(fartlekMatch[2]) * 60;
    const reps = parseInt(fartlekMatch[3]);
    const intervals = [];
    for (let i = 0; i < reps; i++) {
      intervals.push({ type: 'run', duration: fast, label: `Rápido ${fartlekMatch[1]} min`, rep: i + 1, totalReps: reps });
      intervals.push({ type: 'walk', duration: easy, label: `Suave ${fartlekMatch[2]} min`, rep: i + 1, totalReps: reps });
    }
    return intervals;
  }

  // Simple continuous: "Corre X min" / "X min a ritmo..." / "Trote X min" / "X min muy suave"
  const simpleMatch = d.match(/(\d+) min/) || d.match(/([Tt]rote|[Cc]orre|[Cc]amina).*?(\d+) min/);
  if (simpleMatch) {
    const mins = parseInt(d.match(/(\d+) min/)?.[1]);
    if (mins) {
      const isWalk = /[Cc]amina|[Tt]rote|suave|calmad/i.test(d);
      return [{ type: isWalk ? 'walk' : 'run', duration: mins * 60, label: `${mins} minutos` }];
    }
  }

  return null;
};

export const PHASE_CONFIG = {
  run:      { label: 'CORRER',        bg: '#FF5C00', secondary: '#CC3D00', icon: 'fitness-outline' },
  walk:     { label: 'CAMINAR',       bg: '#2563EB', secondary: '#1D4ED8', icon: 'walk-outline' },
  warmup:   { label: 'CALENTAMIENTO', bg: '#D97706', secondary: '#B45309', icon: 'flame-outline' },
  cooldown: { label: 'VUELTA CALMA',  bg: '#7C3AED', secondary: '#6D28D9', icon: 'snow-outline' },
  rest:     { label: 'DESCANSO',      bg: '#059669', secondary: '#047857', icon: 'pause-outline' },
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

export const getPhaseSummaryText = (description) => {
  const intervals = parseIntervals(description);
  if (!intervals || intervals.length === 0) return null;
  const parts = [];
  let i = 0;
  while (i < intervals.length) {
    const iv = intervals[i];
    const dur = iv.duration ? Math.round(iv.duration / 60) : 0;
    if (iv.type === 'warmup') { parts.push(`Calienta ${dur}'`); i++; }
    else if (iv.type === 'cooldown') { parts.push(`Enfría ${dur}'`); i++; }
    else if (iv.type === 'run' && iv.totalReps && intervals[i + 1]?.type === 'walk') {
      const w = Math.round(intervals[i + 1].duration / 60);
      parts.push(`${dur}'/${w}' ×${iv.totalReps}`);
      i += iv.totalReps * 2;
    } else if (iv.type === 'run') { parts.push(`Corre ${dur}'`); i++; }
    else if (iv.type === 'walk') { parts.push(`Camina ${dur}'`); i++; }
    else { i++; }
  }
  return parts.length > 0 ? parts.join(' · ') : null;
};

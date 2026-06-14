import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Dimensions, Platform, Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme';
import { parseIntervals, PHASE_CONFIG, getGroupedPhases } from '../utils/parseIntervals';
import { toggleSession } from '../storage/progress';
import { saveRun } from '../storage/storage';
import { TRAINING_PLANS } from '../data/trainingPlans';
import { generateId } from '../utils/id';
import { formatDuration } from '../utils/format';
import { playPhaseChange, playDone, playCountdown, playStart as playStartSound, unlockAudio } from '../utils/sound';
import { activate as activateKeepAwake, deactivate as deactivateKeepAwake } from '../utils/keepAwake';

const { width: SCREEN_W } = Dimensions.get('window');

const FEELINGS = [
  { key: 'easy', emoji: '😌', label: 'Fácil' },
  { key: 'good', emoji: '💪', label: 'Bien' },
  { key: 'hard', emoji: '🔥', label: 'Duro' },
];

const getPaceTip = (type, weekNum) => {
  if (type === 'run') {
    if (weekNum <= 4) return '¿Puedes hablar? Ese es tu ritmo';
    if (weekNum <= 6) return 'Ritmo cómodo y constante';
    return 'Confía en tu cuerpo';
  }
  const tips = {
    walk: 'Recupera la respiración',
    warmup: 'Activa los músculos suavemente',
    cooldown: 'Afloja el paso, respira hondo',
    rest: 'Descansa y prepárate',
  };
  return tips[type] || null;
};

const isWeekNowComplete = (updated, planId, weekNum) => {
  const plan = TRAINING_PLANS.find((p) => p.id === planId);
  const weekSchedule = plan?.schedule.find((w) => w.week === weekNum);
  if (!weekSchedule) return false;
  const total = weekSchedule.sessions.length;
  const done = Object.values(updated[planId]?.[weekNum] || {}).filter(Boolean).length;
  return done >= total;
};

export default function IntervalTimerScreen({ route, navigation }) {
  const { session, planId, week, sessionIdx } = route.params;
  const intervals = parseIntervals(session.description);
  const hasParsed = intervals && intervals.length > 0;

  const [status, setStatus] = useState('idle'); // idle | running | paused | done
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [phaseElapsed, setPhaseElapsed] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [lapsCompleted, setLapsCompleted] = useState(0);
  const [feeling, setFeeling] = useState(null);
  const [weekComplete, setWeekComplete] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [actualDist, setActualDist] = useState(parseFloat(session.distance) || 0);

  const intervalRef = useRef(null);
  const startRef = useRef(null);
  const accTotalRef = useRef(0);
  const accPhaseRef = useRef(0);

  const currentPhase = hasParsed ? intervals[phaseIdx] : null;
  const config = currentPhase ? PHASE_CONFIG[currentPhase.type] : PHASE_CONFIG.run;
  const phaseDuration = currentPhase?.duration;
  const phaseRemaining = phaseDuration ? Math.max(phaseDuration - phaseElapsed, 0) : null;

  const advancePhase = useCallback(() => {
    setPhaseIdx((prev) => {
      if (prev + 1 >= intervals.length) {
        setStatus('done');
        return prev;
      }
      accPhaseRef.current = 0;
      setPhaseElapsed(0);
      return prev + 1;
    });
  }, [intervals]);

  const tick = useCallback(() => {
    const now = Date.now();
    const elapsed = accTotalRef.current + Math.floor((now - startRef.current) / 1000);
    const phElapsed = accPhaseRef.current + Math.floor((now - startRef.current) / 1000);
    setTotalElapsed(elapsed);
    setPhaseElapsed(phElapsed);
  }, []);

  useEffect(() => {
    if (status !== 'running') return;
    intervalRef.current = setInterval(tick, 500);
    return () => clearInterval(intervalRef.current);
  }, [status, tick]);

  // Auto-advance when countdown phase ends
  useEffect(() => {
    if (status === 'running' && phaseRemaining === 0 && phaseDuration !== null) {
      clearInterval(intervalRef.current);
      accTotalRef.current = totalElapsed;
      advancePhase();
      if (status !== 'done') {
        accPhaseRef.current = 0;
        startRef.current = Date.now();
        intervalRef.current = setInterval(tick, 500);
      }
    }
  }, [phaseRemaining]);

  const beginCountdown = () => {
    unlockAudio();
    setCountdown(3);
  };

  const start = () => {
    activateKeepAwake();
    startRef.current = Date.now();
    setStatus('running');
    playStartSound();
    Vibration.vibrate(200);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setCountdown(null);
      start();
      return;
    }
    playCountdown();
    Vibration.vibrate(40);
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const pause = () => {
    clearInterval(intervalRef.current);
    accTotalRef.current = totalElapsed;
    accPhaseRef.current = phaseElapsed;
    setStatus('paused');
  };

  const resume = () => {
    startRef.current = Date.now();
    setStatus('running');
  };

  const skipPhase = () => {
    clearInterval(intervalRef.current);
    accTotalRef.current = totalElapsed;
    accPhaseRef.current = 0;
    setPhaseElapsed(0);
    if (phaseIdx + 1 >= intervals.length) {
      setStatus('done');
      return;
    }
    advancePhase();
    startRef.current = Date.now();
    if (status !== 'running') setStatus('running');
    intervalRef.current = setInterval(tick, 500);
  };

  const completeLap = () => {
    setLapsCompleted((l) => l + 1);
    skipPhase();
  };

  const handleMarkDone = async () => {
    const updated = await toggleSession(planId, week, sessionIdx);
    if (isWeekNowComplete(updated, planId, week)) {
      setWeekComplete(true);
    } else {
      navigation.goBack();
    }
  };

  const handleSaveRun = async () => {
    await saveRun({
      id: generateId(),
      date: new Date().toISOString(),
      distance: actualDist,
      duration: totalElapsed,
      pace: actualDist > 0 ? Math.round(totalElapsed / actualDist) : 0,
      notes: `${session.type} — plan`,
      feeling: feeling || 'good',
    });
    const updated = await toggleSession(planId, week, sessionIdx);
    if (isWeekNowComplete(updated, planId, week)) {
      setWeekComplete(true);
    } else {
      navigation.goBack();
    }
  };

  const handleExit = () => {
    const leave = () => navigation.goBack();
    if (status === 'idle' || status === 'done') { leave(); return; }
    if (Platform.OS === 'web') {
      if (window.confirm('¿Salir? Se perderá el progreso del cronómetro.')) leave();
    } else {
      leave();
    }
  };

  // Sound + vibration on phase change
  useEffect(() => {
    if (status === 'running' && phaseIdx > 0) {
      playPhaseChange(currentPhase?.type);
      Vibration.vibrate(150);
    }
  }, [phaseIdx]);

  // Sound countdown (last 3 seconds of phase)
  useEffect(() => {
    if (status === 'running' && phaseRemaining !== null && phaseRemaining <= 3 && phaseRemaining > 0) {
      playCountdown();
    }
    if (status === 'done') {
      playDone();
      deactivateKeepAwake();
      Vibration.vibrate([0, 200, 100, 200, 100, 400]);
    }
  }, [phaseRemaining, status]);

  useEffect(() => () => { clearInterval(intervalRef.current); deactivateKeepAwake(); }, []);

  const formatCountdown = (secs) => {
    if (secs === null) return '--:--';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const nextPhase = hasParsed && phaseIdx + 1 < intervals.length ? intervals[phaseIdx + 1] : null;
  const nextConfig = nextPhase ? PHASE_CONFIG[nextPhase.type] : null;
  const showDots = hasParsed && intervals.length <= 16;
  const groupedPhases = hasParsed ? getGroupedPhases(intervals) : null;
  const totalEstMins = hasParsed ? Math.round(intervals.reduce((s, iv) => s + (iv.duration || 0), 0) / 60) : null;
  const paceTip = status === 'running' && currentPhase ? getPaceTip(currentPhase.type, week) : null;

  // ── Week complete celebration ─────────────────────────────────────────────
  if (weekComplete) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.doneScreen}>
          <Text style={styles.doneEmoji}>🏆</Text>
          <Text style={styles.doneTitle}>¡Semana {week} completada!</Text>
          <Text style={styles.doneSub}>Cada semana te acerca más al 5K. Sigue así.</Text>
          <View style={styles.doneSummary}>
            <View style={styles.doneStat}>
              <Text style={styles.doneStatValue}>{formatDuration(totalElapsed)}</Text>
              <Text style={styles.doneStatLabel}>Tiempo</Text>
            </View>
            <View style={styles.doneStatDiv} />
            <View style={styles.doneStat}>
              <Text style={styles.doneStatValue}>{session.distance} km</Text>
              <Text style={styles.doneStatLabel}>Distancia</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.primaryBtnText}>Seguir con el plan →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Session done screen ───────────────────────────────────────────────────
  if (status === 'done') {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.doneScreen}>
          <TouchableOpacity style={styles.closeBtn} onPress={handleExit}>
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <Text style={styles.doneEmoji}>🎉</Text>
          <Text style={styles.doneTitle}>¡Sesión completada!</Text>
          <Text style={styles.doneSub}>{session.type}</Text>

          <View style={styles.doneSummary}>
            <View style={styles.doneStat}>
              <Text style={styles.doneStatValue}>{formatDuration(totalElapsed)}</Text>
              <Text style={styles.doneStatLabel}>Tiempo total</Text>
            </View>
            <View style={styles.doneStatDiv} />
            <View style={styles.doneStat}>
              <Text style={styles.doneStatValue}>{actualDist.toFixed(1)} km</Text>
              <Text style={styles.doneStatLabel}>Distancia</Text>
            </View>
          </View>

          {/* Distance adjuster */}
          <View style={styles.distAdjust}>
            <Text style={styles.distAdjustLabel}>Ajusta la distancia real</Text>
            <View style={styles.distStepper}>
              <TouchableOpacity
                style={styles.distStepBtn}
                onPress={() => setActualDist((d) => Math.max(0, Math.round((d - 0.1) * 10) / 10))}
                hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
              >
                <Ionicons name="remove" size={22} color={colors.text} />
              </TouchableOpacity>
              <Text style={styles.distStepVal}>{actualDist.toFixed(1)} km</Text>
              <TouchableOpacity
                style={styles.distStepBtn}
                onPress={() => setActualDist((d) => Math.round((d + 0.1) * 10) / 10)}
                hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
              >
                <Ionicons name="add" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Feeling selector */}
          <View style={styles.feelingSection}>
            <Text style={styles.feelingQuestion}>¿Cómo te has sentido?</Text>
            <View style={styles.feelingRow}>
              {FEELINGS.map(({ key, emoji, label }) => (
                <TouchableOpacity
                  key={key}
                  style={[styles.feelingBtn, feeling === key && styles.feelingBtnActive]}
                  onPress={() => setFeeling(key)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.feelingEmoji}>{emoji}</Text>
                  <Text style={[styles.feelingLabel, feeling === key && styles.feelingLabelActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, !feeling && styles.primaryBtnMuted]}
            onPress={handleSaveRun}
            activeOpacity={feeling ? 0.8 : 0.5}
          >
            <Ionicons name="save-outline" size={20} color="#fff" />
            <Text style={styles.primaryBtnText}>Guardar entrenamiento</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={handleMarkDone}>
            <Ionicons name="checkmark-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.secondaryBtnText}>Solo marcar completada</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Active timer ──────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: status !== 'idle' ? config.bg : colors.background }]} edges={['top', 'bottom']}>
      <View style={[styles.header, status !== 'idle' && styles.headerLight]}>
        <TouchableOpacity onPress={handleExit} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <Ionicons name="close" size={24} color={status !== 'idle' ? '#fff' : colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerDay, status !== 'idle' && { color: 'rgba(255,255,255,0.9)' }]}>
            {session.day}
          </Text>
          <Text style={[styles.headerType, status !== 'idle' && { color: 'rgba(255,255,255,0.7)' }]} numberOfLines={1}>
            {session.type}
          </Text>
        </View>
        <View style={styles.headerDist}>
          <Text style={[styles.headerDistText, status !== 'idle' && { color: 'rgba(255,255,255,0.9)' }]}>
            {session.distance} km
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {status === 'idle' && hasParsed && groupedPhases && (
          <View style={styles.planView}>
            <Text style={styles.planViewLabel}>PLAN DE HOY</Text>
            {groupedPhases.map((group) => (
              <View key={group.key} style={styles.planRow}>
                <View style={[styles.planRowBar, {
                  backgroundColor: group.type === 'interval' ? group.runCfg.bg : group.cfg.bg,
                }]} />
                <View style={styles.planRowBody}>
                  {group.type === 'interval' ? (
                    <View style={styles.planRowLeft}>
                      <Ionicons name={group.runCfg.icon} size={15} color={group.runCfg.bg} />
                      <Text style={styles.planRowName}>{group.runCfg.label}</Text>
                      <Text style={styles.planRowSlash}>/</Text>
                      <Ionicons name={group.walkCfg.icon} size={15} color={group.walkCfg.bg} />
                      <Text style={styles.planRowName}>{group.walkCfg.label}</Text>
                    </View>
                  ) : (
                    <View style={styles.planRowLeft}>
                      <Ionicons name={group.cfg.icon} size={15} color={group.cfg.bg} />
                      <Text style={styles.planRowName}>{group.cfg.label}</Text>
                    </View>
                  )}
                  <Text style={styles.planRowDur}>
                    {group.type === 'interval'
                      ? `${Math.round(group.runDuration / 60)}'/${Math.round(group.walkDuration / 60)}' ×${group.reps}`
                      : `${Math.round((group.duration || 0) / 60)} min`}
                  </Text>
                </View>
              </View>
            ))}
            <View style={styles.planViewTotal}>
              <Text style={styles.planViewTotalLabel}>Duración estimada</Text>
              <Text style={styles.planViewTotalValue}>~{totalEstMins} min</Text>
            </View>
          </View>
        )}

        {status !== 'idle' && showDots && hasParsed && (
          <View style={styles.dotsRow}>
            {intervals.map((iv, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor: i < phaseIdx ? 'rgba(255,255,255,0.9)'
                      : i === phaseIdx ? '#fff'
                      : 'rgba(255,255,255,0.3)',
                    width: i === phaseIdx ? 12 : 8,
                    height: i === phaseIdx ? 12 : 8,
                  },
                ]}
              />
            ))}
          </View>
        )}

        {status !== 'idle' && hasParsed && (
          <Text style={[styles.phaseCounter, status !== 'idle' && { color: 'rgba(255,255,255,0.85)' }]}>
            {currentPhase?.isLap
              ? `Repetición ${lapsCompleted + 1} de ${currentPhase.totalReps}`
              : currentPhase?.totalReps
              ? `${config.label} — Intervalo ${currentPhase.rep} de ${currentPhase.totalReps}`
              : `Fase ${phaseIdx + 1} de ${intervals.length}`
            }
          </Text>
        )}

        {status !== 'idle' && (
          <View style={styles.timerBlock}>
            <View style={[styles.phaseCard, status !== 'idle' && { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              {hasParsed && (
                <>
                  <Ionicons name={config.icon} size={36} color={status !== 'idle' ? '#fff' : config.bg} />
                  <Text style={[styles.phaseLabel, status !== 'idle' && { color: '#fff' }, status === 'idle' && { color: config.bg }]}>
                    {config.label}
                  </Text>
                </>
              )}

              <Text style={[styles.timerBig, status !== 'idle' && { color: '#fff' }]}>
                {phaseRemaining !== null ? formatCountdown(phaseRemaining) : formatDuration(totalElapsed)}
              </Text>

              {phaseDuration && (
                <Text style={[styles.timerSub, status !== 'idle' && { color: 'rgba(255,255,255,0.7)' }]}>
                  de {formatCountdown(phaseDuration)}
                </Text>
              )}

              {phaseDuration && (
                <View style={styles.phaseTrack}>
                  <View style={[
                    styles.phaseFill,
                    {
                      width: `${Math.min(((phaseDuration - (phaseRemaining || 0)) / phaseDuration) * 100, 100)}%`,
                      backgroundColor: status !== 'idle' ? '#fff' : config.bg,
                    }
                  ]} />
                </View>
              )}

              {session.targetPace && currentPhase?.type === 'run' && status !== 'idle' && (
                <View style={styles.targetPaceRow}>
                  <Ionicons name="speedometer-outline" size={14} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.targetPaceText}>Objetivo: {session.targetPace} /km</Text>
                </View>
              )}

              {paceTip && (
                <View style={styles.paceTipRow}>
                  <Text style={styles.paceTipText}>💬 {paceTip}</Text>
                </View>
              )}
            </View>

            {status !== 'idle' && (
              <Text style={styles.totalTimer}>Total: {formatDuration(totalElapsed)}</Text>
            )}
          </View>
        )}

        {nextPhase && status !== 'idle' && (
          <View style={styles.nextBlock}>
            <Text style={styles.nextLabel}>A continuación</Text>
            <View style={[styles.nextCard, { borderLeftColor: nextConfig.bg }]}>
              <Ionicons name={nextConfig.icon} size={18} color={nextConfig.bg} />
              <Text style={styles.nextText}>{nextConfig.label}</Text>
              {nextPhase.duration && (
                <Text style={styles.nextDuration}>{nextPhase.duration / 60} min</Text>
              )}
            </View>
          </View>
        )}

        {!hasParsed && (
          <View style={styles.descBox}>
            <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.descText}>{session.description}</Text>
          </View>
        )}

        <View style={styles.controls}>
          {status === 'idle' && (
            <TouchableOpacity style={[styles.bigPlayBtn, { backgroundColor: hasParsed ? config.bg : colors.primary }]} onPress={beginCountdown}>
              <Ionicons name="play" size={36} color="#fff" />
              <Text style={styles.bigPlayText}>Iniciar</Text>
            </TouchableOpacity>
          )}

          {status === 'running' && (
            <View style={styles.controlRow}>
              {currentPhase?.isLap ? (
                <TouchableOpacity style={[styles.mainBtn, { backgroundColor: '#fff' }]} onPress={completeLap}>
                  <Ionicons name="flag" size={28} color={config.bg} />
                  <Text style={[styles.mainBtnText, { color: config.bg }]}>Lap completado</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={[styles.mainBtn, { backgroundColor: 'rgba(255,255,255,0.25)' }]} onPress={pause}>
                  <Ionicons name="pause" size={28} color="#fff" />
                  <Text style={[styles.mainBtnText, { color: '#fff' }]}>Pausar</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {status === 'paused' && (
            <View style={styles.controlRow}>
              <TouchableOpacity style={[styles.mainBtn, { backgroundColor: colors.primary }]} onPress={resume}>
                <Ionicons name="play" size={28} color="#fff" />
                <Text style={[styles.mainBtnText, { color: '#fff' }]}>Continuar</Text>
              </TouchableOpacity>
            </View>
          )}

          {(status === 'running' || status === 'paused') && hasParsed && phaseIdx + 1 < intervals.length && (
            <TouchableOpacity style={styles.skipBtn} onPress={skipPhase}>
              <Text style={[styles.skipText, { color: 'rgba(255,255,255,0.8)' }]}>Saltar fase →</Text>
            </TouchableOpacity>
          )}

          {(status === 'running' || status === 'paused') && (
            <TouchableOpacity style={styles.finishBtn} onPress={() => setStatus('done')}>
              <Text style={[styles.finishText, { color: 'rgba(255,255,255,0.7)' }]}>Terminar sesión</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {countdown !== null && (
        <View style={[styles.countdownOverlay, { backgroundColor: config.bg }]}>
          <Text style={styles.countdownNum}>{countdown > 0 ? countdown : '¡Ya!'}</Text>
          <Text style={styles.countdownLabel}>
            {countdown > 0 ? 'Prepárate...' : config.label}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLight: { borderBottomColor: 'rgba(255,255,255,0.2)' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerDay: { ...typography.body, fontWeight: '700' },
  headerType: { ...typography.bodySmall },
  headerDist: { minWidth: 48, alignItems: 'flex-end' },
  headerDistText: { ...typography.body, fontWeight: '700', color: colors.primary },
  content: { padding: spacing.md, paddingBottom: spacing.xxl, alignItems: 'center' },

  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    marginBottom: spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  dot: { borderRadius: 99 },
  phaseCounter: { ...typography.label, marginBottom: spacing.lg, color: colors.textSecondary },

  timerBlock: { alignItems: 'center', width: '100%', marginBottom: spacing.lg },
  phaseCard: {
    width: SCREEN_W - spacing.md * 2,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  phaseLabel: { fontSize: 26, fontWeight: '800', letterSpacing: 3, color: colors.text },
  timerBig: {
    fontSize: 92,
    fontWeight: '200',
    color: colors.text,
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
  },
  timerSub: { ...typography.bodySmall, color: colors.textSecondary, marginTop: -spacing.sm },
  phaseTrack: {
    width: '80%',
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  phaseFill: { height: '100%', borderRadius: 2 },
  targetPaceRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.xs },
  targetPaceText: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.85)' },
  paceTipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    width: '100%',
    justifyContent: 'center',
  },
  paceTipText: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '500', textAlign: 'center' },
  totalTimer: { marginTop: spacing.md, fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.8)' },

  nextBlock: { width: '100%', marginBottom: spacing.lg },
  nextLabel: { ...typography.label, marginBottom: spacing.xs, color: 'rgba(255,255,255,0.7)' },
  nextCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.md,
    padding: spacing.sm,
    borderLeftWidth: 3,
  },
  nextText: { flex: 1, fontWeight: '600', color: '#fff', fontSize: 14 },
  nextDuration: { fontWeight: '700', color: 'rgba(255,255,255,0.8)', fontSize: 13 },

  descBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    width: '100%',
    marginBottom: spacing.lg,
  },
  descText: { ...typography.body, flex: 1, color: colors.textSecondary, lineHeight: 22 },

  controls: { alignItems: 'center', gap: spacing.md, width: '100%' },
  controlRow: { width: '100%', alignItems: 'center' },
  bigPlayBtn: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  bigPlayText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  mainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.full,
    minWidth: 180,
  },
  mainBtnText: { fontSize: 16, fontWeight: '700' },
  skipBtn: { paddingVertical: spacing.xs },
  skipText: { ...typography.body, fontWeight: '600' },
  finishBtn: { paddingVertical: spacing.xs },
  finishText: { ...typography.bodySmall },

  // Done / celebration screens
  doneScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  closeBtn: { position: 'absolute', top: spacing.md, right: spacing.md },
  doneEmoji: { fontSize: 72 },
  doneTitle: { ...typography.h2, textAlign: 'center' },
  doneSub: { ...typography.bodySmall, textAlign: 'center', marginTop: -spacing.xs },
  doneSummary: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  doneStat: { flex: 1, alignItems: 'center' },
  doneStatValue: { fontSize: 24, fontWeight: '700', color: colors.text },
  doneStatLabel: { ...typography.label, marginTop: 2 },
  doneStatDiv: { width: 1, height: 40, backgroundColor: colors.border },

  feelingSection: { width: '100%', alignItems: 'center', gap: spacing.sm },
  feelingQuestion: { fontSize: 15, fontWeight: '600', color: colors.text },
  feelingRow: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center' },
  feelingBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 4,
  },
  feelingBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceElevated,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  feelingEmoji: { fontSize: 28 },
  feelingLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  feelingLabelActive: { color: colors.primary },

  primaryBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.full,
    width: '100%',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnMuted: { opacity: 0.55 },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.primary,
    width: '100%',
    justifyContent: 'center',
  },
  secondaryBtnText: { color: colors.primary, fontWeight: '700', fontSize: 15 },

  distAdjust: { width: '100%', alignItems: 'center', gap: spacing.sm },
  distAdjustLabel: { ...typography.label },
  distStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
    overflow: 'hidden',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  distStepBtn: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  distStepVal: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },

  countdownOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  countdownNum: {
    fontSize: 128,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 140,
  },
  countdownLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: spacing.sm,
  },

  planView: {
    width: '100%',
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  planViewLabel: {
    ...typography.label,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  planRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    minHeight: 52,
  },
  planRowBar: { width: 4 },
  planRowBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  planRowLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flex: 1 },
  planRowName: { fontSize: 13, fontWeight: '600', color: colors.text },
  planRowSlash: { fontSize: 13, color: colors.textSecondary, marginHorizontal: 2 },
  planRowDur: { fontSize: 13, fontWeight: '700', color: colors.text },
  planViewTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  planViewTotalLabel: { ...typography.label },
  planViewTotalValue: { fontSize: 15, fontWeight: '800', color: colors.primary },
});

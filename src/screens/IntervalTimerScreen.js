import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import IdlePlanView from '../components/timer/IdlePlanView';
import NextPhaseBlock from '../components/timer/NextPhaseBlock';
import PhaseDotsRow from '../components/timer/PhaseDotsRow';
import TimerControls from '../components/timer/TimerControls';
import TimerPhaseCard from '../components/timer/TimerPhaseCard';
import { useTimerStyles } from '../components/timer/useTimerStyles';
import { useIntervalTimer } from '../hooks/useIntervalTimer';
import { useLanguage } from '../i18n';
import { TRAINING_PLANS } from '../data/trainingPlans';
import { confirm } from '../utils/confirm';
import { parseIntervals } from '../utils/parseIntervals';
import { getPaceTip } from '../utils/paceTips';
import SessionDoneScreen from './timer/SessionDoneScreen';
import WeekCompleteScreen from './timer/WeekCompleteScreen';
import PlanCompleteScreen from './timer/PlanCompleteScreen';

export default function IntervalTimerScreen({ route, navigation }) {
  const { styles, colors } = useTimerStyles();
  const { t } = useLanguage();

  const { session, planId, week, sessionIdx, daysPerWeek } = route.params;
  const plan = TRAINING_PLANS.find((p) => p.id === planId);
  const intervals = parseIntervals(session.description);

  const {
    status, phaseIdx, totalElapsed, lapsCompleted,
    feeling, setFeeling, weekComplete, planComplete,
    shouldNavigateBack, countdown, actualDist, setActualDist,
    currentPhase, phaseDuration, phaseRemaining,
    hasParsed, config, nextPhase, nextConfig, showDots, groupedPhases, totalEstMins,
    beginCountdown, pause, resume, skipPhase, completeLap,
    finishEarly, handleMarkDone, handleSaveRun,
  } = useIntervalTimer(intervals || [], {
    planId, sessionIdx, plan, week, daysPerWeek, session,
  });

  // Animate root background color: idle → phase color (JS thread, single-shot transition)
  const bgAnim = useRef(new Animated.Value(0)).current;
  const isActive = status !== 'idle';
  const prevIsActiveRef = useRef(false);
  useEffect(() => {
    if (isActive === prevIsActiveRef.current) return;
    prevIsActiveRef.current = isActive;
    Animated.timing(bgAnim, {
      toValue: isActive ? 1 : 0,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [isActive]);

  const animatedBgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.background, config.bg],
  });

  // Terminal screens (done / weekComplete / planComplete) fade in as overlay
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const overlayVisible = status === 'done' || weekComplete || planComplete;
  const overlayShownRef = useRef(false);
  useEffect(() => {
    if (!overlayVisible || overlayShownRef.current) return;
    overlayShownRef.current = true;
    overlayOpacity.setValue(0);
    Animated.timing(overlayOpacity, {
      toValue: 1,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [overlayVisible]);

  useEffect(() => {
    if (shouldNavigateBack) navigation.goBack();
  }, [shouldNavigateBack]);

  const handleExit = () => {
    const leave = () => navigation.goBack();
    if (status === 'idle' || status === 'done') { leave(); return; }
    confirm(
      t('timer.exitAlert.title'),
      t('timer.exitAlert.message'),
      leave,
      { cancelText: t('timer.exitAlert.stay'), confirmText: t('timer.exitAlert.leave'), destructive: true },
    );
  };

  const paceTip = status === 'running' && currentPhase ? getPaceTip(currentPhase.type, week, t) : null;

  return (
    <Animated.View style={[localStyles.root, { backgroundColor: animatedBgColor }]}>
      <SafeAreaView style={localStyles.safe} edges={['top', 'bottom']}>
        <View style={[styles.header, isActive && styles.headerLight]}>
          <TouchableOpacity onPress={handleExit} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <Ionicons name="close" size={24} color={isActive ? '#fff' : colors.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.headerDay, isActive && { color: 'rgba(255,255,255,0.9)' }]}>
              {t('days.' + session.day + '.full') || session.day}
            </Text>
            <Text style={[styles.headerType, isActive && { color: 'rgba(255,255,255,0.7)' }]} numberOfLines={1}>
              {t('plans.sessionType.' + session.type)}
            </Text>
          </View>
          <View style={styles.headerDist}>
            <Text style={[styles.headerDistText, isActive && { color: 'rgba(255,255,255,0.9)' }]}>
              {session.distance} km
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {status === 'idle' && hasParsed && groupedPhases && (
            <IdlePlanView groupedPhases={groupedPhases} totalEstMins={totalEstMins} />
          )}

          {status !== 'idle' && showDots && hasParsed && (
            <PhaseDotsRow intervals={intervals} phaseIdx={phaseIdx} />
          )}

          {status !== 'idle' && hasParsed && (
            <Text style={[styles.phaseCounter, { color: 'rgba(255,255,255,0.85)' }]}>
              {currentPhase?.isLap
                ? t('timer.lap', { n: lapsCompleted + 1, total: currentPhase.totalReps })
                : currentPhase?.totalReps
                ? t('timer.interval', { phase: t('phases.' + currentPhase.type), n: currentPhase.rep, total: currentPhase.totalReps })
                : t('timer.phase', { n: phaseIdx + 1, total: intervals.length })
              }
            </Text>
          )}

          {status !== 'idle' && (
            <TimerPhaseCard
              status={status}
              config={config}
              hasParsed={hasParsed}
              currentPhase={currentPhase}
              phaseRemaining={phaseRemaining}
              phaseDuration={phaseDuration}
              totalElapsed={totalElapsed}
              session={session}
              paceTip={paceTip}
            />
          )}

          {nextPhase && status !== 'idle' && (
            <NextPhaseBlock nextPhase={nextPhase} nextConfig={nextConfig} />
          )}

          {!hasParsed && (
            <View style={styles.descBox}>
              <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.descText}>{session.description}</Text>
            </View>
          )}

          <TimerControls
            status={status}
            config={config}
            hasParsed={hasParsed}
            intervals={intervals}
            phaseIdx={phaseIdx}
            currentPhase={currentPhase}
            beginCountdown={beginCountdown}
            pause={pause}
            resume={resume}
            skipPhase={skipPhase}
            completeLap={completeLap}
            finishEarly={finishEarly}
          />
        </ScrollView>

        {countdown !== null && (
          <View style={[styles.countdownOverlay, { backgroundColor: config.bg }]}>
            <Text style={styles.countdownNum}>{countdown > 0 ? countdown : t('timer.prepareGo')}</Text>
            <Text style={styles.countdownLabel}>
              {countdown > 0 ? t('timer.prepare') : t('phases.' + currentPhase?.type)}
            </Text>
          </View>
        )}
      </SafeAreaView>

      {/* Terminal screens fade in as overlay — no tree unmount/remount */}
      {overlayVisible && (
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: overlayOpacity }]}>
          {planComplete && (
            <PlanCompleteScreen totalElapsed={totalElapsed} session={session} navigation={navigation} />
          )}
          {!planComplete && weekComplete && (
            <WeekCompleteScreen
              totalElapsed={totalElapsed}
              session={session}
              week={week}
              onContinue={() => navigation.goBack()}
            />
          )}
          {!planComplete && !weekComplete && status === 'done' && (
            <SessionDoneScreen
              totalElapsed={totalElapsed}
              session={session}
              actualDist={actualDist}
              setActualDist={setActualDist}
              feeling={feeling}
              setFeeling={setFeeling}
              handleSaveRun={handleSaveRun}
              handleMarkDone={handleMarkDone}
              onClose={handleExit}
            />
          )}
        </Animated.View>
      )}
    </Animated.View>
  );
}

const localStyles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1, backgroundColor: 'transparent' },
});

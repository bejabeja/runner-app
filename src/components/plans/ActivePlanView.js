import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../i18n';
import { isSessionDone } from '../../storage/progress';
import { spacing } from '../../theme';
import { flattenSessions } from '../../utils/virtualSchedule';
import { usePlanStyles } from './usePlanStyles';
import WeekAccordion from './WeekAccordion';

export default function ActivePlanView({ plan, progress, expandedWeek, setExpandedWeek, celebration, setCelebration, currentWeek, onDeactivate, onToggleSession, navigation }) {
  const { styles, colors } = usePlanStyles();
  const { t } = useLanguage();

  const flatSessions = flattenSessions(plan);
  const totalSessionsDone = flatSessions.filter(s => isSessionDone(progress, plan.id, s.globalIdx)).length;
  const totalSessions = flatSessions.length;
  const progressPct = totalSessions > 0 ? totalSessionsDone / totalSessions : 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.summary}>
          <View style={styles.summaryTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryLabel}>{plan.goal}</Text>
              <Text style={styles.summaryName}>{plan.name}</Text>
            </View>
            <TouchableOpacity onPress={onDeactivate} style={styles.abandonBtn}>
              <Text style={styles.abandonText}>{t('plans.abandon')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{t('plans.statWeek', { n: currentWeek })}</Text>
              <Text style={styles.statLabel}>{t('plans.statOf', { n: plan.weeks })}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{totalSessionsDone}/{totalSessions}</Text>
              <Text style={styles.statLabel}>{t('plans.sessions')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{Math.round(progressPct * 100)}%</Text>
              <Text style={styles.statLabel}>{t('plans.completed')}</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPct * 100}%`, backgroundColor: plan.color }]} />
          </View>
        </View>

        {plan.schedule.map((week, weekIndex) => {
          const weekOffset = plan.schedule.slice(0, weekIndex).reduce((sum, w) => sum + w.sessions.length, 0);
          return (
            <WeekAccordion
              key={`w${week.week}`}
              week={week}
              weekOffset={weekOffset}
              plan={plan}
              progress={progress}
              expandedWeek={expandedWeek}
              setExpandedWeek={setExpandedWeek}
              currentWeek={currentWeek}
              onToggleSession={onToggleSession}
              navigation={navigation}
            />
          );
        })}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      {celebration && (
        <View style={styles.celebrationOverlay}>
          <View style={styles.celebrationCard}>
            <Text style={styles.celebrationEmoji}>🏆</Text>
            <Text style={styles.celebrationTitle}>{t('plans.celebration.title', { n: celebration })}</Text>
            <Text style={styles.celebrationSub}>
              {celebration < plan.weeks
                ? t('plans.celebration.nextSub', { n: celebration + 1 })
                : t('plans.celebration.doneSub')}
            </Text>
            <TouchableOpacity style={styles.celebrationBtn} onPress={() => setCelebration(null)}>
              <Text style={styles.celebrationBtnText}>
                {celebration < plan.weeks ? t('plans.celebration.nextBtn') : t('plans.celebration.doneBtn')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

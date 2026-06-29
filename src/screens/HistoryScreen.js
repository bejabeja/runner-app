import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import PaceChart from '../components/history/PaceChart';
import WeekProgressGrid from '../components/history/WeekProgressGrid';
import { useHistoryStyles } from '../components/history/useHistoryStyles';
import { usePlanWithProgress } from '../hooks/usePlanWithProgress';
import { useRuns } from '../hooks/useRuns';
import { useLanguage } from '../i18n';
import { spacing } from '../theme';
import { FEELING_EMOJI } from '../utils/constants';
import { formatDuration, formatRelativeDate } from '../utils/format';
import { getStreak } from '../utils/streak';

export default function HistoryScreen() {
  const navigation = useNavigation();
  const { styles, colors } = useHistoryStyles();
  const { t, lang } = useLanguage();
  const locale = lang === 'en' ? 'en-US' : 'es-ES';
  const formatDate = (iso) => formatRelativeDate(iso, { t, locale, todayKey: 'history.today', yesterdayKey: 'history.yesterday' });

  const { activePlanData: activePlan, plan: planObj, progress } = usePlanWithProgress();
  const { runs } = useRuns();

  const totalKm = runs.reduce((s, r) => s + (r.distance || 0), 0);
  const totalSecs = runs.reduce((s, r) => s + (r.duration || 0), 0);
  const streak = getStreak(runs);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('history.title')}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddRun')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="add-circle-outline" size={26} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statVal} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>{runs.length}</Text>
            <Text style={styles.statLbl}>{t('history.sessions')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statVal} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>{totalKm.toFixed(1)}</Text>
            <Text style={styles.statLbl}>{t('history.kmTotal')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statVal} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>{formatDuration(totalSecs)}</Text>
            <Text style={styles.statLbl}>{t('history.totalTime')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statVal} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>{streak > 0 ? `🔥${streak}` : streak}</Text>
            <Text style={styles.statLbl}>{t('history.streak')}</Text>
          </View>
        </View>

        <PaceChart runs={runs} />

        <WeekProgressGrid planObj={planObj} activePlan={activePlan} progress={progress} />

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('history.workouts')}</Text>
          {runs.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="fitness-outline" size={40} color={colors.textSecondary} />
              <Text style={styles.emptyText}>{t('history.empty')}</Text>
              <Text style={styles.emptySubtext}>{t('history.emptySub')}</Text>
            </View>
          ) : (
            runs.map((run) => (
              <View key={run.id} style={styles.runRow}>
                <View style={styles.runLeft}>
                  <Text style={styles.runDate}>{formatDate(run.date)}</Text>
                  <Text style={styles.runMeta} numberOfLines={1}>
                    {formatDuration(run.duration || 0)} · {(run.distance || 0).toFixed(1)} km
                    {run.pace ? `  ·  ${Math.floor(run.pace / 60)}'${String(run.pace % 60).padStart(2, '0')}"` + '/km' : ''}
                  </Text>
                  {run.notes ? <Text style={styles.runNotes}>{run.notes}</Text> : null}
                </View>
                {run.feeling ? (
                  <Text style={styles.runFeeling}>{FEELING_EMOJI[run.feeling] || ''}</Text>
                ) : null}
              </View>
            ))
          )}
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

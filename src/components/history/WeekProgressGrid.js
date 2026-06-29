import { Text, View } from 'react-native';
import { useLanguage } from '../../i18n';
import { isSessionDone } from '../../storage/progress';
import { getCurrentVirtualWeek, getVirtualSchedule } from '../../utils/virtualSchedule';
import { useHistoryStyles } from './useHistoryStyles';

export default function WeekProgressGrid({ planObj, activePlan, progress }) {
  const { styles, colors } = useHistoryStyles();
  const { t } = useLanguage();

  if (!planObj) return null;

  const dpw = activePlan?.daysPerWeek || planObj.defaultDaysPerWeek || 3;
  const vSchedule = getVirtualSchedule(planObj, dpw);
  const currentWeekNum = activePlan ? getCurrentVirtualWeek(activePlan, planObj) : 0;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{t('history.weeksLbl')}</Text>
      <View style={styles.weekGrid}>
        {vSchedule.map((w) => {
          const done = w.sessions.filter(s => isSessionDone(progress, planObj.id, s.globalIdx)).length;
          const total = w.sessions.length;
          const allDone = done === total;
          const isCurrent = w.week === currentWeekNum;
          const isPast = w.week < currentWeekNum;
          return (
            <View
              key={w.week}
              style={[styles.weekCell, allDone && styles.weekCellDone, isCurrent && styles.weekCellCurrent]}
            >
              <Text style={[
                styles.weekCellNum,
                allDone && styles.weekCellNumDone,
                isCurrent && styles.weekCellNumCurrent,
              ]}>
                {allDone ? '✓' : t('history.weekAbbr', { n: w.week })}
              </Text>
              {(isCurrent || isPast) && (
                <Text style={[styles.weekCellPct, allDone && { color: colors.success }]}>
                  {done}/{total}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

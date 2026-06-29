import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../i18n';
import { isSessionDone } from '../../storage/progress';
import { usePlanStyles } from './usePlanStyles';
import SessionRow from './SessionRow';

export default function WeekAccordion({ week, weekOffset, plan, progress, expandedWeek, setExpandedWeek, currentWeek, onToggleSession, navigation }) {
  const { styles, colors } = usePlanStyles();
  const { t } = useLanguage();

  const weekKey = `w${week.week}`;
  const isExpanded = expandedWeek === weekKey;
  const isCurrent = week.week === currentWeek;
  const done = week.sessions.filter((_, i) => isSessionDone(progress, plan.id, weekOffset + i)).length;
  const total = week.sessions.length;
  const allDone = done === total;

  const openTimer = (session, globalIdx) => navigation.navigate('IntervalTimer', {
    session,
    planId: plan.id,
    week: week.week,
    sessionIdx: globalIdx,
    daysPerWeek: plan.defaultDaysPerWeek,
  });

  return (
    <View>
      <TouchableOpacity
        style={[styles.weekHeader, isCurrent && { borderLeftColor: plan.color, backgroundColor: colors.surfaceElevated }]}
        onPress={() => setExpandedWeek(isExpanded ? null : weekKey)}
        activeOpacity={0.6}
      >
        <View style={styles.weekHeaderLeft}>
          {allDone
            ? <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            : <Text style={[styles.weekLabel, isCurrent && { color: plan.color }]}>
              {t('plans.weekLabel', { n: week.week })}
            </Text>
          }
          <Text style={[
            styles.weekFocus,
            allDone && { color: colors.success },
            isCurrent && !allDone && { color: plan.color },
          ]}>
            {allDone ? t('plans.weekDone') : t('plans.weekFocus.' + week.focus)}
          </Text>
        </View>
        <View style={styles.weekHeaderRight}>
          <Text style={[styles.weekCount, allDone && { color: colors.success }]}>{done}/{total}</Text>
          <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textSecondary} />
        </View>
      </TouchableOpacity>

      {isExpanded && week.sessions.map((session, idx) => {
        const globalIdx = weekOffset + idx;
        return (
          <SessionRow
            key={idx}
            session={session}
            globalIdx={globalIdx}
            plan={plan}
            progress={progress}
            onToggle={(gIdx) => onToggleSession(plan.id, gIdx, week.week)}
            onStart={openTimer}
          />
        );
      })}

      <View style={styles.sectionDivider} />
    </View>
  );
}

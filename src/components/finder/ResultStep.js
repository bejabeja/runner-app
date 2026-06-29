import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../i18n';
import { isSameDay, getNextMonday } from '../../utils/dateHelpers';
import { getTotalVirtualWeeks } from '../../utils/virtualSchedule';
import { useFinderStyles } from './useFinderStyles';

const todayNoon = () => { const d = new Date(); d.setHours(12, 0, 0, 0); return d; };

function formatDate(date, lang) {
  const locale = lang === 'en' ? 'en-US' : 'es-ES';
  return date.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'short' });
}

export default function ResultStep({ resultPlan, result, daysPerWeek, diffColor, startDate, onChangeDate, onStart, onSeeAll }) {
  const { styles, colors } = useFinderStyles();
  const { t, lang } = useLanguage();
  const dpw = daysPerWeek || resultPlan.defaultDaysPerWeek;

  const todayDate = todayNoon();
  const nextMonday = getNextMonday();
  const isToday = isSameDay(startDate, todayDate);
  const isNextMonday = isSameDay(startDate, nextMonday);
  const isNextMondayToday = isSameDay(nextMonday, todayDate);

  const stepBack = () => {
    const d = new Date(startDate);
    d.setDate(d.getDate() - 1);
    if (d >= todayDate) onChangeDate(d);
  };

  const stepForward = () => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + 1);
    onChangeDate(d);
  };

  return (
    <>
      <Text style={styles.question}>{t('finder.resultTitle')}</Text>

      {result.noteKey && (
        <View style={styles.noteCard}>
          <Ionicons name="information-circle-outline" size={18} color={colors.warning} />
          <Text style={styles.noteText}>{t(result.noteKey)}</Text>
        </View>
      )}

      <View style={[styles.planCard, { borderColor: resultPlan.color + '55' }]}>
        <View style={[styles.planColorBar, { backgroundColor: resultPlan.color }]} />
        <View style={styles.planBody}>
          <View style={styles.planTop}>
            <Text style={styles.planName}>{t('plans.name.' + resultPlan.id)}</Text>
            <View style={[styles.diffPill, { backgroundColor: diffColor + '20' }]}>
              <Text style={[styles.diffText, { color: diffColor }]}>{t('plans.browse.difficulty.' + resultPlan.difficulty)}</Text>
            </View>
          </View>
          <Text style={styles.planDesc}>{t('plans.planDesc.' + resultPlan.id)}</Text>
          <View style={styles.planMeta}>
            <View style={styles.planMetaItem}>
              <Ionicons name="calendar-outline" size={13} color={colors.textSecondary} />
              <Text style={styles.planMetaText}>{getTotalVirtualWeeks(resultPlan, dpw)} {t('finder.weeks')}</Text>
            </View>
            <Text style={styles.planMetaDot}>·</Text>
            <View style={styles.planMetaItem}>
              <Ionicons name="trophy-outline" size={13} color={colors.textSecondary} />
              <Text style={styles.planMetaText}>{resultPlan.goal}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.datePicker}>
        <Text style={styles.datePickerLabel}>{t('finder.startWhen')}</Text>
        <View style={styles.dateRow}>
          <TouchableOpacity
            style={styles.dateArrowBtn}
            onPress={stepBack}
            disabled={isToday}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="chevron-back" size={22} color={isToday ? colors.border : colors.text} />
          </TouchableOpacity>
          <Text style={styles.dateTxt}>{formatDate(startDate, lang)}</Text>
          <TouchableOpacity
            style={styles.dateArrowBtn}
            onPress={stepForward}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="chevron-forward" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.dateChipRow}>
          <TouchableOpacity
            style={[styles.dateChip, isToday && styles.dateChipActive]}
            onPress={() => onChangeDate(todayDate)}
            activeOpacity={0.7}
          >
            <Text style={[styles.dateChipTxt, isToday && styles.dateChipTxtActive]}>{t('finder.startToday')}</Text>
          </TouchableOpacity>
          {!isNextMondayToday && (
            <TouchableOpacity
              style={[styles.dateChip, isNextMonday && styles.dateChipActive]}
              onPress={() => onChangeDate(nextMonday)}
              activeOpacity={0.7}
            >
              <Text style={[styles.dateChipTxt, isNextMonday && styles.dateChipTxtActive]}>{t('finder.startNextMonday')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.startBtn, { backgroundColor: resultPlan.color }]}
        onPress={onStart}
        activeOpacity={0.88}
      >
        <Ionicons name="play" size={20} color="#fff" />
        <Text style={styles.startBtnText}>{t('finder.startBtn')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.allPlansBtn} onPress={onSeeAll}>
        <Text style={styles.allPlansBtnText}>{t('finder.seeAll')}</Text>
      </TouchableOpacity>
    </>
  );
}

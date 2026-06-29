import { useEffect, useMemo, useState } from 'react';
import { LayoutAnimation, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../i18n';
import { getMondayOf, parseDateString, weeksBetween, isSameDay, toDateString, WEEK_MS } from '../utils/dateHelpers';
import { DEFAULT_WEEKDAYS, getVirtualSchedule, JS_DAY_TO_NAME } from '../utils/virtualSchedule';
import { useCalendarStyles } from './calendar/useCalendarStyles';
import DayCell from './calendar/DayCell';
import WeekPickerModal from './calendar/WeekPickerModal';

const ISO_DAY_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function CalendarCard({ weekCalendar, activePlanData, planProgress, plan, planObj, weekNum, totalVirtualWeeks, selectedDate, onSelectDay }) {
  const { styles, colors } = useCalendarStyles();
  const { t, lang } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekPickerOpen, setWeekPickerOpen] = useState(false);

  const locale = lang === 'en' ? 'en-US' : 'es-ES';
  const planColor = planObj?.color || colors.primary;

  const planWeeks = useMemo(() => {
    if (!activePlanData || !totalVirtualWeeks) return [];
    const start = new Date(activePlanData.startDate);
    return Array.from({ length: totalVirtualWeeks }, (_, i) => {
      const s = new Date(start);
      s.setDate(start.getDate() + i * 7);
      const e = new Date(s);
      e.setDate(s.getDate() + 6);
      return { weekNum: i + 1, start: s, end: e };
    });
  }, [activePlanData, totalVirtualWeeks]);

  const selectPlanWeek = (planWeekNum) => {
    if (!activePlanData) return;
    const start = new Date(activePlanData.startDate);
    const target = new Date(start);
    target.setDate(start.getDate() + (planWeekNum - 1) * 7);
    const targetMonday = getMondayOf(target);
    const currentMonday = getMondayOf();
    setWeekOffset(weeksBetween(currentMonday, targetMonday));
    setWeekPickerOpen(false);
  };

  useEffect(() => {
    if (!selectedDate) return;
    const selMonday = getMondayOf(parseDateString(selectedDate));
    const currentMonday = getMondayOf();
    setWeekOffset(weeksBetween(currentMonday, selMonday));
  }, [selectedDate]);

  const displayMonday = useMemo(() => {
    const monday = getMondayOf();
    monday.setDate(monday.getDate() + weekOffset * 7);
    return monday;
  }, [weekOffset]);

  const monthShort = displayMonday.toLocaleDateString(locale, { month: 'short' }).replace('.', '');
  const monthLabel = monthShort.charAt(0).toUpperCase() + monthShort.slice(1) + ' ' + displayMonday.getFullYear();
  const dayLabels = ISO_DAY_NAMES.map(d => t('days.' + d + '.abbr').slice(0, 2));

  const monthGrid = useMemo(() => {
    if (!expanded) return [];
    const dpw = activePlanData?.daysPerWeek || plan?.defaultDaysPerWeek || 3;
    const weekdays = activePlanData?.weekdays || DEFAULT_WEEKDAYS[dpw] || DEFAULT_WEEKDAYS[3];
    const schedule = plan && activePlanData ? getVirtualSchedule(plan, dpw) : [];
    const startDate = activePlanData ? new Date(activePlanData.startDate) : null;

    const year = displayMonday.getFullYear();
    const month = displayMonday.getMonth();
    const todayNow = new Date();

    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7;
    const cursor = new Date(year, month, 1 - firstDayOfWeek, 12, 0, 0, 0);

    const lastDay = new Date(year, month + 1, 0);
    const lastDayOfWeek = (lastDay.getDay() + 6) % 7;
    const endDate = new Date(year, month + 1 - 1, lastDay.getDate() + (6 - lastDayOfWeek), 12, 0, 0, 0);

    const days = [];
    while (cursor <= endDate) {
      const isCurrentMonth = cursor.getMonth() === month;
      const isToday = isSameDay(cursor, todayNow);
      const dayJs = cursor.getDay();
      let isTraining = false, isDone = false, session = null, dayVWeek = null;
      if (startDate && schedule.length > 0) {
        const slotIdx = weekdays.indexOf(dayJs);
        if (slotIdx >= 0) {
          const weeksSince = Math.floor((cursor.getTime() - startDate.getTime()) / WEEK_MS);
          dayVWeek = weeksSince + 1;
          if (dayVWeek >= 1 && dayVWeek <= schedule.length) {
            const s = schedule[dayVWeek - 1]?.sessions[slotIdx];
            if (s) { isTraining = true; isDone = !!(planProgress?.[s.globalIdx]); session = s; }
          }
        }
      }
      days.push({
        dateNum: cursor.getDate(),
        isCurrentMonth, isToday, isTraining, isDone,
        date: toDateString(cursor),
        dayName: JS_DAY_TO_NAME[dayJs],
        session,
        vWeek: dayVWeek,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    return days;
  }, [expanded, activePlanData, planProgress, plan, displayMonday]);

  const displayWeekData = useMemo(() => {
    if (weekOffset === 0) return weekCalendar;
    const dpw = activePlanData?.daysPerWeek || plan?.defaultDaysPerWeek || 3;
    const weekdays = activePlanData?.weekdays || DEFAULT_WEEKDAYS[dpw] || DEFAULT_WEEKDAYS[3];
    const schedule = plan && activePlanData ? getVirtualSchedule(plan, dpw) : [];
    const startDate = activePlanData ? new Date(activePlanData.startDate) : null;
    const todayNow = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(displayMonday);
      d.setDate(displayMonday.getDate() + i);
      const dayJs = d.getDay();
      const date = toDateString(d);
      const isToday = isSameDay(d, todayNow);
      let isTraining = false, isDone = false, session = null, vWeek = null;
      if (startDate && schedule.length > 0) {
        const slotIdx = weekdays.indexOf(dayJs);
        if (slotIdx >= 0) {
          const weeksSince = Math.floor((d.getTime() - startDate.getTime()) / WEEK_MS);
          vWeek = weeksSince + 1;
          if (vWeek >= 1 && vWeek <= schedule.length) {
            const s = schedule[vWeek - 1]?.sessions[slotIdx];
            if (s) { isTraining = true; isDone = !!(planProgress?.[s.globalIdx]); session = s; }
          }
        }
      }
      return { dateNum: d.getDate(), date, dayName: JS_DAY_TO_NAME[dayJs], isTraining, isDone, isToday, session, vWeek };
    });
  }, [weekOffset, weekCalendar, activePlanData, plan, planProgress, displayMonday]);

  const displayVWeek = displayWeekData.find(d => d.isTraining)?.vWeek ?? weekNum;

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(e => !e);
  };

  const monthWeeks = expanded
    ? Array.from({ length: Math.ceil(monthGrid.length / 7) }, (_, w) => monthGrid.slice(w * 7, w * 7 + 7))
    : [];

  return (
    <View style={styles.card}>
      <View style={styles.calNavRow}>
        <TouchableOpacity style={styles.calMonthBtn} onPress={toggle} activeOpacity={0.7}>
          <Text style={styles.monthLabel}>{monthLabel}</Text>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={14} color={colors.textSecondary} />
        </TouchableOpacity>

        {weekOffset !== 0 && (
          <TouchableOpacity
            style={styles.todayChip}
            onPress={() => { setWeekOffset(0); onSelectDay && onSelectDay(null); }}
            activeOpacity={0.7}
          >
            <Text style={styles.todayChipText}>{t('home.today').toUpperCase()}</Text>
          </TouchableOpacity>
        )}

        {planWeeks.length > 0 && (
          <TouchableOpacity style={styles.weekDropBtn} onPress={() => setWeekPickerOpen(true)} activeOpacity={0.8}>
            <Text style={styles.weekDropText}>
              {displayVWeek ? t('home.weekShort', { n: displayVWeek }) : '—'}
            </Text>
            <Ionicons name="chevron-down" size={12} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.row}>
        {dayLabels.map((label, i) => (
          <View key={i} style={styles.cell}>
            <Text style={styles.dayLabel}>{label}</Text>
          </View>
        ))}
      </View>

      {!expanded && (
        <View style={styles.row}>
          {displayWeekData.map((day, dIdx) => (
            <DayCell
              key={dIdx}
              dateNum={day.dateNum}
              isTraining={day.isTraining}
              isDone={day.isDone}
              isToday={day.isToday}
              isSelected={day.date === selectedDate}
              planColor={planColor}
              onPress={() => onSelectDay({ ...day, vWeek: day.vWeek ?? weekNum })}
            />
          ))}
        </View>
      )}

      {expanded && monthWeeks.map((weekDays, wIdx) => {
        const isActiveWeek = weekDays.some(d => d.date === toDateString(displayMonday));
        return (
          <View key={wIdx} style={[styles.row, isActiveWeek && styles.activeWeekRow]}>
            {weekDays.map((day, dIdx) => (
              <DayCell
                key={dIdx}
                dateNum={day.dateNum}
                isTraining={day.isTraining}
                isDone={day.isDone}
                isToday={day.isToday}
                isSelected={day.date === selectedDate}
                faded={!day.isCurrentMonth}
                planColor={planColor}
                onPress={day.isCurrentMonth ? () => onSelectDay(day) : null}
              />
            ))}
          </View>
        );
      })}

      <WeekPickerModal
        visible={weekPickerOpen}
        planWeeks={planWeeks}
        displayVWeek={displayVWeek}
        totalVirtualWeeks={totalVirtualWeeks}
        planColor={planColor}
        locale={locale}
        onClose={() => setWeekPickerOpen(false)}
        onSelectWeek={selectPlanWeek}
      />
    </View>
  );
}

import { Ionicons } from '@expo/vector-icons';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../i18n';
import { useCalendarStyles } from './useCalendarStyles';

function formatWeekRange(start, end, locale) {
  const sm = start.toLocaleDateString(locale, { month: 'short' }).replace('.', '').toLowerCase();
  const em = end.toLocaleDateString(locale, { month: 'short' }).replace('.', '').toLowerCase();
  return sm === em
    ? `${start.getDate()}–${end.getDate()} ${sm}`
    : `${start.getDate()} ${sm} – ${end.getDate()} ${em}`;
}

export default function WeekPickerModal({ visible, planWeeks, displayVWeek, totalVirtualWeeks, planColor, locale, onClose, onSelectWeek }) {
  const { styles } = useCalendarStyles();
  const { t } = useLanguage();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.pickerOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.pickerSheet}>
          <View style={styles.pickerHandle} />
          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            {planWeeks.map((week) => {
              const isSelected = week.weekNum === displayVWeek;
              return (
                <TouchableOpacity
                  key={week.weekNum}
                  style={[styles.pickerItem, isSelected && styles.pickerItemActive]}
                  onPress={() => onSelectWeek(week.weekNum)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.pickerItemWeek, isSelected && { color: planColor }]}>
                    {t('home.weekPill', { n: week.weekNum, total: totalVirtualWeeks })}
                  </Text>
                  <Text style={styles.pickerItemRange}>
                    {formatWeekRange(week.start, week.end, locale)}
                  </Text>
                  {isSelected && <Ionicons name="checkmark" size={16} color={planColor} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

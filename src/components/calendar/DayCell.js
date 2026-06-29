import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { useCalendarStyles } from './useCalendarStyles';

export default function DayCell({ dateNum, isTraining, isDone, isToday, isSelected, faded, planColor, onPress }) {
  const { styles, colors } = useCalendarStyles();
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper style={styles.cell} onPress={onPress} activeOpacity={0.65}>
      <View style={[
        styles.circle,
        isTraining && !isDone && !isToday && { borderColor: planColor, borderWidth: 1.5 },
        isDone && { backgroundColor: colors.success },
        isToday && !isDone && { backgroundColor: planColor },
        isSelected && !isToday && !isDone && { backgroundColor: planColor + '22', borderColor: planColor, borderWidth: 1.5 },
        isSelected && isDone && { borderWidth: 2, borderColor: colors.success },
        isSelected && isToday && !isDone && { borderWidth: 2, borderColor: '#ffffff88' },
      ]}>
        {isDone
          ? <Ionicons name="checkmark" size={12} color="#fff" />
          : <Text style={[
              styles.dateNum,
              faded && { color: colors.textSecondary + '30' },
              isTraining && !isToday && !faded && { color: planColor, fontWeight: '700' },
              isToday && { color: '#fff', fontWeight: '800' },
            ]}>{dateNum}</Text>
        }
      </View>
      <View style={[
        styles.selDot,
        isSelected && { backgroundColor: isToday ? '#ffffff99' : (faded ? 'transparent' : planColor) },
      ]} />
    </Wrapper>
  );
}

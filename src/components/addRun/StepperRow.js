import { Text, TouchableOpacity, View } from 'react-native';
import { useAddRunStyles } from './useAddRunStyles';

export default function StepperRow({ value, onDecrement, onIncrement, style }) {
  const { styles } = useAddRunStyles();
  const hitSlop = { top: 8, bottom: 8, left: 8, right: 8 };
  return (
    <View style={[styles.row, style]}>
      <TouchableOpacity style={styles.stepBtn} onPress={onDecrement} hitSlop={hitSlop}>
        <Text style={styles.stepBtnText}>−</Text>
      </TouchableOpacity>
      <Text style={styles.stepValue}>{value}</Text>
      <TouchableOpacity style={styles.stepBtn} onPress={onIncrement} hitSlop={hitSlop}>
        <Text style={styles.stepBtnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

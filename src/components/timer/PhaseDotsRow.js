import { View } from 'react-native';
import { useTimerStyles } from './useTimerStyles';

export default function PhaseDotsRow({ intervals, phaseIdx }) {
  const { styles } = useTimerStyles();
  return (
    <View style={styles.dotsRow}>
      {intervals.map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor: i < phaseIdx ? 'rgba(255,255,255,0.9)'
                : i === phaseIdx ? '#fff'
                : 'rgba(255,255,255,0.3)',
              width: i === phaseIdx ? 12 : 8,
              height: i === phaseIdx ? 12 : 8,
            },
          ]}
        />
      ))}
    </View>
  );
}

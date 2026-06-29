import { View, Text, StyleSheet } from 'react-native';
import { spacing, radius, typography } from '../theme';
import { useTheme } from '../ThemeContext';

export function SessionStats({ stats }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return (
    <View style={styles.container}>
      {stats.map((s, i) => (
        <View key={s.label} style={styles.row}>
          {i > 0 && <View style={styles.divider} />}
          <View style={styles.stat}>
            <Text style={styles.value}>{s.value}</Text>
            <Text style={styles.label}>{s.label}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const makeStyles = (colors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  row: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  divider: { width: 1, height: 40, backgroundColor: colors.border },
  stat: { flex: 1, alignItems: 'center' },
  value: { fontSize: 24, fontWeight: '700', color: colors.text },
  label: { ...typography.label, marginTop: 2 },
});

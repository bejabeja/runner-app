import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSettingsStyles } from './useSettingsStyles';

export default function SettingRow({ icon, label, sublabel, onPress, destructive, right }) {
  const { styles, colors } = useSettingsStyles();
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.rowIcon, { backgroundColor: destructive ? colors.error + '1A' : colors.primary + '1A' }]}>
        <Ionicons name={icon} size={20} color={destructive ? colors.error : colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, { color: destructive ? colors.error : colors.text }]}>{label}</Text>
        {sublabel ? <Text style={styles.rowSublabel}>{sublabel}</Text> : null}
      </View>
      {right ?? <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />}
    </TouchableOpacity>
  );
}

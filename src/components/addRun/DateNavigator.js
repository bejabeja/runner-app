import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../i18n';
import { dateFromDaysAgo } from '../../utils/dateHelpers';
import { useAddRunStyles } from './useAddRunStyles';

function formatSelectedDate(daysAgo, t, lang) {
  if (daysAgo === 0) return t('history.today');
  if (daysAgo === 1) return t('history.yesterday');
  const d = dateFromDaysAgo(daysAgo);
  const locale = lang === 'en' ? 'en-US' : 'es-ES';
  return d.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'short' });
}

export default function DateNavigator({ daysAgo, onBack, onForward }) {
  const { styles, colors } = useAddRunStyles();
  const { t, lang } = useLanguage();
  const hitSlop = { top: 8, bottom: 8, left: 8, right: 8 };
  return (
    <View style={[styles.card, styles.row]}>
      <TouchableOpacity style={styles.arrowBtn} onPress={onBack} hitSlop={hitSlop}>
        <Ionicons name="chevron-back" size={22} color={colors.text} />
      </TouchableOpacity>
      <Text style={styles.dateText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
        {formatSelectedDate(daysAgo, t, lang)}
      </Text>
      <TouchableOpacity
        style={[styles.arrowBtn, daysAgo === 0 && styles.arrowDisabled]}
        onPress={onForward}
        disabled={daysAgo === 0}
        hitSlop={hitSlop}
      >
        <Ionicons name="chevron-forward" size={22} color={daysAgo === 0 ? colors.textSecondary : colors.text} />
      </TouchableOpacity>
    </View>
  );
}

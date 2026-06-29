import { Text, View } from 'react-native';
import { useLanguage } from '../../i18n';
import { useHomeStyles } from './useHomeStyles';

export default function DayRestCard({ dayAbbr }) {
  const { styles } = useHomeStyles();
  const { t } = useLanguage();
  return (
    <View style={styles.restCard}>
      <View style={styles.restHeader}>
        <Text style={styles.restLabel}>{t('home.restDay')} · {dayAbbr}</Text>
      </View>
      <Text style={styles.restTitle}>{t('home.rest.title')}</Text>
      <Text style={styles.restSub}>{t('home.rest.sub')}</Text>
    </View>
  );
}

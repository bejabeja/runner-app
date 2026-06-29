import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../i18n';
import { useHomeStyles } from './useHomeStyles';

export default function NoPlanCard({ onPress }) {
  const { styles } = useHomeStyles();
  const { t } = useLanguage();
  return (
    <TouchableOpacity style={styles.noPlanCard} onPress={onPress} activeOpacity={0.88}>
      <View style={styles.heroStripe} />
      <View style={styles.noPlanContent}>
        <Text style={styles.noPlanLabel}>{t('home.noplan.label')}</Text>
        <Text style={styles.noPlanTitle}>{t('home.noplan.title')}</Text>
        <Text style={styles.noPlanSub}>{t('home.noplan.sub')}</Text>
        <View style={styles.noPlanBtn}>
          <Text style={styles.noPlanBtnText}>{t('home.noplan.btn')}</Text>
          <Ionicons name="arrow-forward" size={15} color="#fff" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../i18n';
import { formatDuration } from '../../utils/format';
import { SessionStats } from '../../components/SessionStats';
import { AppButton } from '../../components/AppButton';
import { useDoneScreenStyles } from '../../components/timer/useDoneScreenStyles';

export default function PlanCompleteScreen({ totalElapsed, session, navigation }) {
  const { styles } = useDoneScreenStyles();
  const { t } = useLanguage();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.doneScreen}>
        <Text style={styles.doneEmoji}>🏅</Text>
        <Text style={styles.doneTitle}>{t('timer.planDone.title')}</Text>
        <Text style={styles.doneSub}>{t('timer.planDone.sub')}</Text>
        <SessionStats stats={[
          { value: formatDuration(totalElapsed), label: t('timer.planDone.lastSess') },
          { value: `${session.distance} km`, label: t('timer.done.dist') },
        ]} />
        <Text style={styles.doneSub}>{t('timer.planDone.progress')}</Text>
        <AppButton label={t('timer.planDone.more')} onPress={() => navigation.navigate('History')} />
        <AppButton label={t('timer.planDone.browsePlans')} onPress={() => navigation.navigate('Plans')} variant="secondary" />
      </View>
    </SafeAreaView>
  );
}

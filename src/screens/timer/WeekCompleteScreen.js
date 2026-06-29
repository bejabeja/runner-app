import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../i18n';
import { formatDuration } from '../../utils/format';
import { SessionStats } from '../../components/SessionStats';
import { AppButton } from '../../components/AppButton';
import { useDoneScreenStyles } from '../../components/timer/useDoneScreenStyles';

export default function WeekCompleteScreen({ totalElapsed, session, week, onContinue }) {
  const { styles } = useDoneScreenStyles();
  const { t } = useLanguage();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.doneScreen}>
        <Text style={styles.doneEmoji}>🏆</Text>
        <Text style={styles.doneTitle}>{t('timer.weekDone.title', { n: week })}</Text>
        <Text style={styles.doneSub}>{t('timer.weekDone.sub')}</Text>
        <SessionStats stats={[
          { value: formatDuration(totalElapsed), label: t('timer.weekDone.time') },
          { value: `${session.distance} km`, label: t('timer.weekDone.dist') },
        ]} />
        <AppButton label={t('timer.weekDone.btn')} onPress={onContinue} />
      </View>
    </SafeAreaView>
  );
}

import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../i18n';
import { formatDuration } from '../../utils/format';
import { FEELING_EMOJI } from '../../utils/constants';
import { SessionStats } from '../../components/SessionStats';
import { AppButton } from '../../components/AppButton';
import { useSessionDoneStyles } from '../../components/timer/useSessionDoneStyles';

const FEELINGS = ['easy', 'good', 'hard'];

export default function SessionDoneScreen({
  totalElapsed, session, actualDist, setActualDist,
  feeling, setFeeling, handleSaveRun, handleMarkDone, onClose,
}) {
  const { styles, colors } = useSessionDoneStyles();
  const { t } = useLanguage();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.doneScreen}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Ionicons name="close" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <Text style={styles.doneEmoji}>🎉</Text>
        <Text style={styles.doneTitle}>{t('timer.done.title')}</Text>
        <Text style={styles.doneSub}>{t('plans.sessionType.' + session.type)}</Text>

        <SessionStats stats={[
          { value: formatDuration(totalElapsed), label: t('timer.done.time') },
          { value: `${actualDist.toFixed(1)} km`, label: t('timer.done.dist') },
        ]} />

        <View style={styles.distAdjust}>
          <Text style={styles.distAdjustLabel}>{t('timer.done.adjDist')}</Text>
          <View style={styles.distStepper}>
            <TouchableOpacity
              style={styles.distStepBtn}
              onPress={() => setActualDist((d) => Math.max(0, Math.round((d - 0.1) * 10) / 10))}
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
              <Ionicons name="remove" size={22} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.distStepVal}>{actualDist.toFixed(1)} km</Text>
            <TouchableOpacity
              style={styles.distStepBtn}
              onPress={() => setActualDist((d) => Math.round((d + 0.1) * 10) / 10)}
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
              <Ionicons name="add" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.feelingSection}>
          <Text style={styles.feelingQuestion}>{t('timer.feelings.label')}</Text>
          <View style={styles.feelingRow}>
            {FEELINGS.map((key) => (
              <TouchableOpacity
                key={key}
                style={[styles.feelingBtn, feeling === key && styles.feelingBtnActive]}
                onPress={() => setFeeling(key)}
                activeOpacity={0.7}
              >
                <Text style={styles.feelingEmoji}>{FEELING_EMOJI[key]}</Text>
                <Text style={[styles.feelingLabel, feeling === key && styles.feelingLabelActive]}>
                  {t(`timer.feelings.${key}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <AppButton
          label={t('timer.done.save')}
          onPress={handleSaveRun}
          icon="save-outline"
          disabled={!feeling}
        />

        <AppButton
          label={t('timer.done.markDone')}
          onPress={handleMarkDone}
          variant="secondary"
          icon="checkmark-circle-outline"
        />
      </View>
    </SafeAreaView>
  );
}

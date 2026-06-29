import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../i18n';
import { isSessionDone } from '../../storage/progress';
import { spacing } from '../../theme';
import { getPhaseSummaryText } from '../../utils/parseIntervals';
import { getEstimatedMins } from '../../utils/sessionSummary';
import { usePlanStyles } from './usePlanStyles';

export default function SessionRow({ session, globalIdx, plan, progress, onToggle, onStart }) {
  const { styles, colors } = usePlanStyles();
  const { t } = useLanguage();
  const sessionDone = isSessionDone(progress, plan.id, globalIdx);
  const mins = getEstimatedMins(session.description);
  const phaseSummary = getPhaseSummaryText(session.description, {
    run: t('phases.summary.run'),
    walk: t('phases.summary.walk'),
    warmup: t('phases.summary.warmup'),
    cooldown: t('phases.summary.cooldown'),
  });

  return (
    <TouchableOpacity style={styles.sessionRow} onPress={() => onStart(session, globalIdx)} activeOpacity={0.7}>
      <View style={styles.sessionInfo}>
        <View style={styles.sessionTopRow}>
          <Text style={[styles.sessionDay, sessionDone && styles.doneText]}>
            {t('days.' + session.day + '.full')}
          </Text>
          <Text style={[styles.sessionDist, sessionDone && styles.doneText]}>
            {session.distance} km
          </Text>
        </View>
        <Text style={[styles.sessionType, sessionDone && styles.doneText]}>
          {t('plans.sessionType.' + session.type)}
        </Text>
        <Text style={[styles.sessionMeta, sessionDone && styles.doneText]}>
          {mins ? `~${mins} min · ` : ''}{session.distance} km
        </Text>
        {phaseSummary ? <Text style={styles.sessionPhases}>{phaseSummary}</Text> : null}
      </View>

      <TouchableOpacity
        style={[styles.checkbox, sessionDone && { backgroundColor: colors.success, borderColor: colors.success }]}
        onPress={() => onToggle(globalIdx)}
        hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
      >
        {sessionDone
          ? <Ionicons name="checkmark" size={13} color="#fff" />
          : <Ionicons name="ellipse-outline" size={13} color={colors.textSecondary} />
        }
      </TouchableOpacity>

      <Ionicons name="play-circle" size={30} color={plan.color} style={{ marginLeft: spacing.xs }} />
    </TouchableOpacity>
  );
}

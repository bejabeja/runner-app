import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import DateNavigator from '../components/addRun/DateNavigator';
import FeelingPicker from '../components/addRun/FeelingPicker';
import PlanSessionPicker from '../components/addRun/PlanSessionPicker';
import StepperRow from '../components/addRun/StepperRow';
import { useAddRunStyles } from '../components/addRun/useAddRunStyles';
import { useLanguage } from '../i18n';
import { AppButton } from '../components/AppButton';
import { isSessionDone, toggleSession } from '../storage/progress';
import { saveRun } from '../storage/runs';
import { spacing } from '../theme';
import { generateId } from '../utils/id';
import { dateFromDaysAgo } from '../utils/dateHelpers';
import { loadPlanBundle } from '../utils/planBundle';
import { flattenSessions } from '../utils/virtualSchedule';

export default function AddRunScreen() {
  const navigation = useNavigation();
  const { styles, colors } = useAddRunStyles();
  const { t } = useLanguage();

  const [daysAgo, setDaysAgo] = useState(0);
  const [distance, setDistance] = useState(5.0);
  const [minutes, setMinutes] = useState(30);
  const [seconds, setSeconds] = useState(0);
  const [feeling, setFeeling] = useState(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const [planData, setPlanData] = useState(null);
  const [pendingSessions, setPendingSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    loadPlanBundle().then(({ activePlanData, plan, progress }) => {
      if (!activePlanData || !plan) return;
      const all = flattenSessions(plan);
      const pending = all.filter(s => !isSessionDone(progress, activePlanData.planId, s.globalIdx));
      setPlanData({ planId: activePlanData.planId, planName: plan.name });
      setPendingSessions(pending);
    });
  }, []);

  const duration = minutes * 60 + seconds;
  const pace = distance > 0 ? Math.round(duration / distance) : 0;

  const handleSave = async () => {
    if (!feeling) return;
    setSaving(true);
    try {
      const runNotes = selectedSession
        ? `${selectedSession.type}, plan${notes.trim() ? ` · ${notes.trim()}` : ''}`
        : notes.trim() || undefined;
      await saveRun({
        id: generateId(),
        date: dateFromDaysAgo(daysAgo).toISOString(),
        distance, duration, pace,
        notes: runNotes, feeling,
      });
      if (selectedSession && planData) {
        await toggleSession(planData.planId, selectedSession.globalIdx);
      }
      navigation.goBack();
    } catch (_) {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('history.addRun.title')}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

          <View style={styles.section}>
            <Text style={styles.label}>{t('history.addRun.dateLbl')}</Text>
            <DateNavigator
              daysAgo={daysAgo}
              onBack={() => setDaysAgo(d => d + 1)}
              onForward={() => daysAgo > 0 && setDaysAgo(d => d - 1)}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>{t('history.addRun.distanceLbl')}</Text>
            <View style={styles.card}>
              <StepperRow
                value={`${distance.toFixed(1)} km`}
                onDecrement={() => setDistance(d => Math.max(0.1, Math.round((d - 0.1) * 10) / 10))}
                onIncrement={() => setDistance(d => Math.round((d + 0.1) * 10) / 10)}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>{t('history.addRun.durationLbl')}</Text>
            <View style={styles.card}>
              <StepperRow
                value={`${String(minutes).padStart(2, '0')} min`}
                onDecrement={() => setMinutes(m => Math.max(0, m - 1))}
                onIncrement={() => setMinutes(m => Math.min(300, m + 1))}
                style={{ marginBottom: spacing.sm }}
              />
              <StepperRow
                value={`${String(seconds).padStart(2, '0')} seg`}
                onDecrement={() => setSeconds(s => s === 0 ? 55 : s - 5)}
                onIncrement={() => setSeconds(s => (s + 5) % 60)}
              />
              {pace > 0 && (
                <Text style={styles.paceHint}>
                  {t('history.addRun.pace')}: {Math.floor(pace / 60)}'{String(pace % 60).padStart(2, '0')}" /km
                </Text>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>{t('timer.feelings.label')}</Text>
            <FeelingPicker value={feeling} onChange={setFeeling} />
          </View>

          {pendingSessions.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.label}>{t('history.addRun.planLbl')}</Text>
              <PlanSessionPicker sessions={pendingSessions} selected={selectedSession} onSelect={setSelectedSession} />
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.label}>{t('history.addRun.notesLbl')}</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder={t('history.addRun.notesPlaceholder')}
              placeholderTextColor={colors.textSecondary}
              multiline
              maxLength={200}
            />
          </View>

          <AppButton label={t('history.addRun.save')} icon="save-outline" onPress={handleSave} disabled={!feeling || saving} />

          <View style={{ height: spacing.xl }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

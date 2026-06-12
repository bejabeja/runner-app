import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme';
import { formatDuration, formatPace } from '../utils/format';
import { saveRun } from '../storage/storage';
import { generateId } from '../utils/id';

const FEELINGS = [
  { key: 'great', label: 'Genial', emoji: '🔥', color: colors.great },
  { key: 'good', label: 'Bien', emoji: '😊', color: colors.good },
  { key: 'ok', label: 'Normal', emoji: '😐', color: colors.ok },
  { key: 'tired', label: 'Cansado', emoji: '😓', color: colors.tired },
];

export default function TimerScreen({ navigation }) {
  const [status, setStatus] = useState('idle'); // idle | running | paused | done
  const [elapsed, setElapsed] = useState(0);
  const [distance, setDistance] = useState('');
  const [feeling, setFeeling] = useState('good');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const accumulatedRef = useRef(0);

  const start = useCallback(() => {
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      setElapsed(accumulatedRef.current + Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 500);
    setStatus('running');
  }, []);

  const pause = useCallback(() => {
    clearInterval(intervalRef.current);
    accumulatedRef.current += Math.floor((Date.now() - startTimeRef.current) / 1000);
    setStatus('paused');
  }, []);

  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    accumulatedRef.current = 0;
    setElapsed(0);
    setStatus('idle');
    setDistance('');
    setNotes('');
    setFeeling('good');
  }, []);

  const stop = useCallback(() => {
    if (status === 'running') {
      clearInterval(intervalRef.current);
      accumulatedRef.current += Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsed(accumulatedRef.current);
    }
    setStatus('done');
  }, [status]);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const dist = parseFloat(distance);
  const pace = dist > 0 && elapsed > 0 ? Math.round(elapsed / dist) : null;

  const handleSave = async () => {
    if (!dist || dist <= 0) {
      Alert.alert('Distancia requerida', 'Introduce la distancia en km antes de guardar.');
      return;
    }
    setSaving(true);
    try {
      await saveRun({
        id: generateId(),
        date: new Date().toISOString(),
        distance: dist,
        duration: elapsed,
        pace: pace || 0,
        notes: notes.trim(),
        feeling,
      });
      reset();
      navigation.navigate('HomeMain');
    } catch {
      Alert.alert('Error', 'No se pudo guardar la carrera.');
    } finally {
      setSaving(false);
    }
  };

  const formatElapsed = () => {
    const h = Math.floor(elapsed / 3600);
    const m = Math.floor((elapsed % 3600) / 60);
    const s = elapsed % 60;
    return h > 0
      ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => {
          if (status !== 'idle') {
            const doExit = () => { reset(); navigation.goBack(); };
            if (Platform.OS === 'web') {
              if (window.confirm('¿Salir? Perderás la carrera en curso.')) doExit();
            } else {
              Alert.alert('¿Salir?', 'Perderás la carrera en curso.', [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Salir', style: 'destructive', onPress: doExit },
              ]);
            }
          } else {
            navigation.goBack();
          }
        }}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Cronómetro</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={[styles.timerDisplay, status === 'running' && styles.timerRunning]}>
          <Text style={[styles.timerText, status === 'running' && styles.timerTextRunning]}>
            {formatElapsed()}
          </Text>
          {pace && (
            <Text style={styles.paceText}>{formatPace(pace)} /km</Text>
          )}
          {status === 'running' && <View style={styles.pulse} />}
        </View>

        <View style={styles.controls}>
          {status === 'idle' && (
            <TouchableOpacity style={[styles.bigBtn, styles.startBtn]} onPress={start}>
              <Ionicons name="play" size={32} color="#fff" />
              <Text style={styles.bigBtnText}>Iniciar</Text>
            </TouchableOpacity>
          )}

          {status === 'running' && (
            <View style={styles.btnRow}>
              <TouchableOpacity style={[styles.bigBtn, styles.pauseBtn]} onPress={pause}>
                <Ionicons name="pause" size={28} color="#fff" />
                <Text style={styles.bigBtnText}>Pausa</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.bigBtn, styles.stopBtn]} onPress={stop}>
                <Ionicons name="stop" size={28} color="#fff" />
                <Text style={styles.bigBtnText}>Parar</Text>
              </TouchableOpacity>
            </View>
          )}

          {status === 'paused' && (
            <View style={styles.btnRow}>
              <TouchableOpacity style={[styles.bigBtn, styles.startBtn]} onPress={start}>
                <Ionicons name="play" size={28} color="#fff" />
                <Text style={styles.bigBtnText}>Continuar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.bigBtn, styles.stopBtn]} onPress={stop}>
                <Ionicons name="stop" size={28} color="#fff" />
                <Text style={styles.bigBtnText}>Parar</Text>
              </TouchableOpacity>
            </View>
          )}

          {status !== 'idle' && status !== 'running' && (
            <TouchableOpacity style={styles.resetLink} onPress={reset}>
              <Ionicons name="refresh" size={16} color={colors.textSecondary} />
              <Text style={styles.resetText}>Reiniciar</Text>
            </TouchableOpacity>
          )}
        </View>

        {status === 'done' && (
          <View style={styles.saveForm}>
            <Text style={[typography.h3, { marginBottom: spacing.md }]}>Guardar carrera</Text>

            <Text style={styles.fieldLabel}>Distancia (km)</Text>
            <TextInput
              style={styles.input}
              value={distance}
              onChangeText={setDistance}
              placeholder="Ej: 5.32"
              keyboardType="decimal-pad"
              placeholderTextColor={colors.textSecondary}
              autoFocus
            />

            <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>¿Cómo te sentiste?</Text>
            <View style={styles.feelingsRow}>
              {FEELINGS.map((f) => (
                <TouchableOpacity
                  key={f.key}
                  style={[styles.feelingBtn, feeling === f.key && { backgroundColor: f.color + '20', borderColor: f.color }]}
                  onPress={() => setFeeling(f.key)}
                >
                  <Text style={styles.feelingEmoji}>{f.emoji}</Text>
                  <Text style={[styles.feelingLabel, feeling === f.key && { color: f.color, fontWeight: '700' }]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>Notas (opcional)</Text>
            <TextInput
              style={[styles.input, { minHeight: 70, textAlignVertical: 'top', paddingTop: spacing.sm }]}
              value={notes}
              onChangeText={setNotes}
              placeholder="¿Cómo fue?"
              placeholderTextColor={colors.textSecondary}
              multiline
            />

            <TouchableOpacity
              style={[styles.saveBtn, saving && { opacity: 0.6 }]}
              onPress={handleSave}
              disabled={saving}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.saveBtnText}>{saving ? 'Guardando...' : 'Guardar carrera'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  navTitle: { ...typography.h3 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  timerDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    position: 'relative',
    overflow: 'hidden',
  },
  timerRunning: { backgroundColor: colors.primary + '08' },
  timerText: {
    fontSize: 72,
    fontWeight: '200',
    color: colors.text,
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
  },
  timerTextRunning: { color: colors.primary },
  paceText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  pulse: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  controls: { alignItems: 'center', marginBottom: spacing.lg },
  btnRow: { flexDirection: 'row', gap: spacing.md },
  bigBtn: {
    width: 120,
    height: 120,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  startBtn: { backgroundColor: colors.primary, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6 },
  pauseBtn: { backgroundColor: '#4299E1' },
  stopBtn: { backgroundColor: colors.secondary },
  bigBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  resetLink: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.md },
  resetText: { ...typography.bodySmall },
  saveForm: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  fieldLabel: { ...typography.label, marginBottom: spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  feelingsRow: { flexDirection: 'row', gap: spacing.sm },
  feelingBtn: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  feelingEmoji: { fontSize: 22, marginBottom: 4 },
  feelingLabel: { ...typography.bodySmall, color: colors.textSecondary },
  saveBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

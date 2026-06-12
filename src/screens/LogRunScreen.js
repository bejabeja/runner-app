import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme';
import { saveRun } from '../storage/storage';
import { parseDurationInput, calcPace, formatPace } from '../utils/format';
import { generateId } from '../utils/id';

const FEELINGS = [
  { key: 'great', label: 'Genial', emoji: '🔥', color: colors.great },
  { key: 'good', label: 'Bien', emoji: '😊', color: colors.good },
  { key: 'ok', label: 'Normal', emoji: '😐', color: colors.ok },
  { key: 'tired', label: 'Cansado', emoji: '😓', color: colors.tired },
];

export default function LogRunScreen({ navigation }) {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [feeling, setFeeling] = useState('good');
  const [pacePreview, setPacePreview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const dist = parseFloat(distance);
    const secs = parseDurationInput(duration);
    if (dist > 0 && secs > 0) {
      setPacePreview(calcPace(dist, secs));
    } else {
      setPacePreview(null);
    }
  }, [distance, duration]);

  const handleSave = async () => {
    const dist = parseFloat(distance);
    const secs = parseDurationInput(duration);

    if (!dist || dist <= 0) {
      Alert.alert('Distancia inválida', 'Introduce una distancia válida en kilómetros.');
      return;
    }
    if (!secs || secs <= 0) {
      Alert.alert('Tiempo inválido', 'Introduce el tiempo en formato mm:ss o hh:mm:ss.');
      return;
    }
    if (!date) {
      Alert.alert('Fecha inválida', 'Introduce una fecha válida.');
      return;
    }

    setSaving(true);
    const run = {
      id: generateId(),
      date: new Date(date).toISOString(),
      distance: dist,
      duration: secs,
      pace: calcPace(dist, secs),
      notes: notes.trim(),
      feeling,
    };

    try {
      await saveRun(run);
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'No se pudo guardar la carrera.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Nueva carrera</Text>
          <TouchableOpacity onPress={handleSave} disabled={saving}>
            <Text style={[styles.saveBtn, saving && { opacity: 0.5 }]}>Guardar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Field label="Fecha">
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textSecondary}
            />
          </Field>

          <Field label="Distancia (km)">
            <TextInput
              style={styles.input}
              value={distance}
              onChangeText={setDistance}
              placeholder="Ej: 5.32"
              keyboardType="decimal-pad"
              placeholderTextColor={colors.textSecondary}
            />
          </Field>

          <Field label="Tiempo (mm:ss o hh:mm:ss)">
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={setDuration}
              placeholder="Ej: 28:45 o 1:02:30"
              keyboardType="numbers-and-punctuation"
              placeholderTextColor={colors.textSecondary}
            />
          </Field>

          {pacePreview !== null && (
            <View style={styles.pacePreview}>
              <Ionicons name="speedometer-outline" size={18} color={colors.primary} />
              <Text style={styles.pacePreviewText}>
                Ritmo calculado: <Text style={styles.paceValue}>{formatPace(pacePreview)} /km</Text>
              </Text>
            </View>
          )}

          <Field label="¿Cómo te sentiste?">
            <View style={styles.feelingsRow}>
              {FEELINGS.map((f) => (
                <TouchableOpacity
                  key={f.key}
                  style={[
                    styles.feelingBtn,
                    feeling === f.key && { backgroundColor: f.color + '20', borderColor: f.color },
                  ]}
                  onPress={() => setFeeling(f.key)}
                >
                  <Text style={styles.feelingEmoji}>{f.emoji}</Text>
                  <Text style={[styles.feelingLabel, feeling === f.key && { color: f.color, fontWeight: '700' }]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Field>

          <Field label="Notas (opcional)">
            <TextInput
              style={[styles.input, styles.notesInput]}
              value={notes}
              onChangeText={setNotes}
              placeholder="¿Cómo fue la carrera? ¿Alguna observación?"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </Field>

          <TouchableOpacity
            style={[styles.primaryBtn, saving && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={saving}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ marginRight: spacing.sm }} />
            <Text style={styles.primaryBtnText}>{saving ? 'Guardando...' : 'Guardar carrera'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, children }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
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
  saveBtn: { color: colors.primary, fontWeight: '700', fontSize: 16 },
  scroll: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  field: { marginBottom: spacing.lg },
  fieldLabel: { ...typography.label, marginBottom: spacing.xs },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 16,
    color: colors.text,
  },
  notesInput: {
    minHeight: 80,
    paddingTop: spacing.sm,
  },
  pacePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  pacePreviewText: { ...typography.body, marginLeft: spacing.xs },
  paceValue: { fontWeight: '700', color: colors.primary },
  feelingsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
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
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

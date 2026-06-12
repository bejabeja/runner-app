import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme';
import { getRuns, deleteRun } from '../storage/storage';
import RunCard from '../components/RunCard';

export default function HistoryScreen({ navigation }) {
  const [runs, setRuns] = useState([]);

  const loadRuns = useCallback(async () => {
    const data = await getRuns();
    setRuns(data);
  }, []);

  useFocusEffect(useCallback(() => { loadRuns(); }, [loadRuns]));

  const handleDelete = (id) => {
    const doDelete = async () => {
      const updated = await deleteRun(id);
      setRuns(updated);
    };
    if (Platform.OS === 'web') {
      if (window.confirm('¿Eliminar esta carrera?')) doDelete();
    } else {
      Alert.alert('Eliminar carrera', '¿Seguro?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: doDelete },
      ]);
    }
  };

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyTitle}>Sin carreras aún</Text>
      <Text style={styles.emptyDesc}>Tus carreras aparecerán aquí una vez que las registres</Text>
      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('LogRun')}>
        <Text style={styles.addBtnText}>Registrar carrera</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={typography.h2}>Historial</Text>
        {runs.length > 0 && (
          <Text style={styles.count}>{runs.length} carrera{runs.length > 1 ? 's' : ''}</Text>
        )}
      </View>
      <FlatList
        data={runs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RunCard run={item} onDelete={handleDelete} />
        )}
        contentContainerStyle={[
          styles.list,
          runs.length === 0 && { flex: 1 },
        ]}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  count: { ...typography.bodySmall, color: colors.textSecondary },
  list: { padding: spacing.md, paddingTop: spacing.sm },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: { fontSize: 64, marginBottom: spacing.md },
  emptyTitle: { ...typography.h3, marginBottom: spacing.xs },
  emptyDesc: { ...typography.bodySmall, textAlign: 'center', marginBottom: spacing.lg },
  addBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

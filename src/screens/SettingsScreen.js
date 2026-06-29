import { Alert, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import SettingRow from '../components/settings/SettingRow';
import { useSettingsStyles } from '../components/settings/useSettingsStyles';
import { useLanguage } from '../i18n';
import { useTheme } from '../ThemeContext';
import { clearActivePlan } from '../storage/plan';
import { clearAllProgress } from '../storage/progress';
import store from '../storage/asyncStorageAdapter';
import { STORAGE_KEYS } from '../storage/keys';
import { confirm } from '../utils/confirm';

const resetOnboarding = () => store.removeItem(STORAGE_KEYS.ONBOARDING);

const clearAllData = async () => {
  await Promise.all([
    clearActivePlan(),
    clearAllProgress(),
    store.removeItem(STORAGE_KEYS.RUNS),
    store.removeItem(STORAGE_KEYS.ONBOARDING),
  ]);
};

export default function SettingsScreen({ navigation }) {
  const { t, lang, setLang } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { styles, colors } = useSettingsStyles();

  const handleResetOnboarding = () => {
    confirm(
      t('settings.alert.resetTitle'),
      t('settings.alert.resetMsg'),
      async () => {
        await resetOnboarding();
        Alert.alert(t('settings.alert.done'), t('settings.alert.resetDone'));
      },
      { cancelText: t('settings.alert.cancel'), confirmText: t('settings.alert.confirm'), destructive: true },
    );
  };

  const handleClearPlan = () => {
    confirm(
      t('settings.alert.planTitle'),
      t('settings.alert.planMsg'),
      async () => { await clearActivePlan(); navigation.navigate('Home'); },
      { cancelText: t('settings.alert.cancel'), confirmText: t('settings.alert.confirm'), destructive: true },
    );
  };

  const handleClearAll = () => {
    confirm(
      t('settings.alert.allTitle'),
      t('settings.alert.allMsg'),
      async () => { await clearAllData(); navigation.navigate('Home'); },
      { cancelText: t('settings.alert.cancel'), confirmText: t('settings.alert.confirm'), destructive: true },
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>{t('settings.title')}</Text>

        <Text style={styles.sectionHeader}>{t('settings.secAppearance')}</Text>
        <View style={styles.card}>
          <SettingRow
            icon={isDark ? 'moon-outline' : 'sunny-outline'}
            label={t('settings.themeLbl')}
            sublabel={t('settings.themeSub')}
            onPress={toggleTheme}
            right={
              <Switch
                value={!isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            }
          />
        </View>

        <Text style={styles.sectionHeader}>{t('settings.language')}</Text>
        <View style={styles.card}>
          {[
            { code: 'es', flag: '🇪🇸', name: 'Español' },
            { code: 'en', flag: '🇬🇧', name: 'English' },
          ].map(({ code, flag, name }, i) => (
            <TouchableOpacity
              key={code}
              style={[styles.langRow, i > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}
              onPress={() => setLang(code)}
              activeOpacity={0.75}
            >
              <Text style={styles.langFlag}>{flag}</Text>
              <Text style={[styles.langLabel, { flex: 1 }]}>{name}</Text>
              {lang === code && <Ionicons name="checkmark" size={20} color={colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionHeader}>{t('settings.secDev')}</Text>
        <View style={styles.card}>
          <SettingRow icon="refresh-outline" label={t('settings.resetLbl')} sublabel={t('settings.resetSub')} onPress={handleResetOnboarding} />
        </View>

        <Text style={styles.sectionHeader}>{t('settings.secData')}</Text>
        <View style={styles.card}>
          <SettingRow icon="trophy-outline" label={t('settings.clearPlan')} sublabel={t('settings.clearPlanSub')} onPress={handleClearPlan} destructive />
          <View style={styles.divider} />
          <SettingRow icon="trash-outline" label={t('settings.clearAll')} sublabel={t('settings.clearAllSub')} onPress={handleClearAll} destructive />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

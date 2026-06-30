import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';

// Show notifications even when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import PlansScreen from './src/screens/PlansScreen';
import IntervalTimerScreen from './src/screens/IntervalTimerScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import PlanFinderScreen from './src/screens/PlanFinderScreen';
import AddRunScreen from './src/screens/AddRunScreen';
import { getOnboardingDone, getLanguagePref } from './src/storage/storage';
import { LanguageProvider, useLanguage } from './src/i18n';
import { ThemeProvider, useTheme, getThemePref } from './src/ThemeContext';

const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

// Tab bar visual constants
const TAB_ICON_WIDTH = 44;
const TAB_INDICATOR_TOP = -10;
const TAB_INDICATOR_WIDTH = 20;
const TAB_INDICATOR_HEIGHT = 3;
const TAB_INDICATOR_RADIUS = 1.5;
const TAB_LABEL_SIZE = 11;

function MainTabs() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { colors } = useTheme();
  const tabBarHeight = 52 + insets.bottom;
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.tabBarBorder,
          backgroundColor: colors.tabBarBg,
          height: tabBarHeight,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: TAB_LABEL_SIZE, fontWeight: '600', letterSpacing: 0.2 },
        tabBarIcon: ({ focused, color }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Plans: focused ? 'trophy' : 'trophy-outline',
            History: focused ? 'time' : 'time-outline',
            Settings: focused ? 'settings' : 'settings-outline',
          };
          return (
            <View style={{ alignItems: 'center', width: TAB_ICON_WIDTH }}>
              {focused && (
                <View style={{
                  position: 'absolute', top: TAB_INDICATOR_TOP,
                  width: TAB_INDICATOR_WIDTH, height: TAB_INDICATOR_HEIGHT,
                  borderRadius: TAB_INDICATOR_RADIUS,
                  backgroundColor: colors.primary,
                }} />
              )}
              <Ionicons name={icons[route.name]} size={22} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t('tabs.home') }} />
      <Tab.Screen name="Plans" component={PlansScreen} options={{ title: t('tabs.plans') }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: t('tabs.history') }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: t('tabs.settings') }} />
    </Tab.Navigator>
  );
}

function ThemedBackground({ children }) {
  const { colors, isDark } = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: colors.rootBg }]}>
      <LinearGradient
        colors={colors.gradientColors}
        locations={colors.gradientLocations}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={colors.ambientGlow}
        style={[StyleSheet.absoluteFill, { top: '55%' }]}
      />
      <SafeAreaProvider>
        {children}
      </SafeAreaProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}

export default function App() {
  const [onboardingDone, setOnboardingDone] = useState(null);
  const [initLang, setInitLang] = useState('es');
  const [initIsDark, setInitIsDark] = useState(true);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: false,
    });
    Promise.all([getOnboardingDone(), getLanguagePref(), getThemePref()]).then(([done, lang, isDark]) => {
      setInitLang(lang);
      setInitIsDark(isDark);
      setOnboardingDone(done);
    });
  }, []);

  if (onboardingDone === null) {
    return (
      <GestureHandlerRootView style={styles.root}>
        <ThemeProvider initialIsDark={initIsDark}>
          <ThemedBackground>
            <View style={{ flex: 1 }} />
          </ThemedBackground>
        </ThemeProvider>
      </GestureHandlerRootView>
    );
  }

  if (!onboardingDone) {
    return (
      <GestureHandlerRootView style={styles.root}>
        <ThemeProvider initialIsDark={initIsDark}>
          <ThemedBackground>
            <LanguageProvider initialLang={initLang}>
              <OnboardingScreen onDone={() => setOnboardingDone(true)} />
            </LanguageProvider>
          </ThemedBackground>
        </ThemeProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <ThemeProvider initialIsDark={initIsDark}>
        <ThemedBackground>
          <LanguageProvider initialLang={initLang}>
            <NavigationContainer>
              <RootStack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#07080F' }, cardOverlayEnabled: false, cardShadowEnabled: false }}>
                <RootStack.Screen name="Main" component={MainTabs} />
                <RootStack.Screen
                  name="IntervalTimer"
                  component={IntervalTimerScreen}
                  options={{ gestureEnabled: false, presentation: 'fullScreenModal', cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid }}
                />
                <RootStack.Screen
                  name="PlanFinder"
                  component={PlanFinderScreen}
                  options={{ presentation: 'modal', gestureEnabled: true, cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid }}
                />
                <RootStack.Screen
                  name="AddRun"
                  component={AddRunScreen}
                  options={{ presentation: 'modal', gestureEnabled: true, cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid }}
                />
              </RootStack.Navigator>
            </NavigationContainer>
          </LanguageProvider>
        </ThemedBackground>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

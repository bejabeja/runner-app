import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import PlansScreen from './src/screens/PlansScreen';
import IntervalTimerScreen from './src/screens/IntervalTimerScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { colors } from './src/theme';

const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.surfaceElevated,
          height: 68,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', letterSpacing: 0.2 },
        tabBarIcon: ({ focused, color }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Plans: focused ? 'trophy' : 'trophy-outline',
          };
          return (
            <View style={{ alignItems: 'center', width: 44 }}>
              {focused && (
                <View style={{
                  position: 'absolute', top: -10,
                  width: 20, height: 3,
                  borderRadius: 1.5,
                  backgroundColor: colors.primary,
                }} />
              )}
              <Ionicons name={icons[route.name]} size={22} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Tab.Screen name="Plans" component={PlansScreen} options={{ title: 'Planes' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Main" component={MainTabs} />
          <RootStack.Screen
            name="IntervalTimer"
            component={IntervalTimerScreen}
            options={{ gestureEnabled: false, presentation: 'fullScreenModal' }}
          />
          <RootStack.Screen name="History" component={HistoryScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}

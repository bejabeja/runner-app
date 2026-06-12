import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import LogRunScreen from './src/screens/LogRunScreen';
import TimerScreen from './src/screens/TimerScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import StatsScreen from './src/screens/StatsScreen';
import PlansScreen from './src/screens/PlansScreen';
import { colors } from './src/theme';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="LogRun" component={LogRunScreen} options={{ presentation: 'modal' }} />
      <HomeStack.Screen name="Timer" component={TimerScreen} options={{ presentation: 'modal' }} />
    </HomeStack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textSecondary,
            tabBarStyle: {
              borderTopColor: colors.border,
              backgroundColor: colors.surface,
              paddingBottom: 4,
              height: 60,
            },
            tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
            tabBarIcon: ({ focused, color, size }) => {
              const icons = {
                Home: focused ? 'home' : 'home-outline',
                History: focused ? 'list' : 'list-outline',
                Stats: focused ? 'bar-chart' : 'bar-chart-outline',
                Plans: focused ? 'trophy' : 'trophy-outline',
              };
              return <Ionicons name={icons[route.name]} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeStackNavigator} options={{ title: 'Inicio' }} />
          <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'Historial' }} />
          <Tab.Screen name="Stats" component={StatsScreen} options={{ title: 'Estadísticas' }} />
          <Tab.Screen name="Plans" component={PlansScreen} options={{ title: 'Planes' }} />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}

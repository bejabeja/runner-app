import { createContext, useContext, useState } from 'react';
import store from './storage/asyncStorageAdapter';
import { STORAGE_KEYS } from './storage/keys';

// Shared values are defined once here; each theme only declares what differs.
const createTheme = (overrides) => ({
  primary: '#FF5C00',
  primaryDark: '#CC3D00',
  textSecondary: '#6B7090',
  gradientLocations: [0, 0.6, 1],
  onPrimary: '#FFFFFF',
  ...overrides,
});

export const darkTheme = createTheme({
  rootBg: '#07080F',
  background: '#07080F',
  surface: 'rgba(255,255,255,0.07)',
  surfaceElevated: 'rgba(255,255,255,0.11)',
  text: '#FFFFFF',
  border: 'rgba(255,255,255,0.10)',
  success: '#2DD98F',
  warning: '#F59E0B',
  error: '#F56565',
  gradientColors: ['#060810', '#080B14', '#100D09'],
  ambientGlow: ['transparent', 'rgba(255,92,0,0.07)'],
  tabBarBg: 'rgba(6,8,16,0.90)',
  tabBarBorder: 'rgba(255,255,255,0.08)',
});

export const lightTheme = createTheme({
  rootBg: '#EEF0F8',
  background: '#EEF0F8',
  surface: 'rgba(255,255,255,0.80)',
  surfaceElevated: 'rgba(255,255,255,0.95)',
  text: '#0F1117',
  border: 'rgba(0,0,0,0.09)',
  success: '#059669',
  warning: '#D97706',
  error: '#DC2626',
  gradientColors: ['#E8EBF5', '#EEF0F8', '#F5EEE8'],
  ambientGlow: ['transparent', 'rgba(255,92,0,0.04)'],
  tabBarBg: 'rgba(238,240,248,0.95)',
  tabBarBorder: 'rgba(0,0,0,0.08)',
});

const ThemeContext = createContext({ colors: darkTheme, isDark: true, toggleTheme: () => { } });

export function ThemeProvider({ children, initialIsDark = true }) {
  const [isDark, setIsDark] = useState(initialIsDark);

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    await store.setItem(STORAGE_KEYS.THEME, next ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ colors: isDark ? darkTheme : lightTheme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

export const getThemePref = async () => {
  const val = await store.getItem(STORAGE_KEYS.THEME);
  return val !== 'light';
};

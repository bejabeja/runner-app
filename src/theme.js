import { darkTheme } from './ThemeContext';

export const colors = darkTheme;

export const DIFFICULTY_COLOR = {
  Principiante: '#48BB78',
  Intermedio: '#4299E1',
  Avanzado: '#9F7AEA',
};

export const ONBOARDING_SLIDE_BG = ['#FF5C00', '#2563EB', '#059669'];

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };

export const radius = { sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, full: 9999 };

export const typography = {
  h1: { fontSize: 32, fontWeight: '800', color: '#FFFFFF' },
  h2: { fontSize: 24, fontWeight: '700', color: '#FFFFFF' },
  h3: { fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
  body: { fontSize: 15, fontWeight: '400', color: '#FFFFFF' },
  bodySmall: { fontSize: 13, fontWeight: '400', color: '#6B7090' },
  label: { fontSize: 11, fontWeight: '700', color: '#6B7090', textTransform: 'uppercase', letterSpacing: 0.8 },
};

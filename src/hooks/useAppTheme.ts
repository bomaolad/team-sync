import { useThemeStore } from '../store/themeStore';

const COLORS = {
  primary: '#2563EB',
  secondary: '#64748B',
  success: '#22C55E',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  background: {
    light: '#F8FAFC',
    dark: '#0F172A',
  },
  surface: {
    light: '#FFFFFF',
    dark: '#1E293B',
  },
  text: {
    primary: '#0F172A',
    secondary: '#64748B',
    muted: '#94A3B8',
    light: '#FFFFFF',
  },
  border: {
    light: '#E2E8F0',
    dark: '#334155',
  },
  status: {
    todo: '#94A3B8',
    inProgress: '#3B82F6',
    underReview: '#F59E0B',
    recheck: '#EF4444',
    done: '#22C55E',
  },
  priority: {
    low: '#22C55E',
    medium: '#F59E0B',
    high: '#EF4444',
  },
};

export const useAppTheme = () => {
  const { mode, toggleTheme, setTheme } = useThemeStore();

  const isDark = mode === 'dark';

  const colors = {
    ...COLORS,
    background: COLORS.background[mode],
    surface: COLORS.surface[mode],
    border: COLORS.border[mode],
    text: {
      ...COLORS.text,
      primary: isDark ? '#F1F5F9' : COLORS.text.primary,
      secondary: isDark ? '#94A3B8' : COLORS.text.secondary,
      muted: isDark ? '#64748B' : COLORS.text.muted,
    },
  };

  return {
    mode,
    isDark,
    toggleTheme,
    setTheme,
    colors,
  };
};

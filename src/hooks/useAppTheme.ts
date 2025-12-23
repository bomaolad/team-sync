import { useThemeStore } from '../store/themeStore';
import { ApTheme } from '../components/ApTheme';

export const useAppTheme = () => {
  const { mode, toggleTheme, setTheme } = useThemeStore();

  const isDark = mode === 'dark';

  const colors = {
    ...ApTheme.Color,
    background: ApTheme.Color.background[mode],
    surface: ApTheme.Color.surface[mode],
    border: ApTheme.Color.border[mode],
    text: {
      ...ApTheme.Color.text,
      primary: isDark ? '#F1F5F9' : ApTheme.Color.text.primary, // slate-100 vs slate-900
      secondary: isDark ? '#94A3B8' : ApTheme.Color.text.secondary, // slate-400 vs slate-500
      muted: isDark ? '#64748B' : ApTheme.Color.text.muted,
      // 'light' remains white usually
    },
  };

  return {
    mode,
    isDark,
    toggleTheme,
    setTheme,
    colors,
    spacing: ApTheme.Spacing,
    borderRadius: ApTheme.BorderRadius,
    fontSize: ApTheme.FontSize,
    fontWeight: ApTheme.FontWeight,
  };
};

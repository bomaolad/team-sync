export const ApTheme = {
  Color: {
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
  },
  Spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  BorderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  FontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  FontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export type ThemeColor = keyof typeof ApTheme.Color;
export type StatusColor = keyof typeof ApTheme.Color.status;
export type PriorityColor = keyof typeof ApTheme.Color.priority;

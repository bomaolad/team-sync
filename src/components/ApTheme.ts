export const ApTheme = {
  Color: {
    primary: '#2563EB',
    secondary: '#64748B',
    success: '#22C55E',
    danger: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    white: '#FFFFFF',
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
      primary: '#1E293B',
      secondary: '#475569',
      muted: '#94A3B8',
      light: '#F8FAFC',
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
};

export type ApThemeType = typeof ApTheme;

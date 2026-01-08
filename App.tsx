import 'react-native-css-interop/metro-runtime';
import './global.css';
import React, { useEffect } from 'react';
import {
  DefaultTheme,
  DarkTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { QueryClientProvider } from '@tanstack/react-query';
import { RootNavigator } from './src/navigation';
import { useAppTheme, useHydrateAuth } from './src/hooks';
import { queryClient } from './src/services';

const AppContent: React.FC = () => {
  const { isDark, colors } = useAppTheme();
  const hydrateAuth = useHydrateAuth();

  useEffect(() => {
    hydrateAuth();
  }, []);

  const baseTheme = isDark ? DarkTheme : DefaultTheme;

  const navigationTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text.primary,
      border: colors.border,
      notification: colors.danger,
    },
  };

  const paperTheme = isDark ? MD3DarkTheme : MD3LightTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer theme={navigationTheme}>
        <RootNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
};

export default App;

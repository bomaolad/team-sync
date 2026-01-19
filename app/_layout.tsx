import '../global.css';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { queryClient } from '@/src/services';
import { useAppTheme, useHydrateAuth } from '@/src/hooks';

const RootLayoutContent = () => {
  const { isDark } = useAppTheme();
  const hydrateAuth = useHydrateAuth();

  useEffect(() => {
    hydrateAuth();
  }, []);

  const paperTheme = isDark ? MD3DarkTheme : MD3LightTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
    </PaperProvider>
  );
};

const RootLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <RootLayoutContent />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;

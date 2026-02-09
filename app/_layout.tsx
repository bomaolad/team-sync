import '../global.css';
import 'react-native-reanimated';
import 'regenerator-runtime/runtime';
import React, { useEffect } from 'react';
import { Stack, usePathname } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { queryClient } from '@/src/services';
import { useAppTheme, useHydrateAuth } from '@/src/hooks';
import { ToastProvider } from '@/src/components';

const RootLayoutContent = () => {
  const { isDark } = useAppTheme();
  const hydrateAuth = useHydrateAuth();

  const pathname = usePathname();

  useEffect(() => {
    hydrateAuth();
  }, []);

  useEffect(() => {
    // Invalidate all queries on route change to ensure fresh data (no cache)
    queryClient.invalidateQueries();
  }, [pathname]);

  const paperTheme = isDark ? MD3DarkTheme : MD3LightTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <ToastProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
      </ToastProvider>
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

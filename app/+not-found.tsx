import React from 'react';
import { View } from 'react-native';
import { Link, Stack } from 'expo-router';
import { ApText, ApScreen } from '@/src/components';

const NotFoundScreen = () => {
  return (
    <ApScreen>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View className="flex-1 items-center justify-center p-5">
        <ApText size="xl" weight="bold" className="mb-4">
          Page Not Found
        </ApText>
        <ApText size="md" className="text-center mb-6">
          The page you're looking for doesn't exist.
        </ApText>
        <Link href="/" className="mt-4">
          <ApText size="md" weight="semibold" className="text-primary">
            Go to Home
          </ApText>
        </Link>
      </View>
    </ApScreen>
  );
};

export default NotFoundScreen;

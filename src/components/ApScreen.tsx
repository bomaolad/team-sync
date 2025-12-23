import React from 'react';
import { StatusBar, View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApTheme } from './ApTheme';

interface ApScreenProps extends ViewProps {
  backgroundColor?: string;
  statusBarStyle?: 'light-content' | 'dark-content';
  children: React.ReactNode;
  className?: string;
}

import { useAppTheme } from '../hooks/useAppTheme';

export const ApScreen: React.FC<ApScreenProps> = ({
  children,
  backgroundColor,
  statusBarStyle,
  style,
  ...props
}) => {
  const { colors, isDark } = useAppTheme();

  const resolvedBackgroundColor = backgroundColor || colors.background;
  const resolvedStatusBarStyle =
    statusBarStyle || (isDark ? 'light-content' : 'dark-content');

  return (
    <SafeAreaView
      style={[
        {
          flex: 1,
          backgroundColor: resolvedBackgroundColor,
        },
        style,
      ]}
      {...props}
    >
      <StatusBar
        barStyle={resolvedStatusBarStyle}
        backgroundColor={resolvedBackgroundColor}
      />
      <View style={{ flex: 1, paddingHorizontal: 16 }}>{children}</View>
    </SafeAreaView>
  );
};

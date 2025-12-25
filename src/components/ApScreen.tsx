import React from 'react';
import { StatusBar, View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../hooks/useAppTheme';

interface ApScreenProps extends ViewProps {
  backgroundColor?: string;
  statusBarStyle?: 'light-content' | 'dark-content';
  children: React.ReactNode;
  className?: string;
}

export const ApScreen: React.FC<ApScreenProps> = ({
  children,
  backgroundColor,
  statusBarStyle,
  className = '',
  style,
  ...props
}) => {
  const { colors, isDark } = useAppTheme();

  const resolvedBackgroundColor = backgroundColor || colors.background;
  const resolvedStatusBarStyle =
    statusBarStyle || (isDark ? 'light-content' : 'dark-content');

  return (
    <SafeAreaView
      className={`flex-1 ${className}`}
      style={[{ backgroundColor: resolvedBackgroundColor }, style]}
      {...props}
    >
      <StatusBar
        barStyle={resolvedStatusBarStyle}
        backgroundColor={resolvedBackgroundColor}
      />
      <View className="flex-1 px-4">{children}</View>
    </SafeAreaView>
  );
};

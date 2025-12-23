import React from 'react';
import { SafeAreaView, StatusBar, View, ViewProps } from 'react-native';
import { ApTheme } from './ApTheme';

interface ApScreenProps extends ViewProps {
  backgroundColor?: string;
  statusBarStyle?: 'light-content' | 'dark-content';
  children: React.ReactNode;
  className?: string;
}

export const ApScreen: React.FC<ApScreenProps> = ({
  children,
  backgroundColor = ApTheme.Color.background.light,
  statusBarStyle = 'dark-content',
  style,
  ...props
}) => {
  return (
    <SafeAreaView
      style={[
        {
          flex: 1,
          backgroundColor: backgroundColor,
        },
        style,
      ]}
      {...props}
    >
      <StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />
      <View style={{ flex: 1, paddingHorizontal: ApTheme.Spacing.md }}>
        {children}
      </View>
    </SafeAreaView>
  );
};

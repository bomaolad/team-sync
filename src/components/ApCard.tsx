import React from 'react';
import { View, ViewProps, TouchableOpacity } from 'react-native';
import { ApTheme } from './ApTheme';

interface ApCardProps extends ViewProps {
  onPress?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  elevated?: boolean;
  className?: string;
}

export const ApCard: React.FC<ApCardProps> = ({
  children,
  onPress,
  padding = 'md',
  elevated = true,
  style,
  ...props
}) => {
  const paddingMap = {
    none: 0,
    sm: ApTheme.Spacing.sm,
    md: ApTheme.Spacing.md,
    lg: ApTheme.Spacing.lg,
  };

  const cardStyle = {
    backgroundColor: ApTheme.Color.surface.light,
    borderRadius: ApTheme.BorderRadius.lg,
    padding: paddingMap[padding],
    ...(elevated && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    }),
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[cardStyle, style]}
        activeOpacity={0.8}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[cardStyle, style]} {...props}>
      {children}
    </View>
  );
};

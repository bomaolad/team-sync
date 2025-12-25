import React from 'react';
import { View, ViewProps, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';

interface ApCardProps extends ViewProps {
  onPress?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  elevated?: boolean;
  className?: string;
}

const paddingClasses = {
  none: 'p-0',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
};

export const ApCard: React.FC<ApCardProps> = ({
  children,
  onPress,
  padding = 'md',
  elevated = true,
  style,
  className = '',
  ...props
}) => {
  const { colors } = useAppTheme();

  const baseClass = `rounded-xl ${paddingClasses[padding]} ${className}`;
  const shadowStyle = elevated
    ? {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }
    : {};

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        className={baseClass}
        style={[{ backgroundColor: colors.surface }, shadowStyle, style]}
        activeOpacity={0.8}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View
      className={baseClass}
      style={[{ backgroundColor: colors.surface }, shadowStyle, style]}
      {...props}
    >
      {children}
    </View>
  );
};

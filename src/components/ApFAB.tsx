import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { ApTheme } from './ApTheme';
import Icon from 'react-native-vector-icons/Feather';

interface ApFABProps extends TouchableOpacityProps {
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  backgroundColor?: string;
  position?: 'bottom-right' | 'bottom-center' | 'bottom-left';
  className?: string;
}

export const ApFAB: React.FC<ApFABProps> = ({
  icon = 'plus',
  size = 'md',
  color = ApTheme.Color.white,
  backgroundColor = ApTheme.Color.primary,
  position = 'bottom-right',
  style,
  ...props
}) => {
  const sizeMap = {
    sm: { button: 48, icon: 20 },
    md: { button: 56, icon: 24 },
    lg: { button: 64, icon: 28 },
  };

  const positionStyles = {
    'bottom-right': { right: ApTheme.Spacing.md, bottom: ApTheme.Spacing.lg },
    'bottom-center': {
      alignSelf: 'center' as const,
      bottom: ApTheme.Spacing.lg,
    },
    'bottom-left': { left: ApTheme.Spacing.md, bottom: ApTheme.Spacing.lg },
  };

  const currentSize = sizeMap[size];

  return (
    <TouchableOpacity
      style={[
        {
          position: 'absolute',
          ...positionStyles[position],
          width: currentSize.button,
          height: currentSize.button,
          borderRadius: currentSize.button / 2,
          backgroundColor: backgroundColor,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        },
        style,
      ]}
      activeOpacity={0.8}
      {...props}
    >
      <Icon name={icon} size={currentSize.icon} color={color} />
    </TouchableOpacity>
  );
};

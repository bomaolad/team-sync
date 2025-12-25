import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import Icon from '@expo/vector-icons/Feather';
import { ApTheme } from './ApTheme';

type IconName = React.ComponentProps<typeof Icon>['name'];

interface ApFABProps extends TouchableOpacityProps {
  icon?: IconName;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  backgroundColor?: string;
  position?: 'bottom-right' | 'bottom-center' | 'bottom-left';
  className?: string;
}

const sizeConfig = {
  sm: { button: 48, icon: 20 },
  md: { button: 56, icon: 24 },
  lg: { button: 64, icon: 28 },
};

const positionConfig = {
  'bottom-right': { right: 16, bottom: 24 },
  'bottom-center': { alignSelf: 'center' as const, bottom: 24 },
  'bottom-left': { left: 16, bottom: 24 },
};

export const ApFAB: React.FC<ApFABProps> = ({
  icon = 'plus',
  size = 'md',
  color = ApTheme.Color.white,
  backgroundColor = ApTheme.Color.primary,
  position = 'bottom-right',
  style,
  className = '',
  ...props
}) => {
  const config = sizeConfig[size];

  return (
    <TouchableOpacity
      className={`absolute items-center justify-center rounded-full ${className}`}
      style={[
        {
          ...positionConfig[position],
          width: config.button,
          height: config.button,
          backgroundColor: backgroundColor,
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
      <Icon name={icon} size={config.icon} color={color} />
    </TouchableOpacity>
  );
};

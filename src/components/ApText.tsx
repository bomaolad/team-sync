import React from 'react';
import { Text, TextProps } from 'react-native';

interface ApTextProps extends TextProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
  color?: string;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  className?: string;
}

import { useAppTheme } from '../hooks/useAppTheme';

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  xxl: 'text-2xl',
  xxxl: 'text-3xl',
};

const weightClasses = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export const ApText: React.FC<ApTextProps> = ({
  children,
  size = 'md',
  color,
  weight = 'normal',
  align = 'left',
  numberOfLines,
  className = '',
  style,
  ...props
}) => {
  const { colors } = useAppTheme();
  const resolvedColor = color || colors.text.primary;

  return (
    <Text
      numberOfLines={numberOfLines}
      className={`${sizeClasses[size]} ${weightClasses[weight]} ${alignClasses[align]} ${className}`}
      style={[{ color: resolvedColor }, style]}
      {...props}
    >
      {children}
    </Text>
  );
};

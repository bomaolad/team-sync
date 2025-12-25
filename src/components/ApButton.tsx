import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  View,
} from 'react-native';
import { ApText } from './ApText';

interface ApButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
}

const COLORS = {
  primary: '#2563EB',
  secondary: '#64748B',
  danger: '#EF4444',
  white: '#FFFFFF',
};

const sizeClasses = {
  sm: 'h-9 px-3',
  md: 'h-12 px-4',
  lg: 'h-14 px-5',
};

const variantConfig = {
  primary: {
    bgColor: COLORS.primary,
    borderColor: COLORS.primary,
    textColor: COLORS.white,
    hasBorder: false,
  },
  secondary: {
    bgColor: COLORS.secondary,
    borderColor: COLORS.secondary,
    textColor: COLORS.white,
    hasBorder: false,
  },
  outline: {
    bgColor: 'transparent',
    borderColor: COLORS.primary,
    textColor: COLORS.primary,
    hasBorder: true,
  },
  ghost: {
    bgColor: 'transparent',
    borderColor: 'transparent',
    textColor: COLORS.primary,
    hasBorder: false,
  },
  danger: {
    bgColor: COLORS.danger,
    borderColor: COLORS.danger,
    textColor: COLORS.white,
    hasBorder: false,
  },
};

export const ApButton: React.FC<ApButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  className = '',
  ...props
}) => {
  const config = variantConfig[variant];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      disabled={isDisabled}
      className={`flex-row items-center justify-center rounded-lg ${
        sizeClasses[size]
      } ${fullWidth ? 'w-full' : ''} ${className}`}
      style={[
        {
          backgroundColor: config.bgColor,
          borderColor: config.borderColor,
          borderWidth: config.hasBorder ? 1.5 : 0,
          opacity: isDisabled ? 0.6 : 1,
        },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={config.textColor} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <View className="mr-2">{icon}</View>
          )}
          <ApText
            weight="semibold"
            size={size === 'sm' ? 'sm' : 'md'}
            color={config.textColor}
          >
            {title}
          </ApText>
          {icon && iconPosition === 'right' && (
            <View className="ml-2">{icon}</View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

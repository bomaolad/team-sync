import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  View,
} from 'react-native';
import { ApTheme } from './ApTheme';
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
  ...props
}) => {
  const sizeStyles = {
    sm: { height: 36, paddingHorizontal: 12 },
    md: { height: 48, paddingHorizontal: 16 },
    lg: { height: 56, paddingHorizontal: 20 },
  };

  const variantStyles = {
    primary: {
      backgroundColor: ApTheme.Color.primary,
      borderColor: ApTheme.Color.primary,
      textColor: ApTheme.Color.white,
    },
    secondary: {
      backgroundColor: ApTheme.Color.secondary,
      borderColor: ApTheme.Color.secondary,
      textColor: ApTheme.Color.white,
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: ApTheme.Color.primary,
      textColor: ApTheme.Color.primary,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      textColor: ApTheme.Color.primary,
    },
    danger: {
      backgroundColor: ApTheme.Color.danger,
      borderColor: ApTheme.Color.danger,
      textColor: ApTheme.Color.white,
    },
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      disabled={isDisabled}
      style={[
        {
          height: currentSize.height,
          paddingHorizontal: currentSize.paddingHorizontal,
          backgroundColor: currentVariant.backgroundColor,
          borderColor: currentVariant.borderColor,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          borderRadius: ApTheme.BorderRadius.md,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isDisabled ? 0.6 : 1,
          width: fullWidth ? '100%' : undefined,
        },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={currentVariant.textColor} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <View style={{ marginRight: ApTheme.Spacing.sm }}>{icon}</View>
          )}
          <ApText
            weight="semibold"
            size={size === 'sm' ? 'sm' : 'md'}
            color={currentVariant.textColor}
          >
            {title}
          </ApText>
          {icon && iconPosition === 'right' && (
            <View style={{ marginLeft: ApTheme.Spacing.sm }}>{icon}</View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

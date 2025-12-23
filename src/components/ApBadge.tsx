import React from 'react';
import { View, ViewProps } from 'react-native';
import { ApTheme } from './ApTheme';
import { ApText } from './ApText';

type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';
type StatusBadge = 'todo' | 'inProgress' | 'underReview' | 'recheck' | 'done';
type PriorityBadge = 'low' | 'medium' | 'high';

interface ApBadgeProps extends ViewProps {
  label: string;
  variant?: BadgeVariant;
  status?: StatusBadge;
  priority?: PriorityBadge;
  size?: 'sm' | 'md';
  className?: string;
}

export const ApBadge: React.FC<ApBadgeProps> = ({
  label,
  variant = 'default',
  status,
  priority,
  size = 'sm',
  style,
  ...props
}) => {
  const getBackgroundColor = () => {
    if (status) {
      return ApTheme.Color.status[status];
    }
    if (priority) {
      return ApTheme.Color.priority[priority];
    }
    const variantColors = {
      default: ApTheme.Color.secondary,
      primary: ApTheme.Color.primary,
      success: ApTheme.Color.success,
      warning: ApTheme.Color.warning,
      danger: ApTheme.Color.danger,
      info: ApTheme.Color.info,
    };
    return variantColors[variant];
  };

  const sizeStyles = {
    sm: { paddingHorizontal: 8, paddingVertical: 4 },
    md: { paddingHorizontal: 12, paddingVertical: 6 },
  };

  return (
    <View
      style={[
        {
          backgroundColor: getBackgroundColor(),
          borderRadius: ApTheme.BorderRadius.full,
          ...sizeStyles[size],
          alignSelf: 'flex-start',
        },
        style,
      ]}
      {...props}
    >
      <ApText
        size={size === 'sm' ? 'xs' : 'sm'}
        weight="medium"
        color={ApTheme.Color.white}
      >
        {label}
      </ApText>
    </View>
  );
};

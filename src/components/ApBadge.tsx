import React from 'react';
import { View, ViewProps } from 'react-native';
import { ApText } from './ApText';
import { ApTheme } from './ApTheme';

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

const VARIANT_COLORS = {
  default: ApTheme.Color.secondary,
  primary: ApTheme.Color.primary,
  success: ApTheme.Color.success,
  warning: ApTheme.Color.warning,
  danger: ApTheme.Color.danger,
  info: ApTheme.Color.info,
};

const sizeClasses = {
  sm: 'px-2 py-1',
  md: 'px-3 py-1.5',
};

export const ApBadge: React.FC<ApBadgeProps> = ({
  label,
  variant = 'default',
  status,
  priority,
  size = 'sm',
  style,
  className = '',
  ...props
}) => {
  const getBackgroundColor = () => {
    if (status) {
      return ApTheme.Color.status[status];
    }
    if (priority) {
      return ApTheme.Color.priority[priority];
    }
    return VARIANT_COLORS[variant];
  };

  return (
    <View
      className={`rounded-full self-start ${sizeClasses[size]} ${className}`}
      style={[{ backgroundColor: getBackgroundColor() }, style]}
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

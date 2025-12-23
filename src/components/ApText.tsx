import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { ApTheme } from './ApTheme';

interface ApTextProps extends TextProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
  color?: string;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  className?: string;
}

import { useAppTheme } from '../hooks/useAppTheme';

export const ApText: React.FC<ApTextProps> = ({
  children,
  size = 'md',
  color,
  weight = 'normal',
  align = 'left',
  numberOfLines,
  className,
  style,
  ...props
}) => {
  const { colors } = useAppTheme();
  const resolvedColor = color || colors.text.primary;

  const fontSizeMap = {
    xs: ApTheme.FontSize.xs,
    sm: ApTheme.FontSize.sm,
    md: ApTheme.FontSize.md,
    lg: ApTheme.FontSize.lg,
    xl: ApTheme.FontSize.xl,
    xxl: ApTheme.FontSize.xxl,
    xxxl: ApTheme.FontSize.xxxl,
  };

  const fontWeightMap = {
    normal: ApTheme.FontWeight.normal,
    medium: ApTheme.FontWeight.medium,
    semibold: ApTheme.FontWeight.semibold,
    bold: ApTheme.FontWeight.bold,
  };

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        {
          fontSize: fontSizeMap[size],
          color: resolvedColor,
          fontWeight: fontWeightMap[weight],
          textAlign: align,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

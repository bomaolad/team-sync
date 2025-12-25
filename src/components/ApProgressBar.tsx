import React from 'react';
import { View, ViewProps } from 'react-native';
import { ApText } from './ApText';
import Svg, { Circle } from 'react-native-svg';
import { useAppTheme } from '../hooks/useAppTheme';
import { ApTheme } from './ApTheme';

interface ApProgressBarProps extends ViewProps {
  progress: number;
  variant?: 'linear' | 'circular';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showLabel?: boolean;
  className?: string;
}

const circularSizeConfig = {
  sm: { size: 40, stroke: 4 },
  md: { size: 56, stroke: 5 },
  lg: { size: 80, stroke: 6 },
};

const linearHeightConfig = {
  sm: 4,
  md: 6,
  lg: 8,
};

export const ApProgressBar: React.FC<ApProgressBarProps> = ({
  progress,
  variant = 'linear',
  size = 'md',
  color = ApTheme.Color.primary,
  showLabel = false,
  style,
  className = '',
  ...props
}) => {
  const { colors } = useAppTheme();
  const clampedProgress = Math.min(100, Math.max(0, progress));

  if (variant === 'circular') {
    const config = circularSizeConfig[size];
    const circleSize = config.size;
    const strokeWidth = config.stroke;
    const radius = (circleSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset =
      circumference - (clampedProgress / 100) * circumference;

    return (
      <View
        className={`relative ${className}`}
        style={[{ width: circleSize, height: circleSize }, style]}
        {...props}
      >
        <Svg width={circleSize} height={circleSize}>
          <Circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            stroke={colors.border}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${circleSize / 2} ${circleSize / 2})`}
          />
        </Svg>
        {showLabel && (
          <View className="absolute inset-0 items-center justify-center">
            <ApText size="xs" weight="semibold" color={colors.text.primary}>
              {Math.round(clampedProgress)}%
            </ApText>
          </View>
        )}
      </View>
    );
  }

  const barHeight = linearHeightConfig[size];

  return (
    <View className={className} style={style} {...props}>
      <View
        className="overflow-hidden"
        style={{
          height: barHeight,
          backgroundColor: colors.border,
          borderRadius: barHeight / 2,
        }}
      >
        <View
          className="h-full"
          style={{
            width: `${clampedProgress}%`,
            backgroundColor: color,
            borderRadius: barHeight / 2,
          }}
        />
      </View>
      {showLabel && (
        <ApText size="xs" color={colors.text.secondary} className="mt-1">
          {Math.round(clampedProgress)}%
        </ApText>
      )}
    </View>
  );
};

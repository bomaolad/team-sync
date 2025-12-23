import React from 'react';
import { View, ViewProps } from 'react-native';
import { ApTheme } from './ApTheme';
import { ApText } from './ApText';
import Svg, { Circle } from 'react-native-svg';

interface ApProgressBarProps extends ViewProps {
  progress: number; // 0 to 100
  variant?: 'linear' | 'circular';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showLabel?: boolean;
  className?: string;
}

export const ApProgressBar: React.FC<ApProgressBarProps> = ({
  progress,
  variant = 'linear',
  size = 'md',
  color = ApTheme.Color.primary,
  showLabel = false,
  style,
  ...props
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  if (variant === 'circular') {
    const sizeMap = { sm: 40, md: 56, lg: 80 };
    const strokeMap = { sm: 4, md: 5, lg: 6 };
    const circleSize = sizeMap[size];
    const strokeWidth = strokeMap[size];
    const radius = (circleSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset =
      circumference - (clampedProgress / 100) * circumference;

    return (
      <View
        style={[
          { width: circleSize, height: circleSize, position: 'relative' },
          style,
        ]}
        {...props}
      >
        <Svg width={circleSize} height={circleSize}>
          <Circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            stroke={ApTheme.Color.border.light}
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
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ApText
              size="xs"
              weight="semibold"
              color={ApTheme.Color.text.primary}
            >
              {Math.round(clampedProgress)}%
            </ApText>
          </View>
        )}
      </View>
    );
  }

  const heightMap = { sm: 4, md: 6, lg: 8 };
  const barHeight = heightMap[size];

  return (
    <View style={style} {...props}>
      <View
        style={{
          height: barHeight,
          backgroundColor: ApTheme.Color.border.light,
          borderRadius: barHeight / 2,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            height: '100%',
            width: `${clampedProgress}%`,
            backgroundColor: color,
            borderRadius: barHeight / 2,
          }}
        />
      </View>
      {showLabel && (
        <ApText
          size="xs"
          color={ApTheme.Color.text.secondary}
          style={{ marginTop: ApTheme.Spacing.xs }}
        >
          {Math.round(clampedProgress)}%
        </ApText>
      )}
    </View>
  );
};

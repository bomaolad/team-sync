import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { ApText } from './ApText';
import { ApTheme } from './ApTheme';

interface ApAvatarProps extends TouchableOpacityProps {
  source?: string | null;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onPress?: () => void;
  className?: string;
}

const sizeConfig = {
  xs: { dimension: 24, fontSize: 'xs' as const },
  sm: { dimension: 32, fontSize: 'xs' as const },
  md: { dimension: 40, fontSize: 'sm' as const },
  lg: { dimension: 56, fontSize: 'lg' as const },
  xl: { dimension: 80, fontSize: 'xl' as const },
};

export const ApAvatar: React.FC<ApAvatarProps> = ({
  source,
  name,
  size = 'md',
  onPress,
  style,
  className = '',
  ...props
}) => {
  const config = sizeConfig[size];

  const getInitials = (fullName: string) => {
    const names = fullName.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const avatarContent = source ? (
    <Image
      source={{ uri: source }}
      className="rounded-full"
      style={{
        width: config.dimension,
        height: config.dimension,
      }}
    />
  ) : (
    <View
      className="items-center justify-center rounded-full"
      style={{
        width: config.dimension,
        height: config.dimension,
        backgroundColor: ApTheme.Color.primary,
      }}
    >
      <ApText
        size={config.fontSize}
        weight="semibold"
        color={ApTheme.Color.white}
      >
        {name ? getInitials(name) : '?'}
      </ApText>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        className={className}
        style={style}
        {...props}
      >
        {avatarContent}
      </TouchableOpacity>
    );
  }

  return (
    <View className={className} style={style} {...props}>
      {avatarContent}
    </View>
  );
};

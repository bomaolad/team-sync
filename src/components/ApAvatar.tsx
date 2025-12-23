import React from 'react';
import { View, Image, TouchableOpacity, ViewProps } from 'react-native';
import { ApTheme } from './ApTheme';
import { ApText } from './ApText';

interface ApAvatarProps extends ViewProps {
  source?: string | null;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onPress?: () => void;
  className?: string;
}

export const ApAvatar: React.FC<ApAvatarProps> = ({
  source,
  name,
  size = 'md',
  onPress,
  style,
  ...props
}) => {
  const sizeMap = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
  };

  const fontSizeMap = {
    xs: 'xs' as const,
    sm: 'xs' as const,
    md: 'sm' as const,
    lg: 'lg' as const,
    xl: 'xl' as const,
  };

  const avatarSize = sizeMap[size];

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
      style={{
        width: avatarSize,
        height: avatarSize,
        borderRadius: avatarSize / 2,
      }}
    />
  ) : (
    <View
      style={{
        width: avatarSize,
        height: avatarSize,
        borderRadius: avatarSize / 2,
        backgroundColor: ApTheme.Color.primary,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ApText
        size={fontSizeMap[size]}
        weight="semibold"
        color={ApTheme.Color.white}
      >
        {name ? getInitials(name) : '?'}
      </ApText>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={style} {...props}>
        {avatarContent}
      </TouchableOpacity>
    );
  }

  return (
    <View style={style} {...props}>
      {avatarContent}
    </View>
  );
};

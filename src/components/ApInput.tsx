import React, { useState } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  TouchableOpacity,
} from 'react-native';
import { ApText } from './ApText';
import Icon from '@expo/vector-icons/Feather';
import { useAppTheme } from '../hooks/useAppTheme';
import { ApTheme } from './ApTheme';

type IconName = React.ComponentProps<typeof Icon>['name'];

interface ApInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
  onRightIconPress?: () => void;
  containerClassName?: string;
  className?: string;
}

export const ApInput: React.FC<ApInputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry,
  style,
  className = '',
  ...props
}) => {
  const { colors } = useAppTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = secureTextEntry !== undefined;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View className="mb-4">
      {label && (
        <ApText
          size="sm"
          weight="medium"
          color={colors.text.secondary}
          className="mb-1"
        >
          {label}
        </ApText>
      )}
      <View
        className="flex-row items-center rounded-lg px-4 h-12"
        style={{
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: error ? ApTheme.Color.danger : colors.border,
        }}
      >
        {leftIcon && (
          <Icon
            name={leftIcon}
            size={20}
            color={colors.text.muted}
            style={{ marginRight: 8 }}
          />
        )}
        <TextInput
          placeholderTextColor={colors.text.muted}
          secureTextEntry={isPassword ? !isPasswordVisible : false}
          className={`flex-1 text-base py-0 ${className}`}
          style={[{ color: colors.text.primary }, style]}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Icon
              name={isPasswordVisible ? 'eye' : 'eye-off'}
              size={20}
              color={ApTheme.Color.text.muted}
            />
          </TouchableOpacity>
        )}
        {rightIcon && !isPassword && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            <Icon
              name={rightIcon}
              size={20}
              color={ApTheme.Color.text.muted}
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <ApText size="xs" color={ApTheme.Color.danger} className="mt-1">
          {error}
        </ApText>
      )}
    </View>
  );
};

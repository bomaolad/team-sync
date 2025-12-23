import React, { useState } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  TouchableOpacity,
} from 'react-native';
import { ApTheme } from './ApTheme';
import { ApText } from './ApText';
import Icon from 'react-native-vector-icons/Feather';

interface ApInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
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
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = secureTextEntry !== undefined;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={{ marginBottom: ApTheme.Spacing.md }}>
      {label && (
        <ApText
          size="sm"
          weight="medium"
          color={ApTheme.Color.text.secondary}
          style={{ marginBottom: ApTheme.Spacing.xs }}
        >
          {label}
        </ApText>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: ApTheme.Color.surface.light,
          borderWidth: 1,
          borderColor: error
            ? ApTheme.Color.danger
            : ApTheme.Color.border.light,
          borderRadius: ApTheme.BorderRadius.md,
          paddingHorizontal: ApTheme.Spacing.md,
          height: 48,
        }}
      >
        {leftIcon && (
          <Icon
            name={leftIcon}
            size={20}
            color={ApTheme.Color.text.muted}
            style={{ marginRight: ApTheme.Spacing.sm }}
          />
        )}
        <TextInput
          placeholderTextColor={ApTheme.Color.text.muted}
          secureTextEntry={isPassword ? !isPasswordVisible : false}
          style={[
            {
              flex: 1,
              fontSize: ApTheme.FontSize.md,
              color: ApTheme.Color.text.primary,
              paddingVertical: 0,
            },
            style,
          ]}
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
              style={{ marginLeft: ApTheme.Spacing.sm }}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <ApText
          size="xs"
          color={ApTheme.Color.danger}
          style={{ marginTop: ApTheme.Spacing.xs }}
        >
          {error}
        </ApText>
      )}
    </View>
  );
};

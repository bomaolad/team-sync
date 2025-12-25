import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  ApTheme,
  ApText,
  ApScreen,
  ApScrollView,
  ApButton,
  ApInput,
} from '../../components';
import Icon from '@expo/vector-icons/Feather';
import { useAppTheme } from '../../hooks/useAppTheme';

interface ForgotPasswordScreenProps {
  navigation: any;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const { colors } = useAppTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSendResetLink = () => {
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <ApScreen>
        <View className="flex-1 items-center justify-center">
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-6"
            style={{ backgroundColor: ApTheme.Color.success + '20' }}
          >
            <Icon name="check" size={40} color={ApTheme.Color.success} />
          </View>

          <ApText
            size="xl"
            weight="bold"
            color={colors.text.primary}
            align="center"
          >
            Check Your Email
          </ApText>

          <ApText
            size="md"
            color={colors.text.secondary}
            align="center"
            className="mt-2 px-5"
          >
            We've sent a password reset link to {email}
          </ApText>

          <ApButton
            title="Back to Login"
            onPress={() => navigation.navigate('Login')}
            className="mt-8 w-[200px]"
          />
        </View>
      </ApScreen>
    );
  }

  return (
    <ApScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ApScrollView>
          <View className="pt-10 pb-10">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mb-6"
            >
              <Icon name="arrow-left" size={24} color={colors.text.primary} />
            </TouchableOpacity>

            <View
              className="w-16 h-16 rounded-full items-center justify-center mb-6"
              style={{ backgroundColor: ApTheme.Color.primary + '15' }}
            >
              <Icon name="key" size={28} color={ApTheme.Color.primary} />
            </View>

            <ApText size="xxl" weight="bold" color={colors.text.primary}>
              Forgot Password?
            </ApText>

            <ApText
              size="md"
              color={colors.text.secondary}
              className="mt-1 mb-8"
            >
              Enter your email address and we'll send you a link to reset your
              password.
            </ApText>

            <ApInput
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={text => {
                setEmail(text);
                setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail"
              error={error}
            />

            <ApButton
              title="Send Reset Link"
              onPress={handleSendResetLink}
              loading={loading}
              fullWidth
              className="mt-4"
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              className="self-center mt-8"
            >
              <ApText size="md" weight="medium" color={ApTheme.Color.primary}>
                Back to Login
              </ApText>
            </TouchableOpacity>
          </View>
        </ApScrollView>
      </KeyboardAvoidingView>
    </ApScreen>
  );
};

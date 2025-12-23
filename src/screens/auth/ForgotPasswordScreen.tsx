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

interface ForgotPasswordScreenProps {
  navigation: any;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
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
      <ApScreen backgroundColor={ApTheme.Color.background.light}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: ApTheme.Color.success + '20',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: ApTheme.Spacing.lg,
            }}
          >
            <Icon name="check" size={40} color={ApTheme.Color.success} />
          </View>

          <ApText
            size="xl"
            weight="bold"
            color={ApTheme.Color.text.primary}
            align="center"
          >
            Check Your Email
          </ApText>

          <ApText
            size="md"
            color={ApTheme.Color.text.secondary}
            align="center"
            style={{ marginTop: ApTheme.Spacing.sm, paddingHorizontal: 20 }}
          >
            We've sent a password reset link to {email}
          </ApText>

          <ApButton
            title="Back to Login"
            onPress={() => navigation.navigate('Login')}
            style={{ marginTop: ApTheme.Spacing.xl, width: 200 }}
          />
        </View>
      </ApScreen>
    );
  }

  return (
    <ApScreen backgroundColor={ApTheme.Color.background.light}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ApScrollView>
          <View style={{ paddingTop: 40, paddingBottom: 40 }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginBottom: ApTheme.Spacing.lg }}
            >
              <Icon
                name="arrow-left"
                size={24}
                color={ApTheme.Color.text.primary}
              />
            </TouchableOpacity>

            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: ApTheme.Color.primary + '15',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: ApTheme.Spacing.lg,
              }}
            >
              <Icon name="key" size={28} color={ApTheme.Color.primary} />
            </View>

            <ApText size="xxl" weight="bold" color={ApTheme.Color.text.primary}>
              Forgot Password?
            </ApText>

            <ApText
              size="md"
              color={ApTheme.Color.text.secondary}
              style={{
                marginTop: ApTheme.Spacing.xs,
                marginBottom: ApTheme.Spacing.xl,
              }}
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
              style={{ marginTop: ApTheme.Spacing.md }}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={{ alignSelf: 'center', marginTop: ApTheme.Spacing.xl }}
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

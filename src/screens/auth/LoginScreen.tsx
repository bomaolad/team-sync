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

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (!validateForm()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace('Main');
    }, 1500);
  };

  const handleGoogleLogin = () => {
    // Google login will be implemented with backend
  };

  return (
    <ApScreen backgroundColor={ApTheme.Color.background.light}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ApScrollView>
          <View style={{ paddingTop: 60, paddingBottom: 40 }}>
            <View style={{ alignItems: 'center', marginBottom: 48 }}>
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 18,
                  backgroundColor: ApTheme.Color.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: ApTheme.Spacing.md,
                }}
              >
                <ApText size="xl" weight="bold" color={ApTheme.Color.white}>
                  TS
                </ApText>
              </View>

              <ApText
                size="xxl"
                weight="bold"
                color={ApTheme.Color.text.primary}
              >
                Welcome Back
              </ApText>

              <ApText
                size="md"
                color={ApTheme.Color.text.secondary}
                style={{ marginTop: ApTheme.Spacing.xs }}
              >
                Sign in to continue to TeamSync
              </ApText>
            </View>

            <ApInput
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail"
              error={errors.email}
            />

            <ApInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon="lock"
              error={errors.password}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={{
                alignSelf: 'flex-end',
                marginBottom: ApTheme.Spacing.lg,
              }}
            >
              <ApText size="sm" weight="medium" color={ApTheme.Color.primary}>
                Forgot Password?
              </ApText>
            </TouchableOpacity>

            <ApButton
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              fullWidth
              style={{ marginBottom: ApTheme.Spacing.md }}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: ApTheme.Spacing.lg,
              }}
            >
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: ApTheme.Color.border.light,
                }}
              />
              <ApText
                size="sm"
                color={ApTheme.Color.text.muted}
                style={{ marginHorizontal: ApTheme.Spacing.md }}
              >
                OR
              </ApText>
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: ApTheme.Color.border.light,
                }}
              />
            </View>

            <ApButton
              title="Continue with Google"
              variant="outline"
              onPress={handleGoogleLogin}
              fullWidth
              icon={
                <Icon name="chrome" size={20} color={ApTheme.Color.primary} />
              }
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: ApTheme.Spacing.xl,
              }}
            >
              <ApText size="md" color={ApTheme.Color.text.secondary}>
                Don't have an account?{' '}
              </ApText>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <ApText
                  size="md"
                  weight="semibold"
                  color={ApTheme.Color.primary}
                >
                  Sign Up
                </ApText>
              </TouchableOpacity>
            </View>
          </View>
        </ApScrollView>
      </KeyboardAvoidingView>
    </ApScreen>
  );
};

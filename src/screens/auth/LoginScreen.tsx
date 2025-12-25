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

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { colors } = useAppTheme();
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

  const handleGoogleLogin = () => {};

  return (
    <ApScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ApScrollView>
          <View className="pt-16 pb-10">
            <View className="items-center mb-12">
              <View
                className="w-[72px] h-[72px] rounded-2xl items-center justify-center mb-4"
                style={{ backgroundColor: ApTheme.Color.primary }}
              >
                <ApText size="xl" weight="bold" color={ApTheme.Color.white}>
                  TS
                </ApText>
              </View>

              <ApText size="xxl" weight="bold" color={colors.text.primary}>
                Welcome Back
              </ApText>

              <ApText size="md" color={colors.text.secondary} className="mt-1">
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
              className="self-end mb-6"
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
              className="mb-4"
            />

            <View className="flex-row items-center my-6">
              <View
                className="flex-1 h-px"
                style={{ backgroundColor: colors.border }}
              />
              <ApText size="sm" color={colors.text.muted} className="mx-4">
                OR
              </ApText>
              <View
                className="flex-1 h-px"
                style={{ backgroundColor: colors.border }}
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

            <View className="flex-row justify-center mt-8">
              <ApText size="md" color={colors.text.secondary}>
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

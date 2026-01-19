import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import {
  ApTheme,
  ApText,
  ApScreen,
  ApScrollView,
  ApButton,
  ApInput,
} from '@/src/components';
import Icon from '@expo/vector-icons/Feather';
import { useAppTheme, useLogin, useRegister } from '@/src/hooks';

export const LoginScreen = () => {
  const { colors } = useAppTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const loginMutation = useLogin();

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

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          router.replace('/(tabs)');
        },
        onError: (error: any) => {
          const message =
            error.response?.data?.message || 'Login failed. Please try again.';
          Alert.alert('Login Failed', message);
        },
      },
    );
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
              onPress={() => router.push('/forgot-password')}
              className="self-end mb-6"
            >
              <ApText size="sm" weight="medium" color={ApTheme.Color.primary}>
                Forgot Password?
              </ApText>
            </TouchableOpacity>

            <ApButton
              title="Sign In"
              onPress={handleLogin}
              loading={loginMutation.isPending}
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
              <TouchableOpacity onPress={() => router.push('/signup')}>
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

export const SignUpScreen = () => {
  const { colors } = useAppTheme();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    jobTitle: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreeTerms, setAgreeTerms] = useState(false);

  const registerMutation = useRegister();

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = () => {
    if (!validateForm()) return;

    registerMutation.mutate(
      {
        name: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      },
      {
        onSuccess: () => {
          router.replace('/(tabs)');
        },
        onError: (error: any) => {
          const message =
            error.response?.data?.message ||
            'Registration failed. Please try again.';
          Alert.alert('Registration Failed', message);
        },
      },
    );
  };

  return (
    <ApScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ApScrollView>
          <View className="pt-10 pb-10">
            <TouchableOpacity onPress={() => router.back()} className="mb-6">
              <Icon name="arrow-left" size={24} color={colors.text.primary} />
            </TouchableOpacity>

            <ApText size="xxl" weight="bold" color={colors.text.primary}>
              Create Account
            </ApText>

            <ApText
              size="md"
              color={colors.text.secondary}
              className="mt-1 mb-8"
            >
              Sign up to get started with TeamSync
            </ApText>

            <ApInput
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChangeText={text => updateField('fullName', text)}
              leftIcon="user"
              error={errors.fullName}
            />

            <ApInput
              label="Username"
              placeholder="Choose a username"
              value={formData.username}
              onChangeText={text => updateField('username', text)}
              autoCapitalize="none"
              leftIcon="at-sign"
              error={errors.username}
            />

            <ApInput
              label="Email Address"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={text => updateField('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail"
              error={errors.email}
            />

            <ApInput
              label="Job Title (Optional)"
              placeholder="e.g. Frontend Developer"
              value={formData.jobTitle}
              onChangeText={text => updateField('jobTitle', text)}
              leftIcon="briefcase"
              error={errors.jobTitle}
            />

            <ApInput
              label="Password"
              placeholder="Create a password"
              value={formData.password}
              onChangeText={text => updateField('password', text)}
              secureTextEntry
              leftIcon="lock"
              error={errors.password}
            />

            <ApInput
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={text => updateField('confirmPassword', text)}
              secureTextEntry
              leftIcon="lock"
              error={errors.confirmPassword}
            />

            <TouchableOpacity
              onPress={() => setAgreeTerms(!agreeTerms)}
              className="flex-row items-center mb-6"
            >
              <View
                className="w-[22px] h-[22px] rounded-md items-center justify-center mr-2"
                style={{
                  borderWidth: 2,
                  borderColor: errors.terms
                    ? ApTheme.Color.danger
                    : agreeTerms
                    ? ApTheme.Color.primary
                    : ApTheme.Color.border.light,
                  backgroundColor: agreeTerms
                    ? ApTheme.Color.primary
                    : ApTheme.Color.transparent,
                }}
              >
                {agreeTerms && (
                  <Icon name="check" size={14} color={ApTheme.Color.white} />
                )}
              </View>
              <ApText size="sm" color={colors.text.secondary}>
                I agree to the{' '}
                <ApText
                  size="sm"
                  weight="semibold"
                  color={ApTheme.Color.primary}
                >
                  Terms of Service
                </ApText>{' '}
                and{' '}
                <ApText
                  size="sm"
                  weight="semibold"
                  color={ApTheme.Color.primary}
                >
                  Privacy Policy
                </ApText>
              </ApText>
            </TouchableOpacity>

            {errors.terms && (
              <ApText
                size="xs"
                color={ApTheme.Color.danger}
                className="-mt-2 mb-4"
              >
                {errors.terms}
              </ApText>
            )}

            <ApButton
              title="Create Account"
              onPress={handleSignUp}
              loading={registerMutation.isPending}
              fullWidth
            />

            <View className="flex-row justify-center mt-8">
              <ApText size="md" color={colors.text.secondary}>
                Already have an account?{' '}
              </ApText>
              <TouchableOpacity onPress={() => router.push('/signin')}>
                <ApText
                  size="md"
                  weight="semibold"
                  color={ApTheme.Color.primary}
                >
                  Sign In
                </ApText>
              </TouchableOpacity>
            </View>
          </View>
        </ApScrollView>
      </KeyboardAvoidingView>
    </ApScreen>
  );
};

export const ForgotPasswordScreen = () => {
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
            onPress={() => router.push('/signin')}
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
            <TouchableOpacity onPress={() => router.back()} className="mb-6">
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
              onPress={() => router.push('/signin')}
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

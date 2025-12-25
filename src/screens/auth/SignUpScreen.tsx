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

interface SignUpScreenProps {
  navigation: any;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const { colors } = useAppTheme();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    jobTitle: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreeTerms, setAgreeTerms] = useState(false);

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

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
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

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('VerifyEmail', { email: formData.email });
    }, 1500);
  };

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
              label="Job Title"
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
              loading={loading}
              fullWidth
            />

            <View className="flex-row justify-center mt-8">
              <ApText size="md" color={colors.text.secondary}>
                Already have an account?{' '}
              </ApText>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
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

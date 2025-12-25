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
  ApAvatar,
} from '../../components';
import Icon from '@expo/vector-icons/Feather';
import { useAppTheme } from '../../hooks/useAppTheme';

interface CreateProfileScreenProps {
  navigation: any;
}

export const CreateProfileScreen: React.FC<CreateProfileScreenProps> = ({
  navigation,
}) => {
  const { colors } = useAppTheme();
  const [formData, setFormData] = useState({
    fullName: '',
    jobTitle: '',
    avatar: null as string | null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSelectAvatar = () => {};

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateProfile = () => {
    if (!validateForm()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace('Main');
    }, 1500);
  };

  const handleSkip = () => {
    navigation.replace('Main');
  };

  return (
    <ApScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ApScrollView>
          <View className="pt-10 pb-10">
            <View className="flex-row justify-between items-center mb-8">
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={24} color={colors.text.primary} />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSkip}>
                <ApText size="md" weight="medium" color={ApTheme.Color.primary}>
                  Skip
                </ApText>
              </TouchableOpacity>
            </View>

            <ApText size="xxl" weight="bold" color={colors.text.primary}>
              Set Up Your Profile
            </ApText>

            <ApText
              size="md"
              color={colors.text.secondary}
              className="mt-1 mb-8"
            >
              Let your team know who you are
            </ApText>

            <View className="items-center mb-8">
              <TouchableOpacity onPress={handleSelectAvatar}>
                <View className="relative">
                  <ApAvatar
                    source={formData.avatar}
                    name={formData.fullName || 'User'}
                    size="xl"
                  />
                  <View
                    className="absolute bottom-0 right-0 w-7 h-7 rounded-full items-center justify-center"
                    style={{
                      backgroundColor: ApTheme.Color.primary,
                      borderWidth: 2,
                      borderColor: ApTheme.Color.white,
                    }}
                  >
                    <Icon name="camera" size={14} color={ApTheme.Color.white} />
                  </View>
                </View>
              </TouchableOpacity>
              <ApText size="sm" color={colors.text.secondary} className="mt-2">
                Tap to upload photo
              </ApText>
            </View>

            <ApInput
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChangeText={text => updateField('fullName', text)}
              leftIcon="user"
              error={errors.fullName}
            />

            <ApInput
              label="Job Title"
              placeholder="e.g. Frontend Developer, Designer"
              value={formData.jobTitle}
              onChangeText={text => updateField('jobTitle', text)}
              leftIcon="briefcase"
              error={errors.jobTitle}
            />

            <ApButton
              title="Complete Setup"
              onPress={handleCreateProfile}
              loading={loading}
              fullWidth
              className="mt-6"
            />
          </View>
        </ApScrollView>
      </KeyboardAvoidingView>
    </ApScreen>
  );
};

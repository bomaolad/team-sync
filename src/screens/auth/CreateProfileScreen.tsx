import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
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
import Icon from 'react-native-vector-icons/Feather';

interface CreateProfileScreenProps {
  navigation: any;
}

export const CreateProfileScreen: React.FC<CreateProfileScreenProps> = ({
  navigation,
}) => {
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

  const handleSelectAvatar = () => {
    // Image picker will be implemented - for now just simulate
  };

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
    <ApScreen backgroundColor={ApTheme.Color.background.light}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ApScrollView>
          <View style={{ paddingTop: 40, paddingBottom: 40 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: ApTheme.Spacing.xl,
              }}
            >
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon
                  name="arrow-left"
                  size={24}
                  color={ApTheme.Color.text.primary}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSkip}>
                <ApText size="md" weight="medium" color={ApTheme.Color.primary}>
                  Skip
                </ApText>
              </TouchableOpacity>
            </View>

            <ApText size="xxl" weight="bold" color={ApTheme.Color.text.primary}>
              Set Up Your Profile
            </ApText>

            <ApText
              size="md"
              color={ApTheme.Color.text.secondary}
              style={{
                marginTop: ApTheme.Spacing.xs,
                marginBottom: ApTheme.Spacing.xl,
              }}
            >
              Let your team know who you are
            </ApText>

            <View
              style={{ alignItems: 'center', marginBottom: ApTheme.Spacing.xl }}
            >
              <TouchableOpacity onPress={handleSelectAvatar}>
                <View style={{ position: 'relative' }}>
                  <ApAvatar
                    source={formData.avatar}
                    name={formData.fullName || 'User'}
                    size="xl"
                  />
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: ApTheme.Color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 2,
                      borderColor: ApTheme.Color.white,
                    }}
                  >
                    <Icon name="camera" size={14} color={ApTheme.Color.white} />
                  </View>
                </View>
              </TouchableOpacity>
              <ApText
                size="sm"
                color={ApTheme.Color.text.secondary}
                style={{ marginTop: ApTheme.Spacing.sm }}
              >
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
              style={{ marginTop: ApTheme.Spacing.lg }}
            />
          </View>
        </ApScrollView>
      </KeyboardAvoidingView>
    </ApScreen>
  );
};

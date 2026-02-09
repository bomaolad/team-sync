import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import {
  ApTheme,
  ApText,
  ApScreen,
  ApInput,
  ApButton,
  ApAvatar,
  useToast,
  ApCard,
} from '@/src/components';
import Icon from '@expo/vector-icons/Feather';
import { useAppTheme, useUpdateProfile, useProfile } from '@/src/hooks';

export const EditProfileScreen = () => {
  const { colors } = useAppTheme();
  const { data: userProfile, isLoading: profileLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const { showToast } = useToast();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile) {
      if (userProfile.firstName && userProfile.lastName) {
        setFirstName(userProfile.firstName);
        setLastName(userProfile.lastName);
      } else {
        const [first, ...lastParts] = (userProfile.name || '')
          .trim()
          .split(' ');
        setFirstName(first || '');
        setLastName(lastParts.join(' ') || '');
      }
      setUsername(userProfile.username || '');
      setJobTitle(userProfile.jobTitle || '');
      setAvatar(userProfile.avatar || null);
    }
  }, [userProfile]);

  const handleSubmit = () => {
    if (!firstName.trim()) {
      showToast('First name is required', 'error');
      return;
    }

    if (!lastName.trim()) {
      showToast('Last name is required', 'error');
      return;
    }

    if (!username.trim()) {
      showToast('Username is required', 'error');
      return;
    }

    updateProfileMutation.mutate(
      {
        firstName,
        lastName,
        username,
        jobTitle: jobTitle || null,
        // TODO: Handle avatar upload/selection properly
        // For now we just keep existing avatar if not changed, or update if we had a picker
      },
      {
        onSuccess: () => {
          showToast('Profile updated successfully', 'success');
          router.back();
        },
        onError: (error: any) => {
          const message =
            error.response?.data?.message || 'Failed to update profile';
          showToast(message, 'error');
        },
      },
    );
  };

  const isSaving = updateProfileMutation.isPending;

  return (
    <ApScreen>
      <View className="flex-row items-center justify-between py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-left" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <ApText size="lg" weight="bold">
          Edit Profile
        </ApText>
        <View className="w-6" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="items-center my-6">
          <View className="relative">
            <ApAvatar
              source={avatar}
              name={`${firstName} ${lastName}`.trim() || 'User'}
              size="xl"
            />
            <TouchableOpacity
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full items-center justify-center border-2 border-white"
              style={{ backgroundColor: ApTheme.Color.primary }}
              onPress={() => {
                showToast('Avatar upload not implemented yet', 'info');
              }}
            >
              <Icon name="camera" size={14} color={ApTheme.Color.white} />
            </TouchableOpacity>
          </View>
        </View>

        <ApCard padding="lg">
          <ApInput
            label="First Name"
            placeholder="Enter your first name"
            value={firstName}
            onChangeText={setFirstName}
          />

          <ApInput
            label="Last Name"
            placeholder="Enter your last name"
            value={lastName}
            onChangeText={setLastName}
          />

          <ApInput
            label="Username"
            placeholder="johndoe"
            value={username}
            onChangeText={setUsername}
          />

          <ApInput
            label="Job Title"
            placeholder="e.g. Software Engineer"
            value={jobTitle}
            onChangeText={setJobTitle}
          />

          <View className="mb-4">
            <ApText
              size="sm"
              weight="medium"
              color={colors.text.secondary}
              className="mb-2"
            >
              Email
            </ApText>
            <View className="py-3 px-4 rounded-lg bg-gray-100 border border-gray-200">
              <ApText color={colors.text.muted}>{userProfile?.email}</ApText>
            </View>
            <ApText size="xs" color={colors.text.muted} className="mt-1 ml-1">
              Email cannot be changed
            </ApText>
          </View>

          <ApButton
            title="Save Changes"
            onPress={handleSubmit}
            loading={isSaving}
            className="mt-4"
          />
        </ApCard>
      </ScrollView>
    </ApScreen>
  );
};

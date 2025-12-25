import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from '@expo/vector-icons/Feather';
import {
  ApTheme,
  ApScreen,
  ApText,
  ApInput,
  ApButton,
  ApCard,
} from '../../components';
import { useAppTheme } from '../../hooks/useAppTheme';

interface CreateProjectScreenProps {
  navigation: any;
  route: any;
}

export const CreateProjectScreen: React.FC<CreateProjectScreenProps> = ({
  navigation,
  route,
}) => {
  const { colors } = useAppTheme();
  const projectId = route.params?.projectId;
  const isEditing = !!projectId;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'completed' | 'onHold'>(
    'active',
  );
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setName('Website Redesign');
      setDescription('Redesigning the corporate website with new branding.');
      setStatus('active');
      setDueDate('2026-01-30');
    }
  }, [isEditing]);

  const handleSubmit = () => {
    if (!name || !description) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    setLoading(true);
    new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
      setLoading(false);
      Alert.alert(
        'Success',
        `Project ${isEditing ? 'updated' : 'created'} successfully`,
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    });
  };

  const StatusOption = ({
    value,
    label,
    color,
  }: {
    value: 'active' | 'completed' | 'onHold';
    label: string;
    color: string;
  }) => (
    <TouchableOpacity
      onPress={() => setStatus(value)}
      className="flex-1 py-2 px-4 rounded-lg items-center mx-1"
      style={{
        backgroundColor: status === value ? color : colors.surface,
        borderWidth: 1,
        borderColor: status === value ? color : colors.border,
      }}
    >
      <ApText
        weight="medium"
        color={status === value ? ApTheme.Color.white : colors.text.secondary}
      >
        {label}
      </ApText>
    </TouchableOpacity>
  );

  return (
    <ApScreen>
      <View className="flex-row items-center justify-between py-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <ApText size="lg" weight="bold">
          {isEditing ? 'Edit Project' : 'Create New Project'}
        </ApText>
        <View className="w-6" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ApCard padding="lg" className="mt-4">
          <ApInput
            label="Project Name"
            placeholder="e.g. Website Redesign"
            value={name}
            onChangeText={setName}
          />

          <ApInput
            label="Description"
            placeholder="Project goals and scope..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={{ height: 100, textAlignVertical: 'top' }}
          />

          <ApInput
            label="Due Date"
            placeholder="YYYY-MM-DD"
            value={dueDate}
            onChangeText={setDueDate}
            rightIcon="calendar"
          />

          <View className="mb-6">
            <ApText
              size="sm"
              weight="medium"
              color={colors.text.secondary}
              className="mb-1"
            >
              Status
            </ApText>
            <View className="flex-row -mx-1">
              <StatusOption
                value="active"
                label="Active"
                color={ApTheme.Color.primary}
              />
              <StatusOption
                value="onHold"
                label="On Hold"
                color={ApTheme.Color.warning}
              />
              <StatusOption
                value="completed"
                label="Completed"
                color={ApTheme.Color.success}
              />
            </View>
          </View>

          <ApButton
            title={isEditing ? 'Update Project' : 'Create Project'}
            onPress={handleSubmit}
            loading={loading}
          />
        </ApCard>
      </ScrollView>
    </ApScreen>
  );
};

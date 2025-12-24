import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from '@expo/vector-icons/Feather';
import {
  ApScreen,
  ApText,
  ApInput,
  ApButton,
  ApTheme,
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
      // Mock fetch project details
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
    // Simulate API call
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
      style={{
        flex: 1,
        paddingVertical: ApTheme.Spacing.sm,
        paddingHorizontal: ApTheme.Spacing.md,
        backgroundColor: status === value ? color : colors.surface,
        borderRadius: ApTheme.BorderRadius.md,
        borderWidth: 1,
        borderColor: status === value ? color : colors.border,
        alignItems: 'center',
        marginHorizontal: ApTheme.Spacing.xs,
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
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: ApTheme.Spacing.md,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <ApText size="lg" weight="bold">
          {isEditing ? 'Edit Project' : 'Create New Project'}
        </ApText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ApCard padding="lg" style={{ marginTop: ApTheme.Spacing.md }}>
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

          <View style={{ marginBottom: ApTheme.Spacing.lg }}>
            <ApText
              size="sm"
              weight="medium"
              color={colors.text.secondary}
              style={{ marginBottom: ApTheme.Spacing.xs }}
            >
              Status
            </ApText>
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: -ApTheme.Spacing.xs,
              }}
            >
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

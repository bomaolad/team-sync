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

interface CreateTaskScreenProps {
  navigation: any;
  route: any;
}

export const CreateTaskScreen: React.FC<CreateTaskScreenProps> = ({
  navigation,
  route,
}) => {
  const { colors } = useAppTheme();
  const taskId = route.params?.taskId;
  const isEditing = !!taskId;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      // Mock fetch task details
      setTitle('Fix API Authentication Bug');
      setDescription('Investigate 401 errors on login endpoint');
      setProject('Backend API');
      setDueDate('2025-12-25');
      setPriority('high');
      navigation.setOptions({ headerTitle: 'Edit Task' });
    }
  }, [isEditing, navigation]);

  const handleSubmit = () => {
    if (!title || !project || !dueDate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    // Simulate API call
    new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
      setLoading(false);
      Alert.alert(
        'Success',
        `Task ${isEditing ? 'updated' : 'created'} successfully`,
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    });
  };

  const PriorityOption = ({
    value,
    label,
    color,
  }: {
    value: 'low' | 'medium' | 'high';
    label: string;
    color: string;
  }) => (
    <TouchableOpacity
      onPress={() => setPriority(value)}
      style={{
        flex: 1,
        paddingVertical: ApTheme.Spacing.sm,
        paddingHorizontal: ApTheme.Spacing.md,
        backgroundColor: priority === value ? color : colors.surface,
        borderRadius: ApTheme.BorderRadius.md,
        borderWidth: 1,
        borderColor: priority === value ? color : colors.border,
        alignItems: 'center',
        marginHorizontal: ApTheme.Spacing.xs,
      }}
    >
      <ApText
        weight="medium"
        color={priority === value ? ApTheme.Color.white : colors.text.secondary}
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
          {isEditing ? 'Edit Task' : 'Create New Task'}
        </ApText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ApCard padding="lg" style={{ marginTop: ApTheme.Spacing.md }}>
          <ApInput
            label="Task Title"
            placeholder="e.g. Design Home Page"
            value={title}
            onChangeText={setTitle}
          />

          <ApInput
            label="Description"
            placeholder="Add details..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={{ height: 100, textAlignVertical: 'top' }}
          />

          <ApInput
            label="Project"
            placeholder="Select Project"
            value={project}
            onChangeText={setProject}
            rightIcon="chevron-down"
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
              Priority
            </ApText>
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: -ApTheme.Spacing.xs,
              }}
            >
              <PriorityOption
                value="low"
                label="Low"
                color={ApTheme.Color.priority.low}
              />
              <PriorityOption
                value="medium"
                label="Medium"
                color={ApTheme.Color.priority.medium}
              />
              <PriorityOption
                value="high"
                label="High"
                color={ApTheme.Color.priority.high}
              />
            </View>
          </View>

          <ApButton
            title={isEditing ? 'Update Task' : 'Create Task'}
            onPress={handleSubmit}
            loading={loading}
          />
        </ApCard>
      </ScrollView>
    </ApScreen>
  );
};

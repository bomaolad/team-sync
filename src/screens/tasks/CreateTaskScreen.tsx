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
  }: {
    value: 'low' | 'medium' | 'high';
    label: string;
  }) => (
    <TouchableOpacity
      onPress={() => setPriority(value)}
      className="flex-1 py-2 px-4 rounded-lg items-center mx-1"
      style={{
        backgroundColor:
          priority === value ? ApTheme.Color.priority[value] : colors.surface,
        borderWidth: 1,
        borderColor:
          priority === value ? ApTheme.Color.priority[value] : colors.border,
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
      <View className="flex-row items-center justify-between py-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <ApText size="lg" weight="bold">
          {isEditing ? 'Edit Task' : 'Create New Task'}
        </ApText>
        <View className="w-6" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ApCard padding="lg" className="mt-4">
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

          <View className="mb-6">
            <ApText
              size="sm"
              weight="medium"
              color={colors.text.secondary}
              className="mb-1"
            >
              Priority
            </ApText>
            <View className="flex-row -mx-1">
              <PriorityOption value="low" label="Low" />
              <PriorityOption value="medium" label="Medium" />
              <PriorityOption value="high" label="High" />
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

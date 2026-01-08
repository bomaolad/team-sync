import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from '@expo/vector-icons/Feather';
import {
  ApTheme,
  ApScreen,
  ApText,
  ApInput,
  ApButton,
  ApCard,
} from '../../components';
import {
  useAppTheme,
  useProjects,
  useCreateTask,
  useUpdateTask,
  useTask,
} from '../../hooks';
import { Project, TaskPriority } from '../../types';

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
  const preselectedProjectId = route.params?.projectId;
  const isEditing = !!taskId;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(
    preselectedProjectId || '',
  );
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');

  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: existingTask, isLoading: taskLoading } = useTask(taskId || '');
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();

  useEffect(() => {
    if (isEditing && existingTask) {
      setTitle(existingTask.title);
      setDescription(existingTask.description || '');
      setSelectedProjectId(existingTask.projectId);
      setDueDate(
        existingTask.dueDate ? existingTask.dueDate.split('T')[0] : '',
      );
      setPriority(existingTask.priority);
    }
  }, [isEditing, existingTask]);

  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId && !preselectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, preselectedProjectId]);

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    if (!selectedProjectId) {
      Alert.alert('Error', 'Please select a project');
      return;
    }

    if (isEditing) {
      updateTaskMutation.mutate(
        {
          id: taskId,
          data: {
            title,
            description,
            priority,
            dueDate: dueDate || undefined,
          },
        },
        {
          onSuccess: () => {
            Alert.alert('Success', 'Task updated successfully', [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
          },
          onError: (error: any) => {
            const message =
              error.response?.data?.message || 'Failed to update task';
            Alert.alert('Error', message);
          },
        },
      );
    } else {
      createTaskMutation.mutate(
        {
          title,
          description,
          projectId: selectedProjectId,
          priority,
          dueDate: dueDate || undefined,
        },
        {
          onSuccess: () => {
            Alert.alert('Success', 'Task created successfully', [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
          },
          onError: (error: any) => {
            const message =
              error.response?.data?.message || 'Failed to create task';
            Alert.alert('Error', message);
          },
        },
      );
    }
  };

  const isLoading = projectsLoading || (isEditing && taskLoading);
  const isSaving = createTaskMutation.isPending || updateTaskMutation.isPending;

  const PriorityOption = ({
    value,
    label,
  }: {
    value: TaskPriority;
    label: string;
  }) => (
    <TouchableOpacity
      onPress={() => setPriority(value)}
      className="flex-1 py-2 px-4 rounded-lg items-center mx-1"
      style={{
        backgroundColor:
          priority === value
            ? ApTheme.Color.priority[
                label.toLowerCase() as 'low' | 'medium' | 'high'
              ]
            : colors.surface,
        borderWidth: 1,
        borderColor:
          priority === value
            ? ApTheme.Color.priority[
                label.toLowerCase() as 'low' | 'medium' | 'high'
              ]
            : colors.border,
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

  if (isLoading) {
    return (
      <ApScreen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={ApTheme.Color.primary} />
        </View>
      </ApScreen>
    );
  }

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

          {!isEditing && !preselectedProjectId && (
            <View className="mb-6">
              <ApText
                size="sm"
                weight="medium"
                color={colors.text.secondary}
                className="mb-2"
              >
                Select Project
              </ApText>
              {projects.length === 0 ? (
                <ApText size="sm" color={colors.text.muted}>
                  No projects available. Create a project first.
                </ApText>
              ) : (
                <View className="flex-row flex-wrap -mx-1">
                  {projects.map((p: Project) => (
                    <TouchableOpacity
                      key={p.id}
                      onPress={() => setSelectedProjectId(p.id)}
                      className="py-2 px-4 rounded-lg m-1"
                      style={{
                        backgroundColor:
                          selectedProjectId === p.id
                            ? ApTheme.Color.primary
                            : colors.surface,
                        borderWidth: 1,
                        borderColor:
                          selectedProjectId === p.id
                            ? ApTheme.Color.primary
                            : colors.border,
                      }}
                    >
                      <ApText
                        weight="medium"
                        color={
                          selectedProjectId === p.id
                            ? ApTheme.Color.white
                            : colors.text.secondary
                        }
                      >
                        {p.name}
                      </ApText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}

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
              <PriorityOption value="LOW" label="Low" />
              <PriorityOption value="MEDIUM" label="Medium" />
              <PriorityOption value="HIGH" label="High" />
            </View>
          </View>

          <ApButton
            title={isEditing ? 'Update Task' : 'Create Task'}
            onPress={handleSubmit}
            loading={isSaving}
            disabled={projects.length === 0 && !isEditing}
          />
        </ApCard>
      </ScrollView>
    </ApScreen>
  );
};

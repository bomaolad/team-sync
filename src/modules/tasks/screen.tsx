import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ApTheme,
  ApText,
  ApScreen,
  ApScrollView,
  ApCard,
  ApAvatar,
  ApBadge,
  ApButton,
  ApModal,
  ApInput,
} from '@/src/components';
import Icon from '@expo/vector-icons/Feather';
import {
  useAppTheme,
  useTask,
  useUpdateTaskStatus,
  useComments,
  useCreateComment,
  useSubtasks,
  useUpdateSubtask,
  useCreateSubtask,
  useProjects,
  useCreateTask,
  useUpdateTask,
} from '@/src/hooks';
import {
  TaskStatus as TaskStatusType,
  TaskPriority,
  Comment,
  Subtask,
  Project,
} from '@/src/types';
import {
  statusConfig,
  statusOrder,
  mapPriority,
  formatDate,
  formatTimestamp,
} from './model';

interface TaskDetailScreenProps {
  taskId?: string;
}

export const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({
  taskId,
}) => {
  const { colors } = useAppTheme();

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newSubtask, setNewSubtask] = useState('');

  const { data: task, isLoading: taskLoading } = useTask(taskId || '');
  const { data: comments = [], isLoading: commentsLoading } = useComments(
    taskId || '',
  );
  const { data: subtasks = [], isLoading: subtasksLoading } = useSubtasks(
    taskId || '',
  );

  const updateStatusMutation = useUpdateTaskStatus();
  const createCommentMutation = useCreateComment();
  const updateSubtaskMutation = useUpdateSubtask();
  const createSubtaskMutation = useCreateSubtask();

  const handleStatusChange = (newStatus: TaskStatusType) => {
    if (!taskId) return;
    updateStatusMutation.mutate(
      { id: taskId, data: { status: newStatus } },
      {
        onSuccess: () => {
          setShowStatusModal(false);
        },
        onError: (error: any) => {
          const message =
            error.response?.data?.message || 'Failed to update status';
          Alert.alert('Error', message);
        },
      },
    );
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !taskId) return;
    createCommentMutation.mutate(
      { taskId, data: { content: newComment } },
      {
        onSuccess: () => {
          setNewComment('');
        },
        onError: (error: any) => {
          const message =
            error.response?.data?.message || 'Failed to add comment';
          Alert.alert('Error', message);
        },
      },
    );
  };

  const toggleSubtask = (subtask: Subtask) => {
    if (!taskId) return;
    updateSubtaskMutation.mutate({
      subtaskId: subtask.id,
      taskId,
      data: { completed: !subtask.completed },
    });
  };

  const handleAddSubtask = () => {
    if (!newSubtask.trim() || !taskId) return;
    createSubtaskMutation.mutate(
      { taskId, data: { title: newSubtask } },
      {
        onSuccess: () => {
          setNewSubtask('');
        },
      },
    );
  };

  const isLoading = taskLoading || commentsLoading || subtasksLoading;

  if (isLoading || !task) {
    return (
      <ApScreen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={ApTheme.Color.primary} />
        </View>
      </ApScreen>
    );
  }

  const currentStatus = task.status as TaskStatusType;
  const completedSubtasks = subtasks.filter((s: Subtask) => s.completed).length;

  return (
    <ApScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-row items-center pt-4 mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Icon name="arrow-left" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <ApText size="sm" color={colors.text.secondary} className="flex-1">
            {task.project?.name || 'Task'}
          </ApText>
          <TouchableOpacity
            onPress={() => router.push(`/tasks/create?taskId=${taskId}`)}
          >
            <Icon name="edit-2" size={20} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <ApScrollView>
          <ApText size="xl" weight="bold" className="mb-4">
            {task.title}
          </ApText>

          <TouchableOpacity
            onPress={() => setShowStatusModal(true)}
            className="flex-row items-center self-start px-4 py-2 rounded-lg mb-6"
            style={{
              backgroundColor:
                statusConfig[currentStatus]?.color || ApTheme.Color.primary,
            }}
          >
            <ApText size="sm" weight="semibold" color={ApTheme.Color.white}>
              {statusConfig[currentStatus]?.label || currentStatus}
            </ApText>
            <Icon
              name="chevron-down"
              size={16}
              color={ApTheme.Color.white}
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>

          <View className="mb-6">
            <View className="flex-row mb-4">
              <View className="flex-1">
                <ApText size="xs" color={ApTheme.Color.text.muted}>
                  Assignee
                </ApText>
                <View className="flex-row items-center mt-1">
                  <ApAvatar
                    name={task.assignee?.name || 'Unassigned'}
                    size="xs"
                  />
                  <ApText size="sm" weight="medium" className="ml-2">
                    {task.assignee?.name || 'Unassigned'}
                  </ApText>
                </View>
              </View>
              <View className="flex-1">
                <ApText size="xs" color={ApTheme.Color.text.muted}>
                  Priority
                </ApText>
                <ApBadge
                  priority={mapPriority(task.priority)}
                  label={task.priority.toLowerCase()}
                  className="mt-1"
                />
              </View>
            </View>

            <View className="flex-row">
              <View className="flex-1">
                <ApText size="xs" color={ApTheme.Color.text.muted}>
                  Start Date
                </ApText>
                <ApText size="sm" weight="medium" className="mt-1">
                  {formatDate(task.startDate)}
                </ApText>
              </View>
              <View className="flex-1">
                <ApText size="xs" color={ApTheme.Color.text.muted}>
                  Due Date
                </ApText>
                <ApText size="sm" weight="medium" className="mt-1">
                  {formatDate(task.dueDate)}
                </ApText>
              </View>
            </View>
          </View>

          {task.description && (
            <View className="mb-6">
              <ApText size="md" weight="semibold" className="mb-2">
                Description
              </ApText>
              <ApText size="sm" color={colors.text.secondary}>
                {task.description}
              </ApText>
            </View>
          )}

          <View className="mb-6">
            <ApText size="md" weight="semibold" className="mb-2">
              Subtasks ({completedSubtasks}/{subtasks.length})
            </ApText>
            {subtasks.map((subtask: Subtask) => (
              <TouchableOpacity
                key={subtask.id}
                onPress={() => toggleSubtask(subtask)}
                className="flex-row items-center py-2"
              >
                <View
                  className="w-[22px] h-[22px] rounded-md items-center justify-center mr-2"
                  style={{
                    borderWidth: 2,
                    borderColor: subtask.completed
                      ? ApTheme.Color.success
                      : ApTheme.Color.border.light,
                    backgroundColor: subtask.completed
                      ? ApTheme.Color.success
                      : ApTheme.Color.transparent,
                  }}
                >
                  {subtask.completed && (
                    <Icon name="check" size={14} color={ApTheme.Color.white} />
                  )}
                </View>
                <ApText
                  size="sm"
                  style={{
                    textDecorationLine: subtask.completed
                      ? 'line-through'
                      : 'none',
                    color: subtask.completed
                      ? ApTheme.Color.text.muted
                      : colors.text.primary,
                  }}
                >
                  {subtask.title}
                </ApText>
              </TouchableOpacity>
            ))}
            <View className="flex-row items-center mt-2">
              <TextInput
                placeholder="Add subtask..."
                value={newSubtask}
                onChangeText={setNewSubtask}
                className="flex-1 rounded-lg px-4 py-2 text-sm"
                style={{
                  backgroundColor: ApTheme.Color.background.light,
                  color: colors.text.primary,
                }}
                onSubmitEditing={handleAddSubtask}
              />
              <TouchableOpacity onPress={handleAddSubtask} className="ml-2">
                <Icon
                  name="plus-circle"
                  size={24}
                  color={ApTheme.Color.primary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View className="mb-24">
            <ApText size="md" weight="semibold" className="mb-2">
              Comments ({comments.length})
            </ApText>
            {comments.length === 0 ? (
              <ApText size="sm" color={colors.text.muted}>
                No comments yet
              </ApText>
            ) : (
              comments.map((comment: Comment) => (
                <View key={comment.id} className="flex-row mb-4">
                  <ApAvatar name={comment.user?.name || 'User'} size="sm" />
                  <View className="flex-1 ml-2">
                    <View className="flex-row items-center">
                      <ApText size="sm" weight="semibold">
                        {comment.user?.name || 'User'}
                      </ApText>
                      <ApText
                        size="xs"
                        color={ApTheme.Color.text.muted}
                        className="ml-2"
                      >
                        {formatTimestamp(comment.createdAt)}
                      </ApText>
                    </View>
                    <ApText
                      size="sm"
                      color={colors.text.secondary}
                      style={{ marginTop: 2 }}
                    >
                      {comment.content}
                    </ApText>
                  </View>
                </View>
              ))
            )}
          </View>
        </ApScrollView>

        <View
          className="flex-row items-center p-4"
          style={{
            borderTopWidth: 1,
            borderTopColor: colors.border,
            backgroundColor: colors.surface,
          }}
        >
          <TextInput
            placeholder="Write a comment..."
            value={newComment}
            onChangeText={setNewComment}
            className="flex-1 rounded-lg px-4 py-2 mr-2 text-sm"
            style={{
              backgroundColor: ApTheme.Color.background.light,
              color: colors.text.primary,
            }}
          />
          <TouchableOpacity
            onPress={handleAddComment}
            disabled={createCommentMutation.isPending}
          >
            {createCommentMutation.isPending ? (
              <ActivityIndicator size="small" color={ApTheme.Color.primary} />
            ) : (
              <Icon name="send" size={24} color={ApTheme.Color.primary} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <ApModal
        visible={showStatusModal}
        onClose={() => setShowStatusModal(false)}
      >
        <ApText size="lg" weight="bold" className="mb-4">
          Change Status
        </ApText>
        {statusOrder.map(status => (
          <TouchableOpacity
            key={status}
            onPress={() => handleStatusChange(status)}
            className="flex-row items-center py-2"
            disabled={updateStatusMutation.isPending}
          >
            <View
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: statusConfig[status].color }}
            />
            <ApText
              size="md"
              weight={currentStatus === status ? 'semibold' : 'normal'}
            >
              {statusConfig[status].label}
            </ApText>
            {currentStatus === status && (
              <Icon
                name="check"
                size={18}
                color={ApTheme.Color.primary}
                style={{ marginLeft: 'auto' }}
              />
            )}
          </TouchableOpacity>
        ))}
      </ApModal>
    </ApScreen>
  );
};

interface CreateTaskScreenProps {
  taskId?: string;
}

export const CreateTaskScreen: React.FC<CreateTaskScreenProps> = ({
  taskId,
}) => {
  const { colors } = useAppTheme();
  const params = useLocalSearchParams<{ projectId?: string }>();
  const preselectedProjectId = params.projectId;
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
              { text: 'OK', onPress: () => router.back() },
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
              { text: 'OK', onPress: () => router.back() },
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
        <TouchableOpacity onPress={() => router.back()}>
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

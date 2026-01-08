import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
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
} from '../../components';
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
} from '../../hooks';
import {
  TaskStatus as TaskStatusType,
  TaskPriority,
  Comment,
  Subtask,
} from '../../types';

interface TaskDetailScreenProps {
  navigation: any;
  route: any;
}

const statusConfig: Record<TaskStatusType, { label: string; color: string }> = {
  TODO: { label: 'To Do', color: ApTheme.Color.status.todo },
  IN_PROGRESS: { label: 'In Progress', color: ApTheme.Color.status.inProgress },
  UNDER_REVIEW: {
    label: 'Under Review',
    color: ApTheme.Color.status.underReview,
  },
  DONE: { label: 'Done', color: ApTheme.Color.status.done },
};

const statusOrder: TaskStatusType[] = [
  'TODO',
  'IN_PROGRESS',
  'UNDER_REVIEW',
  'DONE',
];

const mapPriority = (priority: TaskPriority): 'low' | 'medium' | 'high' => {
  const priorityMap: Record<TaskPriority, 'low' | 'medium' | 'high'> = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
  };
  return priorityMap[priority] || 'medium';
};

const formatDate = (date: string | null): string => {
  if (!date) return 'Not set';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatTimestamp = (date: string): string => {
  const now = new Date();
  const commentDate = new Date(date);
  const diffMs = now.getTime() - commentDate.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(date);
};

export const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { colors } = useAppTheme();
  const taskId = route.params?.taskId;

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newSubtask, setNewSubtask] = useState('');

  const { data: task, isLoading: taskLoading } = useTask(taskId);
  const { data: comments = [], isLoading: commentsLoading } =
    useComments(taskId);
  const { data: subtasks = [], isLoading: subtasksLoading } =
    useSubtasks(taskId);

  const updateStatusMutation = useUpdateTaskStatus();
  const createCommentMutation = useCreateComment();
  const updateSubtaskMutation = useUpdateSubtask();
  const createSubtaskMutation = useCreateSubtask();

  const handleStatusChange = (newStatus: TaskStatusType) => {
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
    if (!newComment.trim()) return;
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
    updateSubtaskMutation.mutate({
      subtaskId: subtask.id,
      taskId,
      data: { completed: !subtask.completed },
    });
  };

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
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
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4"
          >
            <Icon name="arrow-left" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <ApText size="sm" color={colors.text.secondary} className="flex-1">
            {task.project?.name || 'Task'}
          </ApText>
          <TouchableOpacity
            onPress={() => navigation.navigate('CreateTask', { taskId })}
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

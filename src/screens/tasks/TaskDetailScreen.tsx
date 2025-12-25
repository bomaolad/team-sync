import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
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
import { useAppTheme } from '../../hooks/useAppTheme';

interface TaskDetailScreenProps {
  navigation: any;
  route: any;
}

type TaskStatus = 'todo' | 'inProgress' | 'underReview' | 'recheck' | 'done';

const statusConfig: Record<TaskStatus, { label: string; color: string }> = {
  todo: { label: 'To Do', color: ApTheme.Color.status.todo },
  inProgress: { label: 'In Progress', color: ApTheme.Color.status.inProgress },
  underReview: {
    label: 'Under Review',
    color: ApTheme.Color.status.underReview,
  },
  recheck: { label: 'Recheck', color: ApTheme.Color.status.recheck },
  done: { label: 'Done', color: ApTheme.Color.status.done },
};

const mockTask = {
  id: '1',
  title: 'Design Home Page Banner',
  description:
    "Create a modern, eye-catching banner for the homepage. Should include the company logo, tagline, and a CTA button. Use the brand colors and ensure it's responsive.",
  status: 'inProgress' as TaskStatus,
  priority: 'high' as const,
  assignee: { id: '1', name: 'John Doe' },
  startDate: 'Dec 20, 2024',
  dueDate: 'Dec 25, 2024',
  project: 'Website Redesign',
  subtasks: [
    { id: '1', title: 'Research design inspiration', completed: true },
    { id: '2', title: 'Create wireframe', completed: true },
    { id: '3', title: 'Design in Figma', completed: false },
    { id: '4', title: 'Export assets', completed: false },
  ],
  attachments: [
    { id: '1', name: 'wireframe.png', type: 'image' },
    { id: '2', name: 'brief.pdf', type: 'file' },
  ],
  comments: [
    {
      id: '1',
      user: { id: '2', name: 'Jane Smith' },
      text: 'Looking great so far! Can we make the CTA button more prominent?',
      timestamp: '2 hours ago',
      isSystem: false,
    },
    {
      id: '2',
      user: { id: '1', name: 'John Doe' },
      text: "Sure, I'll increase the size and add a subtle animation.",
      timestamp: '1 hour ago',
      isSystem: false,
    },
    {
      id: '3',
      user: { id: '1', name: 'System' },
      text: 'John changed status to In Progress',
      timestamp: '3 hours ago',
      isSystem: true,
    },
  ],
};

export const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({
  navigation,
}) => {
  const { colors } = useAppTheme();
  const [task, setTask] = useState(mockTask);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showRecheckModal, setShowRecheckModal] = useState(false);
  const [recheckReason, setRecheckReason] = useState('');
  const [newComment, setNewComment] = useState('');
  const [pendingStatus, setPendingStatus] = useState<TaskStatus | null>(null);

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (newStatus === 'recheck') {
      setPendingStatus(newStatus);
      setShowStatusModal(false);
      setShowRecheckModal(true);
    } else {
      setTask(prev => ({ ...prev, status: newStatus }));
      setShowStatusModal(false);
    }
  };

  const handleRecheckSubmit = () => {
    if (!recheckReason.trim()) return;
    setTask(prev => ({ ...prev, status: 'recheck' }));
    setShowRecheckModal(false);
    setRecheckReason('');
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setNewComment('');
  };

  const toggleSubtask = (subtaskId: string) => {
    setTask(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(st =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st,
      ),
    }));
  };

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
            {task.project}
          </ApText>
          <TouchableOpacity>
            <Icon name="more-vertical" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <ApScrollView>
          <ApText size="xl" weight="bold" className="mb-4">
            {task.title}
          </ApText>

          <TouchableOpacity
            onPress={() => setShowStatusModal(true)}
            className="flex-row items-center self-start px-4 py-2 rounded-lg mb-6"
            style={{ backgroundColor: statusConfig[task.status].color }}
          >
            <ApText size="sm" weight="semibold" color={ApTheme.Color.white}>
              {statusConfig[task.status].label}
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
                  <ApAvatar name={task.assignee.name} size="xs" />
                  <ApText size="sm" weight="medium" className="ml-2">
                    {task.assignee.name}
                  </ApText>
                </View>
              </View>
              <View className="flex-1">
                <ApText size="xs" color={ApTheme.Color.text.muted}>
                  Priority
                </ApText>
                <ApBadge
                  priority={task.priority}
                  label={task.priority}
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
                  {task.startDate}
                </ApText>
              </View>
              <View className="flex-1">
                <ApText size="xs" color={ApTheme.Color.text.muted}>
                  Due Date
                </ApText>
                <ApText size="sm" weight="medium" className="mt-1">
                  {task.dueDate}
                </ApText>
              </View>
            </View>
          </View>

          <View className="mb-6">
            <ApText size="md" weight="semibold" className="mb-2">
              Description
            </ApText>
            <ApText size="sm" color={colors.text.secondary}>
              {task.description}
            </ApText>
          </View>

          <View className="mb-6">
            <ApText size="md" weight="semibold" className="mb-2">
              Subtasks ({task.subtasks.filter(s => s.completed).length}/
              {task.subtasks.length})
            </ApText>
            {task.subtasks.map(subtask => (
              <TouchableOpacity
                key={subtask.id}
                onPress={() => toggleSubtask(subtask.id)}
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
          </View>

          <View className="mb-6">
            <ApText size="md" weight="semibold" className="mb-2">
              Attachments
            </ApText>
            <View className="flex-row flex-wrap">
              {task.attachments.map(attachment => (
                <ApCard key={attachment.id} padding="sm" className="mr-2 mb-2">
                  <View className="flex-row items-center">
                    <Icon
                      name={attachment.type === 'image' ? 'image' : 'file'}
                      size={16}
                      color={ApTheme.Color.primary}
                    />
                    <ApText size="sm" className="ml-2">
                      {attachment.name}
                    </ApText>
                  </View>
                </ApCard>
              ))}
            </View>
          </View>

          <View className="mb-24">
            <ApText size="md" weight="semibold" className="mb-2">
              Activity
            </ApText>
            {task.comments.map(comment => (
              <View key={comment.id} className="flex-row mb-4">
                <ApAvatar name={comment.user.name} size="sm" />
                <View className="flex-1 ml-2">
                  <View className="flex-row items-center">
                    <ApText size="sm" weight="semibold">
                      {comment.user.name}
                    </ApText>
                    <ApText
                      size="xs"
                      color={ApTheme.Color.text.muted}
                      className="ml-2"
                    >
                      {comment.timestamp}
                    </ApText>
                  </View>
                  <ApText
                    size="sm"
                    color={
                      comment.isSystem
                        ? ApTheme.Color.text.muted
                        : colors.text.secondary
                    }
                    style={{
                      marginTop: 2,
                      fontStyle: comment.isSystem ? 'italic' : 'normal',
                    }}
                  >
                    {comment.text}
                  </ApText>
                </View>
              </View>
            ))}
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
          <TouchableOpacity onPress={handleAddComment}>
            <Icon name="send" size={24} color={ApTheme.Color.primary} />
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
        {(Object.keys(statusConfig) as TaskStatus[]).map(status => (
          <TouchableOpacity
            key={status}
            onPress={() => handleStatusChange(status)}
            className="flex-row items-center py-2"
          >
            <View
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: statusConfig[status].color }}
            />
            <ApText
              size="md"
              weight={task.status === status ? 'semibold' : 'normal'}
            >
              {statusConfig[status].label}
            </ApText>
            {task.status === status && (
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

      <ApModal
        visible={showRecheckModal}
        onClose={() => {
          setShowRecheckModal(false);
          setRecheckReason('');
        }}
      >
        <ApText size="lg" weight="bold" className="mb-2">
          Reason for Rejection
        </ApText>
        <ApText size="sm" color={colors.text.secondary} className="mb-4">
          Please provide a reason why this task needs to be rechecked.
        </ApText>
        <TextInput
          placeholder="Enter rejection reason..."
          value={recheckReason}
          onChangeText={setRecheckReason}
          multiline
          numberOfLines={4}
          className="rounded-lg p-4 text-sm mb-4"
          style={{
            backgroundColor: ApTheme.Color.background.light,
            textAlignVertical: 'top',
            minHeight: 100,
            color: colors.text.primary,
          }}
        />
        <ApButton
          title="Submit"
          onPress={handleRecheckSubmit}
          fullWidth
          disabled={!recheckReason.trim()}
        />
      </ApModal>
    </ApScreen>
  );
};

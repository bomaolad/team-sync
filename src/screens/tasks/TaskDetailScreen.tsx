import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
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
import Icon from 'react-native-vector-icons/Feather';

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
        style={{ flex: 1 }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: ApTheme.Spacing.md,
            marginBottom: ApTheme.Spacing.md,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginRight: ApTheme.Spacing.md }}
          >
            <Icon
              name="arrow-left"
              size={24}
              color={ApTheme.Color.text.primary}
            />
          </TouchableOpacity>
          <ApText
            size="sm"
            color={ApTheme.Color.text.secondary}
            style={{ flex: 1 }}
          >
            {task.project}
          </ApText>
          <TouchableOpacity>
            <Icon
              name="more-vertical"
              size={24}
              color={ApTheme.Color.text.primary}
            />
          </TouchableOpacity>
        </View>

        <ApScrollView>
          <ApText
            size="xl"
            weight="bold"
            style={{ marginBottom: ApTheme.Spacing.md }}
          >
            {task.title}
          </ApText>

          <TouchableOpacity
            onPress={() => setShowStatusModal(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: statusConfig[task.status].color,
              paddingHorizontal: ApTheme.Spacing.md,
              paddingVertical: ApTheme.Spacing.sm,
              borderRadius: ApTheme.BorderRadius.md,
              alignSelf: 'flex-start',
              marginBottom: ApTheme.Spacing.lg,
            }}
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

          <View style={{ marginBottom: ApTheme.Spacing.lg }}>
            <View
              style={{ flexDirection: 'row', marginBottom: ApTheme.Spacing.md }}
            >
              <View style={{ flex: 1 }}>
                <ApText size="xs" color={ApTheme.Color.text.muted}>
                  Assignee
                </ApText>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 4,
                  }}
                >
                  <ApAvatar name={task.assignee.name} size="xs" />
                  <ApText size="sm" weight="medium" style={{ marginLeft: 8 }}>
                    {task.assignee.name}
                  </ApText>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <ApText size="xs" color={ApTheme.Color.text.muted}>
                  Priority
                </ApText>
                <ApBadge
                  priority={task.priority}
                  label={task.priority}
                  style={{ marginTop: 4 }}
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <ApText size="xs" color={ApTheme.Color.text.muted}>
                  Start Date
                </ApText>
                <ApText size="sm" weight="medium" style={{ marginTop: 4 }}>
                  {task.startDate}
                </ApText>
              </View>
              <View style={{ flex: 1 }}>
                <ApText size="xs" color={ApTheme.Color.text.muted}>
                  Due Date
                </ApText>
                <ApText size="sm" weight="medium" style={{ marginTop: 4 }}>
                  {task.dueDate}
                </ApText>
              </View>
            </View>
          </View>

          <View style={{ marginBottom: ApTheme.Spacing.lg }}>
            <ApText
              size="md"
              weight="semibold"
              style={{ marginBottom: ApTheme.Spacing.sm }}
            >
              Description
            </ApText>
            <ApText size="sm" color={ApTheme.Color.text.secondary}>
              {task.description}
            </ApText>
          </View>

          <View style={{ marginBottom: ApTheme.Spacing.lg }}>
            <ApText
              size="md"
              weight="semibold"
              style={{ marginBottom: ApTheme.Spacing.sm }}
            >
              Subtasks ({task.subtasks.filter(s => s.completed).length}/
              {task.subtasks.length})
            </ApText>
            {task.subtasks.map(subtask => (
              <TouchableOpacity
                key={subtask.id}
                onPress={() => toggleSubtask(subtask.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: ApTheme.Spacing.sm,
                }}
              >
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    borderWidth: 2,
                    borderColor: subtask.completed
                      ? ApTheme.Color.success
                      : ApTheme.Color.border.light,
                    backgroundColor: subtask.completed
                      ? ApTheme.Color.success
                      : 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: ApTheme.Spacing.sm,
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
                      : ApTheme.Color.text.primary,
                  }}
                >
                  {subtask.title}
                </ApText>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ marginBottom: ApTheme.Spacing.lg }}>
            <ApText
              size="md"
              weight="semibold"
              style={{ marginBottom: ApTheme.Spacing.sm }}
            >
              Attachments
            </ApText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {task.attachments.map(attachment => (
                <ApCard
                  key={attachment.id}
                  padding="sm"
                  style={{
                    marginRight: ApTheme.Spacing.sm,
                    marginBottom: ApTheme.Spacing.sm,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon
                      name={attachment.type === 'image' ? 'image' : 'file'}
                      size={16}
                      color={ApTheme.Color.primary}
                    />
                    <ApText size="sm" style={{ marginLeft: 8 }}>
                      {attachment.name}
                    </ApText>
                  </View>
                </ApCard>
              ))}
            </View>
          </View>

          <View style={{ marginBottom: 100 }}>
            <ApText
              size="md"
              weight="semibold"
              style={{ marginBottom: ApTheme.Spacing.sm }}
            >
              Activity
            </ApText>
            {task.comments.map(comment => (
              <View
                key={comment.id}
                style={{
                  flexDirection: 'row',
                  marginBottom: ApTheme.Spacing.md,
                }}
              >
                <ApAvatar name={comment.user.name} size="sm" />
                <View style={{ flex: 1, marginLeft: ApTheme.Spacing.sm }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ApText size="sm" weight="semibold">
                      {comment.user.name}
                    </ApText>
                    <ApText
                      size="xs"
                      color={ApTheme.Color.text.muted}
                      style={{ marginLeft: 8 }}
                    >
                      {comment.timestamp}
                    </ApText>
                  </View>
                  <ApText
                    size="sm"
                    color={
                      comment.isSystem
                        ? ApTheme.Color.text.muted
                        : ApTheme.Color.text.secondary
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
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: ApTheme.Spacing.md,
            borderTopWidth: 1,
            borderTopColor: ApTheme.Color.border.light,
            backgroundColor: ApTheme.Color.surface.light,
          }}
        >
          <TextInput
            placeholder="Write a comment..."
            value={newComment}
            onChangeText={setNewComment}
            style={{
              flex: 1,
              backgroundColor: ApTheme.Color.background.light,
              borderRadius: ApTheme.BorderRadius.md,
              paddingHorizontal: ApTheme.Spacing.md,
              paddingVertical: ApTheme.Spacing.sm,
              marginRight: ApTheme.Spacing.sm,
              fontSize: 14,
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
        <ApText
          size="lg"
          weight="bold"
          style={{ marginBottom: ApTheme.Spacing.md }}
        >
          Change Status
        </ApText>
        {(Object.keys(statusConfig) as TaskStatus[]).map(status => (
          <TouchableOpacity
            key={status}
            onPress={() => handleStatusChange(status)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: ApTheme.Spacing.sm,
            }}
          >
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: statusConfig[status].color,
                marginRight: ApTheme.Spacing.sm,
              }}
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
        <ApText
          size="lg"
          weight="bold"
          style={{ marginBottom: ApTheme.Spacing.sm }}
        >
          Reason for Rejection
        </ApText>
        <ApText
          size="sm"
          color={ApTheme.Color.text.secondary}
          style={{ marginBottom: ApTheme.Spacing.md }}
        >
          Please provide a reason why this task needs to be rechecked.
        </ApText>
        <TextInput
          placeholder="Enter rejection reason..."
          value={recheckReason}
          onChangeText={setRecheckReason}
          multiline
          numberOfLines={4}
          style={{
            backgroundColor: ApTheme.Color.background.light,
            borderRadius: ApTheme.BorderRadius.md,
            padding: ApTheme.Spacing.md,
            fontSize: 14,
            textAlignVertical: 'top',
            minHeight: 100,
            marginBottom: ApTheme.Spacing.md,
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

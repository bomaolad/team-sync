import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
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
  ApDatePicker,
  ApConfirm,
  ApSelect,
  useToast,
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
  useDeleteSubtask,
  useProjects,
  useCreateTask,
  useUpdateTask,
  useTeamMembers,
} from '@/src/hooks';
import {
  TaskStatus as TaskStatusType,
  TaskPriority,
  Comment,
  Subtask,
  Project,
  TeamMember,
} from '@/src/types';
import { statusConfig, statusOrder, mapPriority } from './model';
import { formatDate, formatTimestamp, formatDateTime } from '@/src/utils';

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
  const { showToast } = useToast();

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
  const deleteSubtaskMutation = useDeleteSubtask();

  const [updatingSubtaskId, setUpdatingSubtaskId] = useState<string | null>(
    null,
  );

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
          showToast(message, 'error');
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
          showToast(message, 'error');
        },
      },
    );
  };

  const toggleSubtask = (subtask: Subtask) => {
    if (!taskId) return;
    setUpdatingSubtaskId(subtask.id);
    updateSubtaskMutation.mutate(
      {
        subtaskId: subtask.id,
        taskId,
        data: { isCompleted: !subtask.isCompleted },
      },
      {
        onSettled: () => setUpdatingSubtaskId(null),
      },
    );
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    if (!taskId) return;
    setUpdatingSubtaskId(subtaskId);
    deleteSubtaskMutation.mutate(
      { subtaskId, taskId },
      {
        onSettled: () => setUpdatingSubtaskId(null),
        onError: (error: any) => {
          const message =
            error.response?.data?.message || 'Failed to delete subtask';
          showToast(message, 'error');
        },
      },
    );
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
  const completedSubtasks = subtasks.filter(
    (s: Subtask) => s.isCompleted,
  ).length;

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
                  Assignees
                </ApText>
                <View className="flex-row flex-wrap mt-1">
                  {task.assignees && task.assignees.length > 0 ? (
                    task.assignees.map(assignee => (
                      <View
                        key={assignee.id}
                        className="flex-row items-center mr-2 mb-1"
                      >
                        <ApAvatar name={assignee.name} size="xs" />
                        <ApText size="sm" weight="medium" className="ml-1">
                          {assignee.name}
                        </ApText>
                      </View>
                    ))
                  ) : (
                    <ApText size="sm" color={colors.text.muted}>
                      Unassigned
                    </ApText>
                  )}
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
              <View className="flex-1">
                <ApText size="xs" color={ApTheme.Color.text.muted}>
                  Created
                </ApText>
                <ApText size="sm" weight="medium" className="mt-1">
                  {formatDateTime(task.createdAt)}
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
              <View key={subtask.id} className="flex-row items-center py-2">
                <TouchableOpacity
                  onPress={() => toggleSubtask(subtask)}
                  className="flex-row items-center flex-1"
                  disabled={updatingSubtaskId === subtask.id}
                >
                  <View
                    className="w-[22px] h-[22px] rounded-md items-center justify-center mr-2"
                    style={{
                      borderWidth: 2,
                      borderColor: subtask.isCompleted
                        ? ApTheme.Color.success
                        : ApTheme.Color.border.light,
                      backgroundColor: subtask.isCompleted
                        ? ApTheme.Color.success
                        : ApTheme.Color.transparent,
                    }}
                  >
                    {updatingSubtaskId === subtask.id ? (
                      <ActivityIndicator
                        size="small"
                        color={ApTheme.Color.primary}
                      />
                    ) : subtask.isCompleted ? (
                      <Icon
                        name="check"
                        size={14}
                        color={ApTheme.Color.white}
                      />
                    ) : null}
                  </View>
                  <ApText
                    size="sm"
                    className="flex-1"
                    style={{
                      textDecorationLine: subtask.isCompleted
                        ? 'line-through'
                        : 'none',
                      color: subtask.isCompleted
                        ? ApTheme.Color.text.muted
                        : colors.text.primary,
                    }}
                  >
                    {subtask.title}
                  </ApText>
                </TouchableOpacity>
                <ApConfirm
                  title="Delete Subtask"
                  message={`Are you sure you want to delete "${subtask.title}"?`}
                  confirmText="Delete"
                  onConfirm={() => handleDeleteSubtask(subtask.id)}
                  disabled={updatingSubtaskId === subtask.id}
                >
                  <View className="p-2">
                    <Icon
                      name="trash-2"
                      size={16}
                      color={ApTheme.Color.danger}
                    />
                  </View>
                </ApConfirm>
              </View>
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
              {createSubtaskMutation.isPending ? (
                <ActivityIndicator
                  size="small"
                  color={ApTheme.Color.primary}
                  style={{ marginLeft: 8 }}
                />
              ) : (
                <TouchableOpacity onPress={handleAddSubtask} className="ml-2">
                  <Icon
                    name="plus-circle"
                    size={24}
                    color={ApTheme.Color.primary}
                  />
                </TouchableOpacity>
              )}
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
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);

  const { data: projects = [], isLoading: projectsLoading } = useProjects();

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const { data: teamMembers = [] } = useTeamMembers(
    selectedProject?.teamId || '',
  );

  const { data: existingTask, isLoading: taskLoading } = useTask(taskId || '');
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const { showToast } = useToast();

  useEffect(() => {
    if (isEditing && existingTask) {
      setTitle(existingTask.title);
      setDescription(existingTask.description || '');
      setSelectedProjectId(existingTask.projectId);
      setDueDate(
        existingTask.dueDate ? existingTask.dueDate.split('T')[0] : '',
      );
      setPriority(existingTask.priority);
      setAssigneeIds(existingTask.assignees?.map((a: any) => a.id) || []);
    }
  }, [isEditing, existingTask]);

  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId && !preselectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, preselectedProjectId]);

  const handleSubmit = () => {
    if (!title.trim()) {
      showToast('Please enter a task title', 'error');
      return;
    }

    if (!selectedProjectId) {
      showToast('Please select a project', 'error');
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
            assigneeIds: assigneeIds.length > 0 ? assigneeIds : undefined,
          },
        },
        {
          onSuccess: () => {
            showToast('Task updated successfully', 'success');
            router.back();
          },
          onError: (error: any) => {
            const message =
              error.response?.data?.message || 'Failed to update task';
            showToast(message, 'error');
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
          assigneeIds: assigneeIds.length > 0 ? assigneeIds : undefined,
        },
        {
          onSuccess: () => {
            showToast('Task created successfully', 'success');
            router.back();
          },
          onError: (error: any) => {
            const message =
              error.response?.data?.message || 'Failed to create task';
            showToast(message, 'error');
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

      <ApScrollView showsVerticalScrollIndicator={false}>
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

          <ApDatePicker
            label="Due Date"
            placeholder="Select due date"
            value={dueDate}
            onChange={setDueDate}
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

          {selectedProjectId && (
            <ApSelect
              label="Assignees"
              placeholder="Select assignees"
              searchPlaceholder="Search members..."
              searchable
              multiple
              options={teamMembers}
              value={assigneeIds}
              onChange={setAssigneeIds}
              getValue={(item: any) => item.userId}
              getLabel={(item: any) => item.user?.name || 'Unknown'}
              renderItem={(item: any, isSelected: boolean) => (
                <View className="flex-row items-center">
                  <ApAvatar
                    source={item.user?.avatar}
                    name={item.user?.name || '?'}
                    size="xs"
                    className="mr-2"
                  />
                  <ApText
                    size="md"
                    weight={isSelected ? 'semibold' : 'normal'}
                    color={
                      isSelected ? ApTheme.Color.primary : colors.text.primary
                    }
                  >
                    {item.user?.name || 'Unknown'}
                  </ApText>
                </View>
              )}
              renderTrigger={(selectedItems: any) => {
                const items = Array.isArray(selectedItems) ? selectedItems : [];
                return (
                  <View className="flex-row items-center flex-1">
                    {items.length > 0 ? (
                      <View
                        className="flex-row items-center flex-wrap"
                        style={{ gap: 4 }}
                      >
                        {items.slice(0, 3).map((item: any) => (
                          <ApAvatar
                            key={item.id}
                            source={item.user?.avatar}
                            name={item.user?.name || '?'}
                            size="xs"
                          />
                        ))}
                        {items.length > 3 && (
                          <View className="w-5 h-5 rounded-full items-center justify-center bg-gray-200">
                            <ApText size="xs">+{items.length - 3}</ApText>
                          </View>
                        )}
                        <ApText
                          size="md"
                          className="ml-2"
                          color={colors.text.primary}
                        >
                          {items.length === 1
                            ? items[0].user?.name
                            : `${items.length} selected`}
                        </ApText>
                      </View>
                    ) : (
                      <>
                        <Icon
                          name="users"
                          size={16}
                          color={colors.text.muted}
                          style={{ marginRight: 8 }}
                        />
                        <ApText size="md" color={colors.text.muted}>
                          Select assignees
                        </ApText>
                      </>
                    )}
                  </View>
                );
              }}
            />
          )}

          <ApButton
            title={isEditing ? 'Update Task' : 'Create Task'}
            onPress={handleSubmit}
            loading={isSaving}
            disabled={projects.length === 0 && !isEditing}
          />
        </ApCard>
      </ApScrollView>
    </ApScreen>
  );
};

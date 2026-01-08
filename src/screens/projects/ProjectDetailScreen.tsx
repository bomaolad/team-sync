import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  ApTheme,
  ApText,
  ApScreen,
  ApCard,
  ApAvatar,
  ApBadge,
  ApFAB,
} from '../../components';
import Icon from '@expo/vector-icons/Feather';
import {
  useAppTheme,
  useProject,
  useTasks,
  useProjectProgress,
} from '../../hooks';
import { Task, TaskStatus as TaskStatusType, TaskPriority } from '../../types';

interface ProjectDetailScreenProps {
  navigation: any;
  route: any;
}

type ViewMode = 'list' | 'board';

const statusConfig: Record<string, { label: string; color: string }> = {
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

export const ProjectDetailScreen: React.FC<ProjectDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { colors } = useAppTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const projectId = route.params?.projectId;

  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: allTasks = [], isLoading: tasksLoading } = useTasks({
    projectId,
  });
  const { data: progress } = useProjectProgress(projectId);

  const tasks = allTasks.filter((t: Task) => t.projectId === projectId);

  const getTasksByStatus = (status: TaskStatusType) =>
    tasks.filter((task: Task) => task.status === status);

  const renderTaskCard = (task: Task) => (
    <ApCard
      key={task.id}
      padding="sm"
      onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
      className="mb-2"
    >
      <ApText size="sm" weight="medium" numberOfLines={2}>
        {task.title}
      </ApText>
      <View className="flex-row justify-between items-center mt-2">
        <ApAvatar name={task.assignee?.name || 'Unassigned'} size="xs" />
        <ApBadge
          priority={mapPriority(task.priority)}
          label={task.priority.toLowerCase()}
          size="sm"
        />
      </View>
    </ApCard>
  );

  const renderListView = () => (
    <FlatList
      data={statusOrder}
      keyExtractor={item => item}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
      renderItem={({ item: status }) => {
        const statusTasks = getTasksByStatus(status);
        if (statusTasks.length === 0) return null;

        return (
          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <View
                className="w-3 h-3 rounded-full mr-2"
                style={{
                  backgroundColor:
                    statusConfig[status]?.color || ApTheme.Color.primary,
                }}
              />
              <ApText size="md" weight="semibold">
                {statusConfig[status]?.label || status}
              </ApText>
              <ApText
                size="sm"
                color={ApTheme.Color.text.muted}
                className="ml-2"
              >
                {statusTasks.length}
              </ApText>
            </View>
            {statusTasks.map(renderTaskCard)}
          </View>
        );
      }}
    />
  );

  const renderBoardView = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: 16 }}
    >
      {statusOrder.map(status => {
        const statusTasks = getTasksByStatus(status);
        return (
          <View key={status} className="w-[260px] mr-4">
            <View className="flex-row items-center mb-2 px-2">
              <View
                className="w-3 h-3 rounded-full mr-2"
                style={{
                  backgroundColor:
                    statusConfig[status]?.color || ApTheme.Color.primary,
                }}
              />
              <ApText size="md" weight="semibold">
                {statusConfig[status]?.label || status}
              </ApText>
              <View
                className="ml-2 px-2 py-0.5 rounded-xl"
                style={{ backgroundColor: ApTheme.Color.border.light }}
              >
                <ApText size="xs" color={colors.text.secondary}>
                  {statusTasks.length}
                </ApText>
              </View>
            </View>
            <View
              className="rounded-xl p-2 min-h-[200px]"
              style={{ backgroundColor: ApTheme.Color.background.light }}
            >
              {statusTasks.length > 0 ? (
                statusTasks.map(renderTaskCard)
              ) : (
                <View className="items-center py-10">
                  <ApText size="sm" color={ApTheme.Color.text.muted}>
                    No tasks
                  </ApText>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );

  const isLoading = projectLoading || tasksLoading;

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
      <View className="flex-row items-center pt-4 mb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Icon name="arrow-left" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <ApText size="lg" weight="bold" className="flex-1" numberOfLines={1}>
          {project?.name || 'Project'}
        </ApText>
        <TouchableOpacity>
          <Icon name="more-vertical" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {progress && (
        <View className="flex-row mb-4">
          <View className="flex-1 items-center">
            <ApText size="lg" weight="bold" color={ApTheme.Color.primary}>
              {progress.percentage || 0}%
            </ApText>
            <ApText size="xs" color={colors.text.secondary}>
              Complete
            </ApText>
          </View>
          <View className="flex-1 items-center">
            <ApText size="lg" weight="bold" color={ApTheme.Color.success}>
              {progress.completed || 0}
            </ApText>
            <ApText size="xs" color={colors.text.secondary}>
              Done
            </ApText>
          </View>
          <View className="flex-1 items-center">
            <ApText size="lg" weight="bold" color={ApTheme.Color.warning}>
              {progress.inProgress || 0}
            </ApText>
            <ApText size="xs" color={colors.text.secondary}>
              In Progress
            </ApText>
          </View>
        </View>
      )}

      <View
        className="flex-row rounded-lg p-1 mb-4"
        style={{ backgroundColor: ApTheme.Color.border.light }}
      >
        <TouchableOpacity
          onPress={() => setViewMode('list')}
          className="flex-1 py-2 rounded items-center"
          style={{
            backgroundColor:
              viewMode === 'list'
                ? ApTheme.Color.white
                : ApTheme.Color.transparent,
          }}
        >
          <ApText
            size="sm"
            weight={viewMode === 'list' ? 'semibold' : 'normal'}
            color={
              viewMode === 'list'
                ? ApTheme.Color.primary
                : colors.text.secondary
            }
          >
            List View
          </ApText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setViewMode('board')}
          className="flex-1 py-2 rounded items-center"
          style={{
            backgroundColor:
              viewMode === 'board'
                ? ApTheme.Color.white
                : ApTheme.Color.transparent,
          }}
        >
          <ApText
            size="sm"
            weight={viewMode === 'board' ? 'semibold' : 'normal'}
            color={
              viewMode === 'board'
                ? ApTheme.Color.primary
                : colors.text.secondary
            }
          >
            Board View
          </ApText>
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        {viewMode === 'list' ? renderListView() : renderBoardView()}
      </View>

      <ApFAB
        icon="plus"
        onPress={() => navigation.navigate('CreateTask', { projectId })}
      />
    </ApScreen>
  );
};

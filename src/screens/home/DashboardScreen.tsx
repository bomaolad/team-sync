import React from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {
  ApTheme,
  ApText,
  ApScreen,
  ApCard,
  ApAvatar,
  ApBadge,
} from '../../components';
import Icon from '@expo/vector-icons/Feather';
import { useAppTheme, useMyTasks, useProjects } from '../../hooks';
import { useAuthStore } from '../../store/authStore';
import { Task, TaskStatus as TaskStatusType, TaskPriority } from '../../types';

interface DashboardScreenProps {
  navigation: any;
}

const mapStatus = (
  status: TaskStatusType,
): 'todo' | 'inProgress' | 'underReview' | 'done' => {
  const statusMap: Record<
    TaskStatusType,
    'todo' | 'inProgress' | 'underReview' | 'done'
  > = {
    TODO: 'todo',
    IN_PROGRESS: 'inProgress',
    UNDER_REVIEW: 'underReview',
    DONE: 'done',
  };
  return statusMap[status] || 'todo';
};

const mapPriority = (priority: TaskPriority): 'low' | 'medium' | 'high' => {
  const priorityMap: Record<TaskPriority, 'low' | 'medium' | 'high'> = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
  };
  return priorityMap[priority] || 'medium';
};

const formatDueDate = (dueDate: string | null): string => {
  if (!dueDate) return 'No due date';
  const date = new Date(dueDate);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  navigation,
}) => {
  const { colors } = useAppTheme();
  const { user } = useAuthStore();
  const { data: tasks = [], isLoading: tasksLoading } = useMyTasks();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();

  const activeTasks = tasks.filter((t: Task) => t.status !== 'DONE');
  const completedTasks = tasks.filter((t: Task) => t.status === 'DONE');

  const StatCard = ({
    title,
    value,
    icon,
    color,
  }: {
    title: string;
    value: number;
    icon: React.ComponentProps<typeof Icon>['name'];
    color: string;
  }) => (
    <ApCard padding="md" className="flex-1 mx-1">
      <View
        className="w-10 h-10 rounded-xl items-center justify-center mb-2"
        style={{ backgroundColor: color + '20' }}
      >
        <Icon name={icon} size={20} color={color} />
      </View>
      <ApText size="xxl" weight="bold" color={colors.text.primary}>
        {value}
      </ApText>
      <ApText size="xs" color={colors.text.secondary}>
        {title}
      </ApText>
    </ApCard>
  );

  const renderTaskItem = (task: Task) => (
    <ApCard
      padding="md"
      onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
      className="mb-3"
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <ApText size="md" weight="semibold" numberOfLines={1}>
            {task.title}
          </ApText>
          <ApText size="sm" color={colors.text.secondary} className="mt-0.5">
            {task.project?.name || 'No project'}
          </ApText>
          <View className="flex-row items-center mt-2">
            <Icon name="calendar" size={14} color={ApTheme.Color.text.muted} />
            <ApText size="xs" color={ApTheme.Color.text.muted} className="ml-1">
              {formatDueDate(task.dueDate)}
            </ApText>
          </View>
        </View>
        <View className="items-end">
          <ApBadge
            priority={mapPriority(task.priority)}
            label={task.priority.toLowerCase()}
            size="sm"
          />
          <ApBadge
            status={mapStatus(task.status)}
            label={task.status.replace('_', ' ').toLowerCase()}
            size="sm"
            className="mt-2"
          />
        </View>
      </View>
    </ApCard>
  );

  const isLoading = tasksLoading || projectsLoading;

  if (isLoading) {
    return (
      <ApScreen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={ApTheme.Color.primary} />
          <ApText size="md" color={colors.text.secondary} className="mt-4">
            Loading...
          </ApText>
        </View>
      </ApScreen>
    );
  }

  return (
    <ApScreen>
      <View className="flex-1">
        <View className="flex-row items-center justify-between pt-4 mb-6">
          <View>
            <ApText size="md" color={colors.text.secondary}>
              Welcome back,
            </ApText>
            <ApText size="xl" weight="bold">
              {user?.name || 'User'} 👋
            </ApText>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <ApAvatar name={user?.name || 'User'} size="md" />
          </TouchableOpacity>
        </View>

        <View className="flex-row -mx-1 mb-6">
          <StatCard
            title="Projects"
            value={projects.length}
            icon="folder"
            color={ApTheme.Color.primary}
          />
          <StatCard
            title="Active"
            value={activeTasks.length}
            icon="clock"
            color={ApTheme.Color.warning}
          />
        </View>
        <View className="flex-row -mx-1 mb-6">
          <StatCard
            title="Done"
            value={completedTasks.length}
            icon="check-circle"
            color={ApTheme.Color.success}
          />
          <StatCard
            title="Total Tasks"
            value={tasks.length}
            icon="list"
            color={ApTheme.Color.danger}
          />
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <ApText size="lg" weight="semibold">
            My Tasks
          </ApText>
          <TouchableOpacity onPress={() => navigation.navigate('Projects')}>
            <ApText size="sm" weight="medium" color={ApTheme.Color.primary}>
              See All
            </ApText>
          </TouchableOpacity>
        </View>

        <FlatList
          data={activeTasks.slice(0, 5)}
          renderItem={({ item }) => (
            <React.Fragment key={item.id}>
              {renderTaskItem(item)}
            </React.Fragment>
          )}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View className="items-center pt-8">
              <Icon
                name="check-circle"
                size={48}
                color={ApTheme.Color.text.muted}
              />
              <ApText
                size="md"
                color={ApTheme.Color.text.muted}
                className="mt-4"
              >
                No tasks assigned to you
              </ApText>
            </View>
          }
        />
      </View>
    </ApScreen>
  );
};

import React from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import {
  ApTheme,
  ApText,
  ApScreen,
  ApCard,
  ApAvatar,
  ApBadge,
} from '@/src/components';
import Icon from '@expo/vector-icons/Feather';
import { useAppTheme, useMyTasks, useProjects } from '@/src/hooks';
import { useAuthStore } from '@/src/store/authStore';
import { Task } from '@/src/types';
import { mapStatus, mapPriority, formatDueDate } from './model';

const StatCard = ({
  title,
  value,
  icon,
  color,
  colors,
}: {
  title: string;
  value: number;
  icon: React.ComponentProps<typeof Icon>['name'];
  color: string;
  colors: any;
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

export const DashboardScreen = () => {
  const { colors } = useAppTheme();
  const { user } = useAuthStore();
  const { data: tasks = [], isLoading: tasksLoading } = useMyTasks();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();

  const activeTasks = tasks.filter((t: Task) => t.status !== 'DONE');
  const completedTasks = tasks.filter((t: Task) => t.status === 'DONE');

  const renderTaskItem = (task: Task) => (
    <ApCard
      padding="md"
      onPress={() => router.push(`/tasks/${task.id}`)}
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
          <TouchableOpacity onPress={() => router.push('/(tabs)/settings')}>
            <ApAvatar name={user?.name || 'User'} size="md" />
          </TouchableOpacity>
        </View>

        <View className="flex-row -mx-1 mb-6">
          <StatCard
            title="Projects"
            value={projects.length}
            icon="folder"
            color={ApTheme.Color.primary}
            colors={colors}
          />
          <StatCard
            title="Active"
            value={activeTasks.length}
            icon="clock"
            color={ApTheme.Color.warning}
            colors={colors}
          />
        </View>
        <View className="flex-row -mx-1 mb-6">
          <StatCard
            title="Done"
            value={completedTasks.length}
            icon="check-circle"
            color={ApTheme.Color.success}
            colors={colors}
          />
          <StatCard
            title="Total Tasks"
            value={tasks.length}
            icon="list"
            color={ApTheme.Color.danger}
            colors={colors}
          />
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <ApText size="lg" weight="semibold">
            My Tasks
          </ApText>
          <TouchableOpacity onPress={() => router.push('/(tabs)/projects')}>
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

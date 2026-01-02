import React from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';
import {
  ApTheme,
  ApText,
  ApScreen,
  ApCard,
  ApAvatar,
  ApBadge,
} from '../../components';
import Icon from '@expo/vector-icons/Feather';
import { useAppTheme } from '../../hooks/useAppTheme';

interface DashboardScreenProps {
  navigation: any;
}

const mockStats = {
  totalProjects: 5,
  activeTasks: 12,
  completedTasks: 24,
  teamMembers: 8,
};

const mockTasks = [
  {
    id: '1',
    title: 'Design Home Page',
    project: 'Website Redesign',
    priority: 'high' as const,
    dueDate: 'Today',
    status: 'inProgress' as const,
  },
  {
    id: '2',
    title: 'Fix Login Bug',
    project: 'Mobile App',
    priority: 'high' as const,
    dueDate: 'Tomorrow',
    status: 'todo' as const,
  },
  {
    id: '3',
    title: 'Update API Docs',
    project: 'Backend API',
    priority: 'medium' as const,
    dueDate: 'Dec 20',
    status: 'underReview' as const,
  },
  {
    id: '4',
    title: 'Team Meeting Notes',
    project: 'Internal',
    priority: 'low' as const,
    dueDate: 'Dec 21',
    status: 'done' as const,
  },
];

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  navigation,
}) => {
  const { colors } = useAppTheme();

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

  const renderTaskItem = (task: (typeof mockTasks)[0]) => (
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
            {task.project}
          </ApText>
          <View className="flex-row items-center mt-2">
            <Icon name="calendar" size={14} color={ApTheme.Color.text.muted} />
            <ApText size="xs" color={ApTheme.Color.text.muted} className="ml-1">
              {task.dueDate}
            </ApText>
          </View>
        </View>
        <View className="items-end">
          <ApBadge priority={task.priority} label={task.priority} size="sm" />
          <ApBadge
            status={task.status}
            label={task.status}
            size="sm"
            className="mt-2"
          />
        </View>
      </View>
    </ApCard>
  );

  return (
    <ApScreen>
      <View className="flex-1">
        <View className="flex-row items-center justify-between pt-4 mb-6">
          <View>
            <ApText size="md" color={colors.text.secondary}>
              Welcome back,
            </ApText>
            <ApText size="xl" weight="bold">
              Muhammed Bello 👋
            </ApText>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <ApAvatar name="Muhammed Bello" size="md" />
          </TouchableOpacity>
        </View>

        <View className="flex-row -mx-1 mb-6">
          <StatCard
            title="Projects"
            value={mockStats.totalProjects}
            icon="folder"
            color={ApTheme.Color.primary}
          />
          <StatCard
            title="Active"
            value={mockStats.activeTasks}
            icon="clock"
            color={ApTheme.Color.warning}
          />
        </View>
        <View className="flex-row -mx-1 mb-6">
          <StatCard
            title="Done"
            value={mockStats.completedTasks}
            icon="check-circle"
            color={ApTheme.Color.success}
          />
          <StatCard
            title="Team"
            value={mockStats.teamMembers}
            icon="users"
            color={ApTheme.Color.danger}
          />
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <ApText size="lg" weight="semibold">
            Recent Tasks
          </ApText>
          <TouchableOpacity onPress={() => navigation.navigate('Projects')}>
            <ApText size="sm" weight="medium" color={ApTheme.Color.primary}>
              See All
            </ApText>
          </TouchableOpacity>
        </View>

        <FlatList
          data={mockTasks}
          renderItem={({ item }) => (
            <React.Fragment key={item.id}>
              {renderTaskItem(item)}
            </React.Fragment>
          )}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </ApScreen>
  );
};

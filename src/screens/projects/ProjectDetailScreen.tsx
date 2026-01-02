import React, { useState } from 'react';
import { View, TouchableOpacity, FlatList, ScrollView } from 'react-native';
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

interface ProjectDetailScreenProps {
  navigation: any;
  route: any;
}

type ViewMode = 'list' | 'board';
type TaskStatus = 'todo' | 'inProgress' | 'underReview' | 'recheck' | 'done';

interface Task {
  id: string;
  title: string;
  assignee: { id: string; name: string };
  priority: 'low' | 'medium' | 'high';
  status: TaskStatus;
  dueDate: string;
}

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

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design homepage layout',
    assignee: { id: '1', name: 'Muhammed Bello' },
    priority: 'high',
    status: 'todo',
    dueDate: 'Dec 24',
  },
  {
    id: '2',
    title: 'Implement nav component',
    assignee: { id: '2', name: 'Jane Smith' },
    priority: 'medium',
    status: 'todo',
    dueDate: 'Dec 25',
  },
  {
    id: '3',
    title: 'Create API endpoints',
    assignee: { id: '3', name: 'Bob Wilson' },
    priority: 'high',
    status: 'inProgress',
    dueDate: 'Dec 23',
  },
  {
    id: '4',
    title: 'Setup database schema',
    assignee: { id: '1', name: 'Muhammed Bello' },
    priority: 'medium',
    status: 'inProgress',
    dueDate: 'Dec 26',
  },
  {
    id: '5',
    title: 'Review PR #42',
    assignee: { id: '2', name: 'Jane Smith' },
    priority: 'low',
    status: 'underReview',
    dueDate: 'Dec 22',
  },
  {
    id: '6',
    title: 'Fix login bug',
    assignee: { id: '3', name: 'Bob Wilson' },
    priority: 'high',
    status: 'recheck',
    dueDate: 'Dec 21',
  },
  {
    id: '7',
    title: 'Write unit tests',
    assignee: { id: '1', name: 'Muhammed Bello' },
    priority: 'medium',
    status: 'done',
    dueDate: 'Dec 20',
  },
  {
    id: '8',
    title: 'Update docs',
    assignee: { id: '2', name: 'Jane Smith' },
    priority: 'low',
    status: 'done',
    dueDate: 'Dec 19',
  },
];

const statusOrder: TaskStatus[] = [
  'todo',
  'inProgress',
  'underReview',
  'recheck',
  'done',
];

export const ProjectDetailScreen: React.FC<ProjectDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { colors } = useAppTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const projectTitle = 'Website Redesign';

  const getTasksByStatus = (status: TaskStatus) =>
    mockTasks.filter(task => task.status === status);

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
        <ApAvatar name={task.assignee.name} size="xs" />
        <ApBadge priority={task.priority} label={task.priority} size="sm" />
      </View>
    </ApCard>
  );

  const renderListView = () => (
    <FlatList
      data={statusOrder}
      keyExtractor={item => item}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
      renderItem={({ item: status }) => {
        const tasks = getTasksByStatus(status);
        if (tasks.length === 0) return null;

        return (
          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <View
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: statusConfig[status].color }}
              />
              <ApText size="md" weight="semibold">
                {statusConfig[status].label}
              </ApText>
              <ApText
                size="sm"
                color={ApTheme.Color.text.muted}
                className="ml-2"
              >
                {tasks.length}
              </ApText>
            </View>
            {tasks.map(renderTaskCard)}
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
        const tasks = getTasksByStatus(status);
        return (
          <View key={status} className="w-[260px] mr-4">
            <View className="flex-row items-center mb-2 px-2">
              <View
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: statusConfig[status].color }}
              />
              <ApText size="md" weight="semibold">
                {statusConfig[status].label}
              </ApText>
              <View
                className="ml-2 px-2 py-0.5 rounded-xl"
                style={{ backgroundColor: ApTheme.Color.border.light }}
              >
                <ApText size="xs" color={colors.text.secondary}>
                  {tasks.length}
                </ApText>
              </View>
            </View>
            <View
              className="rounded-xl p-2 min-h-[200px]"
              style={{ backgroundColor: ApTheme.Color.background.light }}
            >
              {tasks.length > 0 ? (
                tasks.map(renderTaskCard)
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

  return (
    <ApScreen>
      <View className="flex-row items-center pt-4 mb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Icon name="arrow-left" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <ApText size="lg" weight="bold" className="flex-1" numberOfLines={1}>
          {projectTitle}
        </ApText>
        <TouchableOpacity>
          <Icon name="more-vertical" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

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
    </ApScreen>
  );
};

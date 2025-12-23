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
import Icon from 'react-native-vector-icons/Feather';

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

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design homepage layout',
    assignee: { id: '1', name: 'John Doe' },
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
    assignee: { id: '1', name: 'John Doe' },
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
    assignee: { id: '1', name: 'John Doe' },
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
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const projectTitle = 'Website Redesign';

  const getTasksByStatus = (status: TaskStatus) =>
    mockTasks.filter(task => task.status === status);

  const renderTaskCard = (task: Task) => (
    <ApCard
      key={task.id}
      padding="sm"
      onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
      style={{ marginBottom: ApTheme.Spacing.sm }}
    >
      <ApText size="sm" weight="medium" numberOfLines={2}>
        {task.title}
      </ApText>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: ApTheme.Spacing.sm,
        }}
      >
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
          <View style={{ marginBottom: ApTheme.Spacing.lg }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: ApTheme.Spacing.sm,
              }}
            >
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: statusConfig[status].color,
                  marginRight: ApTheme.Spacing.sm,
                }}
              />
              <ApText size="md" weight="semibold">
                {statusConfig[status].label}
              </ApText>
              <ApText
                size="sm"
                color={ApTheme.Color.text.muted}
                style={{ marginLeft: 8 }}
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
      contentContainerStyle={{ paddingRight: ApTheme.Spacing.md }}
    >
      {statusOrder.map(status => {
        const tasks = getTasksByStatus(status);
        return (
          <View
            key={status}
            style={{
              width: 260,
              marginRight: ApTheme.Spacing.md,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: ApTheme.Spacing.sm,
                paddingHorizontal: ApTheme.Spacing.sm,
              }}
            >
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: statusConfig[status].color,
                  marginRight: ApTheme.Spacing.sm,
                }}
              />
              <ApText size="md" weight="semibold">
                {statusConfig[status].label}
              </ApText>
              <View
                style={{
                  marginLeft: 8,
                  backgroundColor: ApTheme.Color.border.light,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 10,
                }}
              >
                <ApText size="xs" color={ApTheme.Color.text.secondary}>
                  {tasks.length}
                </ApText>
              </View>
            </View>
            <View
              style={{
                backgroundColor: ApTheme.Color.background.light,
                borderRadius: ApTheme.BorderRadius.lg,
                padding: ApTheme.Spacing.sm,
                minHeight: 200,
              }}
            >
              {tasks.length > 0 ? (
                tasks.map(renderTaskCard)
              ) : (
                <View style={{ alignItems: 'center', paddingVertical: 40 }}>
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
        <ApText size="lg" weight="bold" style={{ flex: 1 }} numberOfLines={1}>
          {projectTitle}
        </ApText>
        <TouchableOpacity>
          <Icon
            name="more-vertical"
            size={24}
            color={ApTheme.Color.text.primary}
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: 'row',
          backgroundColor: ApTheme.Color.border.light,
          borderRadius: ApTheme.BorderRadius.md,
          padding: 4,
          marginBottom: ApTheme.Spacing.md,
        }}
      >
        <TouchableOpacity
          onPress={() => setViewMode('list')}
          style={{
            flex: 1,
            paddingVertical: ApTheme.Spacing.sm,
            borderRadius: ApTheme.BorderRadius.sm,
            backgroundColor:
              viewMode === 'list' ? ApTheme.Color.white : 'transparent',
            alignItems: 'center',
          }}
        >
          <ApText
            size="sm"
            weight={viewMode === 'list' ? 'semibold' : 'normal'}
            color={
              viewMode === 'list'
                ? ApTheme.Color.primary
                : ApTheme.Color.text.secondary
            }
          >
            List View
          </ApText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setViewMode('board')}
          style={{
            flex: 1,
            paddingVertical: ApTheme.Spacing.sm,
            borderRadius: ApTheme.BorderRadius.sm,
            backgroundColor:
              viewMode === 'board' ? ApTheme.Color.white : 'transparent',
            alignItems: 'center',
          }}
        >
          <ApText
            size="sm"
            weight={viewMode === 'board' ? 'semibold' : 'normal'}
            color={
              viewMode === 'board'
                ? ApTheme.Color.primary
                : ApTheme.Color.text.secondary
            }
          >
            Board View
          </ApText>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        {viewMode === 'list' ? renderListView() : renderBoardView()}
      </View>
    </ApScreen>
  );
};

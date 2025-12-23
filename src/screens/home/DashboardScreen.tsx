import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import {
  ApTheme,
  ApText,
  ApScreen,
  ApScrollView,
  ApCard,
  ApAvatar,
  ApBadge,
  ApFAB,
} from '../../components';
import Icon from 'react-native-vector-icons/Feather';

interface DashboardScreenProps {
  navigation: any;
}

const mockStats = [
  { id: '1', title: 'Pending Tasks', count: 12, color: ApTheme.Color.primary },
  { id: '2', title: 'In Review', count: 5, color: ApTheme.Color.warning },
  { id: '3', title: 'Recheck', count: 2, color: ApTheme.Color.danger },
  { id: '4', title: 'Completed', count: 24, color: ApTheme.Color.success },
];

const mockTasks = [
  {
    id: '1',
    title: 'Design Home Page Banner',
    project: 'Website Redesign',
    priority: 'high' as const,
    dueDate: 'Today',
    status: 'inProgress' as const,
  },
  {
    id: '2',
    title: 'Fix API Authentication Bug',
    project: 'Backend API',
    priority: 'high' as const,
    dueDate: 'Tomorrow',
    status: 'todo' as const,
  },
  {
    id: '3',
    title: 'Update User Documentation',
    project: 'Documentation',
    priority: 'medium' as const,
    dueDate: 'Dec 25',
    status: 'underReview' as const,
  },
  {
    id: '4',
    title: 'Implement Dark Mode',
    project: 'Mobile App',
    priority: 'low' as const,
    dueDate: 'Dec 28',
    status: 'todo' as const,
  },
  {
    id: '5',
    title: 'Database Optimization',
    project: 'Backend API',
    priority: 'medium' as const,
    dueDate: 'Dec 30',
    status: 'recheck' as const,
  },
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  navigation,
}) => {
  const userName = 'John';

  const renderStatCard = ({ item }: { item: (typeof mockStats)[0] }) => (
    <ApCard
      padding="md"
      style={{
        width: 140,
        marginRight: ApTheme.Spacing.sm,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: item.color + '15',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: ApTheme.Spacing.sm,
        }}
      >
        <ApText size="lg" weight="bold" color={item.color}>
          {item.count}
        </ApText>
      </View>
      <ApText size="sm" color={ApTheme.Color.text.secondary} numberOfLines={1}>
        {item.title}
      </ApText>
    </ApCard>
  );

  const renderTaskItem = ({ item }: { item: (typeof mockTasks)[0] }) => (
    <ApCard
      padding="md"
      onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
      style={{ marginBottom: ApTheme.Spacing.sm }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, marginRight: ApTheme.Spacing.sm }}>
          <ApText size="md" weight="semibold" numberOfLines={1}>
            {item.title}
          </ApText>
          <ApText
            size="sm"
            color={ApTheme.Color.text.secondary}
            style={{ marginTop: 2 }}
          >
            {item.project}
          </ApText>
        </View>
        <ApBadge priority={item.priority} label={item.priority} size="sm" />
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: ApTheme.Spacing.md,
        }}
      >
        <ApBadge
          status={item.status}
          label={item.status.replace(/([A-Z])/g, ' $1').trim()}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon
            name="calendar"
            size={14}
            color={
              item.dueDate === 'Today'
                ? ApTheme.Color.danger
                : ApTheme.Color.text.muted
            }
          />
          <ApText
            size="sm"
            color={
              item.dueDate === 'Today'
                ? ApTheme.Color.danger
                : ApTheme.Color.text.muted
            }
            style={{ marginLeft: 4 }}
          >
            {item.dueDate}
          </ApText>
        </View>
      </View>
    </ApCard>
  );

  return (
    <ApScreen>
      <ApScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: ApTheme.Spacing.md,
            marginBottom: ApTheme.Spacing.lg,
          }}
        >
          <View>
            <ApText size="md" color={ApTheme.Color.text.secondary}>
              {getGreeting()},
            </ApText>
            <ApText size="xl" weight="bold">
              {userName} 👋
            </ApText>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <ApAvatar name={userName} size="md" />
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: ApTheme.Spacing.lg }}>
          <ApText
            size="md"
            weight="semibold"
            style={{ marginBottom: ApTheme.Spacing.sm }}
          >
            Overview
          </ApText>
          <FlatList
            horizontal
            data={mockStats}
            renderItem={renderStatCard}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: ApTheme.Spacing.md }}
          />
        </View>

        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: ApTheme.Spacing.sm,
            }}
          >
            <ApText size="md" weight="semibold">
              My Tasks
            </ApText>
            <TouchableOpacity>
              <ApText size="sm" weight="medium" color={ApTheme.Color.primary}>
                See All
              </ApText>
            </TouchableOpacity>
          </View>

          {mockTasks.map(task => renderTaskItem({ item: task }))}
        </View>
      </ApScrollView>

      <ApFAB icon="plus" onPress={() => navigation.navigate('CreateTask')} />
    </ApScreen>
  );
};

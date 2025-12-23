import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import {
  ApTheme,
  ApText,
  ApScreen,
  ApCard,
  ApAvatar,
  ApProgressBar,
  ApFAB,
  ApInput,
} from '../../components';
import Icon from '@expo/vector-icons/Feather';

interface ProjectsListScreenProps {
  navigation: any;
}

const mockProjects = [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Complete overhaul of company website',
    progress: 65,
    taskCount: 24,
    completedTasks: 16,
    members: [
      { id: '1', name: 'John Doe' },
      { id: '2', name: 'Jane Smith' },
      { id: '3', name: 'Bob Wilson' },
    ],
    status: 'active',
  },
  {
    id: '2',
    title: 'Mobile App Development',
    description: 'Native iOS and Android app',
    progress: 40,
    taskCount: 32,
    completedTasks: 13,
    members: [
      { id: '1', name: 'John Doe' },
      { id: '4', name: 'Alice Brown' },
    ],
    status: 'active',
  },
  {
    id: '3',
    title: 'Backend API',
    description: 'RESTful API with NestJS',
    progress: 85,
    taskCount: 18,
    completedTasks: 15,
    members: [
      { id: '2', name: 'Jane Smith' },
      { id: '5', name: 'Charlie Davis' },
      { id: '6', name: 'Eva Green' },
      { id: '7', name: 'Frank White' },
    ],
    status: 'active',
  },
  {
    id: '4',
    title: 'Documentation',
    description: 'User guides and API docs',
    progress: 100,
    taskCount: 8,
    completedTasks: 8,
    members: [{ id: '1', name: 'John Doe' }],
    status: 'completed',
  },
];

type FilterType = 'all' | 'active' | 'completed';

export const ProjectsListScreen: React.FC<ProjectsListScreenProps> = ({
  navigation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
  ];

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'active' && project.status === 'active') ||
      (activeFilter === 'completed' && project.status === 'completed');
    return matchesSearch && matchesFilter;
  });

  const renderProjectCard = ({ item }: { item: (typeof mockProjects)[0] }) => (
    <ApCard
      padding="md"
      onPress={() =>
        navigation.navigate('ProjectDetail', { projectId: item.id })
      }
      style={{ marginBottom: ApTheme.Spacing.md }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <ApText size="lg" weight="semibold" numberOfLines={1}>
            {item.title}
          </ApText>
          <ApText
            size="sm"
            color={ApTheme.Color.text.secondary}
            numberOfLines={1}
            style={{ marginTop: 2 }}
          >
            {item.description}
          </ApText>
        </View>
        <ApProgressBar
          progress={item.progress}
          variant="circular"
          size="md"
          showLabel
          color={
            item.progress === 100
              ? ApTheme.Color.success
              : ApTheme.Color.primary
          }
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: ApTheme.Spacing.md,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row' }}>
            {item.members.slice(0, 3).map((member, index) => (
              <View
                key={member.id}
                style={{ marginLeft: index > 0 ? -10 : 0, zIndex: 3 - index }}
              >
                <ApAvatar name={member.name} size="xs" />
              </View>
            ))}
            {item.members.length > 3 && (
              <View
                style={{
                  marginLeft: -10,
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: ApTheme.Color.secondary,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ApText size="xs" color={ApTheme.Color.white}>
                  +{item.members.length - 3}
                </ApText>
              </View>
            )}
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon
            name="check-square"
            size={14}
            color={ApTheme.Color.text.muted}
          />
          <ApText
            size="sm"
            color={ApTheme.Color.text.muted}
            style={{ marginLeft: 4 }}
          >
            {item.completedTasks}/{item.taskCount} tasks
          </ApText>
        </View>
      </View>
    </ApCard>
  );

  return (
    <ApScreen>
      <View style={{ paddingTop: ApTheme.Spacing.md }}>
        <ApText
          size="xl"
          weight="bold"
          style={{ marginBottom: ApTheme.Spacing.md }}
        >
          Projects
        </ApText>

        <ApInput
          placeholder="Search projects..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon="search"
        />

        <View
          style={{
            flexDirection: 'row',
            marginBottom: ApTheme.Spacing.md,
          }}
        >
          {filters.map(filter => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => setActiveFilter(filter.key)}
              style={{
                paddingHorizontal: ApTheme.Spacing.md,
                paddingVertical: ApTheme.Spacing.sm,
                borderRadius: ApTheme.BorderRadius.full,
                backgroundColor:
                  activeFilter === filter.key
                    ? ApTheme.Color.primary
                    : ApTheme.Color.border.light,
                marginRight: ApTheme.Spacing.sm,
              }}
            >
              <ApText
                size="sm"
                weight="medium"
                color={
                  activeFilter === filter.key
                    ? ApTheme.Color.white
                    : ApTheme.Color.text.secondary
                }
              >
                {filter.label}
              </ApText>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredProjects}
          renderItem={renderProjectCard}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingTop: 60 }}>
              <Icon name="folder" size={48} color={ApTheme.Color.text.muted} />
              <ApText
                size="md"
                color={ApTheme.Color.text.muted}
                style={{ marginTop: ApTheme.Spacing.md }}
              >
                No projects found
              </ApText>
            </View>
          }
        />
      </View>

      <ApFAB icon="plus" onPress={() => navigation.navigate('CreateProject')} />
    </ApScreen>
  );
};

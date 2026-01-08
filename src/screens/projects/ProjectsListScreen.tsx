import React, { useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
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
import { useAppTheme, useProjects, useTasks } from '../../hooks';
import { Project, Task } from '../../types';

interface ProjectsListScreenProps {
  navigation: any;
}

type FilterType = 'all' | 'active' | 'completed';

export const ProjectsListScreen: React.FC<ProjectsListScreenProps> = ({
  navigation,
}) => {
  const { colors } = useAppTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: allTasks = [] } = useTasks();

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
  ];

  const getProjectStats = (projectId: string) => {
    const projectTasks = allTasks.filter(
      (t: Task) => t.projectId === projectId,
    );
    const completedTasks = projectTasks.filter(
      (t: Task) => t.status === 'DONE',
    );
    const total = projectTasks.length;
    const completed = completedTasks.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, progress };
  };

  const filteredProjects = projects.filter((project: Project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const stats = getProjectStats(project.id);
    const isCompleted = stats.progress === 100 && stats.total > 0;

    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'active' && !isCompleted) ||
      (activeFilter === 'completed' && isCompleted);

    return matchesSearch && matchesFilter;
  });

  const renderProjectCard = ({ item }: { item: Project }) => {
    const stats = getProjectStats(item.id);

    return (
      <ApCard
        padding="md"
        onPress={() =>
          navigation.navigate('ProjectDetail', { projectId: item.id })
        }
        className="mb-4"
      >
        <View className="flex-row justify-between">
          <View className="flex-1">
            <ApText size="lg" weight="semibold" numberOfLines={1}>
              {item.name}
            </ApText>
            <ApText
              size="sm"
              color={colors.text.secondary}
              numberOfLines={1}
              className="mt-0.5"
            >
              {item.description || 'No description'}
            </ApText>
          </View>
          <ApProgressBar
            progress={stats.progress}
            variant="circular"
            size="md"
            showLabel
            color={
              stats.progress === 100
                ? ApTheme.Color.success
                : ApTheme.Color.primary
            }
          />
        </View>

        <View className="flex-row justify-between items-center mt-4">
          <View className="flex-row items-center">
            <ApAvatar name={item.name} size="xs" />
          </View>

          <View className="flex-row items-center">
            <Icon
              name="check-square"
              size={14}
              color={ApTheme.Color.text.muted}
            />
            <ApText size="sm" color={ApTheme.Color.text.muted} className="ml-1">
              {stats.completed}/{stats.total} tasks
            </ApText>
          </View>
        </View>
      </ApCard>
    );
  };

  if (projectsLoading) {
    return (
      <ApScreen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={ApTheme.Color.primary} />
          <ApText size="md" color={colors.text.secondary} className="mt-4">
            Loading projects...
          </ApText>
        </View>
      </ApScreen>
    );
  }

  return (
    <ApScreen>
      <View className="pt-4">
        <ApText size="xl" weight="bold" className="mb-4">
          Projects
        </ApText>

        <ApInput
          placeholder="Search projects..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon="search"
        />

        <View className="flex-row mb-4">
          {filters.map(filter => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => setActiveFilter(filter.key)}
              className="px-4 py-2 rounded-full mr-2"
              style={{
                backgroundColor:
                  activeFilter === filter.key
                    ? ApTheme.Color.primary
                    : ApTheme.Color.border.light,
              }}
            >
              <ApText
                size="sm"
                weight="medium"
                color={
                  activeFilter === filter.key
                    ? ApTheme.Color.white
                    : colors.text.secondary
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
            <View className="items-center pt-16">
              <Icon name="folder" size={48} color={ApTheme.Color.text.muted} />
              <ApText
                size="md"
                color={ApTheme.Color.text.muted}
                className="mt-4"
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

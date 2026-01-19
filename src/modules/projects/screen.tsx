import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import {
  ApTheme,
  ApText,
  ApScreen,
  ApCard,
  ApAvatar,
  ApBadge,
  ApProgressBar,
  ApFAB,
  ApInput,
  ApButton,
} from '@/src/components';
import Icon from '@expo/vector-icons/Feather';
import {
  useAppTheme,
  useProjects,
  useTasks,
  useProject,
  useProjectProgress,
  useTeams,
  useCreateProject,
  useUpdateProject,
} from '@/src/hooks';
import { Project, Task, Team } from '@/src/types';
import {
  FilterType,
  ViewMode,
  statusConfig,
  statusOrder,
  mapPriority,
  getProjectStats,
} from './model';

export const ProjectsListScreen = () => {
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

  const filteredProjects = projects.filter((project: Project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const stats = getProjectStats(project.id, allTasks);
    const isCompleted = stats.progress === 100 && stats.total > 0;

    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'active' && !isCompleted) ||
      (activeFilter === 'completed' && isCompleted);

    return matchesSearch && matchesFilter;
  });

  const renderProjectCard = ({ item }: { item: Project }) => {
    const stats = getProjectStats(item.id, allTasks);

    return (
      <ApCard
        padding="md"
        onPress={() => router.push(`/projects/${item.id}`)}
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

      <ApFAB icon="plus" onPress={() => router.push('/projects/create')} />
    </ApScreen>
  );
};

interface ProjectDetailScreenProps {
  projectId?: string;
}

export const ProjectDetailScreen: React.FC<ProjectDetailScreenProps> = ({
  projectId,
}) => {
  const { colors } = useAppTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const { data: project, isLoading: projectLoading } = useProject(
    projectId || '',
  );
  const { data: allTasks = [], isLoading: tasksLoading } = useTasks({
    projectId,
  });
  const { data: progress } = useProjectProgress(projectId || '');

  const tasks = allTasks.filter((t: Task) => t.projectId === projectId);

  const getTasksByStatus = (status: string) =>
    tasks.filter((task: Task) => task.status === status);

  const renderTaskCard = (task: Task) => (
    <ApCard
      key={task.id}
      padding="sm"
      onPress={() => router.push(`/tasks/${task.id}`)}
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
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
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
        onPress={() => router.push(`/tasks/create?projectId=${projectId}`)}
      />
    </ApScreen>
  );
};

interface CreateProjectScreenProps {
  projectId?: string;
}

export const CreateProjectScreen: React.FC<CreateProjectScreenProps> = ({
  projectId,
}) => {
  const { colors } = useAppTheme();
  const isEditing = !!projectId;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');

  const { data: teams = [], isLoading: teamsLoading } = useTeams();
  const { data: existingProject, isLoading: projectLoading } = useProject(
    projectId || '',
  );
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();

  useEffect(() => {
    if (isEditing && existingProject) {
      setName(existingProject.name);
      setDescription(existingProject.description || '');
      setSelectedTeamId(existingProject.teamId);
    }
  }, [isEditing, existingProject]);

  useEffect(() => {
    if (teams.length > 0 && !selectedTeamId) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams]);

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a project name');
      return;
    }

    if (!selectedTeamId) {
      Alert.alert('Error', 'Please select a team');
      return;
    }

    if (isEditing) {
      updateProjectMutation.mutate(
        {
          id: projectId,
          data: { name, description },
        },
        {
          onSuccess: () => {
            Alert.alert('Success', 'Project updated successfully', [
              { text: 'OK', onPress: () => router.back() },
            ]);
          },
          onError: (error: any) => {
            const message =
              error.response?.data?.message || 'Failed to update project';
            Alert.alert('Error', message);
          },
        },
      );
    } else {
      createProjectMutation.mutate(
        {
          name,
          description,
          teamId: selectedTeamId,
        },
        {
          onSuccess: () => {
            Alert.alert('Success', 'Project created successfully', [
              { text: 'OK', onPress: () => router.back() },
            ]);
          },
          onError: (error: any) => {
            const message =
              error.response?.data?.message || 'Failed to create project';
            Alert.alert('Error', message);
          },
        },
      );
    }
  };

  const isLoading = teamsLoading || (isEditing && projectLoading);
  const isSaving =
    createProjectMutation.isPending || updateProjectMutation.isPending;

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
          {isEditing ? 'Edit Project' : 'Create New Project'}
        </ApText>
        <View className="w-6" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ApCard padding="lg" className="mt-4">
          <ApInput
            label="Project Name"
            placeholder="e.g. Website Redesign"
            value={name}
            onChangeText={setName}
          />

          <ApInput
            label="Description"
            placeholder="Project goals and scope..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={{ height: 100, textAlignVertical: 'top' }}
          />

          {!isEditing && (
            <View className="mb-6">
              <ApText
                size="sm"
                weight="medium"
                color={colors.text.secondary}
                className="mb-2"
              >
                Select Team
              </ApText>
              {teams.length === 0 ? (
                <ApText size="sm" color={colors.text.muted}>
                  No teams available. Create a team first.
                </ApText>
              ) : (
                <View className="flex-row flex-wrap -mx-1">
                  {teams.map((team: Team) => (
                    <TouchableOpacity
                      key={team.id}
                      onPress={() => setSelectedTeamId(team.id)}
                      className="py-2 px-4 rounded-lg m-1"
                      style={{
                        backgroundColor:
                          selectedTeamId === team.id
                            ? ApTheme.Color.primary
                            : colors.surface,
                        borderWidth: 1,
                        borderColor:
                          selectedTeamId === team.id
                            ? ApTheme.Color.primary
                            : colors.border,
                      }}
                    >
                      <ApText
                        weight="medium"
                        color={
                          selectedTeamId === team.id
                            ? ApTheme.Color.white
                            : colors.text.secondary
                        }
                      >
                        {team.name}
                      </ApText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}

          <ApButton
            title={isEditing ? 'Update Project' : 'Create Project'}
            onPress={handleSubmit}
            loading={isSaving}
            disabled={teams.length === 0 && !isEditing}
          />
        </ApCard>
      </ScrollView>
    </ApScreen>
  );
};

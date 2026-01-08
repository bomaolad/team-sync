import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from '@expo/vector-icons/Feather';
import {
  ApTheme,
  ApScreen,
  ApText,
  ApInput,
  ApButton,
  ApCard,
} from '../../components';
import {
  useAppTheme,
  useTeams,
  useCreateProject,
  useUpdateProject,
  useProject,
} from '../../hooks';
import { Team } from '../../types';

interface CreateProjectScreenProps {
  navigation: any;
  route: any;
}

export const CreateProjectScreen: React.FC<CreateProjectScreenProps> = ({
  navigation,
  route,
}) => {
  const { colors } = useAppTheme();
  const projectId = route.params?.projectId;
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
              { text: 'OK', onPress: () => navigation.goBack() },
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
              { text: 'OK', onPress: () => navigation.goBack() },
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
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

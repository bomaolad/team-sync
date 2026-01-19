import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
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
  ApButton,
  ApModal,
  ApInput,
} from '@/src/components';
import Icon from '@expo/vector-icons/Feather';
import {
  useAppTheme,
  useTeams,
  useTeamMembers,
  useInviteMember,
  useCreateTeam,
} from '@/src/hooks';
import { Team, TeamMember, TeamRole } from '@/src/types';
import { getRoleBadgeVariant } from './model';

export const TeamListScreen = () => {
  const { colors } = useAppTheme();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'MEMBER' | 'VIEWER'>('MEMBER');
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');

  const { data: teams = [], isLoading: teamsLoading } = useTeams();
  const { data: members = [], isLoading: membersLoading } = useTeamMembers(
    selectedTeamId || teams[0]?.id || '',
  );
  const inviteMemberMutation = useInviteMember();
  const createTeamMutation = useCreateTeam();

  useEffect(() => {
    if (teams.length > 0 && !selectedTeamId) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams]);

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    if (!selectedTeamId) {
      Alert.alert('Error', 'No team selected');
      return;
    }

    inviteMemberMutation.mutate(
      {
        teamId: selectedTeamId,
        data: { email: inviteEmail, role: inviteRole as TeamRole },
      },
      {
        onSuccess: () => {
          setShowInviteModal(false);
          setInviteEmail('');
          Alert.alert('Success', 'Invitation sent successfully');
        },
        onError: (error: any) => {
          const message =
            error.response?.data?.message || 'Failed to send invitation';
          Alert.alert('Error', message);
        },
      },
    );
  };

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) {
      Alert.alert('Error', 'Please enter a team name');
      return;
    }

    createTeamMutation.mutate(
      { name: newTeamName, description: newTeamDescription },
      {
        onSuccess: team => {
          setShowCreateTeamModal(false);
          setNewTeamName('');
          setNewTeamDescription('');
          setSelectedTeamId(team.id);
          Alert.alert('Success', 'Team created successfully');
        },
        onError: (error: any) => {
          const message =
            error.response?.data?.message || 'Failed to create team';
          Alert.alert('Error', message);
        },
      },
    );
  };

  const renderMemberCard = ({ item }: { item: TeamMember }) => (
    <ApCard padding="md" className="mb-2">
      <View className="flex-row items-center">
        <ApAvatar
          source={item.user?.avatar}
          name={item.user?.name || 'User'}
          size="lg"
        />
        <View className="flex-1 ml-4">
          <View className="flex-row items-center">
            <ApText size="md" weight="semibold">
              {item.user?.name || 'Unknown User'}
            </ApText>
            <ApBadge
              label={item.role.toLowerCase()}
              variant={getRoleBadgeVariant(item.role) as any}
              size="sm"
              className="ml-2"
            />
          </View>
          <ApText size="sm" color={colors.text.secondary}>
            {item.user?.jobTitle || 'No title'}
          </ApText>
          <ApText size="xs" color={ApTheme.Color.text.muted} className="mt-0.5">
            {item.user?.email}
          </ApText>
        </View>
      </View>
    </ApCard>
  );

  const isLoading = teamsLoading || membersLoading;

  if (isLoading && teams.length === 0) {
    return (
      <ApScreen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={ApTheme.Color.primary} />
          <ApText size="md" color={colors.text.secondary} className="mt-4">
            Loading teams...
          </ApText>
        </View>
      </ApScreen>
    );
  }

  const selectedTeam = teams.find((t: Team) => t.id === selectedTeamId);

  return (
    <ApScreen>
      <View className="flex-row justify-between items-center pt-4 mb-4">
        <ApText size="xl" weight="bold">
          Team
        </ApText>
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => setShowCreateTeamModal(true)}
            className="flex-row items-center px-3 py-2 rounded-lg mr-2"
            style={{
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Icon name="plus" size={16} color={colors.text.primary} />
            <ApText size="sm" weight="medium" className="ml-1">
              New
            </ApText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowInviteModal(true)}
            className="flex-row items-center px-4 py-2 rounded-lg"
            style={{ backgroundColor: ApTheme.Color.primary }}
          >
            <Icon name="user-plus" size={16} color={ApTheme.Color.white} />
            <ApText
              size="sm"
              weight="semibold"
              color={ApTheme.Color.white}
              className="ml-1.5"
            >
              Invite
            </ApText>
          </TouchableOpacity>
        </View>
      </View>

      {teams.length > 1 && (
        <View className="flex-row mb-4">
          <FlatList
            horizontal
            data={teams}
            keyExtractor={(item: Team) => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }: { item: Team }) => (
              <TouchableOpacity
                onPress={() => setSelectedTeamId(item.id)}
                className="px-4 py-2 rounded-full mr-2"
                style={{
                  backgroundColor:
                    selectedTeamId === item.id
                      ? ApTheme.Color.primary
                      : ApTheme.Color.border.light,
                }}
              >
                <ApText
                  size="sm"
                  weight="medium"
                  color={
                    selectedTeamId === item.id
                      ? ApTheme.Color.white
                      : colors.text.secondary
                  }
                >
                  {item.name}
                </ApText>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {selectedTeam && (
        <View
          className="flex-row rounded-xl p-4 mb-6"
          style={{ backgroundColor: ApTheme.Color.primary + '15' }}
        >
          <View className="flex-1 items-center">
            <ApText size="xxl" weight="bold" color={ApTheme.Color.primary}>
              {members.length}
            </ApText>
            <ApText size="sm" color={colors.text.secondary}>
              Members
            </ApText>
          </View>
          <View
            className="w-px mx-4"
            style={{ backgroundColor: ApTheme.Color.border.light }}
          />
          <View className="flex-1 items-center">
            <ApText
              size="sm"
              weight="bold"
              color={ApTheme.Color.primary}
              className="text-center"
            >
              {selectedTeam.inviteCode || 'N/A'}
            </ApText>
            <ApText size="xs" color={colors.text.secondary}>
              Invite Code
            </ApText>
          </View>
        </View>
      )}

      {teams.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Icon name="users" size={48} color={ApTheme.Color.text.muted} />
          <ApText
            size="md"
            color={ApTheme.Color.text.muted}
            className="mt-4 text-center"
          >
            No teams yet. Create your first team!
          </ApText>
        </View>
      ) : (
        <FlatList
          data={members}
          renderItem={renderMemberCard}
          keyExtractor={(item: TeamMember) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View className="items-center pt-8">
              <Icon name="user" size={48} color={ApTheme.Color.text.muted} />
              <ApText
                size="md"
                color={ApTheme.Color.text.muted}
                className="mt-4"
              >
                No members in this team
              </ApText>
            </View>
          }
        />
      )}

      <ApModal
        visible={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      >
        <ApText size="lg" weight="bold" className="mb-4">
          Invite Team Member
        </ApText>

        <ApInput
          label="Email Address"
          placeholder="Enter email address"
          value={inviteEmail}
          onChangeText={setInviteEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon="mail"
        />

        <ApText size="sm" weight="medium" className="mb-2">
          Role
        </ApText>
        <View className="flex-row mb-6">
          <TouchableOpacity
            onPress={() => setInviteRole('MEMBER')}
            className="flex-1 py-2 rounded-lg items-center mr-2"
            style={{
              borderWidth: 2,
              borderColor:
                inviteRole === 'MEMBER'
                  ? ApTheme.Color.primary
                  : ApTheme.Color.border.light,
            }}
          >
            <ApText
              size="sm"
              weight={inviteRole === 'MEMBER' ? 'semibold' : 'normal'}
              color={
                inviteRole === 'MEMBER'
                  ? ApTheme.Color.primary
                  : colors.text.secondary
              }
            >
              Member
            </ApText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setInviteRole('VIEWER')}
            className="flex-1 py-2 rounded-lg items-center"
            style={{
              borderWidth: 2,
              borderColor:
                inviteRole === 'VIEWER'
                  ? ApTheme.Color.primary
                  : ApTheme.Color.border.light,
            }}
          >
            <ApText
              size="sm"
              weight={inviteRole === 'VIEWER' ? 'semibold' : 'normal'}
              color={
                inviteRole === 'VIEWER'
                  ? ApTheme.Color.primary
                  : colors.text.secondary
              }
            >
              Viewer
            </ApText>
          </TouchableOpacity>
        </View>

        <ApButton
          title="Send Invite"
          onPress={handleInvite}
          fullWidth
          disabled={!inviteEmail.trim()}
          loading={inviteMemberMutation.isPending}
        />
      </ApModal>

      <ApModal
        visible={showCreateTeamModal}
        onClose={() => setShowCreateTeamModal(false)}
      >
        <ApText size="lg" weight="bold" className="mb-4">
          Create New Team
        </ApText>

        <ApInput
          label="Team Name"
          placeholder="Enter team name"
          value={newTeamName}
          onChangeText={setNewTeamName}
          leftIcon="users"
        />

        <ApInput
          label="Description (Optional)"
          placeholder="Team description..."
          value={newTeamDescription}
          onChangeText={setNewTeamDescription}
          multiline
          numberOfLines={3}
        />

        <ApButton
          title="Create Team"
          onPress={handleCreateTeam}
          fullWidth
          disabled={!newTeamName.trim()}
          loading={createTeamMutation.isPending}
        />
      </ApModal>
    </ApScreen>
  );
};

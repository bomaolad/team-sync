import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
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
  ApButton,
  ApModal,
  ApInput,
  useToast,
  ApSelect,
} from '@/src/components';
import Icon from '@expo/vector-icons/Feather';
import {
  useAppTheme,
  useTeams,
  useTeamMembers,
  useInviteMember,
  useCreateTeam,
  useRemoveMember,
  useUpdateMemberRole,
  useProfile,
} from '@/src/hooks';
import { Team, TeamMember, TeamRole } from '@/src/types';
import { getRoleBadgeVariant } from './model';

export const TeamListScreen = () => {
  const { colors } = useAppTheme();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'ADMIN' | 'MEMBER' | 'VIEWER'>(
    'MEMBER',
  );
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [inviteTeamId, setInviteTeamId] = useState<string>('');

  const { data: teams = [], isLoading: teamsLoading } = useTeams();
  const { data: members = [], isLoading: membersLoading } = useTeamMembers(
    selectedTeamId || teams[0]?.id || '',
  );
  const { showToast } = useToast();

  const inviteMemberMutation = useInviteMember();
  const createTeamMutation = useCreateTeam();
  const removeMemberMutation = useRemoveMember();
  const updateMemberRoleMutation = useUpdateMemberRole();
  const { data: userProfile } = useProfile();

  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showMemberActions, setShowMemberActions] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    title: string;
    description: string;
    variant: 'primary' | 'danger';
    confirmText: string;
    onConfirm: () => void;
  }>({
    visible: false,
    title: '',
    description: '',
    variant: 'primary',
    confirmText: 'Confirm',
    onConfirm: () => {},
  });

  const currentUserRole = React.useMemo(() => {
    if (!userProfile || !members) return null;
    const member = members.find((m: TeamMember) => m.userId === userProfile.id);
    return member?.role;
  }, [userProfile, members]);

  const canManageMembers =
    currentUserRole === 'OWNER' || currentUserRole === 'ADMIN';

  useEffect(() => {
    if (teams.length > 0) {
      if (!selectedTeamId) {
        setSelectedTeamId(teams[0].id);
      }
      if (!inviteTeamId) {
        setInviteTeamId(teams[0].id);
      }
    }
  }, [teams]);

  // Update inviteTeamId when selectedTeamId changes, so it defaults to the viewed team
  useEffect(() => {
    if (selectedTeamId) {
      setInviteTeamId(selectedTeamId);
    }
  }, [selectedTeamId]);

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    if (!inviteTeamId) {
      showToast('No team selected', 'error');
      return;
    }

    inviteMemberMutation.mutate(
      {
        teamId: inviteTeamId,
        data: { email: inviteEmail, role: inviteRole as TeamRole },
      },
      {
        onSuccess: () => {
          setShowInviteModal(false);
          setInviteEmail('');
          showToast('Invitation sent successfully', 'success');
        },
        onError: (error: any) => {
          const message =
            error.response?.data?.message || 'Failed to send invitation';
          showToast(message, 'error');
        },
      },
    );
  };

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) {
      showToast('Please enter a team name', 'error');
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
          showToast('Team created successfully', 'success');
        },
        onError: (error: any) => {
          const message =
            error.response?.data?.message || 'Failed to create team';
          showToast(message, 'error');
        },
      },
    );
  };

  const renderMemberCard = ({ item }: { item: TeamMember }) => {
    const isSelf = userProfile?.id === item.userId;
    const isOwner = item.role === 'OWNER';

    // Can't manage yourself, and can't manage the owner (unless you are the owner, but already caught by isSelf)
    const canManageThisMember = canManageMembers && !isSelf && !isOwner;

    return (
      <ApCard padding="md" className="mb-2">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
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
                {item.user?.jobTitle || 'Job Title Not Set'}
              </ApText>
              <ApText
                size="xs"
                color={ApTheme.Color.text.muted}
                className="mt-0.5"
              >
                {item.user?.email}
              </ApText>
            </View>
          </View>

          {canManageThisMember && (
            <TouchableOpacity
              onPress={() => {
                setSelectedMember(item);
                setShowMemberActions(true);
              }}
              className="p-2"
            >
              <Icon
                name="more-vertical"
                size={20}
                color={colors.text.secondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </ApCard>
    );
  };

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

        <ApSelect
          label="Team"
          placeholder="Select a team"
          searchPlaceholder="Search teams..."
          searchable
          options={teams}
          value={inviteTeamId}
          onChange={setInviteTeamId}
          getLabel={(item: Team) => item.name}
          getValue={(item: Team) => item.id}
        />

        <ApText size="sm" weight="medium" className="mb-2">
          Role
        </ApText>
        <View className="flex-row mb-6">
          <TouchableOpacity
            onPress={() => setInviteRole('ADMIN')}
            className="flex-1 py-2 rounded-lg items-center mr-2"
            style={{
              borderWidth: 2,
              borderColor:
                inviteRole === 'ADMIN'
                  ? ApTheme.Color.primary
                  : ApTheme.Color.border.light,
            }}
          >
            <ApText
              size="sm"
              weight={inviteRole === 'ADMIN' ? 'semibold' : 'normal'}
              color={
                inviteRole === 'ADMIN'
                  ? ApTheme.Color.primary
                  : colors.text.secondary
              }
            >
              Admin
            </ApText>
          </TouchableOpacity>
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
          disabled={!inviteEmail.trim() || !inviteTeamId}
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

      <ApModal
        visible={showMemberActions}
        onClose={() => setShowMemberActions(false)}
        position="bottom"
      >
        <View className="pb-4">
          <ApText size="lg" weight="bold" className="mb-4">
            Manage Member
          </ApText>

          <ApText size="md" className="mb-4" color={colors.text.secondary}>
            {selectedMember?.user?.name}
          </ApText>

          {selectedMember?.role !== 'OWNER' &&
            selectedMember?.role !== 'ADMIN' && (
              <TouchableOpacity
                onPress={() => {
                  setShowMemberActions(false);
                  if (!selectedMember || !selectedTeamId) return;

                  setConfirmModal({
                    visible: true,
                    title: 'Promote to Admin',
                    description: `Are you sure you want to promote ${selectedMember.user?.name} to Admin? They will be able to manage team members.`,
                    variant: 'primary',
                    confirmText: 'Promote',
                    onConfirm: () => {
                      updateMemberRoleMutation.mutate(
                        {
                          teamId: selectedTeamId,
                          memberId: selectedMember.id,
                          data: { role: 'ADMIN' as TeamRole },
                        },
                        {
                          onSuccess: () => {
                            setConfirmModal(prev => ({
                              ...prev,
                              visible: false,
                            }));
                            showToast('Member promoted to admin', 'success');
                          },
                          onError: () => {
                            setConfirmModal(prev => ({
                              ...prev,
                              visible: false,
                            }));
                            showToast('Failed to update member role', 'error');
                          },
                        },
                      );
                    },
                  });
                }}
                className="flex-row items-center py-3 border-b"
                style={{ borderColor: ApTheme.Color.border.light }}
              >
                <Icon
                  name="shield"
                  size={20}
                  color={ApTheme.Color.success}
                  style={{ marginRight: 12 }}
                />
                <ApText size="md" color={colors.text.primary}>
                  Make Admin
                </ApText>
              </TouchableOpacity>
            )}

          {selectedMember?.role === 'ADMIN' && (
            <TouchableOpacity
              onPress={() => {
                setShowMemberActions(false);
                if (!selectedMember || !selectedTeamId) return;

                setConfirmModal({
                  visible: true,
                  title: 'Demote Admin',
                  description: `Are you sure you want to demote ${selectedMember.user?.name} from Admin to Member?`,
                  variant: 'primary',
                  confirmText: 'Demote',
                  onConfirm: () => {
                    updateMemberRoleMutation.mutate(
                      {
                        teamId: selectedTeamId,
                        memberId: selectedMember.id,
                        data: { role: 'MEMBER' as TeamRole },
                      },
                      {
                        onSuccess: () => {
                          setConfirmModal(prev => ({
                            ...prev,
                            visible: false,
                          }));
                          showToast('Admin demoted to member', 'success');
                        },
                        onError: () => {
                          setConfirmModal(prev => ({
                            ...prev,
                            visible: false,
                          }));
                          showToast('Failed to update member role', 'error');
                        },
                      },
                    );
                  },
                });
              }}
              className="flex-row items-center py-3 border-b"
              style={{ borderColor: ApTheme.Color.border.light }}
            >
              <Icon
                name="user"
                size={20}
                color={ApTheme.Color.warning}
                style={{ marginRight: 12 }}
              />
              <ApText size="md" color={colors.text.primary}>
                Demote to Member
              </ApText>
            </TouchableOpacity>
          )}

          {selectedMember?.role !== 'OWNER' &&
            selectedMember?.role !== 'ADMIN' && (
              <TouchableOpacity
                onPress={() => {
                  setShowMemberActions(false);
                  if (!selectedMember || !selectedTeamId) return;

                  const newRole =
                    selectedMember.role === 'MEMBER' ? 'VIEWER' : 'MEMBER';
                  const actionText =
                    newRole === 'MEMBER'
                      ? 'promote to Member'
                      : 'change to Viewer';

                  setConfirmModal({
                    visible: true,
                    title: 'Change Role',
                    description: `Are you sure you want to ${actionText}?`,
                    variant: 'primary',
                    confirmText: 'Confirm',
                    onConfirm: () => {
                      updateMemberRoleMutation.mutate(
                        {
                          teamId: selectedTeamId,
                          memberId: selectedMember.id,
                          data: { role: newRole as TeamRole },
                        },
                        {
                          onSuccess: () => {
                            setConfirmModal(prev => ({
                              ...prev,
                              visible: false,
                            }));
                            showToast(
                              `Member updated to ${newRole.toLowerCase()}`,
                              'success',
                            );
                          },
                          onError: () => {
                            setConfirmModal(prev => ({
                              ...prev,
                              visible: false,
                            }));
                            showToast('Failed to update member role', 'error');
                          },
                        },
                      );
                    },
                  });
                }}
                className="flex-row items-center py-3 border-b"
                style={{ borderColor: ApTheme.Color.border.light }}
              >
                <Icon
                  name={selectedMember?.role === 'MEMBER' ? 'eye' : 'user'}
                  size={20}
                  color={ApTheme.Color.primary}
                  style={{ marginRight: 12 }}
                />
                <ApText size="md" color={colors.text.primary}>
                  {selectedMember?.role === 'MEMBER'
                    ? 'Make Viewer'
                    : 'Make Member'}
                </ApText>
              </TouchableOpacity>
            )}

          <TouchableOpacity
            onPress={() => {
              setShowMemberActions(false);
              setConfirmModal({
                visible: true,
                title: 'Remove Member',
                description: `Are you sure you want to remove ${selectedMember?.user?.name} from the team?`,
                variant: 'danger',
                confirmText: 'Remove',
                onConfirm: () => {
                  if (!selectedMember || !selectedTeamId) return;
                  removeMemberMutation.mutate(
                    {
                      teamId: selectedTeamId,
                      memberId: selectedMember.id,
                    },
                    {
                      onSuccess: () => {
                        setConfirmModal(prev => ({ ...prev, visible: false }));
                        showToast('Member removed successfully', 'success');
                      },
                      onError: () => {
                        setConfirmModal(prev => ({ ...prev, visible: false }));
                        showToast('Failed to remove member', 'error');
                      },
                    },
                  );
                },
              });
            }}
            className="flex-row items-center py-3 mt-2"
          >
            <Icon
              name="user-x"
              size={20}
              color={ApTheme.Color.danger}
              style={{ marginRight: 12 }}
            />
            <ApText size="md" color={ApTheme.Color.danger}>
              Remove from Team
            </ApText>
          </TouchableOpacity>
        </View>
      </ApModal>

      <ApModal
        visible={confirmModal.visible}
        onClose={() => setConfirmModal(prev => ({ ...prev, visible: false }))}
        title={confirmModal.title}
        description={confirmModal.description}
        actions={[
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () =>
              setConfirmModal(prev => ({ ...prev, visible: false })),
          },
          {
            text: confirmModal.confirmText,
            style:
              confirmModal.variant === 'danger' ? 'destructive' : 'default',
            loading:
              updateMemberRoleMutation.isPending ||
              removeMemberMutation.isPending,
            onPress: () => {
              confirmModal.onConfirm();
            },
          },
        ]}
      />
    </ApScreen>
  );
};

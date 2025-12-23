import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
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
} from '../../components';
import Icon from 'react-native-vector-icons/Feather';

interface TeamListScreenProps {
  navigation: any;
}

const mockMembers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@teamsync.com',
    role: 'admin',
    jobTitle: 'Project Manager',
    tasksCompleted: 45,
    avatar: null,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@teamsync.com',
    role: 'member',
    jobTitle: 'Frontend Developer',
    tasksCompleted: 38,
    avatar: null,
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@teamsync.com',
    role: 'member',
    jobTitle: 'Backend Developer',
    tasksCompleted: 52,
    avatar: null,
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice@teamsync.com',
    role: 'member',
    jobTitle: 'UI/UX Designer',
    tasksCompleted: 29,
    avatar: null,
  },
  {
    id: '5',
    name: 'Charlie Davis',
    email: 'charlie@teamsync.com',
    role: 'viewer',
    jobTitle: 'Client',
    tasksCompleted: 0,
    avatar: null,
  },
];

export const TeamListScreen: React.FC<TeamListScreenProps> = ({
  navigation,
}) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'member' | 'viewer'>('member');

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    setShowInviteModal(false);
    setInviteEmail('');
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'primary';
      case 'member':
        return 'info';
      case 'viewer':
        return 'default';
      default:
        return 'default';
    }
  };

  const renderMemberCard = ({ item }: { item: (typeof mockMembers)[0] }) => (
    <ApCard padding="md" style={{ marginBottom: ApTheme.Spacing.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ApAvatar source={item.avatar} name={item.name} size="lg" />
        <View style={{ flex: 1, marginLeft: ApTheme.Spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ApText size="md" weight="semibold">
              {item.name}
            </ApText>
            <ApBadge
              label={item.role}
              variant={getRoleBadgeVariant(item.role) as any}
              size="sm"
              style={{ marginLeft: ApTheme.Spacing.sm }}
            />
          </View>
          <ApText size="sm" color={ApTheme.Color.text.secondary}>
            {item.jobTitle}
          </ApText>
          <ApText
            size="xs"
            color={ApTheme.Color.text.muted}
            style={{ marginTop: 2 }}
          >
            {item.email}
          </ApText>
        </View>
        <View style={{ alignItems: 'center' }}>
          <ApText size="lg" weight="bold" color={ApTheme.Color.primary}>
            {item.tasksCompleted}
          </ApText>
          <ApText size="xs" color={ApTheme.Color.text.muted}>
            tasks
          </ApText>
        </View>
      </View>
    </ApCard>
  );

  return (
    <ApScreen>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: ApTheme.Spacing.md,
          marginBottom: ApTheme.Spacing.lg,
        }}
      >
        <ApText size="xl" weight="bold">
          Team
        </ApText>
        <TouchableOpacity
          onPress={() => setShowInviteModal(true)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: ApTheme.Color.primary,
            paddingHorizontal: ApTheme.Spacing.md,
            paddingVertical: ApTheme.Spacing.sm,
            borderRadius: ApTheme.BorderRadius.md,
          }}
        >
          <Icon name="user-plus" size={16} color={ApTheme.Color.white} />
          <ApText
            size="sm"
            weight="semibold"
            color={ApTheme.Color.white}
            style={{ marginLeft: 6 }}
          >
            Invite
          </ApText>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: 'row',
          backgroundColor: ApTheme.Color.primary + '15',
          borderRadius: ApTheme.BorderRadius.lg,
          padding: ApTheme.Spacing.md,
          marginBottom: ApTheme.Spacing.lg,
        }}
      >
        <View style={{ flex: 1, alignItems: 'center' }}>
          <ApText size="xxl" weight="bold" color={ApTheme.Color.primary}>
            {mockMembers.length}
          </ApText>
          <ApText size="sm" color={ApTheme.Color.text.secondary}>
            Members
          </ApText>
        </View>
        <View
          style={{
            width: 1,
            backgroundColor: ApTheme.Color.border.light,
            marginHorizontal: ApTheme.Spacing.md,
          }}
        />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <ApText size="xxl" weight="bold" color={ApTheme.Color.success}>
            {mockMembers.reduce((sum, m) => sum + m.tasksCompleted, 0)}
          </ApText>
          <ApText size="sm" color={ApTheme.Color.text.secondary}>
            Tasks Done
          </ApText>
        </View>
      </View>

      <FlatList
        data={mockMembers}
        renderItem={renderMemberCard}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <ApModal
        visible={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      >
        <ApText
          size="lg"
          weight="bold"
          style={{ marginBottom: ApTheme.Spacing.md }}
        >
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

        <ApText
          size="sm"
          weight="medium"
          style={{ marginBottom: ApTheme.Spacing.sm }}
        >
          Role
        </ApText>
        <View
          style={{ flexDirection: 'row', marginBottom: ApTheme.Spacing.lg }}
        >
          <TouchableOpacity
            onPress={() => setInviteRole('member')}
            style={{
              flex: 1,
              paddingVertical: ApTheme.Spacing.sm,
              borderRadius: ApTheme.BorderRadius.md,
              borderWidth: 2,
              borderColor:
                inviteRole === 'member'
                  ? ApTheme.Color.primary
                  : ApTheme.Color.border.light,
              alignItems: 'center',
              marginRight: ApTheme.Spacing.sm,
            }}
          >
            <ApText
              size="sm"
              weight={inviteRole === 'member' ? 'semibold' : 'normal'}
              color={
                inviteRole === 'member'
                  ? ApTheme.Color.primary
                  : ApTheme.Color.text.secondary
              }
            >
              Member
            </ApText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setInviteRole('viewer')}
            style={{
              flex: 1,
              paddingVertical: ApTheme.Spacing.sm,
              borderRadius: ApTheme.BorderRadius.md,
              borderWidth: 2,
              borderColor:
                inviteRole === 'viewer'
                  ? ApTheme.Color.primary
                  : ApTheme.Color.border.light,
              alignItems: 'center',
            }}
          >
            <ApText
              size="sm"
              weight={inviteRole === 'viewer' ? 'semibold' : 'normal'}
              color={
                inviteRole === 'viewer'
                  ? ApTheme.Color.primary
                  : ApTheme.Color.text.secondary
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
        />
      </ApModal>
    </ApScreen>
  );
};

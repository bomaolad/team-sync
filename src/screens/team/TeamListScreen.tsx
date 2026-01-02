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
import Icon from '@expo/vector-icons/Feather';
import { useAppTheme } from '../../hooks/useAppTheme';

interface TeamListScreenProps {
  navigation: any;
}

const mockMembers = [
  {
    id: '1',
    name: 'Muhammed Bello',
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
  const { colors } = useAppTheme();
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
    <ApCard padding="md" className="mb-2">
      <View className="flex-row items-center">
        <ApAvatar source={item.avatar} name={item.name} size="lg" />
        <View className="flex-1 ml-4">
          <View className="flex-row items-center">
            <ApText size="md" weight="semibold">
              {item.name}
            </ApText>
            <ApBadge
              label={item.role}
              variant={getRoleBadgeVariant(item.role) as any}
              size="sm"
              className="ml-2"
            />
          </View>
          <ApText size="sm" color={colors.text.secondary}>
            {item.jobTitle}
          </ApText>
          <ApText size="xs" color={ApTheme.Color.text.muted} className="mt-0.5">
            {item.email}
          </ApText>
        </View>
        <View className="items-center">
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
      <View className="flex-row justify-between items-center pt-4 mb-6">
        <ApText size="xl" weight="bold">
          Team
        </ApText>
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

      <View
        className="flex-row rounded-xl p-4 mb-6"
        style={{ backgroundColor: ApTheme.Color.primary + '15' }}
      >
        <View className="flex-1 items-center">
          <ApText size="xxl" weight="bold" color={ApTheme.Color.primary}>
            {mockMembers.length}
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
          <ApText size="xxl" weight="bold" color={ApTheme.Color.success}>
            {mockMembers.reduce((sum, m) => sum + m.tasksCompleted, 0)}
          </ApText>
          <ApText size="sm" color={colors.text.secondary}>
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
            onPress={() => setInviteRole('member')}
            className="flex-1 py-2 rounded-lg items-center mr-2"
            style={{
              borderWidth: 2,
              borderColor:
                inviteRole === 'member'
                  ? ApTheme.Color.primary
                  : ApTheme.Color.border.light,
            }}
          >
            <ApText
              size="sm"
              weight={inviteRole === 'member' ? 'semibold' : 'normal'}
              color={
                inviteRole === 'member'
                  ? ApTheme.Color.primary
                  : colors.text.secondary
              }
            >
              Member
            </ApText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setInviteRole('viewer')}
            className="flex-1 py-2 rounded-lg items-center"
            style={{
              borderWidth: 2,
              borderColor:
                inviteRole === 'viewer'
                  ? ApTheme.Color.primary
                  : ApTheme.Color.border.light,
            }}
          >
            <ApText
              size="sm"
              weight={inviteRole === 'viewer' ? 'semibold' : 'normal'}
              color={
                inviteRole === 'viewer'
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
        />
      </ApModal>
    </ApScreen>
  );
};

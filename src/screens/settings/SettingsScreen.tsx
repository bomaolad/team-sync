import React, { useState } from 'react';
import { View, TouchableOpacity, Switch, Alert } from 'react-native';
import {
  ApTheme,
  ApText,
  ApScreen,
  ApScrollView,
  ApCard,
  ApAvatar,
} from '../../components';
import Icon from '@expo/vector-icons/Feather';
import { useAppTheme } from '../../hooks/useAppTheme';

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  navigation,
}) => {
  const { isDark, toggleTheme, colors } = useAppTheme();
  const [notifications, setNotifications] = useState({
    newTasks: true,
    statusChanges: true,
    comments: true,
    recheckAlerts: true,
  });

  const user = {
    name: 'Muhammed Bello',
    email: 'john@teamsync.com',
    role: 'Admin',
    jobTitle: 'Project Manager',
    avatar: null,
  };

  const lastSynced = '2 minutes ago';

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => navigation.replace('Auth'),
      },
    ]);
  };

  const SettingRow = ({
    icon,
    title,
    value,
    onToggle,
    showChevron,
    onPress,
  }: {
    icon: React.ComponentProps<typeof Icon>['name'];
    title: string;
    value?: boolean;
    onToggle?: (val: boolean) => void;
    showChevron?: boolean;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress && !onToggle}
      className="flex-row items-center py-4"
      style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
    >
      <View
        className="w-9 h-9 rounded-xl items-center justify-center mr-4"
        style={{ backgroundColor: ApTheme.Color.primary + '15' }}
      >
        <Icon name={icon} size={18} color={ApTheme.Color.primary} />
      </View>
      <ApText size="md" className="flex-1">
        {title}
      </ApText>
      {onToggle !== undefined && value !== undefined && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: ApTheme.Color.primary }}
          thumbColor={colors.text.light}
        />
      )}
      {showChevron && (
        <Icon name="chevron-right" size={20} color={colors.text.muted} />
      )}
    </TouchableOpacity>
  );

  return (
    <ApScreen>
      <ApScrollView>
        <ApText size="xl" weight="bold" className="pt-4 mb-6">
          Settings
        </ApText>

        <ApCard padding="md" className="mb-6">
          <View className="flex-row items-center">
            <ApAvatar source={user.avatar} name={user.name} size="lg" />
            <View className="flex-1 ml-4">
              <ApText size="lg" weight="semibold">
                {user.name}
              </ApText>
              <ApText size="sm" color={colors.text.secondary}>
                {user.jobTitle}
              </ApText>
              <ApText size="xs" color={colors.text.muted}>
                {user.email}
              </ApText>
            </View>
            <TouchableOpacity>
              <Icon name="edit-2" size={20} color={ApTheme.Color.primary} />
            </TouchableOpacity>
          </View>
        </ApCard>

        <ApText
          size="sm"
          weight="semibold"
          color={colors.text.secondary}
          className="mb-2"
        >
          APPEARANCE
        </ApText>
        <ApCard padding="sm" className="mb-6">
          <SettingRow
            icon="moon"
            title="Dark Mode"
            value={isDark}
            onToggle={() => toggleTheme()}
          />
        </ApCard>

        <ApText
          size="sm"
          weight="semibold"
          color={colors.text.secondary}
          className="mb-2"
        >
          NOTIFICATIONS
        </ApText>
        <ApCard padding="sm" className="mb-6">
          <SettingRow
            icon="check-circle"
            title="New Task Assignments"
            value={notifications.newTasks}
            onToggle={val =>
              setNotifications(prev => ({ ...prev, newTasks: val }))
            }
          />
          <SettingRow
            icon="refresh-cw"
            title="Status Changes"
            value={notifications.statusChanges}
            onToggle={val =>
              setNotifications(prev => ({ ...prev, statusChanges: val }))
            }
          />
          <SettingRow
            icon="message-circle"
            title="New Comments"
            value={notifications.comments}
            onToggle={val =>
              setNotifications(prev => ({ ...prev, comments: val }))
            }
          />
          <SettingRow
            icon="alert-circle"
            title="Recheck Alerts"
            value={notifications.recheckAlerts}
            onToggle={val =>
              setNotifications(prev => ({ ...prev, recheckAlerts: val }))
            }
          />
        </ApCard>

        <ApText
          size="sm"
          weight="semibold"
          color={colors.text.secondary}
          className="mb-2"
        >
          SYNC
        </ApText>
        <ApCard padding="sm" className="mb-6">
          <View className="flex-row items-center py-4">
            <View
              className="w-9 h-9 rounded-xl items-center justify-center mr-4"
              style={{ backgroundColor: ApTheme.Color.success + '15' }}
            >
              <Icon name="cloud" size={18} color={ApTheme.Color.success} />
            </View>
            <View className="flex-1">
              <ApText size="md">Sync Status</ApText>
              <ApText size="xs" color={ApTheme.Color.success}>
                Last synced: {lastSynced}
              </ApText>
            </View>
            <TouchableOpacity>
              <Icon name="refresh-cw" size={20} color={ApTheme.Color.primary} />
            </TouchableOpacity>
          </View>
        </ApCard>

        <ApText
          size="sm"
          weight="semibold"
          color={colors.text.secondary}
          className="mb-2"
        >
          ABOUT
        </ApText>
        <ApCard padding="sm" className="mb-6">
          <SettingRow
            icon="info"
            title="About TeamSync"
            showChevron
            onPress={() => {}}
          />
          <SettingRow
            icon="shield"
            title="Privacy Policy"
            showChevron
            onPress={() => {}}
          />
          <SettingRow
            icon="file-text"
            title="Terms of Service"
            showChevron
            onPress={() => {}}
          />
        </ApCard>

        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center justify-center py-4 mb-8"
        >
          <Icon name="log-out" size={20} color={ApTheme.Color.danger} />
          <ApText
            size="md"
            weight="semibold"
            color={ApTheme.Color.danger}
            className="ml-2"
          >
            Logout
          </ApText>
        </TouchableOpacity>
      </ApScrollView>
    </ApScreen>
  );
};

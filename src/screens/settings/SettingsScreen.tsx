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

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  navigation,
}) => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    newTasks: true,
    statusChanges: true,
    comments: true,
    recheckAlerts: true,
  });

  const user = {
    name: 'John Doe',
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
    icon: string;
    title: string;
    value?: boolean;
    onToggle?: (val: boolean) => void;
    showChevron?: boolean;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress && !onToggle}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: ApTheme.Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: ApTheme.Color.border.light,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: ApTheme.Color.primary + '15',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: ApTheme.Spacing.md,
        }}
      >
        <Icon name={icon} size={18} color={ApTheme.Color.primary} />
      </View>
      <ApText size="md" style={{ flex: 1 }}>
        {title}
      </ApText>
      {onToggle !== undefined && value !== undefined && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{
            false: ApTheme.Color.border.light,
            true: ApTheme.Color.primary,
          }}
          thumbColor={ApTheme.Color.white}
        />
      )}
      {showChevron && (
        <Icon name="chevron-right" size={20} color={ApTheme.Color.text.muted} />
      )}
    </TouchableOpacity>
  );

  return (
    <ApScreen>
      <ApScrollView>
        <ApText
          size="xl"
          weight="bold"
          style={{
            paddingTop: ApTheme.Spacing.md,
            marginBottom: ApTheme.Spacing.lg,
          }}
        >
          Settings
        </ApText>

        <ApCard padding="md" style={{ marginBottom: ApTheme.Spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ApAvatar source={user.avatar} name={user.name} size="lg" />
            <View style={{ flex: 1, marginLeft: ApTheme.Spacing.md }}>
              <ApText size="lg" weight="semibold">
                {user.name}
              </ApText>
              <ApText size="sm" color={ApTheme.Color.text.secondary}>
                {user.jobTitle}
              </ApText>
              <ApText size="xs" color={ApTheme.Color.text.muted}>
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
          color={ApTheme.Color.text.secondary}
          style={{ marginBottom: ApTheme.Spacing.sm }}
        >
          APPEARANCE
        </ApText>
        <ApCard padding="sm" style={{ marginBottom: ApTheme.Spacing.lg }}>
          <SettingRow
            icon="moon"
            title="Dark Mode"
            value={darkMode}
            onToggle={setDarkMode}
          />
        </ApCard>

        <ApText
          size="sm"
          weight="semibold"
          color={ApTheme.Color.text.secondary}
          style={{ marginBottom: ApTheme.Spacing.sm }}
        >
          NOTIFICATIONS
        </ApText>
        <ApCard padding="sm" style={{ marginBottom: ApTheme.Spacing.lg }}>
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
          color={ApTheme.Color.text.secondary}
          style={{ marginBottom: ApTheme.Spacing.sm }}
        >
          SYNC
        </ApText>
        <ApCard padding="sm" style={{ marginBottom: ApTheme.Spacing.lg }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: ApTheme.Spacing.md,
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: ApTheme.Color.success + '15',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: ApTheme.Spacing.md,
              }}
            >
              <Icon name="cloud" size={18} color={ApTheme.Color.success} />
            </View>
            <View style={{ flex: 1 }}>
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
          color={ApTheme.Color.text.secondary}
          style={{ marginBottom: ApTheme.Spacing.sm }}
        >
          ABOUT
        </ApText>
        <ApCard padding="sm" style={{ marginBottom: ApTheme.Spacing.lg }}>
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
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: ApTheme.Spacing.md,
            marginBottom: ApTheme.Spacing.xl,
          }}
        >
          <Icon name="log-out" size={20} color={ApTheme.Color.danger} />
          <ApText
            size="md"
            weight="semibold"
            color={ApTheme.Color.danger}
            style={{ marginLeft: ApTheme.Spacing.sm }}
          >
            Logout
          </ApText>
        </TouchableOpacity>
      </ApScrollView>
    </ApScreen>
  );
};

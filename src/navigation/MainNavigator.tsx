import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from '@expo/vector-icons/Feather';
import { ApTheme } from '../components';
import { useAppTheme } from '../hooks/useAppTheme';

import { DashboardScreen } from '../screens/home';
import {
  ProjectsListScreen,
  ProjectDetailScreen,
  CreateProjectScreen,
} from '../screens/projects';
import { TaskDetailScreen, CreateTaskScreen } from '../screens/tasks';
import { TeamListScreen } from '../screens/team';
import { SettingsScreen } from '../screens/settings';

export type MainStackParamList = {
  MainTabs: undefined;
  ProjectDetail: { projectId: string };
  TaskDetail: { taskId: string };
  CreateTask: { taskId?: string };
  CreateProject: { projectId?: string };
  Profile: undefined;
};

export type MainTabsParamList = {
  Home: undefined;
  Projects: undefined;
  Team: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();

const TabNavigator: React.FC = () => {
  const { colors } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 8,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Projects"
        component={ProjectsListScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="folder" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Team"
        component={TeamListScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="users" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
      <Stack.Screen name="CreateTask" component={CreateTaskScreen} />
      <Stack.Screen name="CreateProject" component={CreateProjectScreen} />
    </Stack.Navigator>
  );
};

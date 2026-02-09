import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from '@expo/vector-icons/Feather';
import { useAuthStore } from '@/src/store/authStore';
import { useAppTheme } from '@/src/hooks';
import { ApTheme } from '@/src/components';

import {
  LoginScreen,
  SignUpScreen,
  ForgotPasswordScreen,
} from '@/src/modules/auth';
import { DashboardScreen } from '@/src/modules/dashboard';
import {
  ProjectsListScreen,
  ProjectDetailScreen,
  CreateProjectScreen,
} from '@/src/modules/projects';
import { TaskDetailScreen, CreateTaskScreen } from '@/src/modules/tasks';
import { TeamListScreen } from '@/src/modules/team';
import { SettingsScreen } from '@/src/modules/settings';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { colors, isDark } = useAppTheme();

  return (
    <Tab.Navigator
      id="MainTabs"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: ApTheme.Color.primary,
        tabBarInactiveTintColor: colors.text.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingTop: 4,
          paddingBottom: 8,
          height: 60,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: React.ComponentProps<typeof Icon>['name'] = 'home';

          if (route.name === 'Dashboard') {
            iconName = 'home';
          } else if (route.name === 'Projects') {
            iconName = 'folder';
          } else if (route.name === 'Team') {
            iconName = 'users';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Projects" component={ProjectsListScreen} />
      <Tab.Screen name="Team" component={TeamListScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const AuthStack = () => (
  <Stack.Navigator
    id="AuthStack"
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

const MainStack = () => (
  <Stack.Navigator
    id="MainStack"
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen name="Tabs" component={TabNavigator} />
    <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
    <Stack.Screen name="CreateProject" component={CreateProjectScreen} />
    <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
    <Stack.Screen name="CreateTask" component={CreateTaskScreen} />
  </Stack.Navigator>
);

export const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return null;
  }

  return isAuthenticated ? <MainStack /> : <AuthStack />;
};

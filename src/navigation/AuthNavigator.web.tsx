import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  SplashScreen,
  LoginScreen,
  SignUpScreen,
  ForgotPasswordScreen,
  VerifyEmailScreen,
  CreateProfileScreen,
} from '../screens/auth';

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  VerifyEmail: { email: string };
  CreateProfile: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
      <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
    </Stack.Navigator>
  );
};

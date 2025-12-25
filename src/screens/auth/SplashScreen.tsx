import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { ApTheme, ApText } from '../../components';

interface SplashScreenProps {
  navigation: any;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    const checkAuth = () => {
      setTimeout(() => {
        navigation.replace('Login');
      }, 2000);
    };
    checkAuth();
  }, [navigation]);

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: ApTheme.Color.primary }}
    >
      <View className="items-center">
        <View
          className="w-[100px] h-[100px] rounded-3xl items-center justify-center mb-6"
          style={{ backgroundColor: ApTheme.Color.white }}
        >
          <ApText size="xxxl" weight="bold" color={ApTheme.Color.primary}>
            TS
          </ApText>
        </View>

        <ApText size="xxl" weight="bold" color={ApTheme.Color.white}>
          TeamSync
        </ApText>

        <ApText
          size="md"
          color={ApTheme.Color.white}
          className="mt-2 opacity-80"
        >
          Collaborate. Manage. Succeed.
        </ApText>
      </View>

      <ActivityIndicator
        size="large"
        color={ApTheme.Color.white}
        style={{ position: 'absolute', bottom: 60 }}
      />
    </View>
  );
};

import React, { useEffect } from 'react';
import { View, ActivityIndicator, Image, Dimensions } from 'react-native';
import { ApTheme, ApText } from '../../components';

const { width, height } = Dimensions.get('window');

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
      style={{
        flex: 1,
        backgroundColor: ApTheme.Color.primary,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View style={{ alignItems: 'center' }}>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 24,
            backgroundColor: ApTheme.Color.white,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: ApTheme.Spacing.lg,
          }}
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
          style={{ marginTop: ApTheme.Spacing.sm, opacity: 0.8 }}
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

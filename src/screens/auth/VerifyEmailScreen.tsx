import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { ApTheme, ApText, ApScreen, ApButton } from '../../components';
import Icon from '@expo/vector-icons/Feather';
import { useAppTheme } from '../../hooks/useAppTheme';

interface VerifyEmailScreenProps {
  navigation: any;
  route: any;
}

export const VerifyEmailScreen: React.FC<VerifyEmailScreenProps> = ({
  navigation,
  route,
}) => {
  const { colors } = useAppTheme();
  const email = route?.params?.email || 'your email';
  const [code, setCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleCodeChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text[text.length - 1];
    }

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    setError('');

    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const fullCode = code.join('');
    if (fullCode.length !== 4) {
      setError('Please enter the complete code');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('CreateProfile');
    }, 1500);
  };

  const handleResendCode = () => {
    setCode(['', '', '', '']);
    setError('');
  };

  return (
    <ApScreen>
      <View className="flex-1 pt-10">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
          <Icon name="arrow-left" size={24} color={colors.text.primary} />
        </TouchableOpacity>

        <View
          className="w-16 h-16 rounded-full items-center justify-center mb-6"
          style={{ backgroundColor: ApTheme.Color.primary + '15' }}
        >
          <Icon name="mail" size={28} color={ApTheme.Color.primary} />
        </View>

        <ApText size="xxl" weight="bold" color={colors.text.primary}>
          Verify Your Email
        </ApText>

        <ApText size="md" color={colors.text.secondary} className="mt-1 mb-8">
          We've sent a 4-digit code to {email}. Enter it below to verify.
        </ApText>

        <View className="flex-row justify-between mb-4">
          {[0, 1, 2, 3].map(index => (
            <TextInput
              key={index}
              ref={ref => {
                inputRefs.current[index] = ref;
              }}
              className="w-16 h-16 rounded-xl text-center text-2xl font-bold"
              style={{
                borderWidth: 2,
                borderColor: error
                  ? ApTheme.Color.danger
                  : code[index]
                  ? ApTheme.Color.primary
                  : ApTheme.Color.border.light,
                backgroundColor: ApTheme.Color.surface.light,
                color: colors.text.primary,
              }}
              value={code[index]}
              onChangeText={text => handleCodeChange(text, index)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, index)
              }
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        {error && (
          <ApText size="sm" color={ApTheme.Color.danger} className="mb-4">
            {error}
          </ApText>
        )}

        <ApButton
          title="Verify Email"
          onPress={handleVerify}
          loading={loading}
          fullWidth
          className="mt-6"
        />

        <View className="flex-row justify-center mt-8">
          <ApText size="md" color={colors.text.secondary}>
            Didn't receive the code?{' '}
          </ApText>
          <TouchableOpacity onPress={handleResendCode}>
            <ApText size="md" weight="semibold" color={ApTheme.Color.primary}>
              Resend
            </ApText>
          </TouchableOpacity>
        </View>
      </View>
    </ApScreen>
  );
};

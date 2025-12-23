import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { ApTheme, ApText, ApScreen, ApButton } from '../../components';
import Icon from 'react-native-vector-icons/Feather';

interface VerifyEmailScreenProps {
  navigation: any;
  route: any;
}

export const VerifyEmailScreen: React.FC<VerifyEmailScreenProps> = ({
  navigation,
  route,
}) => {
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
    <ApScreen backgroundColor={ApTheme.Color.background.light}>
      <View style={{ flex: 1, paddingTop: 40 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginBottom: ApTheme.Spacing.lg }}
        >
          <Icon
            name="arrow-left"
            size={24}
            color={ApTheme.Color.text.primary}
          />
        </TouchableOpacity>

        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: ApTheme.Color.primary + '15',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: ApTheme.Spacing.lg,
          }}
        >
          <Icon name="mail" size={28} color={ApTheme.Color.primary} />
        </View>

        <ApText size="xxl" weight="bold" color={ApTheme.Color.text.primary}>
          Verify Your Email
        </ApText>

        <ApText
          size="md"
          color={ApTheme.Color.text.secondary}
          style={{
            marginTop: ApTheme.Spacing.xs,
            marginBottom: ApTheme.Spacing.xl,
          }}
        >
          We've sent a 4-digit code to {email}. Enter it below to verify.
        </ApText>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: ApTheme.Spacing.md,
          }}
        >
          {[0, 1, 2, 3].map(index => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              style={{
                width: 64,
                height: 64,
                borderRadius: ApTheme.BorderRadius.lg,
                borderWidth: 2,
                borderColor: error
                  ? ApTheme.Color.danger
                  : code[index]
                  ? ApTheme.Color.primary
                  : ApTheme.Color.border.light,
                backgroundColor: ApTheme.Color.surface.light,
                fontSize: 24,
                fontWeight: '700',
                textAlign: 'center',
                color: ApTheme.Color.text.primary,
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
          <ApText
            size="sm"
            color={ApTheme.Color.danger}
            style={{ marginBottom: ApTheme.Spacing.md }}
          >
            {error}
          </ApText>
        )}

        <ApButton
          title="Verify Email"
          onPress={handleVerify}
          loading={loading}
          fullWidth
          style={{ marginTop: ApTheme.Spacing.lg }}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: ApTheme.Spacing.xl,
          }}
        >
          <ApText size="md" color={ApTheme.Color.text.secondary}>
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

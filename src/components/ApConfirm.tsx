import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, Platform } from 'react-native';
import { ApText } from './ApText';
import { ApButton } from './ApButton';
import { useAppTheme } from '../hooks/useAppTheme';
import { ApTheme } from './ApTheme';

interface ApConfirmProps {
  children: React.ReactNode;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  confirmVariant?: 'primary' | 'danger';
  disabled?: boolean;
}

export const ApConfirm: React.FC<ApConfirmProps> = ({
  children,
  title = 'Confirm',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  confirmVariant = 'danger',
  disabled = false,
}) => {
  const { colors } = useAppTheme();
  const [visible, setVisible] = useState(false);

  const handleOpen = () => {
    if (!disabled) {
      setVisible(true);
    }
  };

  const handleConfirm = () => {
    setVisible(false);
    onConfirm();
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <TouchableOpacity onPress={handleOpen} disabled={disabled}>
        {children}
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <TouchableOpacity
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          activeOpacity={1}
          onPress={handleCancel}
        >
          <TouchableOpacity
            activeOpacity={1}
            className="rounded-2xl p-5 mx-6"
            style={{
              backgroundColor: colors.background,
              width: Platform.OS === 'web' ? 320 : undefined,
              minWidth: 280,
              maxWidth: 400,
            }}
          >
            <ApText
              size="lg"
              weight="semibold"
              color={colors.text.primary}
              className="mb-2"
            >
              {title}
            </ApText>
            <ApText size="sm" color={colors.text.secondary} className="mb-4">
              {message}
            </ApText>
            <View className="flex-row gap-3">
              <ApButton
                title={cancelText}
                variant="outline"
                onPress={handleCancel}
                className="flex-1"
                size="sm"
              />
              <ApButton
                title={confirmText}
                onPress={handleConfirm}
                className="flex-1"
                size="sm"
                style={{
                  backgroundColor:
                    confirmVariant === 'danger'
                      ? ApTheme.Color.danger
                      : ApTheme.Color.primary,
                }}
              />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

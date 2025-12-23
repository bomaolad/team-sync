import React from 'react';
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  ModalProps,
  Dimensions,
} from 'react-native';
import { ApTheme } from './ApTheme';

interface ApModalProps extends Omit<ModalProps, 'visible'> {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: 'center' | 'bottom';
  className?: string;
}

import { useAppTheme } from '../hooks/useAppTheme';

export const ApModal: React.FC<ApModalProps> = ({
  visible,
  onClose,
  children,
  position = 'center',
  animationType = 'fade',
  transparent = true,
  ...props
}) => {
  const { colors } = useAppTheme();
  const isBottom = position === 'bottom';

  return (
    <Modal
      visible={visible}
      animationType={isBottom ? 'slide' : animationType}
      transparent={transparent}
      onRequestClose={onClose}
      {...props}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: isBottom ? 'flex-end' : 'center',
            alignItems: 'center',
          }}
        >
          <TouchableWithoutFeedback>
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: isBottom
                  ? ApTheme.BorderRadius.xl
                  : ApTheme.BorderRadius.lg,
                borderBottomLeftRadius: isBottom ? 0 : ApTheme.BorderRadius.lg,
                borderBottomRightRadius: isBottom ? 0 : ApTheme.BorderRadius.lg,
                padding: ApTheme.Spacing.lg,
                width: isBottom ? '100%' : '90%',
                maxWidth: isBottom ? undefined : 400,
                maxHeight: '80%',
              }}
            >
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

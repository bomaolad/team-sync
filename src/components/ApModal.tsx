import React from 'react';
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  ModalProps,
} from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';

interface ApModalProps extends Omit<ModalProps, 'visible'> {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: 'center' | 'bottom';
  className?: string;
}

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
          className={`flex-1 items-center ${
            isBottom ? 'justify-end' : 'justify-center'
          }`}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <TouchableWithoutFeedback>
            <View
              className={`p-6 max-h-[80%] ${
                isBottom
                  ? 'w-full rounded-t-2xl'
                  : 'w-[90%] max-w-[400px] rounded-xl'
              }`}
              style={{ backgroundColor: colors.surface }}
            >
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

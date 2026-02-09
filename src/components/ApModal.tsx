import React from 'react';
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  ModalProps,
  TouchableOpacity,
} from 'react-native';
import { ApText } from './ApText';
import { ApButton } from './ApButton';
import { useAppTheme } from '../hooks/useAppTheme';

interface ModalAction {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
  loading?: boolean;
}

interface ApModalProps extends Omit<ModalProps, 'visible'> {
  visible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  position?: 'center' | 'bottom';
  className?: string;
  title?: string;
  description?: string;
  actions?: ModalAction[];
}

export const ApModal: React.FC<ApModalProps> = ({
  visible,
  onClose,
  children,
  position = 'center',
  title,
  description,
  actions,
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
              {title || description || actions ? (
                <View>
                  {title && (
                    <ApText
                      size="lg"
                      weight="bold"
                      align="center"
                      className="mb-2"
                    >
                      {title}
                    </ApText>
                  )}
                  {description && (
                    <ApText
                      size="md"
                      color={colors.text.secondary}
                      align="center"
                      className="mb-6"
                    >
                      {description}
                    </ApText>
                  )}
                  {children}
                  {actions && actions.length > 0 && (
                    <View className="flex-row justify-end space-x-3 gap-3 mt-4">
                      {actions.map((action, index) => (
                        <View key={index} className="flex-1">
                          <ApButton
                            title={action.text}
                            onPress={() => {
                              action.onPress?.();
                              if (!action.loading) {
                                onClose();
                              }
                            }}
                            variant={
                              action.style === 'destructive'
                                ? 'danger'
                                : action.style === 'cancel'
                                ? 'outline'
                                : 'primary'
                            }
                            size="md"
                            loading={action.loading}
                            fullWidth
                          />
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ) : (
                children
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

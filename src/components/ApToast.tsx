import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { View, Animated, Platform } from 'react-native';
import { ApText } from './ApText';
import { ApTheme } from './ApTheme';
import Icon from '@expo/vector-icons/Feather';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

const getToastConfig = (type: ToastType) => {
  const configs = {
    success: {
      backgroundColor: ApTheme.Color.success,
      icon: 'check-circle' as const,
    },
    error: {
      backgroundColor: ApTheme.Color.danger,
      icon: 'alert-circle' as const,
    },
    warning: {
      backgroundColor: ApTheme.Color.warning,
      icon: 'alert-triangle' as const,
    },
    info: {
      backgroundColor: ApTheme.Color.primary,
      icon: 'info' as const,
    },
  };
  return configs[type];
};

interface ToastItemProps {
  message: ToastMessage;
  onHide: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ message, onHide }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [translateY] = useState(new Animated.Value(-20));
  const config = getToastConfig(message.type);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -20,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => onHide());
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY }],
        backgroundColor: config.backgroundColor,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <Icon name={config.icon} size={20} color={ApTheme.Color.white} />
      <ApText
        size="sm"
        weight="medium"
        color={ApTheme.Color.white}
        style={{ marginLeft: 10, flex: 1 }}
      >
        {message.message}
      </ApText>
    </Animated.View>
  );
};

interface ToastProviderProps {
  children: ReactNode;
}

let toastIdCounter = 0;

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = ++toastIdCounter;
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const hideToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <View
        style={{
          position: 'absolute',
          top: Platform.OS === 'web' ? 20 : 60,
          left: 16,
          right: 16,
          zIndex: 9999,
        }}
        pointerEvents="box-none"
      >
        {toasts.map(toast => (
          <ToastItem
            key={toast.id}
            message={toast}
            onHide={() => hideToast(toast.id)}
          />
        ))}
      </View>
    </ToastContext.Provider>
  );
};

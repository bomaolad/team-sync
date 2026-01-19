import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthStore } from '@/src/store/authStore';
import {
  useLogin,
  useRegister,
  useLogout,
  useHydrateAuth,
} from '@/src/hooks/useAuth';

interface IProps {
  children: ReactNode;
}

type TAuthContext = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  login: ReturnType<typeof useLogin>;
  register: ReturnType<typeof useRegister>;
  logout: ReturnType<typeof useLogout>;
  hydrateAuth: ReturnType<typeof useHydrateAuth>;
};

const AuthContext = createContext<TAuthContext | undefined>(undefined);

export const useAuthState = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthState must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<IProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const login = useLogin();
  const register = useRegister();
  const logout = useLogout();
  const hydrateAuth = useHydrateAuth();

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        register,
        logout,
        hydrateAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

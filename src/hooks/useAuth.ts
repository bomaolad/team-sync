import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, userService } from '../services';
import { useAuthStore } from '../store/authStore';
import { LoginRequest, RegisterRequest, User } from '../types';

const AUTH_TOKEN_KEY = '@TeamSync:token';

export const useLogin = () => {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: response => {
      login(response.user, response.accessToken);
      AsyncStorage.setItem(AUTH_TOKEN_KEY, response.accessToken);
    },
  });
};

export const useRegister = () => {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: response => {
      login(response.user, response.accessToken);
      AsyncStorage.setItem(AUTH_TOKEN_KEY, response.accessToken);
    },
  });
};

export const useProfile = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['profile'],
    queryFn: () => userService.getProfile(),
    enabled: isAuthenticated,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: Partial<User>) => userService.updateProfile(data),
    onSuccess: updatedUser => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return () => {
    logout();
    AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    queryClient.clear();
  };
};

export const useHydrateAuth = () => {
  const { login, setLoading, setToken } = useAuthStore();

  return () => {
    setLoading(true);
    AsyncStorage.getItem(AUTH_TOKEN_KEY)
      .then(token => {
        if (token) {
          setToken(token);
          return userService.getProfile();
        }
        return null;
      })
      .then(user => {
        if (user) {
          const storedToken = useAuthStore.getState().token;
          if (storedToken) {
            login(user, storedToken);
          }
        }
      })
      .catch(() => {
        AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      })
      .finally(() => {
        setLoading(false);
      });
  };
};

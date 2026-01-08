import { api } from './api';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types';

export const authService = {
  login: (data: LoginRequest): Promise<AuthResponse> =>
    api.post('/auth/login', data).then(res => res.data),

  register: (data: RegisterRequest): Promise<AuthResponse> =>
    api.post('/auth/register', data).then(res => res.data),
};

export const userService = {
  getProfile: (): Promise<User> => api.get('/users/me').then(res => res.data),

  updateProfile: (data: Partial<User>): Promise<User> =>
    api.patch('/users/me', data).then(res => res.data),
};

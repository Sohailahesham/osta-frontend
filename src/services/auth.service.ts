import { api } from '@/api/axios';
import { RegisterUserData, LoginData, AuthResponse } from '@/types/auth.types';

// For user 
export const registerUser = (data: RegisterUserData) => {
  return api.post<AuthResponse>('/auth/register/user', data);
};

export const registerTechnician = (data: RegisterUserData) => {
  return api.post<AuthResponse>('/auth/register/technician', data);
};

export const loginUser = (data: LoginData) => {
  return api.post<AuthResponse>('/auth/login', data);
};

export const logoutUser = () => {
  return api.get('/auth/logout');
};

export const refreshToken = () => {
  return api.get('/auth/refresh');
};
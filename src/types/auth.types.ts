export type UserRole = 'technician' | 'client';

// Register
export interface RegisterUserData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  governorate?: string;
  city?: string;
}

// Login
export interface LoginData {
  email: string;
  password: string;
}

// Response
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
    currentStep: number;
  };
}
export type UserRole = 'technician' | 'client' | 'admin';
export type AuthProvider = 'local' | 'google';

export interface TechnicianData {
  currentStep: number;
  isProfileComplete: boolean;
  verificationStatus: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  provider: AuthProvider;
  isVerified: boolean;
  profileComplete: boolean;
  technicianData?: TechnicianData;
}

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
  user: AuthUser;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  avatarUrl?: string;
  currencyPreference?: string;
  role?: string;
  createdAt?: string;
}

export interface AuthSession {
  user: UserProfile | null;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  email: string;
  fullName: string;
  password?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword?: string;
}

export interface AuthResponse {
  user: UserProfile;
  accessToken?: string;
  message?: string;
}

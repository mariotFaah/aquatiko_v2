// frontend/src/core/auth/types/index.ts

// Types pour le système d'authentification
export interface User {
  id: number;
  email: string;
  nom: string;
  role: 'admin' | 'comptable' | 'commercial';
  prenom?: string;
  code_role?: string;
  nom_role?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresIn?: number;
}

export interface ValidateTokenResponse {
  user: User;
  isValid: boolean;
  expiresAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: LoginResponse;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
  statusCode?: number;
}

// Types pour les permissions
export interface Permission {
  module: string;
  actions: string[];
}

export interface UserWithPermissions extends User {
  permissions?: Permission[];
}
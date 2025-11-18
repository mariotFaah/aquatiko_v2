// src/core/auth/types/index.ts
export interface User {
  id_user: number;
  email: string;
  nom: string;
  prenom: string;
  code_role: string;
  nom_role: string;
  role_description?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  validateToken: () => Promise<boolean>;
  hasPermission: (module: string, action: string) => boolean;
  hasRole: (roles: string[]) => boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
    expiresIn: string;
  };
}

export interface ValidateTokenResponse {
  success: boolean;
  valid: boolean;
  message?: string;
  data?: {
    user: User;
  };
}
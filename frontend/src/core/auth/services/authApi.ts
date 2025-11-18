// src/core/auth/services/authApi.ts

// ✅ Supprimer l'import inutile et définir les types localement
export interface User {
  id_user: number;
  email: string;
  nom: string;
  prenom: string;
  code_role: string;
  nom_role: string;
  role_description?: string;
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

class AuthApi {
  private baseURL = 'http://localhost:3001/api/auth';

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur de connexion');
      }

      return data;
    } catch (error) {
      console.error('Erreur API login:', error);
      throw error;
    }
  }

  async validateToken(token: string): Promise<ValidateTokenResponse> {
    try {
      const response = await fetch(`${this.baseURL}/validate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur de validation');
      }

      return data;
    } catch (error) {
      console.error('Erreur API validateToken:', error);
      throw error;
    }
  }

  async getCurrentUser(token: string): Promise<User> {
    try {
      const response = await fetch(`${this.baseURL}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur récupération utilisateur');
      }

      return data.data.user;
    } catch (error) {
      console.error('Erreur API getCurrentUser:', error);
      throw error;
    }
  }
}

export const authApi = new AuthApi();
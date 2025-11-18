// src/core/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi } from '../auth/services/authApi';
import { tokenUtils } from '../auth/utils/tokenUtils';
import type { LoginData, AuthState, AuthContextType } from '../auth/types';

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Vérifier le token au chargement de l'app
  useEffect(() => {
    checkStoredToken();
  }, []);

  const checkStoredToken = async () => {
    try {
      const storedToken = tokenUtils.getToken();
      
      if (storedToken) {
        const isValid = await validateStoredToken(storedToken);
        
        if (isValid) {
          setAuthState(prev => ({
            ...prev,
            token: storedToken,
            isAuthenticated: true,
            isLoading: false,
          }));
        } else {
          tokenUtils.removeToken();
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
          }));
        }
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error('Erreur vérification token:', error);
      tokenUtils.removeToken();
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  const validateStoredToken = async (token: string): Promise<boolean> => {
    try {
      const response = await authApi.validateToken(token);
      // ✅ CORRECTION : Utiliser l'opérateur de chaînage optionnel
      if (response.success && response.data?.user) {
        setAuthState(prev => ({
          ...prev,
          user: response.data.user,
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur validation token:', error);
      return false;
    }
  };

  // Fonction de connexion
  const login = async (data: LoginData): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const response = await authApi.login(data.email, data.password);
      
      // ✅ CORRECTION : Utiliser l'opérateur de chaînage optionnel
      if (response.success && response.data?.user && response.data?.token) {
        const { user, token } = response.data;
        
        tokenUtils.setToken(token);
        
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error(response.message || 'Erreur de connexion');
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Fonction de déconnexion
  const logout = (): void => {
    tokenUtils.removeToken();
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  // Valider le token actuel
  const validateToken = async (): Promise<boolean> => {
    if (!authState.token) return false;
    
    try {
      const response = await authApi.validateToken(authState.token);
      // ✅ CORRECTION : Utiliser l'opérateur de chaînage optionnel
      if (response.success && response.valid && response.data?.user) {
        setAuthState(prev => ({
          ...prev,
          user: response.data.user,
        }));
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error('Erreur validation token:', error);
      logout();
      return false;
    }
  };

  // Vérifier les permissions
  const hasPermission = (module: string, action: string): boolean => {
    const userRole = authState.user?.code_role;
    
    switch (userRole) {
      case 'admin':
        return true;
      case 'comptable':
        return module === 'comptabilite';
      case 'commercial':
        return module === 'crm' || module === 'import-export';
      case 'utilisateur':
        return action === 'read';
      default:
        return false;
    }
  };

  // Vérifier les rôles
  const hasRole = (roles: string[]): boolean => {
    return authState.user ? roles.includes(authState.user.code_role) : false;
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    validateToken,
    hasPermission,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ EXPORTS CORRECTS
export { AuthProvider, useAuth };
export default AuthContext;
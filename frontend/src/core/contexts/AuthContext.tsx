import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, LoginCredentials } from '../auth/types';
import { authApi } from '../auth/services/authApi';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: User['role']) => boolean;
  isLoading: boolean; // ✅ AJOUTER cette propriété
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ AJOUTER l'état de loading

  useEffect(() => {
    // Vérifier l'authentification au chargement
    const checkAuth = async () => {
      try {
        const currentUser = authApi.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
      } finally {
        setIsLoading(false); // ✅ FIN du loading
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true); // ✅ DÉBUT du loading pendant la connexion
    try {
      const response = await authApi.login(credentials);
      if (response.success) {
        const { user, token } = response.data;
        authApi.setAuthData(user, token);
        setUser(user);
      } else {
        throw new Error(response.message);
      }
    } finally {
      setIsLoading(false); // ✅ FIN du loading après connexion
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const isAuthenticated = !!user;
  
  const hasRole = (role: User['role']) => {
    return user?.role === role || user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated, 
      hasRole,
      isLoading // ✅ INCLURE dans le contexte
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
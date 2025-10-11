#!/bin/bash

echo "🚀 Configuration de l'architecture Aquatiko Frontend..."

# Créer la structure des dossiers
mkdir -p src/{components/{ui,forms,layout,comptabilite,import-export,crm},hooks,services,types,utils,contexts,pages/{comptabilite,import-export,crm,auth},lib,constants}

echo "✅ Structure de dossiers créée"

# Créer le fichier types
cat > src/types/index.ts << 'TYPESEOF'
// Types communs
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Comptabilité
export interface Tiers {
  id_tiers: number;
  type_tiers: 'client' | 'fournisseur';
  nom: string;
  numero: string;
  adresse?: string;
  email?: string;
  telephone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Article {
  code_article: string;
  description: string;
  prix_unitaire: number;
  taux_tva: number;
  unite: string;
  actif: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Facture {
  numero_facture: number;
  date: string;
  type_facture: 'proforma' | 'facture' | 'avoir';
  id_tiers: number;
  total_ht: number;
  total_tva: number;
  total_ttc: number;
  statut: 'brouillon' | 'validee' | 'annulee';
  nom_tiers?: string;
}

export interface LigneFacture {
  id_ligne: number;
  numero_facture: number;
  code_article: string;
  description: string;
  quantite: number;
  prix_unitaire: number;
  taux_tva: number;
  remise: number;
  montant_ht: number;
  montant_tva: number;
  montant_ttc: number;
}

export interface Paiement {
  id_paiement: number;
  numero_facture: number;
  date_paiement: string;
  montant: number;
  mode_paiement: string;
  reference: string;
  statut: string;
  devise: string;
}
TYPESEOF

echo "✅ Types créés"

# Lib - Axios
cat > src/lib/axios.ts << 'AXIOSEOF'
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});
AXIOSEOF

# Lib - Query Client
cat > src/lib/queryClient.ts << 'QUERYEOF'
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});
QUERYEOF

echo "✅ Librairies créées"

# Services - API
cat > src/services/api.ts << 'APIEOF'
import { api } from '../lib/axios';
import { ApiResponse } from '../types';

export class ApiService {
  static async get<T>(endpoint: string): Promise<T> {
    const response = await api.get<ApiResponse<T>>(endpoint);
    return response.data.data;
  }

  static async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await api.post<ApiResponse<T>>(endpoint, data);
    return response.data.data;
  }

  static async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await api.put<ApiResponse<T>>(endpoint, data);
    return response.data.data;
  }

  static async patch<T>(endpoint: string, data?: any): Promise<T> {
    const response = await api.patch<ApiResponse<T>>(endpoint, data);
    return response.data.data;
  }

  static async delete<T>(endpoint: string): Promise<T> {
    const response = await api.delete<ApiResponse<T>>(endpoint);
    return response.data.data;
  }
}
APIEOF

# Services - Comptabilité
cat > src/services/comptabilite.ts << 'COMPTAEOF'
import { ApiService } from './api';
import { Tiers, Article, Facture, Paiement } from '../types';

export const ComptabiliteService = {
  // Tiers
  getTiers: () => ApiService.get<Tiers[]>('/comptabilite/tiers'),
  createTiers: (data: Omit<Tiers, 'id_tiers'>) => 
    ApiService.post<Tiers>('/comptabilite/tiers', data),

  // Articles
  getArticles: () => ApiService.get<Article[]>('/comptabilite/articles'),
  createArticle: (data: Omit<Article, 'created_at' | 'updated_at'>) => 
    ApiService.post<Article>('/comptabilite/articles', data),

  // Factures
  getFactures: () => ApiService.get<Facture[]>('/comptabilite/factures'),
  getFacture: (id: number) => ApiService.get<Facture>(\`/comptabilite/factures/\${id}\`),
  createFacture: (data: any) => 
    ApiService.post<Facture>('/comptabilite/factures', data),
  validerFacture: (id: number) => 
    ApiService.patch<Facture>(\`/comptabilite/factures/\${id}/valider\`),

  // Paiements
  getPaiementsByFacture: (numeroFacture: number) => 
    ApiService.get<Paiement[]>(\`/comptabilite/paiements/facture/\${numeroFacture}\`),
  createPaiement: (data: any) => 
    ApiService.post<Paiement>('/comptabilite/paiements', data),
};
COMPTAEOF

echo "✅ Services créés"

# Context - Auth
cat > src/contexts/AuthContext.tsx << 'AUTHEOF'
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  const login = (token: string) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
AUTHEOF

# Composant UI - Button
cat > src/components/ui/Button.tsx << 'BUTTONEOF'
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-lg font-medium transition-colors focus:outline-none focus:ring-2';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const classes = \`\${baseClasses} \${variants[variant]} \${sizes[size]} \${className}\`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};
BUTTONEOF

echo "✅ Contexts et composants créés"

# Layout principal
cat > src/components/layout/Layout.tsx << 'LAYOUTEOF'
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Aquatiko Gestion</h1>
        </div>
      </header>
      <div className="flex">
        <aside className="w-64 bg-white border-r min-h-screen p-4">
          <nav className="space-y-2">
            <a href="/" className="block py-2 px-4 rounded hover:bg-gray-100">Dashboard</a>
            <a href="/comptabilite" className="block py-2 px-4 rounded hover:bg-gray-100">Comptabilité</a>
            <a href="/import-export" className="block py-2 px-4 rounded hover:bg-gray-100">Import/Export</a>
            <a href="/crm" className="block py-2 px-4 rounded hover:bg-gray-100">CRM</a>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
LAYOUTEOF

# Page Dashboard Comptabilité
mkdir -p src/pages/comptabilite
cat > src/pages/comptabilite/Dashboard.tsx << 'DASHBOARDEOF'
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ComptabiliteService } from '../../services/comptabilite';
import { Button } from '../../components/ui/Button';

export const Dashboard: React.FC = () => {
  const { data: tiers, isLoading: loadingTiers } = useQuery({
    queryKey: ['tiers'],
    queryFn: ComptabiliteService.getTiers,
  });

  const { data: factures, isLoading: loadingFactures } = useQuery({
    queryKey: ['factures'],
    queryFn: ComptabiliteService.getFactures,
  });

  if (loadingTiers || loadingFactures) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Comptabilité</h1>
        <Button>Nouvelle Facture</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Tiers</h3>
          <p className="text-3xl font-bold text-blue-600">{tiers?.length || 0}</p>
          <p className="text-gray-600">Clients/Fournisseurs</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Factures</h3>
          <p className="text-3xl font-bold text-green-600">{factures?.length || 0}</p>
          <p className="text-gray-600">Documents créés</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Trésorerie</h3>
          <p className="text-3xl font-bold text-purple-600">
            {factures?.reduce((sum, f) => sum + f.total_ttc, 0)?.toLocaleString('fr-FR') || 0} MGA
          </p>
          <p className="text-gray-600">Chiffre d'affaires</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Dernières Factures</h2>
        </div>
        <div className="p-6">
          {factures && factures.length > 0 ? (
            <div className="space-y-4">
              {factures.slice(0, 5).map((facture) => (
                <div key={facture.numero_facture} className="flex justify-between items-center py-3 border-b">
                  <div>
                    <p className="font-medium">Facture #{facture.numero_facture}</p>
                    <p className="text-gray-600 text-sm">{facture.nom_tiers}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{facture.total_ttc.toLocaleString('fr-FR')} MGA</p>
                    <p className={\`text-sm \${
                      facture.statut === 'validee' ? 'text-green-600' : 
                      facture.statut === 'brouillon' ? 'text-yellow-600' : 'text-red-600'
                    }\`}>
                      {facture.statut}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Aucune facture créée</p>
          )}
        </div>
      </div>
    </div>
  );
};
DASHBOARDEOF

echo "✅ Layout et pages créés"

# App.tsx principal
cat > src/App.tsx << 'APPEOF'
import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { queryClient } from './lib/queryClient';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/comptabilite/Dashboard';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/comptabilite" element={<Dashboard />} />
              {/* Routes pour import-export et CRM à ajouter plus tard */}
              <Route path="/import-export" element={<div className="p-6"><h1>Module Import/Export</h1></div>} />
              <Route path="/crm" element={<div className="p-6"><h1>Module CRM</h1></div>} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
APPEOF

echo "✅ Architecture créée avec succès!"
echo "🚀 Démarrage du serveur de développement..."
npm run dev

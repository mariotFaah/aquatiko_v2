// src/modules/comptabilite/services/api.ts 
/*
  Decommentena ilay api_base_url faharoa rehefa prod dia soloina amlay nihebergena anlay backend
  aveo commentena lay en local
*/
import type { Tiers, Article, Facture, Paiement, TauxChange, ArticleBackend } from '../types';

const API_BASE_URL = 'http://localhost:3001/api/comptabilite';
//const API_BASE_URL = ' https://sentence-hands-therapy-surely.trycloudflare.com/api/comptabilite';

// Interfaces pour la gestion de stock
export interface UpdateStockRequest {
  quantite_stock: number;
}

export interface AdjustStockRequest {
  quantite: number;
  raison?: string;
}

export interface DisponibiliteResponse {
  disponible: boolean;
  quantite_stock: number;
  quantite_demandee: number;
  statut: string;
  message: string;
}

export interface StockAlerte {
  code_article: string;
  description: string;
  quantite_stock: number;
  seuil_alerte: number;
  statut_stock: string;
  priorite: 'faible' | 'rupture';
}

export const comptabiliteApi = {
  // ---- Tiers API ----
  getTiers: async (): Promise<Tiers[]> => {
    const res = await fetch(`${API_BASE_URL}/tiers`);
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  },

  createTiers: async (tiersData: Partial<Tiers>): Promise<Tiers> => {
    const res = await fetch(`${API_BASE_URL}/tiers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tiersData),
    });
    
    const data = await res.json();
    
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Erreur lors de la création du tiers');
    }
    
    return data.data;
  },

  updateTiers: async (id: number, tiersData: Partial<Tiers>): Promise<Tiers> => {
    const res = await fetch(`${API_BASE_URL}/tiers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tiersData),
    });
    const data = await res.json();
    return data.data;
  },

  deleteTiers: async (id: number): Promise<void> => {
    await fetch(`${API_BASE_URL}/tiers/${id}`, { method: 'DELETE' });
  },

  // ---- Articles API ----
getArticles: async (): Promise<Article[]> => {
  const res = await fetch(`${API_BASE_URL}/articles`);
  if (!res.ok) throw new Error('Erreur lors du chargement des articles');
  const data = await res.json();
  
  const articles = Array.isArray(data.data) ? data.data : [];
  return articles.map((article: ArticleBackend) => ({
    ...article,
    seuil_alerte: article.seuil_alerte,
    // Mapper le statut stock backend → frontend
    statut_stock: article.statut_stock === 'disponible' ? 'en_stock' : article.statut_stock
  }));
},

  getArticle: async (code: string): Promise<Article> => {
    const res = await fetch(`${API_BASE_URL}/articles/${code}`);
    if (!res.ok) throw new Error('Erreur lors du chargement de l\'article');
    const data = await res.json();
    
    // Mapper les données
    return {
      ...data.data,
      seuil_alerte: data.data.seuil_alerte // Mapper seuil_alerte vers seuil_alerte
    };
  },

  createArticle: async (articleData: Omit<Article, 'actif' | 'created_at' | 'updated_at'>): Promise<Article> => {
    // Préparer les données pour le backend
    const backendData = {
      ...articleData,
      seuil_alerte: articleData.seuil_alerte // Mapper seuil_alerte vers seuil_alerte pour le backend
    };
    
    const res = await fetch(`${API_BASE_URL}/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendData),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors de la création');
    }
    
    const data = await res.json();
    
    // Mapper la réponse
    return {
      ...data.data,
      seuil_alerte: data.data.seuil_alerte
    };
  },

  updateArticle: async (code: string, articleData: Partial<Article>): Promise<Article> => {
    // Préparer les données pour le backend
    const backendData = { ...articleData };
    
    // Mapper seuil_alerte vers seuil_alerte si présent
    if (articleData.seuil_alerte !== undefined) {
      backendData.seuil_alerte = articleData.seuil_alerte;
      delete backendData.seuil_alerte;
    }
    
    const res = await fetch(`${API_BASE_URL}/articles/${code}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendData),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors de la modification');
    }
    
    const data = await res.json();
    
    // Mapper la réponse
    return {
      ...data.data,
      seuil_alerte: data.data.seuil_alerte
    };
  },

  deleteArticle: async (code: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/articles/${code}`, {
      method: 'DELETE',
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors de la suppression');
    }
  },

  // ---- Gestion de Stock API ----
// Dans api.ts - mapper les statuts backend → frontend


getArticlesByStatut: async (statut: string): Promise<Article[]> => {
  const res = await fetch(`${API_BASE_URL}/articles/statut/${statut}`);
  if (!res.ok) throw new Error(`Erreur lors du chargement des articles ${statut}`);
  const data = await res.json();
  
  const articles = Array.isArray(data.data) ? data.data : [];
  return articles.map((article: ArticleBackend) => ({
    ...article,
    seuil_alerte: article.seuil_alerte,
    // Mapper le statut stock backend → frontend
    statut_stock: article.statut_stock === 'disponible' ? 'en_stock' : article.statut_stock
  }));
},  
  updateStock: async (code: string, stockData: UpdateStockRequest): Promise<Article> => {
    const res = await fetch(`${API_BASE_URL}/articles/${code}/stock`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stockData),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors de la mise à jour du stock');
    }
    
    const data = await res.json();
    
    // Mapper la réponse
    return {
      ...data.data,
      seuil_alerte: data.data.seuil_alerte
    };
  },

  adjustStock: async (code: string, adjustData: AdjustStockRequest): Promise<Article> => {
    const res = await fetch(`${API_BASE_URL}/articles/${code}/stock/adjust`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adjustData),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors de l\'ajustement du stock');
    }
    
    const data = await res.json();
    
    // Mapper la réponse
    return {
      ...data.data,
      seuil_alerte: data.data.seuil_alerte
    };
  },

  getStockAlerts: async (): Promise<StockAlerte[]> => {
  const res = await fetch(`${API_BASE_URL}/articles/alertes/stock`);
  if (!res.ok) throw new Error('Erreur lors du chargement des alertes de stock');
  const data = await res.json();
  
  const alertesData = data.data || {};
  const alertes: StockAlerte[] = [];
  
  // Traiter les alertes de rupture
  if (Array.isArray(alertesData.rupture_stock)) {
    alertes.push(...alertesData.rupture_stock.map((article: ArticleBackend) => ({
      code_article: article.code_article,
      description: article.description,
      quantite_stock: article.quantite_stock || 0,
      seuil_alerte: article.seuil_alerte || 0,
      statut_stock: article.statut_stock || 'rupture',
      priorite: 'rupture' as const
    })));
  }
  
  // Traiter les alertes de stock faible
  if (Array.isArray(alertesData.stock_faible)) {
    alertes.push(...alertesData.stock_faible.map((article: ArticleBackend) => ({
      code_article: article.code_article,
      description: article.description,
      quantite_stock: article.quantite_stock || 0,
      seuil_alerte: article.seuil_alerte || 0,
      statut_stock: article.statut_stock || 'stock_faible',
      priorite: 'faible' as const
    })));
  }
  
  return alertes;
},

  checkAvailability: async (code: string, quantite: number): Promise<DisponibiliteResponse> => {
    const res = await fetch(`${API_BASE_URL}/articles/${code}/disponibilite?quantite=${quantite}`);
    if (!res.ok) throw new Error('Erreur lors de la vérification de disponibilité');
    const data = await res.json();
    return data.data;
  },

  // ---- Factures API ----
  getFactures: async (): Promise<Facture[]> => {
    const res = await fetch(`${API_BASE_URL}/factures`);
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  },

  getFacture: async (numero: number): Promise<Facture> => {
    const res = await fetch(`${API_BASE_URL}/factures/${numero}`);
    const data = await res.json();
    return data.data;
  },

  createFacture: async (factureData: any): Promise<Facture> => {
    const res = await fetch(`${API_BASE_URL}/factures`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(factureData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Erreur création facture');
    return data.data;
  },

  updateFacture: async (numero: number, factureData: Partial<Facture>): Promise<Facture> => {
    const res = await fetch(`${API_BASE_URL}/factures/${numero}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(factureData),
    });
    const data = await res.json();
    return data.data;
  },

  validerFacture: async (numero: number): Promise<Facture> => {
    const res = await fetch(`${API_BASE_URL}/factures/${numero}/valider`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Erreur validation facture');
    return data.data;
  },

  deleteFacture: async (numero: number): Promise<void> => {
    await fetch(`${API_BASE_URL}/factures/${numero}`, { method: 'DELETE' });
  },

  // ---- Paiements API ----
  getPaiements: async (): Promise<Paiement[]> => {
    const res = await fetch(`${API_BASE_URL}/paiements`);
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  },

  createPaiement: async (paiementData: Partial<Paiement>): Promise<Paiement> => {
    const res = await fetch(`${API_BASE_URL}/paiements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paiementData),
    });
    const data = await res.json();
    return data.data;
  },

  // ---- Devises API ----
  getTauxChange: async (): Promise<TauxChange[]> => {
    const res = await fetch(`${API_BASE_URL}/devises/taux`);
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  },
};

// Export des services supplémentaires
export { paiementApi } from './paiementApi';
export { deviseApi } from './deviseApi';
export { default as rapportApi } from './rapportApi';
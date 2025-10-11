// src/modules/comptabilite/services/api.ts - VERSION CORRIGÉE
import type { Tiers, Article, Facture, FactureFormData } from '../types';

const API_BASE_URL = 'http://localhost:3001/api/comptabilite';

export const comptabiliteApi = {
  // ---- Tiers API ----
  getTiers: async (): Promise<Tiers[]> => {
    const res = await fetch(`${API_BASE_URL}/tiers`);
    const data = await res.json();
    // CORRECTION: Toujours retourner un tableau
    return Array.isArray(data.data) ? data.data : [];
  },

  createTiers: async (tiersData: Partial<Tiers>): Promise<Tiers> => {
    const res = await fetch(`${API_BASE_URL}/tiers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tiersData),
    });
    const data = await res.json();
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
    // CORRECTION: Toujours retourner un tableau
    return Array.isArray(data.data) ? data.data : [];
  },

  getArticle: async (code: string): Promise<Article> => {
    const res = await fetch(`${API_BASE_URL}/articles/${code}`);
    if (!res.ok) throw new Error('Erreur lors du chargement de l\'article');
    const data = await res.json();
    return data.data;
  },

  createArticle: async (articleData: Omit<Article, 'actif' | 'created_at' | 'updated_at'>): Promise<Article> => {
    const res = await fetch(`${API_BASE_URL}/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(articleData),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors de la création');
    }
    
    const data = await res.json();
    return data.data;
  },

  updateArticle: async (code: string, articleData: Partial<Article>): Promise<Article> => {
    const res = await fetch(`${API_BASE_URL}/articles/${code}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(articleData),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors de la modification');
    }
    
    const data = await res.json();
    return data.data;
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

  // ---- Factures API ----
  getFactures: async (): Promise<Facture[]> => {
    const res = await fetch(`${API_BASE_URL}/factures`);
    const data = await res.json();
    // CORRECTION: Toujours retourner un tableau
    return Array.isArray(data.data) ? data.data : [];
  },

  getFacture: async (numero: number): Promise<Facture> => {
    const res = await fetch(`${API_BASE_URL}/factures/${numero}`);
    const data = await res.json();
    return data.data;
  },

  createFacture: async (factureData: FactureFormData): Promise<Facture> => {
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

  deleteFacture: async (numero: number): Promise<void> => {
    await fetch(`${API_BASE_URL}/factures/${numero}`, { method: 'DELETE' });
  },
};

// AJOUTER les exports des nouveaux services à la fin
export { paiementApi } from './paiementApi';
export { deviseApi } from './deviseApi';
export { default as rapportApi } from './rapportApi';
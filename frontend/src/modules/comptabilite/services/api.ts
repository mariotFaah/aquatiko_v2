// src/modules/comptabilite/services/api.ts
import type { Tiers, Article, Facture, FactureFormData } from '../types';

const API_BASE_URL = 'http://localhost:3001/api/comptabilite';

export const comptabiliteApi = {
  // Tiers
  getTiers: async (): Promise<Tiers[]> => {
    const response = await fetch(`${API_BASE_URL}/tiers`);
    const data = await response.json();
    return data.data;
  },

  // Articles
  getArticles: async (): Promise<Article[]> => {
    const response = await fetch(`${API_BASE_URL}/articles`);
    const data = await response.json();
    return data.data;
  },

  // Factures
  getFactures: async (): Promise<Facture[]> => {
    const response = await fetch(`${API_BASE_URL}/factures`);
    const data = await response.json();
    return data.data;
  },

  getFacture: async (numero: number): Promise<Facture> => {
    const response = await fetch(`${API_BASE_URL}/factures/${numero}`);
    const data = await response.json();
    return data.data;
  },

  createFacture: async (factureData: FactureFormData): Promise<Facture> => {
    const response = await fetch(`${API_BASE_URL}/factures`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(factureData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Gérer les erreurs HTTP
      throw new Error(data.message || `Erreur ${response.status}: ${response.statusText}`);
    }

    if (!data.success) {
      // Gérer les erreurs métier
      throw new Error(data.message || 'Erreur lors de la création de la facture');
    }

    return data.data;
  },
  updateFacture: async (numero: number, factureData: Partial<Facture>): Promise<Facture> => {
    const response = await fetch(`${API_BASE_URL}/factures/${numero}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(factureData),
    });
    const data = await response.json();
    return data.data;
  },

  deleteFacture: async (numero: number): Promise<void> => {
    await fetch(`${API_BASE_URL}/factures/${numero}`, {
      method: 'DELETE',
    });
  },
};
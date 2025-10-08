// src/modules/comptabilite/services/api.ts
import type { Tiers, Article, Facture, FactureFormData } from '../types';

const API_BASE_URL = 'http://localhost:3001/api/comptabilite';

export const comptabiliteApi = {
  // ---- Tiers API ----
  getTiers: async (): Promise<Tiers[]> => {
    const res = await fetch(`${API_BASE_URL}/tiers`);
    const data = await res.json();
    return data.data;
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
    const data = await res.json();
    return data.data;
  },

  // ---- Factures API ----
  getFactures: async (): Promise<Facture[]> => {
    const res = await fetch(`${API_BASE_URL}/factures`);
    const data = await res.json();
    return data.data;
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

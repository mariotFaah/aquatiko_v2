// src/modules/comptabilite/services/paiementApi.ts
import type { Paiement } from '../types';

const API_BASE_URL = 'http://localhost:3001/api/comptabilite';

export const paiementApi = {
  // Récupérer tous les paiements
  getPaiements: async (): Promise<Paiement[]> => {
    const res = await fetch(`${API_BASE_URL}/paiements`);
    if (!res.ok) throw new Error('Erreur lors du chargement des paiements');
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  },

  // Récupérer les paiements d'une facture
  getPaiementsByFacture: async (numero_facture: number): Promise<Paiement[]> => {
    const res = await fetch(`${API_BASE_URL}/paiements/facture/${numero_facture}`);
    if (!res.ok) throw new Error('Erreur lors du chargement des paiements');
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  },

  // Créer un paiement
  createPaiement: async (paiementData: Omit<Paiement, 'id_paiement' | 'created_at' | 'updated_at'>): Promise<Paiement> => {
    const res = await fetch(`${API_BASE_URL}/paiements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paiementData),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors de la création du paiement');
    }
    
    const data = await res.json();
    return data.data;
  },

  // Valider un paiement
  validerPaiement: async (id_paiement: number): Promise<Paiement> => {
    const res = await fetch(`${API_BASE_URL}/paiements/${id_paiement}/valider`, {
      method: 'PATCH',
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors de la validation du paiement');
    }
    
    const data = await res.json();
    return data.data;
  },

  // Annuler un paiement
  annulerPaiement: async (id_paiement: number): Promise<Paiement> => {
    const res = await fetch(`${API_BASE_URL}/paiements/${id_paiement}/annuler`, {
      method: 'PATCH',
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors de l\'annulation du paiement');
    }
    
    const data = await res.json();
    return data.data;
  },

  // Supprimer un paiement
  deletePaiement: async (id_paiement: number): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/paiements/${id_paiement}`, {
      method: 'DELETE',
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors de la suppression du paiement');
    }
  }
};
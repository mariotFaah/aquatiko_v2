// src/modules/comptabilite/services/paiementApi.ts - VERSION 100% API
import type { Paiement } from '../types';

const API_BASE_URL = 'http://localhost:3001/api/comptabilite';
//const API_BASE_URL = 'https://sentence-hands-therapy-surely.trycloudflare.com/api/comptabilite';

// Fonction utilitaire pour parser les montants
const parsePaiement = (paiement: any): Paiement => ({
  ...paiement,
  montant: parseFloat(paiement.montant) || 0,
  taux_change: parseFloat(paiement.taux_change) || 1
});

export const paiementApi = {
  // Récupérer tous les paiements
  getPaiements: async (): Promise<Paiement[]> => {
    const res = await fetch(`${API_BASE_URL}/paiements`);
    if (!res.ok) throw new Error('Erreur lors du chargement des paiements');
    const data = await res.json();
    return Array.isArray(data.data) ? data.data.map(parsePaiement) : [];
  },
  

  // Récupérer les paiements d'une facture
  getPaiementsByFacture: async (numero_facture: number): Promise<Paiement[]> => {
    const res = await fetch(`${API_BASE_URL}/paiements/facture/${numero_facture}`);
    if (!res.ok) throw new Error('Erreur lors du chargement des paiements de la facture');
    const data = await res.json();
    return Array.isArray(data.data) ? data.data.map(parsePaiement) : [];
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
    return parsePaiement(data.data);
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
    return parsePaiement(data.data);
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
    return parsePaiement(data.data);
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

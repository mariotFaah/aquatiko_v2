// src/modules/import-export/services/api.ts
import type { 
  Commande, 
  CommandeFormData, 
  ExpeditionFormData, 
  CoutLogistiqueFormData,
  CalculMarge 
} from '../types';

const API_BASE_URL = 'http://localhost:3001/api/import-export';

export const importExportApi = {
  // ---- Commandes API ----
  getCommandes: async (filters?: { type?: string; statut?: string; client_id?: number }): Promise<Commande[]> => {
    const queryParams = new URLSearchParams();
    if (filters?.type) queryParams.append('type', filters.type);
    if (filters?.statut) queryParams.append('statut', filters.statut);
    if (filters?.client_id) queryParams.append('client_id', filters.client_id.toString());

    const url = `${API_BASE_URL}/commandes${queryParams.toString() ? `?${queryParams}` : ''}`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error('Erreur lors du chargement des commandes');
    
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  },

  getCommande: async (id: number): Promise<Commande> => {
    const res = await fetch(`${API_BASE_URL}/commandes/${id}`);
    if (!res.ok) throw new Error('Erreur lors du chargement de la commande');
    
    const data = await res.json();
    return data.data;
  },

  createCommande: async (commandeData: CommandeFormData): Promise<Commande> => {
    const res = await fetch(`${API_BASE_URL}/commandes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commandeData),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors de la création de la commande');
    }
    
    const data = await res.json();
    return data.data;
  },

  updateCommandeStatut: async (id: number, statut: string): Promise<Commande> => {
    const res = await fetch(`${API_BASE_URL}/commandes/${id}/statut`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut }),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors de la mise à jour du statut');
    }
    
    const data = await res.json();
    return data.data;
  },

  // ---- Expéditions API ----
  updateExpedition: async (expeditionData: ExpeditionFormData): Promise<Commande> => {
    const res = await fetch(`${API_BASE_URL}/commandes/expedition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expeditionData),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors de la mise à jour de l\'expédition');
    }
    
    const data = await res.json();
    return data.data;
  },

  // ---- Coûts Logistiques API ----
  updateCoutsLogistiques: async (coutsData: CoutLogistiqueFormData): Promise<Commande> => {
    const res = await fetch(`${API_BASE_URL}/commandes/couts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(coutsData),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors de la mise à jour des coûts logistiques');
    }
    
    const data = await res.json();
    return data.data;
  },

  // ---- Calcul de Marge API ----
  calculerMarge: async (commandeId: number): Promise<CalculMarge> => {
    const res = await fetch(`${API_BASE_URL}/commandes/${commandeId}/marge`);
    if (!res.ok) throw new Error('Erreur lors du calcul de marge');
    
    const data = await res.json();
    return data.data;
  },
};

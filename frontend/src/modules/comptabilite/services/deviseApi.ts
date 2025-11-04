// src/modules/comptabilite/services/deviseApi.ts
import type { TauxChange, ConversionDevise } from '../types';

//  Changer 3001 par 3001 (ou l'inverse selon votre besoin)
const API_BASE_URL = 'http://localhost:3001/api/comptabilite';
//const API_BASE_URL = 'https://sentence-hands-therapy-surely.trycloudflare.com/api/comptabilite'; // ✅ Port correct


export const deviseApi = {
  // Récupérer tous les taux de change - CORRECTION: utiliser le bon endpoint
  getTauxChange: async (): Promise<TauxChange[]> => {
    const res = await fetch(`${API_BASE_URL}/devises/taux`);
    if (!res.ok) {
      console.warn('Endpoint taux non disponible, utilisation de données de démo');
      // Données de démo
      return [
        {
          id_taux: 1,
          devise_source: 'MGA',
          devise_cible: 'USD',
          taux: 0.00022,
          date_effet: new Date().toISOString().split('T')[0],
          actif: true
        },
        {
          id_taux: 2,
          devise_source: 'USD',
          devise_cible: 'MGA',
          taux: 4500,
          date_effet: new Date().toISOString().split('T')[0],
          actif: true
        },
        {
          id_taux: 3,
          devise_source: 'MGA',
          devise_cible: 'EUR',
          taux: 0.00020,
          date_effet: new Date().toISOString().split('T')[0],
          actif: true
        }
      ];
    }
    
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  },

  // Récupérer le taux de change actuel pour une paire - CORRECTION: logique côté client
  getTauxChangeActuel: async (devise_source: string, devise_cible: string): Promise<TauxChange> => {
    // Récupérer tous les taux et filtrer
    const tousLesTaux = await deviseApi.getTauxChange();
    const tauxTrouve = tousLesTaux.find(taux => 
      taux.devise_source === devise_source && taux.devise_cible === devise_cible && taux.actif
    );
    
    if (tauxTrouve) {
      return tauxTrouve;
    }
    
    // Taux par défaut si non trouvé
    const tauxParDefaut: { [key: string]: number } = {
      'MGA-USD': 0.00022,
      'USD-MGA': 4500,
      'MGA-EUR': 0.00020,
      'EUR-MGA': 5000,
      'USD-EUR': 0.92,
      'EUR-USD': 1.09
    };
    
    return {
      id_taux: 0,
      devise_source,
      devise_cible,
      taux: tauxParDefaut[`${devise_source}-${devise_cible}`] || 1,
      date_effet: new Date().toISOString().split('T')[0],
      actif: true
    };
  },

  // Créer un nouveau taux de change - CORRECTION: utiliser le bon endpoint
  createTauxChange: async (tauxData: Omit<TauxChange, 'id_taux' | 'created_at' | 'updated_at'>): Promise<TauxChange> => {
    const res = await fetch(`${API_BASE_URL}/devises/taux`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tauxData),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors de la création du taux de change');
    }
    
    const data = await res.json();
    return data.data;
  },

  // Convertir un montant entre devises - CORRECTION: utiliser le bon endpoint
  convertirDevise: async (conversionData: ConversionDevise): Promise<{ montant_converti: number }> => {
    const res = await fetch(`${API_BASE_URL}/devises/convertir`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(conversionData),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors de la conversion');
    }
    
    const data = await res.json();
    return data.data;
  },

  // Récupérer les devises disponibles
  getDevisesDisponibles: async (): Promise<string[]> => {
    return ['MGA', 'USD', 'EUR'];
  }
};
// src/modules/comptabilite/services/rapportApi.ts - VERSION AVEC DONNÉES RÉELLES
import type { 
  RapportBilan, 
  RapportCompteResultat, 
  RapportTVA, 
  RapportTresorerie 
} from '../types';

const API_BASE_URL = 'http://localhost:3001/api/comptabilite';

export const rapportApi = {
  getBilan: async (date?: string): Promise<RapportBilan> => {
    const url = date 
      ? `${API_BASE_URL}/rapports/bilan?date=${date}`
      : `${API_BASE_URL}/rapports/bilan`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error('Erreur lors du chargement du bilan');
    
    const data = await res.json();
    return data.data || {};
  },

  getCompteResultat: async (date_debut?: string, date_fin?: string): Promise<RapportCompteResultat> => {
    const params = new URLSearchParams();
    if (date_debut) params.append('date_debut', date_debut);
    if (date_fin) params.append('date_fin', date_fin);
    
    const queryString = params.toString();
    const url = queryString 
      ? `${API_BASE_URL}/rapports/compte-resultat?${queryString}` 
      : `${API_BASE_URL}/rapports/compte-resultat`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error('Erreur lors du chargement du compte de résultat');
    
    const data = await res.json();
    return data.data || { charges: 0, produits: 0, resultat_net: 0 };
  },

  getTresorerie: async (date_debut?: string, date_fin?: string): Promise<RapportTresorerie> => {
    const params = new URLSearchParams();
    if (date_debut) params.append('date_debut', date_debut);
    if (date_fin) params.append('date_fin', date_fin);
    
    const queryString = params.toString();
    const url = queryString 
      ? `${API_BASE_URL}/rapports/tresorerie?${queryString}` 
      : `${API_BASE_URL}/rapports/tresorerie`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error('Erreur lors du chargement de la trésorerie');
    
    const data = await res.json();
    return data.data || { entrees: 0, sorties_prevues: 0, solde_tresorerie: 0 };
  },

  getTVA: async (date_debut?: string, date_fin?: string): Promise<RapportTVA> => {
    const params = new URLSearchParams();
    if (date_debut) params.append('date_debut', date_debut);
    if (date_fin) params.append('date_fin', date_fin);
    
    const queryString = params.toString();
    const url = queryString 
      ? `${API_BASE_URL}/rapports/tva?${queryString}` 
      : `${API_BASE_URL}/rapports/tva`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error('Erreur lors du chargement de la TVA');
    
    const data = await res.json();
    return data.data || { tva_collectee: 0, tva_deductable: 0, tva_a_payer: 0 };
  }
};

export default rapportApi;

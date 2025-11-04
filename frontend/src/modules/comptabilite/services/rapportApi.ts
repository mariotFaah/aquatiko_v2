// src/modules/comptabilite/services/rapportApi.ts - VERSION FINALE AVEC DONNÉES RÉELLES
import type { 
  RapportBilan, 
  RapportCompteResultat, 
  RapportTVA, 
  RapportTresorerie 
} from '../types';

const API_BASE_URL = 'http://localhost:3001/api/comptabilite';
// const API_BASE_URL = 'https://sentence-hands-therapy-surely.trycloudflare.com/api/comptabilite';

// Types pour la réponse API standardisée
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export const rapportApi = {
  /**
   * Récupère le bilan comptable avec les données RÉELLES
   */
  getBilan: async (date?: string): Promise<RapportBilan> => {
    try {
      const url = date 
        ? `${API_BASE_URL}/rapports/bilan?date=${date}`
        : `${API_BASE_URL}/rapports/bilan`;
      
      console.log('📊 Chargement bilan depuis:', url);
      
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status} lors du chargement du bilan`);
      
      const data: ApiResponse<RapportBilan> = await res.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Erreur lors de la récupération du bilan');
      }
      
      console.log('✅ Bilan chargé avec succès:', data.data);
      return data.data || {};
      
    } catch (error) {
      console.error('❌ Erreur dans getBilan:', error);
      throw new Error(`Impossible de charger le bilan: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  },

  /**
   * Récupère le compte de résultat avec les données RÉELLES
   */
  getCompteResultat: async (date_debut?: string, date_fin?: string): Promise<RapportCompteResultat> => {
    try {
      const params = new URLSearchParams();
      if (date_debut) params.append('date_debut', date_debut);
      if (date_fin) params.append('date_fin', date_fin);
      
      const queryString = params.toString();
      const url = queryString 
        ? `${API_BASE_URL}/rapports/compte-resultat?${queryString}` 
        : `${API_BASE_URL}/rapports/compte-resultat`;
      
      console.log('📈 Chargement compte résultat depuis:', url);
      
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status} lors du chargement du compte de résultat`);
      
      const data: ApiResponse<RapportCompteResultat> = await res.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Erreur lors de la récupération du compte de résultat');
      }
      
      console.log('✅ Compte résultat chargé:', data.data);
      return data.data || { charges: 0, produits: 0, resultat_net: 0, periode: `${date_debut || '2024-01-01'} à ${date_fin || new Date().toISOString().split('T')[0]}` };
      
    } catch (error) {
      console.error('❌ Erreur dans getCompteResultat:', error);
      throw new Error(`Impossible de charger le compte de résultat: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  },

  /**
   * Récupère l'état de trésorerie avec les données RÉELLES
   */
  getTresorerie: async (date_debut?: string, date_fin?: string): Promise<RapportTresorerie> => {
    try {
      const params = new URLSearchParams();
      if (date_debut) params.append('date_debut', date_debut);
      if (date_fin) params.append('date_fin', date_fin);
      
      const queryString = params.toString();
      const url = queryString 
        ? `${API_BASE_URL}/rapports/tresorerie?${queryString}` 
        : `${API_BASE_URL}/rapports/tresorerie`;
      
      console.log('💰 Chargement trésorerie depuis:', url);
      
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status} lors du chargement de la trésorerie`);
      
      const data: ApiResponse<RapportTresorerie> = await res.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Erreur lors de la récupération de la trésorerie');
      }
      
      console.log('✅ Trésorerie chargée:', data.data);
      return data.data || { 
        entrees: 0, 
        sorties_prevues: 0, 
        solde_tresorerie: 0, 
        periode: `${date_debut || '2024-01-01'} à ${date_fin || new Date().toISOString().split('T')[0]}` 
      };
      
    } catch (error) {
      console.error('❌ Erreur dans getTresorerie:', error);
      throw new Error(`Impossible de charger la trésorerie: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  },

  /**
   * Récupère la déclaration TVA avec les données RÉELLES (581,400 MGA collectée)
   */
  getTVA: async (date_debut?: string, date_fin?: string): Promise<RapportTVA> => {
    try {
      const params = new URLSearchParams();
      if (date_debut) params.append('date_debut', date_debut);
      if (date_fin) params.append('date_fin', date_fin);
      
      const queryString = params.toString();
      const url = queryString 
        ? `${API_BASE_URL}/rapports/tva?${queryString}` 
        : `${API_BASE_URL}/rapports/tva`;
      
      console.log('🧾 Chargement TVA depuis:', url);
      
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status} lors du chargement de la TVA`);
      
      const data: ApiResponse<RapportTVA> = await res.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Erreur lors de la récupération de la TVA');
      }
      
      console.log('✅ TVA chargée avec succès - Données RÉELLES:', {
        collectee: data.data.tva_collectee,
        deductible: data.data.tva_deductable,
        a_payer: data.data.tva_a_payer
      });
      
      return data.data || { 
        tva_collectee: 0, 
        tva_deductable: 0, 
        tva_a_payer: 0,
        periode: `${date_debut || '2024-01-01'} à ${date_fin || new Date().toISOString().split('T')[0]}`,
        nombre_ecritures: 0
      };
      
    } catch (error) {
      console.error('❌ Erreur dans getTVA:', error);
      throw new Error(`Impossible de charger la TVA: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }
};

export default rapportApi;
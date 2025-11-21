// src/modules/import-export/services/api.ts - VERSION CORRIGÉE
import axios from '../../../core/config/axios';
import type { 
  Commande, 
  CommandeFormData, 
  ExpeditionFormData, 
  CoutLogistiqueFormData,
  CalculMarge 
} from '../types';

const API_BASE_URL = '/import-export';

// ✅ UTILISER les mêmes fonctions helper que dans api.ts
const extractData = (response: any): any[] => {
  console.log('📊 Structure de la réponse import-export:', response.data);
  
  if (response.data.success && Array.isArray(response.data.data)) {
    return response.data.data;
  } else if (response.data.success && Array.isArray(response.data.message)) {
    return response.data.message;
  } else if (Array.isArray(response.data)) {
    return response.data;
  }
  
  console.warn('⚠️ Aucune donnée valide trouvée dans la réponse import-export');
  return [];
};

// ✅ FONCTION HELPER pour extraire un objet simple
// ✅ CORRECTION de la fonction extractObject
const extractObject = (response: any): any => {
  console.log('🔍 [DEBUG] Structure réponse import-export:', response.data);
  
  // ✅ CORRECTION : Vérifier d'abord si message est un objet (cas marge)
  if (response.data.success && response.data.message && typeof response.data.message === 'object') {
    console.log('✅ Extraction depuis response.data.message');
    return response.data.message;
  }
  // Ensuite vérifier data
  else if (response.data.success && response.data.data) {
    console.log('✅ Extraction depuis response.data.data');
    return response.data.data;
  }
  // Sinon retourner data s'il existe
  else if (response.data.data) {
    console.log('✅ Extraction depuis response.data (fallback)');
    return response.data.data;
  }
  
  console.log('✅ Extraction depuis response.data (final)');
  return response.data;
};

export const importExportApi = {
  // ---- Commandes API ----
  getCommandes: async (filters?: { type?: string; statut?: string; client_id?: number }): Promise<Commande[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/commandes`, { params: filters });
      return extractData(response);
    } catch (error: any) {
      console.error('❌ Erreur getCommandes:', error.response?.data || error.message);
      if (error.response?.status === 204) return [];
      throw error;
    }
  },

  getCommande: async (id: number): Promise<Commande> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/commandes/${id}`);
      return extractObject(response);
    } catch (error: any) {
      console.error('❌ Erreur getCommande:', error.response?.data || error.message);
      throw error;
    }
  },

  createCommande: async (commandeData: CommandeFormData): Promise<Commande> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/commandes`, commandeData);
      return extractObject(response);
    } catch (error: any) {
      console.error('❌ Erreur createCommande:', error.response?.data || error.message);
      throw error;
    }
  },

  updateCommandeStatut: async (id: number, statut: string): Promise<Commande> => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/commandes/${id}/statut`, { statut });
      return extractObject(response);
    } catch (error: any) {
      console.error('❌ Erreur updateCommandeStatut:', error.response?.data || error.message);
      throw error;
    }
  },

  // ---- Expéditions API ----
  updateExpedition: async (expeditionData: ExpeditionFormData): Promise<Commande> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/commandes/expedition`, expeditionData);
      return extractObject(response);
    } catch (error: any) {
      console.error('❌ Erreur updateExpedition:', error.response?.data || error.message);
      throw error;
    }
  },

  // ---- Coûts Logistiques API ----
  updateCoutsLogistiques: async (coutsData: CoutLogistiqueFormData): Promise<Commande> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/commandes/couts`, coutsData);
      return extractObject(response);
    } catch (error: any) {
      console.error('❌ Erreur updateCoutsLogistiques:', error.response?.data || error.message);
      throw error;
    }
  },

  // ---- Calcul de Marge API ----
  calculerMarge: async (commandeId: number): Promise<CalculMarge> => {
  try {
    console.log(`🔍 Appel API marge pour commande ${commandeId}`);
    const response = await axios.get(`${API_BASE_URL}/commandes/${commandeId}/marge`);
    
    console.log('🔍 Réponse brute marge:', response);
    console.log('🔍 response.data:', response.data);
    
    const margeData = extractObject(response);
    console.log('🔍 Données marge extraites:', margeData);
    
    return margeData;
  } catch (error: any) {
    console.error('❌ Erreur calculerMarge:', error.response?.data || error.message);
    throw error;
  }
},
};
import type { RapportBilan, RapportCompteResultat, RapportTresorerie, RapportTVA } from '../types';

const API_BASE_URL = 'http://localhost:3001/api/comptabilite';

// Données de démo pour la balance
function getBalanceDemo() {
  return {
    "701000": { debit: 0, credit: 1500000, solde: -1500000 },
    "607000": { debit: 800000, credit: 0, solde: 800000 },
    "411000": { debit: 1200000, credit: 800000, solde: 400000 },
    "401000": { debit: 600000, credit: 800000, solde: -200000 },
    "512000": { debit: 500000, credit: 300000, solde: 200000 },
    "445710": { debit: 0, credit: 300000, solde: -300000 }
  };
}

export const rapportApi = {
  // Récupérer le bilan comptable
  getBilan: async (): Promise<RapportBilan> => {
    const res = await fetch(`${API_BASE_URL}/rapports/bilan`);
    if (!res.ok) throw new Error('Erreur lors du chargement du bilan');
    
    const data = await res.json();
    return data.data || {};
  },

  // Récupérer le compte de résultat
  getCompteResultat: async (): Promise<RapportCompteResultat> => {
    const res = await fetch(`${API_BASE_URL}/rapports/compte-resultat`);
    if (!res.ok) throw new Error('Erreur lors du chargement du compte de résultat');
    
    const data = await res.json();
    return data.data || { charges: 0, produits: 0, resultat_net: 0 };
  },

  // Récupérer l'état de trésorerie
  getTresorerie: async (): Promise<RapportTresorerie> => {
    const res = await fetch(`${API_BASE_URL}/rapports/tresorerie`);
    if (!res.ok) throw new Error('Erreur lors du chargement de la trésorerie');
    
    const data = await res.json();
    return data.data || { entrees: 0, sorties_prevues: 0, solde_tresorerie: 0 };
  },

  // Récupérer la déclaration TVA
  getTVA: async (): Promise<RapportTVA> => {
    const res = await fetch(`${API_BASE_URL}/rapports/tva`);
    if (!res.ok) throw new Error('Erreur lors du chargement de la TVA');
    
    const data = await res.json();
    return data.data || { tva_collectee: 0, tva_deductable: 0, tva_a_payer: 0 };
  },

  // Récupérer la balance comptable
  getBalance: async (date_debut?: string, date_fin?: string): Promise<any> => {
    try {
      const params = new URLSearchParams();
      if (date_debut) params.append('date_debut', date_debut);
      if (date_fin) params.append('date_fin', date_fin);
      
      const queryString = params.toString();
      const url = queryString ? `${API_BASE_URL}/rapports/balance?${queryString}` : `${API_BASE_URL}/rapports/balance`;
      
      const res = await fetch(url);
      
      if (!res.ok) {
        console.warn('Endpoint balance non disponible, utilisation de données de démo');
        return getBalanceDemo();
      }
      
      const data = await res.json();
      return data.data || {};
    } catch (error) {
      console.error('Erreur chargement balance:', error);
      return getBalanceDemo();
    }
  }
};

export default rapportApi;
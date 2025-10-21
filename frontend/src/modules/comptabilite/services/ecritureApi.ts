// src/modules/comptabilite/services/ecritureApi.ts - VERSION CORRIGÉE AVEC PARSING
import type { EcritureComptable } from '../types';

const API_BASE_URL = 'http://localhost:3001/api/comptabilite';

// Fonction pour parser les montants string en number
const parseMontants = (ecritures: any[]): EcritureComptable[] => {
  return ecritures.map(ecriture => ({
    ...ecriture,
    debit: parseFloat(ecriture.debit) || 0,
    credit: parseFloat(ecriture.credit) || 0,
    taux_change: parseFloat(ecriture.taux_change) || 1
  }));
};

export const ecritureApi = {
  getEcrituresComptables: async (filters?: { 
    date_debut?: string; 
    date_fin?: string; 
    journal?: string 
  }): Promise<EcritureComptable[]> => {
    const params = new URLSearchParams();
    if (filters?.date_debut) params.append('date_debut', filters.date_debut);
    if (filters?.date_fin) params.append('date_fin', filters.date_fin);
    if (filters?.journal) params.append('journal', filters.journal);
    
    const queryString = params.toString();
    const url = queryString 
      ? `${API_BASE_URL}/ecritures?${queryString}` 
      : `${API_BASE_URL}/ecritures`;

    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    
    if (Array.isArray(data.data)) {
      return parseMontants(data.data);
    }
    
    return [];
  }
};

export default ecritureApi;

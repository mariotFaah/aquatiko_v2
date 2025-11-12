// src/modules/comptabilite/services/ecritureApi.ts - VERSION CORRIGÉE
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
    
    // ✅ CORRECTION : Mapping correct des paramètres
    if (filters?.date_debut) params.append('debut', filters.date_debut);    // "debut" au lieu de "date_debut"
    if (filters?.date_fin) params.append('fin', filters.date_fin);          // "fin" au lieu de "date_fin"
    if (filters?.journal) params.append('journal', filters.journal);
    
    const queryString = params.toString();
    const url = queryString 
      ? `${API_BASE_URL}/ecritures?${queryString}` 
      : `${API_BASE_URL}/ecritures`;

    console.log(`🔄 Appel API: ${url}`); // Debug
    
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log('📊 Données brutes reçues:', data); // Debug
    
    if (data.success && Array.isArray(data.data)) {
      const ecrituresParsees = parseMontants(data.data);
      console.log('✅ Écritures parsées:', ecrituresParsees.length, 'éléments');
      return ecrituresParsees;
    }
    
    console.warn('⚠️ Aucune donnée valide reçue');
    return [];
  }
};

export default ecritureApi;
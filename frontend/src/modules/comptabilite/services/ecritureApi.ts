// src/modules/comptabilite/services/ecritureApi.ts
import type { EcritureComptable } from '../types';

const API_BASE_URL = 'http://localhost:3001/api/comptabilite';

export const ecritureApi = {
  // Récupérer toutes les écritures comptables
  getEcrituresComptables: async (filters?: { date_debut?: string; date_fin?: string; journal?: string }): Promise<EcritureComptable[]> => {
    try {
      // Construire l'URL avec les filtres
      const params = new URLSearchParams();
      if (filters?.date_debut) params.append('date_debut', filters.date_debut);
      if (filters?.date_fin) params.append('date_fin', filters.date_fin);
      if (filters?.journal) params.append('journal', filters.journal);
      
      const queryString = params.toString();
      const url = queryString ? `${API_BASE_URL}/ecritures?${queryString}` : `${API_BASE_URL}/ecritures`;
      
      const res = await fetch(url);
      
      if (!res.ok) {
        // Si l'endpoint n'existe pas encore, retourner des données de démo
        console.warn('Endpoint écritures comptables non disponible, utilisation de données de démo');
        return getEcrituresDemo();
      }
      
      const data = await res.json();
      return Array.isArray(data.data) ? data.data : [];
    } catch (error) {
      console.error('Erreur chargement écritures:', error);
      return getEcrituresDemo();
    }
  }
};

// Données de démo temporaires
function getEcrituresDemo(): EcritureComptable[] {
  return [
    {
      id_ecriture: 1,
      numero_ecriture: 'ECR-2024-001',
      date: '2024-10-01',
      journal: 'ventes',
      compte: '701',
      libelle: 'Vente de produits aquatiques',
      debit: 0,
      credit: 1500000,
      devise: 'MGA',
      taux_change: 1,
      reference: 'FACT-2024-001'
    },
    {
      id_ecriture: 2,
      numero_ecriture: 'ECR-2024-002',
      date: '2024-10-01',
      journal: 'banque',
      compte: '512',
      libelle: 'Virement client - Vente produits',
      debit: 1500000,
      credit: 0,
      devise: 'MGA',
      taux_change: 1,
      reference: 'FACT-2024-001'
    },
    {
      id_ecriture: 3,
      numero_ecriture: 'ECR-2024-003',
      date: '2024-10-02',
      journal: 'achats',
      compte: '601',
      libelle: 'Achat matières premières',
      debit: 800000,
      credit: 0,
      devise: 'MGA',
      taux_change: 1,
      reference: 'ACH-2024-001'
    },
    {
      id_ecriture: 4,
      numero_ecriture: 'ECR-2024-004',
      date: '2024-10-02',
      journal: 'banque',
      compte: '512',
      libelle: 'Paiement fournisseur',
      debit: 0,
      credit: 800000,
      devise: 'MGA',
      taux_change: 1,
      reference: 'ACH-2024-001'
    }
  ];
}

export default ecritureApi;

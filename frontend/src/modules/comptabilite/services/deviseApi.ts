// src/modules/comptabilite/services/deviseApi.ts
import type { TauxChange, ConversionDevise } from '../types';

const API_BASE_URL = 'http://localhost:3001/api/comptabilite';
const parseTaux = (tauxChanges: any[]): TauxChange[] => {
  return tauxChanges.map(taux => ({
    ...taux,
    taux: parseFloat(taux.taux) || 0,
    actif: Boolean(taux.actif)
  }));
};

export interface TauxReelTime {
  USD: number;
  EUR: number;
  date: string;
  base: string;
}

export const deviseApi = {
  // Récupérer tous les taux
  async getTauxChange(): Promise<TauxChange[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/devises/taux`);
      
      if (!res.ok) {
        throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      
      if (data.success && Array.isArray(data.data)) {
        return parseTaux(data.data);
      }
      
      return [];
    } catch (error) {
      console.error('Erreur getTauxChange:', error);
      throw error;
    }
  },

  // Créer un nouveau taux
  async createTauxChange(tauxData: Omit<TauxChange, 'id_taux' | 'created_at' | 'updated_at'>): Promise<TauxChange> {
    try {
      const res = await fetch(`${API_BASE_URL}/devises/taux`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tauxData),
      });
      
      if (!res.ok) {
        throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      
      if (data.success) {
        return data.data;
      }
      
      throw new Error(data.message || 'Erreur lors de la création');
    } catch (error) {
      console.error('Erreur createTauxChange:', error);
      throw error;
    }
  },

  // Convertir un montant
  async convertirDevise(montant: number, source: string, cible: string): Promise<ConversionDevise> {
    try {
      const res = await fetch(`${API_BASE_URL}/devises/convertir`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          montant,
          devise_source: source,
          devise_cible: cible
        }),
      });
      
      if (!res.ok) {
        throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      
      if (data.success) {
        return data.data;
      }
      
      throw new Error(data.message || 'Erreur lors de la conversion');
    } catch (error) {
      console.error('Erreur convertirDevise:', error);
      throw error;
    }
  },

  // NOUVELLE VERSION CORRIGÉE de getTauxReelTime
async getTauxReelTime(): Promise<TauxReelTime> {
  try {
    // Utiliser ExchangeRate-API qui supporte MGA
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    
    if (!res.ok) {
      throw new Error(`Erreur API ExchangeRate: ${res.status}`);
    }
    
    const data = await res.json();
    
    // Vérifier que MGA est disponible
    if (!data.rates || !data.rates.MGA) {
      throw new Error('Taux MGA non disponible');
    }
    
    // ExchangeRate-API retourne: 1 USD = X MGA
    const tauxUSDVersMGA = data.rates.MGA;  // 1 USD = 4484.87 MGA
    const tauxUSDVersEUR = data.rates.EUR;  // 1 USD = X EUR
    
    // Calcul des taux MGA depuis USD
    const tauxMGAVersUSD = 1 / tauxUSDVersMGA;  // 1 MGA = X USD
    const tauxMGAVersEUR = tauxUSDVersEUR / tauxUSDVersMGA;  // 1 MGA = X EUR
    
    console.log('📊 Taux réels récupérés:', {
      'USD→MGA': tauxUSDVersMGA,
      'USD→EUR': tauxUSDVersEUR,
      'MGA→USD': tauxMGAVersUSD,
      'MGA→EUR': tauxMGAVersEUR
    });
    
    return {
      USD: parseFloat(tauxMGAVersUSD.toFixed(6)),
      EUR: parseFloat(tauxMGAVersEUR.toFixed(6)),
      date: data.date || new Date().toISOString().split('T')[0],
      base: 'MGA'
    };
    
  } catch (error) {
    console.error('Erreur getTauxReelTime:', error);
    
    // Fallback avec des taux réalistes basés sur votre test
    return {
      USD: 0.000223,  // 1 MGA = 0.000223 USD (1/4484.87)
      EUR: 0.000205,  // Estimation basée sur EUR/USD
      date: new Date().toISOString().split('T')[0],
      base: 'MGA'
    };
  }
},

  // NOUVEAU : Synchroniser avec les taux réels
  async syncWithReelTaux(): Promise<TauxReelTime> {
    try {
      const tauxReel = await this.getTauxReelTime();
      
      // Ici vous pourriez automatiquement mettre à jour votre base
      // ou juste retourner les taux pour comparaison
      return tauxReel;
    } catch (error) {
      console.error('Erreur syncWithReelTaux:', error);
      throw error;
    }
  }
};

export default deviseApi;
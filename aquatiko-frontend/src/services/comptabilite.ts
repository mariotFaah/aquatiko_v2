import { ApiService } from './api';
import type { Tiers, Article, Facture, Paiement } from '../types';

export const ComptabiliteService = {
  // Tiers
  getTiers: () => ApiService.get<Tiers[]>('/comptabilite/tiers'),
  createTiers: (data: Omit<Tiers, 'id_tiers'>) => 
    ApiService.post<Tiers>('/comptabilite/tiers', data),

  // Articles
  getArticles: () => ApiService.get<Article[]>('/comptabilite/articles'),
  createArticle: (data: Omit<Article, 'created_at' | 'updated_at'>) => 
    ApiService.post<Article>('/comptabilite/articles', data),

  // Factures
  getFactures: () => ApiService.get<Facture[]>('/comptabilite/factures'),
  getFacture: (id: number) => ApiService.get<Facture>(`/comptabilite/factures/${id}`),
  createFacture: (data: any) => 
    ApiService.post<Facture>('/comptabilite/factures', data),
  validerFacture: (id: number) => 
    ApiService.patch<Facture>(`/comptabilite/factures/${id}/valider`),

  // Paiements
  getPaiementsByFacture: (numeroFacture: number) => 
    ApiService.get<Paiement[]>(`/comptabilite/paiements/facture/${numeroFacture}`),
  createPaiement: (data: any) => 
    ApiService.post<Paiement>('/comptabilite/paiements', data),
};
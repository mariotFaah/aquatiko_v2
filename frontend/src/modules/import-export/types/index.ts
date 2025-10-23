// src/modules/import-export/types/index.ts
import type { Tiers } from '../../../types/shared';
export type { Tiers }; // ✅ on garde seulement ce Tiers

export interface Commande {
  id: number;
  numero_commande: string;
  type: 'import' | 'export';
  client_id: number;
  fournisseur_id: number;
  date_commande: string;
  date_livraison_prevue?: string;
  statut: 'brouillon' | 'confirmée' | 'expédiée' | 'livrée' | 'annulée';
  notes?: string;
  montant_total: number;
  devise: string;
  created_at: string;
  updated_at: string;
  
  client?: Tiers;
  fournisseur?: Tiers;
  lignes?: LigneCommande[];
  expedition?: Expedition;
  couts_logistiques?: CoutLogistique;
}

export interface LigneCommande {
  id: number;
  commande_id: number;
  article_id: string;
  description: string;
  quantite: number;
  prix_unitaire: number;
  taux_tva: number;
  created_at: string;
  updated_at: string;

  article?: Article;
}

export interface Expedition {
  id: number;
  commande_id: number;
  numero_bl?: string;
  numero_connaissement?: string;
  numero_packing_list?: string;
  date_expedition?: string;
  date_arrivee_prevue?: string;
  date_arrivee_reelle?: string;
  transporteur?: string;
  mode_transport?: string;
  instructions_speciales?: string;
  statut: 'preparation' | 'expédiée' | 'transit' | 'arrivée' | 'livrée';
  created_at: string;
  updated_at: string;
}

export interface CoutLogistique {
  id: number;
  commande_id: number;
  fret_maritime: number;
  fret_aerien: number;
  assurance: number;
  droits_douane: number;
  frais_transit: number;
  transport_local: number;
  autres_frais: number;
  description_autres_frais?: string;
  devise_couts: string;
  created_at: string;
  updated_at: string;
}

export interface CalculMarge {
  marge_brute: number;
  marge_nette: number;
  taux_marge: number;
  total_couts: number;
  chiffre_affaires: number;
}

export interface Article {
  code_article: string;
  description: string;
  prix_unitaire: number;
  taux_tva: number;
  unite: string;
  devise?: string;
}

export interface CommandeFormData {
  type: 'import' | 'export';
  client_id: number;
  fournisseur_id: number;
  date_commande: string;
  date_livraison_prevue?: string;
  notes?: string;
  devise: string;
  statut?: 'brouillon' | 'confirmée' | 'expédiée' | 'livrée' | 'annulée';
  lignes: LigneCommandeFormData[];
}

export interface LigneCommandeFormData {
  article_id: string;
  description: string;
  quantite: number;
  prix_unitaire: number;
  taux_tva: number;
}

export interface ExpeditionFormData {
  commande_id: number;
  numero_bl?: string;
  numero_connaissement?: string;
  numero_packing_list?: string;
  date_expedition?: string;
  date_arrivee_prevue?: string;
  transporteur?: string;
  mode_transport?: string;
  instructions_speciales?: string;
  statut: 'preparation' | 'expédiée' | 'transit' | 'arrivée' | 'livrée';
}

export interface CoutLogistiqueFormData {
  commande_id: number;
  fret_maritime: number;
  fret_aerien: number;
  assurance: number;
  droits_douane: number;
  frais_transit: number;
  transport_local: number;
  autres_frais: number;
  description_autres_frais?: string;
  devise_couts: string;
}

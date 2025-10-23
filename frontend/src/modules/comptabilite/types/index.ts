// src/modules/comptabilite/types/index.ts
import type { Tiers } from '../../../types/shared';
export type { Tiers }; // ✅ on garde seulement le Tiers partagé

export interface LigneFacture {
  id_ligne?: number;
  numero_facture?: number;
  code_article: string;
  description: string;
  quantite: number;
  prix_unitaire: number;
  taux_tva: number;
  remise: number;
  montant_ht?: number;
  montant_tva?: number;
  montant_ttc?: number;
  article_description?: string;
  article_unite?: string;
}

export interface Article {
  code_article: string;
  description: string;
  prix_unitaire: number;
  taux_tva: number;
  unite: string;
  devise?: string;
  actif?: boolean;
}

export interface Facture {
  numero_facture?: number;
  date: string;
  type_facture: 'facture' | 'proforma' | 'avoir';
  id_tiers: number;
  echeance: string;
  reglement: 'virement' | 'cheque' | 'espece' | 'carte';
  total_ht: number;
  total_tva: number;
  total_ttc: number;
  statut: 'brouillon' | 'validee' | 'annulee';
  nom_tiers?: string;
  adresse?: string;
  email?: string;
  telephone?: string;
  type_tiers?: 'client' | 'fournisseur';
  devise?: string;
  taux_change?: number;
  notes?: string;
  lignes: LigneFacture[];
  created_at?: string;
  updated_at?: string;
}

export interface FactureFormData {
  facture: Omit<Facture, 'numero_facture' | 'lignes' | 'created_at' | 'updated_at'>;
  lignes: Omit<LigneFacture, 'id_ligne' | 'numero_facture' | 'montant_ht' | 'montant_tva' | 'montant_ttc'>[];
}

export interface Paiement {
  id_paiement?: number;
  numero_facture: number;
  date_paiement: string;
  montant: number;
  mode_paiement: 'espèce' | 'virement' | 'chèque' | 'carte';
  reference?: string;
  statut: 'validé' | 'en_attente' | 'annulé';
  devise: string;
  taux_change: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TauxChange {
  id_taux?: number;
  devise_source: string;
  devise_cible: string;
  taux: number;
  date_effet: string;
  actif: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EcritureComptable {
  id_ecriture?: number;
  numero_ecriture: string;
  date: string;
  journal: 'ventes' | 'achats' | 'banque' | 'caisse';
  compte: string;
  libelle: string;
  debit: number;
  credit: number;
  devise: string;
  taux_change: number;
  reference?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ConversionDevise {
  montant: number;
  devise_source: string;
  devise_cible: string;
  date?: string;
}

export interface RapportBilan {
  [compte: string]: {
    debit: number;
    credit: number;
    solde: number;
  };
}

export interface RapportCompteResultat {
  charges: number;
  produits: number;
  resultat_net: number;
}

export interface RapportTresorerie {
  entrees: number;
  sorties_prevues: number;
  solde_tresorerie: number;
}

export interface RapportTVA {
  tva_collectee: number;
  tva_deductable: number;
  tva_a_payer: number;
}

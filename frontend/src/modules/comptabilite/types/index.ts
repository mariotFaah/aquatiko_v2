// src/modules/comptabilite/types/index.ts - VERSION COMPLÈTE CORRIGÉE

// Types existants - AJOUTER LigneFacture manquant
export interface LigneFacture {
  id_ligne?: number;
  numero_facture?: number;
  code_article: string;
  description: string;
  quantite: number;
  prix_unitaire: number;
  taux_tva: number;
  remise: number;
  montant_ht?: number; // Rendre optionnel
  montant_tva?: number; // Rendre optionnel
  montant_ttc?: number; // Rendre optionnel
  article_description?: string;
  article_unite?: string;
}

export interface Tiers {
  id_tiers: number;
  type_tiers: 'client' | 'fournisseur';
  nom: string;
  numero: string;
  adresse: string;
  email: string;
  telephone: string;
  // NOUVEAUX CHAMPS
  devise_preferee?: string;
  created_at: string;
  updated_at: string;
}

export interface Article {
  code_article: string;
  description: string;
  prix_unitaire: number;
  taux_tva: number;
  unite: string;
  // NOUVEAUX CHAMPS
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
  // NOUVEAUX CHAMPS POUR ÉCHÉANCES
  type_tiers?: 'client' | 'fournisseur';  // ← AJOUTÉ
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

// NOUVEAUX TYPES POUR LES FONCTIONNALITÉS AJOUTÉES

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
// src/modules/comptabilite/types/index.ts
export interface Tiers {
  id_tiers: number;
  type_tiers: 'client' | 'fournisseur';
  nom: string;
  numero: string;
  adresse: string;
  email: string;
  telephone: string;
  created_at: string;
  updated_at: string;
}

export interface Article {
  code_article: string;
  description: string;
  prix_unitaire: number;
  taux_tva: number;
  unite: string;
}

export interface LigneFacture {
  id_ligne?: number;
  numero_facture?: number;
  code_article: string;
  description: string;
  quantite: number;
  prix_unitaire: number;
  taux_tva: number;
  remise: number;
  montant_ht: number;
  montant_tva: number;
  montant_ttc: number;
  article_description?: string;
  article_unite?: string;
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
  lignes: LigneFacture[];
  created_at?: string;
  updated_at?: string;
}

export interface FactureFormData {
  facture: Omit<Facture, 'numero_facture' | 'lignes' | 'created_at' | 'updated_at'>;
  lignes: Omit<LigneFacture, 'id_ligne' | 'numero_facture' | 'montant_ht' | 'montant_tva' | 'montant_ttc'>[];
}
// Types communs
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Comptabilité
export interface Tiers {
  id_tiers: number;
  type_tiers: 'client' | 'fournisseur';
  nom: string;
  numero: string;
  adresse?: string;
  email?: string;
  telephone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Article {
  code_article: string;
  description: string;
  prix_unitaire: number;
  taux_tva: number;
  unite: string;
  actif: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Facture {
  numero_facture: number;
  date: string;
  type_facture: 'proforma' | 'facture' | 'avoir';
  id_tiers: number;
  total_ht: number;
  total_tva: number;
  total_ttc: number;
  statut: 'brouillon' | 'validee' | 'annulee';
  nom_tiers?: string;
}

export interface LigneFacture {
  id_ligne: number;
  numero_facture: number;
  code_article: string;
  description: string;
  quantite: number;
  prix_unitaire: number;
  taux_tva: number;
  remise: number;
  montant_ht: number;
  montant_tva: number;
  montant_ttc: number;
}

export interface Paiement {
  id_paiement: number;
  numero_facture: number;
  date_paiement: string;
  montant: number;
  mode_paiement: string;
  reference: string;
  statut: string;
  devise: string;
}
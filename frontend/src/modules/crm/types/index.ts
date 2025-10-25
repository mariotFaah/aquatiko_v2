// src/modules/crm/types/index.ts

// Client étendu avec données CRM
export interface Client {
  // Données de base
  id_tiers: number;
  nom: string;
  type_tiers: string;
  numero: string;
  adresse: string;
  email: string;
  telephone: string;
  created_at: string;
  updated_at: string;
  devise_preferee: string;

  // Données CRM étendues
  siret?: string;
  forme_juridique?: string;
  secteur_activite?: string;
  categorie?: 'prospect' | 'client' | 'fournisseur' | 'partenaire';
  chiffre_affaires_annuel?: number;
  effectif?: number;
  notes?: string;
  site_web?: string;
  responsable_commercial?: string;
  date_premier_contact?: string;
  date_derniere_activite?: string;

  // Relations
  contacts?: Contact[];
  devis?: Devis[];
  contrats?: Contrat[];
  activites?: Activite[];
  stats?: ClientStats;
}

// Contact client
export interface Contact {
  id_contact: number;
  tiers_id: number;
  nom: string;
  prenom?: string;
  fonction?: string;
  email?: string;
  telephone?: string;
  principal: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Devis
export interface Devis {
  id_devis: number;
  numero_devis: string;
  tiers_id: number;
  date_devis: string;
  date_validite?: string;
  statut: 'brouillon' | 'envoye' | 'accepte' | 'refuse' | 'expire';
  montant_ht: number;
  montant_ttc: number;
  objet?: string;
  conditions?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  client_nom?: string;
  client_numero?: string;
  client_adresse?: string;
  client_email?: string;
  client_telephone?: string;
}

// Contrat de prestation
export interface Contrat {
  id_contrat: number;
  numero_contrat: string;
  tiers_id: number;
  devis_id?: number;
  type_contrat: string;
  date_debut: string;
  date_fin?: string;
  statut: 'actif' | 'inactif' | 'resilie' | 'termine';
  montant_ht: number;
  periodicite?: string;
  description?: string;
  conditions?: string;
  created_at: string;
  updated_at: string;
}

// Activité commerciale
export interface Activite {
  id_activite: number;
  tiers_id: number;
  type_activite: 'appel' | 'email' | 'reunion' | 'visite';
  sujet: string;
  description?: string;
  date_activite: string;
  date_rappel?: string;
  statut: 'planifie' | 'realise' | 'annule';
  priorite: 'bas' | 'normal' | 'haut' | 'urgent';
  utilisateur_id?: number;
  created_at: string;
  updated_at: string;
}

// Relance
export interface Relance {
  id_relance: number;
  tiers_id: number;
  type_relance: 'paiement' | 'contrat' | 'echeance' | 'commerciale';
  objet: string;
  message?: string;
  date_relance: string;
  echeance?: string;
  statut: 'en_attente' | 'envoyee' | 'traitee' | 'annulee';
  canal: 'email' | 'telephone' | 'courrier' | 'sms';
  facture_id?: number;
  contrat_id?: number;
  created_at: string;
  updated_at: string;
}

// Statistiques client
export interface ClientStats {
  id_tiers: number;
  total_devis: number;
  total_contrats: number;
  total_activites: number;
  ca_devis: number;
  ca_contrats: number;
}

// Statistiques devis
export interface DevisStats {
  par_statut: Array<{
    statut: string;
    count: number;
  }>;
  total_chiffre_affaires: number;
}

// Formulaires
export interface ClientFormData {
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  siret?: string;
  forme_juridique?: string;
  secteur_activite?: string;
  categorie?: string;
  chiffre_affaires_annuel?: number;
  effectif?: number;
  responsable_commercial?: string;
}

export interface DevisFormData {
  tiers_id: number;
  date_devis: string;
  date_validite?: string;
  objet: string;
  montant_ht: number;
  conditions?: string;
}

export interface ContactFormData {
  tiers_id: number;
  nom: string;
  prenom?: string;
  fonction?: string;
  email?: string;
  telephone?: string;
  principal: boolean;
}

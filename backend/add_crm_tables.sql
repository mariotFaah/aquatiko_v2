-- Ajouter les colonnes CRM à la table tiers
ALTER TABLE tiers 
ADD COLUMN siret VARCHAR(14),
ADD COLUMN forme_juridique VARCHAR(100),
ADD COLUMN secteur_activite VARCHAR(100),
ADD COLUMN categorie ENUM('prospect', 'client', 'fournisseur', 'partenaire'),
ADD COLUMN chiffre_affaires_annuel INT,
ADD COLUMN effectif INT,
ADD COLUMN notes TEXT,
ADD COLUMN site_web VARCHAR(255),
ADD COLUMN responsable_commercial VARCHAR(255),
ADD COLUMN date_premier_contact DATE,
ADD COLUMN date_derniere_activite DATE;

-- Table des contacts
CREATE TABLE IF NOT EXISTS contacts (
  id_contact INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tiers_id INT UNSIGNED NOT NULL,
  nom VARCHAR(255) NOT NULL,
  prenom VARCHAR(255),
  fonction VARCHAR(100),
  email VARCHAR(255),
  telephone VARCHAR(20),
  principal BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tiers_id) REFERENCES tiers(id_tiers) ON DELETE CASCADE
);

-- Table des devis
CREATE TABLE IF NOT EXISTS devis (
  id_devis INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  numero_devis VARCHAR(50) UNIQUE NOT NULL,
  tiers_id INT UNSIGNED NOT NULL,
  date_devis DATE NOT NULL,
  date_validite DATE,
  statut ENUM('brouillon', 'envoye', 'accepte', 'refuse', 'expire') DEFAULT 'brouillon',
  montant_ht DECIMAL(15,2) DEFAULT 0,
  montant_ttc DECIMAL(15,2) DEFAULT 0,
  objet TEXT,
  conditions TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tiers_id) REFERENCES tiers(id_tiers)
);

-- Table des contrats
CREATE TABLE IF NOT EXISTS contrats (
  id_contrat INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  numero_contrat VARCHAR(50) UNIQUE NOT NULL,
  tiers_id INT UNSIGNED NOT NULL,
  devis_id INT UNSIGNED,
  type_contrat VARCHAR(100) NOT NULL,
  date_debut DATE NOT NULL,
  date_fin DATE,
  statut ENUM('actif', 'inactif', 'resilie', 'termine') DEFAULT 'actif',
  montant_ht DECIMAL(15,2) DEFAULT 0,
  periodicite VARCHAR(50),
  description TEXT,
  conditions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tiers_id) REFERENCES tiers(id_tiers),
  FOREIGN KEY (devis_id) REFERENCES devis(id_devis)
);

-- Table des activités
CREATE TABLE IF NOT EXISTS activites (
  id_activite INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tiers_id INT UNSIGNED NOT NULL,
  type_activite VARCHAR(50) NOT NULL,
  sujet VARCHAR(255) NOT NULL,
  description TEXT,
  date_activite DATETIME NOT NULL,
  date_rappel DATETIME,
  statut ENUM('planifie', 'realise', 'annule') DEFAULT 'planifie',
  priorite ENUM('bas', 'normal', 'haut', 'urgent') DEFAULT 'normal',
  utilisateur_id INT UNSIGNED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tiers_id) REFERENCES tiers(id_tiers) ON DELETE CASCADE
);

-- Table des relances
CREATE TABLE IF NOT EXISTS relances (
  id_relance INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tiers_id INT UNSIGNED NOT NULL,
  type_relance VARCHAR(50) NOT NULL,
  objet VARCHAR(255) NOT NULL,
  message TEXT,
  date_relance DATE NOT NULL,
  echeance DATE,
  statut ENUM('en_attente', 'envoyee', 'traitee', 'annulee') DEFAULT 'en_attente',
  canal ENUM('email', 'telephone', 'courrier', 'sms') DEFAULT 'email',
  facture_id INT UNSIGNED,
  contrat_id INT UNSIGNED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tiers_id) REFERENCES tiers(id_tiers) ON DELETE CASCADE,
  FOREIGN KEY (facture_id) REFERENCES factures(numero_facture),
  FOREIGN KEY (contrat_id) REFERENCES contrats(id_contrat)
);

📊 Module Comptabilité - Aquatiko
🌟 Aperçu

Module complet de gestion comptable pour l'entreprise Aquatiko, offrant une solution intégrée de gestion financière multi-devises avec génération automatique d'écritures comptables et gestion dynamique des référentiels.

🚀 Fonctionnalités
💰 Gestion Multi-devises

    Support complet EUR, USD, MGA
    Taux de change dynamiques
    Conversion automatique entre devises
    Historique des taux

👥 Gestion des Tiers

    Clients et fournisseurs
    Devises préférées par tiers
    Adresses et contacts complets
    CRUD complet

📦 Catalogue d'Articles

    Produits et services
    Prix unitaire avec TVA
    Gestion des unités
    Statut actif/inactif

🧾 Facturation Avancée

    Types : Proforma, Facture, Avoir (configurables)
    Lignes détaillées avec TVA
    Échéances et modes de règlement
    Statuts : Brouillon, Validée, Annulée

💳 Suivi des Paiements

    Paiements partiels et complets
    Modes de paiement configurables
    Références de transaction
    Statut de validation

📊 Écritures Comptables Automatiques

    Génération automatique à la validation
    Journaux : Ventes, Achats, Banque, Caisse
    Plan comptable 100% configurable
    Référencement des opérations

📈 Rapports Financiers

    Bilan comptable avec soldes par compte
    Compte de résultat (charges/produits)
    Déclaration TVA collectée/déductible
    État de trésorerie (entrées/sorties)

📊 Tableau de Bord Statistiques

    Chiffre d'affaire par période
    Top clients et produits
    Indicateurs clés de performance
    Métriques financières

🔧 Gestion des Référentiels (NOUVEAU)

    Plan comptable dynamique et configurable
    Modes de paiement personnalisables
    Types de documents extensibles
    Taux de TVA modifiables

🛠️ Installation et Configuration
Prérequis

    Node.js 16+
    MySQL/MariaDB
    npm ou yarn

Installation
# Cloner le projet
git clone [repository-url]
cd aquatiko/backend

# Installer les dépendances
npm install

# Configuration de la base de données
cp .env.example .env
# Éditer .env avec vos paramètres DB

# Exécuter les migrations
npm run migrate

# Peupler la base avec des données de test
npm run seed

# Démarrer le serveur
npm run dev

🌐 API Documentation
Base URL
http://localhost:3001/api/comptabilite

Endpoints Principaux
📋 Tiers (Clients/Fournisseurs)
GET    /tiers                    # Liste tous les tiers
GET    /tiers/:id               # Détail d'un tiers
POST   /tiers                    # Créer un tiers
PUT    /tiers/:id               # Modifier un tiers
DELETE /tiers/:id               # Supprimer un tiers

📦 Articles
GET    /articles                 # Liste tous les articles
GET    /articles/:code          # Détail d'un article
POST   /articles                 # Créer un article
PUT    /articles/:code          # Modifier un article
DELETE /articles/:code          # Supprimer un article

🧾 Factures
GET    /factures                 # Liste toutes les factures
GET    /factures/:id            # Détail d'une facture
POST   /factures                 # Créer une facture
PUT    /factures/:id            # Modifier une facture
PATCH  /factures/:id/valider    # Valider une facture

💳 Paiements
GET    /paiements                # Liste tous les paiements
POST   /paiements                # Enregistrer un paiement
GET    /paiements/facture/:numero_facture   # Paiements d'une facture
GET    /paiements/:id           # Détail d'un paiement
PUT    /paiements/:id           # Modifier un paiement

🌍 Devises
GET    /devises/taux            # Liste des taux de change
POST   /devises/taux            # Mettre à jour un taux
POST   /devises/convertir       # Convertir entre devises

📊 Rapports
GET    /rapports/bilan          # Bilan comptable
GET    /rapports/compte-resultat # Compte de résultat
GET    /rapports/tva            # Déclaration TVA
GET    /rapports/tresorerie     # État de trésorerie

📝 Écritures Comptables
GET    /ecritures               # Liste toutes les écritures
GET    /ecritures/journal/:type # Écritures par journal
GET    /ecritures/:id           # Détail d'une écriture
POST   /ecritures               # Créer une écriture manuelle

📈 Statistiques
GET    /stats/indicateurs       # Indicateurs généraux
GET    /stats/chiffre-affaire   # CA par période
GET    /stats/top-clients       # Top 10 clients
GET    /stats/top-produits      # Top 10 produits
GET    /stats/factures-en-attente # Factures en attente de paiement

🔧 Référentiels (NOUVEAU)
GET    /referentiels/plan-comptable      # Récupérer le plan comptable
GET    /referentiels/modes-paiement      # Liste des modes de paiement
GET    /referentiels/types-facture       # Liste des types de facture
GET    /referentiels/taux-tva            # Liste des taux de TVA

💾 Structure de la Base de Données
Tables Principales

    tiers - Clients et fournisseurs
    articles - Produits et services
    factures - En-têtes des factures
    lignes_facture - Lignes détaillées
    paiements - Transactions
    ecritures_comptables - Écritures comptables
    taux_change - Taux de conversion

Tables de Référence (NOUVEAU)

    plan_comptable - Plan comptable configurable
    referentiel_types_facture - Types de documents
    referentiel_modes_paiement - Modes de paiement
    referentiel_taux_tva - Taux de TVA applicables

Plan Comptable Dynamique (Exemple)
401000 - Fournisseurs
411000 - Clients
445620 - TVA déductible
445710 - TVA collectée
512000 - Banque
530000 - Caisse
607000 - Achats de marchandises
701000 - Ventes de produits

🔧 Architecture Technique
Structure du Module
src/modules/comptabilite/
├── controllers/          # Contrôleurs API
├── entities/            # Modèles de données
├── repositories/        # Accès aux données
├── services/           # Logique métier
├── routes/             # Définition des routes
├── validators/         # Validation des données
└── index.js           # Point d'entrée du module

Services Principaux

    FacturationService - Gestion des factures
    JournalService - Génération d'écritures (plan comptable dynamique)
    RapportService - Calculs financiers
    StatistiqueService - Métriques et KPI
    DeviseService - Conversion de devises
    PaiementService - Gestion des transactions
    ReferentielService - Gestion des référentiels (NOUVEAU)

📋 Exemples d'Utilisation
Création d'une Facture
curl -X POST http://localhost:3001/api/comptabilite/factures \
  -H "Content-Type: application/json" \
  -d '{
    "id_tiers": 1,
    "date": "2024-10-15",
    "type_facture": "facture",
    "echeance": "2024-11-15",
    "reglement": "virement",
    "lignes": [
      {
        "code_article": "ART001",
        "quantite": 2,
        "prix_unitaire": 25000
      }
    ],
    "statut": "validee"
  }'

Enregistrement d'un Paiement
curl -X POST http://localhost:3001/api/comptabilite/paiements \
  -H "Content-Type: application/json" \
  -d '{
    "numero_facture": 1,
    "date_paiement": "2024-10-20",
    "montant": 50000,
    "devise": "MGA",
    "mode_paiement": "virement",
    "reference": "VIR-TEST",
    "statut": "validé"
  }'

Consultation des Référentiels (NOUVEAU)
# Plan comptable dynamique
curl "http://localhost:3001/api/comptabilite/referentiels/plan-comptable"

# Modes de paiement configurables
curl "http://localhost:3001/api/comptabilite/referentiels/modes-paiement"

# Types de documents
curl "http://localhost:3001/api/comptabilite/referentiels/types-facture"

# Taux de TVA
curl "http://localhost:3001/api/comptabilite/referentiels/taux-tva"

Conversion de Devise
curl -X POST http://localhost:3001/api/comptabilite/devises/convertir \
  -H "Content-Type: application/json" \
  -d '{
    "montant": 100,
    "devise_source": "EUR",
    "devise_cible": "MGA"
  }'

Rapport de Trésorerie
curl "http://localhost:3001/api/comptabilite/rapports/tresorerie?date_debut=2024-01-01&date_fin=2024-12-31"

🧪 Tests et Validation
Données de Test Incluses

    3 clients de test
    3 fournisseurs de test
    3 articles de test
    Plan comptable complet
    Modes de paiement : Espèce, Virement, Chèque, Carte
    Types de documents : Proforma, Facture, Avoir
    Taux de TVA : 0%, 5%, 10%, 20%
    Taux de change EUR/USD/MGA
    Factures et paiements d'exemple

Vérification du Module
# Test de santé du module
curl "http://localhost:3001/api/comptabilite/test"

# Vérification des écritures générées
curl "http://localhost:3001/api/comptabilite/ecritures"

# Validation des rapports
curl "http://localhost:3001/api/comptabilite/rapports/bilan"

# Vérification des paiements
curl "http://localhost:3001/api/comptabilite/paiements/facture/1"

# Consultation des référentiels dynamiques
curl "http://localhost:3001/api/comptabilite/referentiels/plan-comptable"

🔒 Sécurité et Validation

    Validation des données d'entrée
    Gestion des erreurs centralisée
    Transactions base de données
    Logs détaillés pour le debugging
    Protection contre les injections SQL

📈 Métriques et Performances

    Génération automatique des écritures
    Calculs financiers optimisés
    Pagination des listes volumineuses
    Cache des taux de change
    Indexation des requêtes fréquentes
    Plan comptable 100% dynamique

🚦 Statut du Module
✅ Complété à 100%

    Gestion des tiers et articles
    Facturation multi-types
    Paiements et échéances
    Écritures comptables automatiques
    Rapports financiers complets
    Statistiques et KPI
    API REST complète
    Documentation technique
    Plan comptable dynamique (NOUVEAU)
    Référentiels configurables (NOUVEAU)

🎯 Prêt pour la Production

Le module a été testé avec des données réelles et est prêt pour une utilisation en production. Toutes les données sont maintenant 100% dynamiques et configurables.

👥 Développement et Contribution
Commandes de Développement
# Mode développement avec rechargement automatique
npm run dev

# Exécution des migrations
npm run migrate

# Rollback des migrations
npm run migrate:rollback

# Génération de données de test
npm run seed

Standards de Code

    ES6+ modules
    Async/await pour les opérations asynchrones
    Validation des entrées
    Gestion centralisée des erreurs
    Logs structurés

📞 Support et Maintenance
Pour toute question ou problème concernant ce module, contacter l'équipe de développement Aquatiko.

© 2024 Aquatiko - Tous droits réservés
# 📊 Module CRM - Aquatiko

![Module Status](https://img.shields.io/badge/status-production-brightgreen) 
![Node Version](https://img.shields.io/badge/node-16%2B-blue) 
![License](https://img.shields.io/badge/license-Aquatiko-blueviolet)

## 🌟 Aperçu

Module complet de **Gestion de la Relation Client (CRM)** pour Aquatiko, offrant un suivi 360° des clients et prospects avec intégration complète aux modules Comptabilité et Import/Export.

---

## 📑 Table des Matières

- [Fonctionnalités](#-fonctionnalités)
- [Architecture Technique](#-architecture-technique)
- [Installation et Configuration](#-installation-et-configuration)
- [API Documentation](#-api-documentation)
- [Structure de la Base de Données](#-structure-de-la-base-de-données)
- [Intégrations](#-intégrations)
- [Exemples d'Utilisation](#-exemples-dutilisation)
- [Développement](#-développement)

---

## 🚀 Fonctionnalités

### 👥 Gestion des Clients Étendue
- ✅ **Fiches clients enrichies** - Données commerciales complètes
- ✅ **Catégorisation** - Prospect, Client, Fournisseur, Partenaire
- ✅ **Informations légales** - SIRET, forme juridique, secteur d'activité
- ✅ **Indicateurs business** - CA annuel, effectif, responsable commercial
- ✅ **Historique complet** - Dates premier contact et dernière activité

### 📋 Gestion Commerciale
- ✅ **Devis professionnels** - Numérotation automatique, statuts workflow
- ✅ **Contrats de prestation** - Types multiples, périodicité, échéances
- ✅ **Pipeline commercial** - Suivi des opportunités du devis au contrat

### 📞 Suivi des Activités
- ✅ **Interactions clients** - Appels, emails, réunions, visites
- ✅ **Calendrier des activités** - Dates, rappels, priorités
- ✅ **Statuts d'avancement** - Planifié, Réalisé, Annulé

### 🔔 Système de Relances
- ✅ **Relances automatisées** - Paiements, contrats, échéances
- ✅ **Multi-canaux** - Email, téléphone, courrier, SMS
- ✅ **Suivi des relances** - En attente, Envoyée, Traitée

### 📊 Analytics CRM
- ✅ **Statistiques clients** - CA, nombre de devis/contrats
- ✅ **Performance commerciale** - Taux de conversion devis
- ✅ **Tableaux de bord** - Vue globale de l'activité commerciale

---

## 🏗️ Architecture Technique

### Structure du Module
src/modules/crm/
├── controllers/
│ ├── ClientController.js # Gestion clients étendus
│ ├── DevisController.js # Gestion devis
│ └── ContactController.js # Gestion contacts
├── entities/
│ ├── Client.js # Modèle client CRM
│ ├── Devis.js # Modèle devis
│ ├── Contact.js # Modèle contact
│ ├── Contrat.js # Modèle contrat
│ ├── Activite.js # Modèle activité
│ └── Relance.js # Modèle relance
├── repositories/
│ ├── ClientRepository.js # Accès données clients
│ ├── DevisRepository.js # Accès données devis
│ ├── ContactRepository.js # Accès données contacts
│ ├── ContratRepository.js # Accès données contrats
│ └── ActiviteRepository.js # Accès données activités
├── services/
│ ├── ClientService.js # Logique métier clients
│ ├── DevisService.js # Logique métier devis
│ └── ContactService.js # Logique métier contacts
├── routes/
│ ├── clients.routes.js # Routes clients
│ ├── devis.routes.js # Routes devis
│ ├── contacts.routes.js # Routes contacts
│ └── index.js # Routeur principal
└── index.js # Point d'entrée du module

### Stack Technique
- **Backend**: Node.js, Express.js
- **Base de données**: MySQL/MariaDB
- **ORM**: Knex.js (Query Builder)
- **Validation**: Joi
- **Architecture**: MVC modulaire

---

## 🛠️ Installation et Configuration

### Prérequis
- Node.js 16+
- MySQL/MariaDB
- Modules Comptabilité et Import/Export installés

### Installation
```bash
# Exécuter les migrations CRM
npx knex migrate:latest

# Vérifier le statut des migrations
npx knex migrate:status

# Démarrer le serveur
npm run dev
Vérification
# Test de santé du module
curl http://localhost:3001/api/crm/health

# Vérifier les clients
curl http://localhost:3001/api/crm/clients
🌐 API Documentation
Base URL
http://localhost:3001/api/crm
Endpoints Principaux
👥 Clients
MéthodeEndpointDescription
GET/clientsListe tous les clients avec données CRM
GET/clients/:idDétails complets d'un client
PUT/clients/:id/crmMettre à jour les données CRM
GET/clients/:id/activitesActivités d'un client
GET/clients/:id/devisDevis d'un client
GET/clients/:id/contratsContrats d'un client
GET/clients/categorie/:categorieClients par catégorie
📋 Devis
MéthodeEndpointDescription
GET/devisListe tous les devis
GET/devis/:idDétail d'un devis
POST/devisCréer un nouveau devis
PUT/devis/:idModifier un devis
PATCH/devis/:id/statutChanger le statut
GET/devis/statsStatistiques des devis
GET/devis/statut/:statutDevis par statut
📞 Contacts
MéthodeEndpointDescription
GET/contacts/client/:clientIdContacts d'un client
GET/contacts/:idDétail d'un contact
POST/contactsCréer un contact
PUT/contacts/:idModifier un contact
DELETE/contacts/:idSupprimer un contact
💾 Structure de la Base de Données
Tables Principales
Table tiers (étendue)
ColonneTypeDescription
siretVARCHAR(14)Numéro SIRET
forme_juridiqueVARCHAR(100)SARL, SA, etc.
secteur_activiteVARCHAR(100)Secteur d'activité
categorieENUMProspect, Client, Fournisseur, Partenaire
chiffre_affaires_annuelINTCA annuel en Ariary
effectifINTNombre d'employés
notesTEXTNotes commerciales
site_webVARCHAR(255)Site web
responsable_commercialVARCHAR(255)Responsable commercial
date_premier_contactDATEDate premier contact
date_derniere_activiteDATEDate dernière activité
Table contacts

    Contacts multiples par client

    Contact principal désignable

    Fonction et coordonnées complètes

Table devis

    Numérotation automatique (DEV-000001)

    Workflow: brouillon → envoyé → accepté/refusé

    Dates de validité

    Montants HT et TTC

Table contrats

    Liaison avec devis

    Types: maintenance, consulting, formation, etc.

    Périodicité et échéances

Table activites

    Types: appel, email, réunion, visite

    Système de rappels

    Priorités: bas, normal, haut, urgent

Table relances

    Types: paiement, contrat, commerciale

    Canaux: email, téléphone, courrier, SMS

    Suivi du statut des relances

🔗 Intégrations
🔄 Avec le Module Comptabilité

    Clients partagés - Même table tiers

    Historique facturation - Liens vers factures

    Relances paiements - Intégration automatique

🌍 Avec le Module Import/Export

    Suivi des commandes par client

    Calcul de rentabilité client

    Historique des opérations d'import/export

📊 Flux de Données
Nouveau Contact → Devis → Contrat → Commandes → Facturation → Paiements
     ↓              ↓         ↓          ↓           ↓           ↓
  Prospect     Négociation  Signé    Import/Export Comptabilité  Relances
📋 Exemples d'Utilisation
Création d'un Devis
curl -X POST http://localhost:3001/api/crm/devis \
  -H "Content-Type: application/json" \
  -d '{
    "tiers_id": 1,
    "date_devis": "2024-01-15",
    "date_validite": "2024-02-15",
    "objet": "Prestation de consulting digital",
    "montant_ht": 2500000,
    "conditions": "Paiement à 30 jours"
  }'
Ajout d'un Contact
curl -X POST http://localhost:3001/api/crm/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "tiers_id": 1,
    "nom": "Rakoto",
    "prenom": "Jean",
    "fonction": "Directeur",
    "email": "jean.rakoto@client.mg",
    "telephone": "+261 34 12 345 67",
    "principal": true
  }'
Mise à Jour des Données CRM
curl -X PUT http://localhost:3001/api/crm/clients/1/crm \
  -H "Content-Type: application/json" \
  -d '{
    "categorie": "client",
    "chiffre_affaires_annuel": 75000000,
    "responsable_commercial": "Marie Dupont"
  }'
Consultation des Statistiques
# Statistiques des devis
curl http://localhost:3001/api/crm/devis/stats

# Clients par catégorie
curl http://localhost:3001/api/crm/clients/categorie/client

# Activités d'un client
curl http://localhost:3001/api/crm/clients/1/activites
🧪 Tests et Validation
Données de Test Incluses

    3 clients avec données CRM complètes

    Contacts multiples par client

    Devis avec différents statuts

    Activités commerciales

Vérification
# Test de santé
curl http://localhost:3001/api/crm/health

# Vérification des données
curl http://localhost:3001/api/crm/clients | jq
curl http://localhost:3001/api/crm/devis | jq
curl http://localhost:3001/api/crm/contacts/client/1 | jq
Tests Automatisés
# Exécuter les tests unitaires
npm test

# Tests d'intégration
npm run test:integration
🔧 Développement
Commandes Utiles
# Mode développement
npm run dev

# Nouvelles migrations
npx knex migrate:make nom_migration

# Rollback migrations
npx knex migrate:rollback

# Exécuter les seeds
npx knex seed:run

# Vérifier le statut des migrations
npx knex migrate:status
Standards de Code

    Architecture MVC modulaire

    Validation des entrées avec Joi

    Gestion centralisée des erreurs

    Logs structurés pour le debugging

    Documentation API complète

Bonnes Pratiques

    Validation des données en entrée

    Gestion des transactions base de données

    Codes d'erreur HTTP appropriés

    Messages d'erreur explicites

    Performance des requêtes optimisées

🔒 Sécurité
Mesures Implémentées

    Validation stricte des entrées utilisateur

    Protection contre les injections SQL

    Gestion des permissions d'accès

    Logs d'audit des opérations sensibles

Validation des Données
// Exemple de validation Joi
const contactSchema = Joi.object({
  tiers_id: Joi.number().integer().positive().required(),
  nom: Joi.string().min(2).max(255).required(),
  email: Joi.string().email().optional(),
  principal: Joi.boolean().default(false)
});
📊 Performances
Optimisations

    Indexation des champs de recherche fréquents

    Pagination des résultats volumineux

    Cache des données statistiques

    Requêtes optimisées avec Knex

Monitoring

    Métriques de performance des endpoints

    Logs des temps d'exécution

    Surveillance de l'utilisation mémoire

🚨 Dépannage
Problèmes Courants
Erreur de Connexion Base de Données
# Vérifier la configuration
cat .env | grep DB

# Tester la connexion
npx knex --version
Migrations Échouées
# Vérifier le statut
npx knex migrate:status

# Rollback et réessayer
npx knex migrate:rollback
npx knex migrate:latest
Données CRM Non Visibles
# Vérifier les colonnes ajoutées
sudo mysql -u root -D gestion_entreprise -e "DESCRIBE tiers;"

# Vérifier les données de test
sudo mysql -u root -D gestion_entreprise -e "SELECT * FROM contacts;"
📞 Support et Maintenance
Contacts

    Équipe Technique : [développement@aquatiko.mg]

    Support Utilisateur : [support@aquatiko.mg]

    Rapports de Bugs : [GitHub Issues]

Maintenance

    Sauvegardes : Automatiques quotidiennes

    Mises à Jour : Mensuelles de sécurité

    Monitoring : 24/7 des performances

Procédures

    Documentation des changements

    Tests de non-régression

    Backup avant déploiement

🎯 Roadmap
Prochaines Fonctionnalités (Q1 2025)

    Tableaux de bord analytiques avancés

    Intégration email automatique

    Application mobile responsive

    Export PDF des devis et contrats

    Système de notifications en temps réel

Améliorations Planifiées (Q2 2025)

    API GraphQL pour plus de flexibilité

    Cache Redis pour les performances

    Architecture microservices

    Internationalisation (multi-langues)

Évolutions Futures

    Intelligence artificielle pour les recommandations

    Intégration réseaux sociaux

    Analyse prédictive du chiffre d'affaires

    Automatisation des workflows marketing

❓ FAQ
Comment ajouter un nouveau champ CRM ?

    Modifier la migration pour ajouter la colonne

    Mettre à jour le modèle Entity correspondant

    Adapter le Repository et Service

    Mettre à jour la validation

    Exécuter la migration

Comment intégrer avec un autre module ?

Les modules communiquent via :

    Les tables partagées (ex: tiers)

    Les APIs REST internes

    Les événements système

Comment personnaliser les workflows ?

Modifier les enum dans les modèles :
// Dans le modèle Devis
statut: Joi.string().valid('brouillon', 'envoye', 'accepte', 'refuse', 'expire')
📝 Journal des Changements
Version 1.0.0 (Octobre 2024)

    ✅ Module CRM complet

    ✅ Intégration avec Comptabilité et Import/Export

    ✅ API REST complète

    ✅ Documentation technique

Version 1.1.0 (Novembre 2024 - Planifiée)

    🚧 Tableaux de bord analytics

    🚧 Export PDF

    🚧 Notifications

© 2024 Aquatiko - Tous droits réservés

"Vos clients, notre priorité - Gérer les relations, créer la valeur"

Dernière mise à jour : Octobre 2024

# 📦 Module Import/Export - Aquatiko

![Module Status](https://img.shields.io/badge/status-production-brightgreen) ![Node Version](https://img.shields.io/badge/node-16%2B-blue) ![License](https://img.shields.io/badge/license-Aquatiko-blueviolet)

## 🌟 Aperçu

Module complet de gestion des opérations **import/export** pour Aquatiko.  
Permet un suivi complet des commandes clients/fournisseurs, des expéditions et des coûts logistiques, avec calcul automatique des marges et intégration comptable.

---

## 📑 Table des Matières

- [Fonctionnalités](#-fonctionnalités)
- [Installation et Configuration](#-installation-et-configuration)
- [API Documentation](#-api-documentation)
- [Structure de la Base de Données](#-structure-de-la-base-de-données)
- [Exemples d’Utilisation](#-exemples-dutilisation)
- [Formules de Calcul](#-formules-de-calcul)
- [Architecture Technique](#-architecture-technique)
- [Tests et Validation](#-tests-et-validation)
- [Sécurité et Validation](#-sécurité-et-validation)
- [Statut du Module](#-statut-du-module)
- [Développement et Contribution](#-développement-et-contribution)
- [Support et Maintenance](#-support-et-maintenance)

---

## 🚀 Fonctionnalités

### Gestion des commandes
- ✅ Import/export
- ✅ Numérotation automatique (`CMD-000001`)
- ✅ Workflow : `brouillon → confirmée → expédiée → livrée → annulée`
- ✅ Lignes détaillées avec articles
- ✅ Calculs automatiques (montants, TVA, totaux)
- ✅ Intégration tiers (clients/fournisseurs)

### Suivi des expéditions
- ✅ Gestion documents : BL, connaissement, packing list
- ✅ Dates d’expédition et d’arrivée prévue
- ✅ Statuts : `préparation → expédiée → transit → arrivée → livrée`
- ✅ Informations transporteur et mode transport
- ✅ Création/modification expédition après création commande

### Coûts logistiques
- ✅ Fret maritime/aérien
- ✅ Assurance
- ✅ Droits de douane
- ✅ Frais de transit et transport local
- ✅ Autres frais
- ✅ Devise paramétrable

### Calcul de marges
- ✅ Marge brute et nette calculées automatiquement
- ✅ Prise en compte des coûts logistiques
- ✅ Taux de marge en %
- ✅ Analyse de rentabilité par commande
- ✅ Mise à jour en temps réel

---

## 🛠️ Installation et Configuration

### Prérequis
- Node.js 16+
- MySQL / MariaDB
- Module Comptabilité installé
- Tables `tiers` et `articles` peuplées

### Installation
```bash
# Exécuter les migrations Knex
npx knex migrate:latest

# Vérifier le statut
npx knex migrate:status
🌐 API Documentation

Base URL : http://localhost:3001/api/import-export

Commandes
| Méthode | Endpoint              | Description                          |
| ------- | --------------------- | ------------------------------------ |
| GET     | /commandes            | Liste toutes les commandes           |
| GET     | /commandes/:id        | Détail d’une commande avec relations |
| POST    | /commandes            | Créer une nouvelle commande          |
| PATCH   | /commandes/:id/statut | Mettre à jour le statut              |

Expéditions
| Méthode | Endpoint              | Description                           |
| ------- | --------------------- | ------------------------------------- |
| POST    | /commandes/expedition | Créer ou mettre à jour une expédition |

Coûts Logistiques
| Méthode | Endpoint         | Description                                        |
| ------- | ---------------- | -------------------------------------------------- |
| POST    | /commandes/couts | Enregistrer ou mettre à jour les coûts logistiques |

Calcul de marge
| Méthode | Endpoint             | Description                      |
| ------- | -------------------- | -------------------------------- |
| GET     | /commandes/:id/marge | Calculer la marge d’une commande |

💾 Structure de la Base de Données
Table commandes
| Champ           | Type                                                        | Description        | Obligatoire |
| --------------- | ----------------------------------------------------------- | ------------------ | ----------- |
| id              | INT UNSIGNED AUTO_INCREMENT                                 | ID unique          | ✅           |
| numero_commande | VARCHAR(255) UNIQUE                                         | Numéro auto        | ✅           |
| type            | ENUM('import','export')                                     | Type               | ✅           |
| client_id       | INT UNSIGNED                                                | Référence tiers.id | ✅           |
| fournisseur_id  | INT UNSIGNED                                                | Référence tiers.id | ✅           |
| date_commande   | DATE                                                        | Date commande      | ✅           |
| statut          | ENUM('brouillon','confirmée','expédiée','livrée','annulée') | Workflow           | ✅           |
| montant_total   | DECIMAL(15,2)                                               | Calcul automatique | ✅           |
| devise          | VARCHAR(3)                                                  | EUR, USD, MGA      | ✅           |
Table lignes_commande
| Champ         | Type                        | Description                     | Obligatoire |
| ------------- | --------------------------- | ------------------------------- | ----------- |
| id            | INT UNSIGNED AUTO_INCREMENT | ID unique                       | ✅           |
| commande_id   | INT UNSIGNED                | Commande parente                | ✅           |
| article_id    | VARCHAR(50)                 | Référence articles.code_article | ✅           |
| description   | VARCHAR(255)                | Description produit             | ✅           |
| quantite      | DECIMAL(10,2)               | Quantité                        | ✅           |
| prix_unitaire | DECIMAL(15,2)               | Prix unitaire                   | ✅           |
| taux_tva      | DECIMAL(5,2)                | TVA (%)                         | ✅           |
Table expeditions
| Champ                | Type                                                        | Description          | Obligatoire |
| -------------------- | ----------------------------------------------------------- | -------------------- | ----------- |
| id                   | INT UNSIGNED AUTO_INCREMENT                                 | ID unique            | ✅           |
| commande_id          | INT UNSIGNED                                                | Commande associée    | ✅           |
| numero_bl            | VARCHAR(255)                                                | Numéro BL            | ❌           |
| numero_connaissement | VARCHAR(255)                                                | Numéro connaissement | ❌           |
| numero_packing_list  | VARCHAR(255)                                                | Numéro packing list  | ❌           |
| date_expedition      | DATE                                                        | Date expédition      | ❌           |
| date_arrivee_prevue  | DATE                                                        | Date arrivée prévue  | ❌           |
| transporteur         | VARCHAR(255)                                                | Transporteur         | ❌           |
| mode_transport       | VARCHAR(50)                                                 | Mode transport       | ❌           |
| statut               | ENUM('preparation','expédiée','transit','arrivée','livrée') | Statut               | ✅           |
Table couts_logistiques
| Champ           | Type                        | Description       | Obligatoire |
| --------------- | --------------------------- | ----------------- | ----------- |
| id              | INT UNSIGNED AUTO_INCREMENT | ID unique         | ✅           |
| commande_id     | INT UNSIGNED                | Commande associée | ✅           |
| fret_maritime   | DECIMAL(15,2)               | Fret maritime     | ❌           |
| fret_aerien     | DECIMAL(15,2)               | Fret aérien       | ❌           |
| assurance       | DECIMAL(15,2)               | Assurance         | ❌           |
| droits_douane   | DECIMAL(15,2)               | Droits douane     | ❌           |
| frais_transit   | DECIMAL(15,2)               | Frais transit     | ❌           |
| transport_local | DECIMAL(15,2)               | Transport local   | ❌           |
| autres_frais    | DECIMAL(15,2)               | Autres frais      | ❌           |
| devise_couts    | VARCHAR(3)                  | Devise coûts      | ✅           |
📋 Exemples d’Utilisation
Création d’une commande d’import
curl -X POST http://localhost:3001/api/import-export/commandes \
-H "Content-Type: application/json" \
-d '{
  "type": "import",
  "client_id": 1,
  "fournisseur_id": 2,
  "date_commande": "2024-01-15",
  "lignes": [
    {
      "article_id": "ART001",
      "description": "Ordinateur Portable",
      "quantite": 2,
      "prix_unitaire": 2500000,
      "taux_tva": 20
    }
  ]
}'
Mise à jour du statut
curl -X PATCH http://localhost:3001/api/import-export/commandes/4/statut \
-H "Content-Type: application/json" \
-d '{"statut": "confirmée"}'
Enregistrement des coûts logistiques
curl -X POST http://localhost:3001/api/import-export/commandes/couts \
-H "Content-Type: application/json" \
-d '{
  "commande_id": 4,
  "fret_maritime": 500000,
  "assurance": 100000,
  "droits_douane": 300000,
  "transport_local": 200000
}'
Calcul de marge
curl http://localhost:3001/api/import-export/commandes/4/marge
Réponse type :
{
  "success": true,
  "message": "Calcul de marge effectué avec succès",
  "data": {
    "marge_brute": "4900000.00",
    "marge_nette": "4900000.00",
    "taux_marge": 81.67,
    "total_couts": "1100000.00",
    "chiffre_affaires": "6000000.00"
  }
}
📐 Formules de Calcul

Montant total commande
total = Σ(ligne.quantite * ligne.prix_unitaire * (1 + ligne.taux_tva/100))

Total coûts logistiques
total_couts = fret_maritime + fret_aerien + assurance + droits_douane + frais_transit + transport_local + autres_frais
Marge brute
marge_brute = montant_total_commande - total_couts_logistiques
Taux de marge
taux_marge = (marge_brute / montant_total_commande) * 100
🔧 Architecture Technique
src/modules/import-export/
├── controllers/
│   └── CommandeController.js
├── entities/
│   ├── Commande.js
│   ├── LigneCommande.js
│   ├── Expedition.js
│   └── CoutLogistique.js
├── repositories/
│   ├── CommandeRepository.js
│   ├── ExpeditionRepository.js
│   └── CoutLogistiqueRepository.js
├── services/
│   ├── CommandeService.js
│   ├── ExpeditionService.js
│   └── CalculMargeService.js
├── routes/
│   ├── index.js
│   └── commandes.routes.js
└── index.js


Workflow métier :
Création Commande → Validation → Expédition → Arrivée → Facturation → Calcul Marge
     ↓              ↓           ↓           ↓           ↓           ↓
 Brouillon      Confirmée   Expédiée    Arrivée     Livrée     Analyse


🧪 Tests et Validation

Vérifier les données de test :

2 clients minimum dans tiers

2 fournisseurs minimum dans tiers

Articles avec code_article

Test de santé :
curl http://localhost:3001/api/health
Test création et récupération commande :
curl -X POST http://localhost:3001/api/import-export/commandes \
-H "Content-Type: application/json" \
-d '{"type":"import","client_id":1,"fournisseur_id":2,"date_commande":"2024-01-15"}'
curl http://localhost:3001/api/import-export/commandes
🔒 Sécurité et Validation

Validation stricte des entrées

Gestion des transactions

Contrôle d’intégrité référentielle

Logs centralisés

Gestion des erreurs robuste

🚦 Statut du Module

Gestion commandes : ✅ 100%

Suivi expéditions : ✅ 100%

Coûts logistiques : ✅ 100%

Calcul marges : ✅ 100%

Prêt pour production

👥 Développement et Contribution

Commandes utiles :
# Mode développement
npm run dev

# Nouvelles migrations
npx knex migrate:make nom_migration

# Exécution migrations
npx knex migrate:latest

Standards de code :

Modules ES6+

Async/await pour opérations asynchrones

Validation des entrées

Gestion centralisée des erreurs

📞 Support et Maintenance

Pour toute question, contacter l’équipe de développement Aquatiko.
© 2025 Aquatiko - Tous droits réservés
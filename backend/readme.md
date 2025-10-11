🌐 BASE URL: /api/comptabilite
📋 ENDPOINTS COMPLETS
1. TIERS (Clients/Fournisseurs)

    GET /api/comptabilite/tiers - Liste tous les tiers

    GET /api/comptabilite/tiers/:id - Détail d'un tiers par ID

    POST /api/comptabilite/tiers - Créer un nouveau tiers

    PUT /api/comptabilite/tiers/:id - Modifier un tiers

    DELETE /api/comptabilite/tiers/:id - Supprimer un tiers

2. ARTICLES (Produits/Services)

    GET /api/comptabilite/articles - Liste tous les articles

    GET /api/comptabilite/articles/:code - Détail d'un article par code

    POST /api/comptabilite/articles - Créer un nouvel article

    PUT /api/comptabilite/articles/:code - Modifier un article

    DELETE /api/comptabilite/articles/:code - Supprimer un article

3. FACTURES

    GET /api/comptabilite/factures - Liste toutes les factures

    GET /api/comptabilite/factures/:id - Détail d'une facture par ID

    POST /api/comptabilite/factures - Créer une nouvelle facture

    PUT /api/comptabilite/factures/:id - Modifier une facture

    PATCH /api/comptabilite/factures/:id/valider - Valider une facture

4. PAIEMENTS

    GET /api/comptabilite/paiements - Info module paiements

    POST /api/comptabilite/paiements - Enregistrer un paiement

    GET /api/comptabilite/paiements/facture/:numero_facture - Paiements d'une facture

5. DEVISES & TAUX DE CHANGE

    GET /api/comptabilite/devises - Info module devises

    GET /api/comptabilite/devises/taux - Liste des taux actifs

    POST /api/comptabilite/devises/taux - Mettre à jour un taux

    POST /api/comptabilite/devises/convertir - Convertir entre devises

6. RAPPORTS FINANCIERS

    GET /api/comptabilite/rapports - Info module rapports

    GET /api/comptabilite/rapports/bilan - Bilan comptable

    GET /api/comptabilite/rapports/compte-resultat - Compte de résultat

    GET /api/comptabilite/rapports/tresorerie - État de trésorerie

    GET /api/comptabilite/rapports/tva - Déclaration TVA

7. TEST & INFO

    GET /api/comptabilite/test - Test complet du module


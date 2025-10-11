// src/modules/comptabilite/routes/index.js
import { Router } from 'express';
import tiersRoutes from './tiers.routes.js';
import articlesRoutes from './articles.routes.js';
import facturesRoutes from './factures.routes.js';
import paiementsRoutes from './paiements.routes.js';
import devisesRoutes from './devises.routes.js';
import rapportsRoutes from './rapports.routes.js';

const router = Router();

// Utiliser les routes modulaires
router.use('/tiers', tiersRoutes);
router.use('/articles', articlesRoutes);
router.use('/factures', facturesRoutes);
router.use('/paiements', paiementsRoutes);
router.use('/devises', devisesRoutes);
router.use('/rapports', rapportsRoutes);

// Route test globale mise à jour
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Module Comptabilité fonctionnel!',
    data: {
      module: 'Comptabilité',
      version: '2.0.0',
      entités: [
        'Tiers', 
        'Article', 
        'Facture', 
        'LigneFacture',
        'Paiement',
        'TauxChange',
        'EcritureComptable'
      ],
      services: [
        'Multi-devises',
        'Suivi des paiements',
        'Journaux comptables',
        'États financiers'
      ],
      routes: {
        tiers: '/api/comptabilite/tiers',
        articles: '/api/comptabilite/articles',
        factures: '/api/comptabilite/factures',
        paiements: '/api/comptabilite/paiements',
        devises: '/api/comptabilite/devises',
        rapports: '/api/comptabilite/rapports'
      },
      fonctionnalités: {
        'Multi-devises': 'Support EUR, USD, MGA avec taux de change',
        'Types de documents': 'Proforma, Facture, Avoir',
        'Suivi paiements': 'Paiements partiels, échéances, modes de paiement',
        'Journaux': 'Ventes, Achats, Banque, Caisse',
        'États financiers': 'Bilan, Compte de résultat, TVA, Trésorerie'
      }
    }
  });
});

export default router;
// src/modules/comptabilite/routes/index.js
import { Router } from 'express';
import tiersRoutes from './tiers.routes.js';
import articlesRoutes from './articles.routes.js';
import facturesRoutes from './factures.routes.js';
import paiementsRoutes from './paiements.routes.js';
import devisesRoutes from './devises.routes.js';
import rapportsRoutes from './rapports.routes.js';
import ecrituresRoutes from './ecritures.routes.js'; 
import statistiquesRoutes from './statistiques.routes.js';
import referentielsRoutes from './referentiels.routes.js';
import emailRoutes from './email.routes.js'; // MODIFICATION : import ES6

const router = Router();

// Utiliser les routes modulaires
router.use('/tiers', tiersRoutes);
router.use('/articles', articlesRoutes);
router.use('/factures', facturesRoutes);
router.use('/paiements', paiementsRoutes);
router.use('/devises', devisesRoutes);
router.use('/rapports', rapportsRoutes);
router.use('/ecritures', ecrituresRoutes); 
router.use('/stats', statistiquesRoutes);
router.use('/referentiels', referentielsRoutes); 
router.use('/email', emailRoutes); 

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
        'EcritureComptable',
        'PlanComptable',
        'Referentiels'
      ],
      services: [
        'Multi-devises',
        'Suivi des paiements',
        'Journaux comptables',
        'États financiers',
        'Gestion référentiels',
        'Relances email' // AJOUT
      ],
      routes: {
        tiers: '/api/comptabilite/tiers',
        articles: '/api/comptabilite/articles',
        factures: '/api/comptabilite/factures',
        paiements: '/api/comptabilite/paiements',
        devises: '/api/comptabilite/devises',
        rapports: '/api/comptabilite/rapports',
        ecritures: '/api/comptabilite/ecritures',
        stats: '/api/comptabilite/stats',
        referentiels: '/api/comptabilite/referentiels',
        email: '/api/comptabilite/email' // AJOUT
      },
      fonctionnalités: {
        'Multi-devises': 'Support EUR, USD, MGA avec taux de change',
        'Types de documents': 'Proforma, Facture, Avoir',
        'Suivi paiements': 'Paiements partiels, échéances, modes de paiement',
        'Journaux': 'Ventes, Achats, Banque, Caisse',
        'États financiers': 'Bilan, Compte de résultat, TVA, Trésorerie',
        'Ecritures comptables': 'Automatiques et manuelles',
        'Statistiques': 'Chiffre d\'affaires, ventes par produit, clients',
        'Plan comptable dynamique': 'Configuration flexible des comptes',
        'Référentiels configurables': 'Modes paiement, types facture, TVA',
        'Relances email': 'Relances automatiques des factures impayées' // AJOUT
      }
    }
  });
});

export default router;
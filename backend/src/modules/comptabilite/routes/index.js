import { Router } from 'express';
import tiersRoutes from './tiers.routes.js';
import articlesRoutes from './articles.routes.js';
import facturesRoutes from './factures.routes.js';

const router = Router();

// Utiliser les routes modulaires
router.use('/tiers', tiersRoutes);
router.use('/articles', articlesRoutes);
router.use('/factures', facturesRoutes);

// Route test globale
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Module Comptabilité fonctionnel!',
    data: {
      module: 'Comptabilité',
      version: '1.0.0',
      entités: ['Tiers', 'Article', 'Facture', 'LigneFacture'],
      routes: {
        tiers: '/api/comptabilite/tiers',
        articles: '/api/comptabilite/articles',
        factures: '/api/comptabilite/factures'
      }
    }
  });
});

export default router;
// src/modules/comptabilite/routes/rapports.routes.js
import express from 'express';
import { RapportController } from '../controllers/RapportController.js';
import authMiddleware from '../../auth/middleware/authMiddleware.js';

const router = express.Router();
const rapportController = new RapportController();

// ✅ ROUTES PROTÉGÉES - Rapports financiers (comptable et admin seulement)
router.get('/bilan', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'read'),
  rapportController.bilan.bind(rapportController)
);

router.get('/compte-resultat', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'read'),
  rapportController.compteResultat.bind(rapportController)
);

router.get('/tresorerie', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'read'),
  rapportController.tresorerie.bind(rapportController)
);

router.get('/tva', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'read'),
  rapportController.tva.bind(rapportController)
);

// ✅ ROUTE RACINE - Accessible à tous pour découvrir le module
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Module Rapports fonctionnel',
    endpoints: {
      bilan: 'GET /api/comptabilite/rapports/bilan (authentifié)',
      compteResultat: 'GET /api/comptabilite/rapports/compte-resultat (authentifié)',
      tresorerie: 'GET /api/comptabilite/rapports/tresorerie (authentifié)',
      tva: 'GET /api/comptabilite/rapports/tva (authentifié)'
    },
    acces: 'Nécessite une authentification avec permission comptabilite/read'
  });
});

export default router;
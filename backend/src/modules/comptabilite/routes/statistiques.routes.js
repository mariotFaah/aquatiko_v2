// src/modules/comptabilite/routes/statistiques.routes.js
import express from 'express';
import { StatistiqueController } from '../controllers/StatistiqueController.js';
import authMiddleware from '../../auth/middleware/authMiddleware.js';

const router = express.Router();
const statistiqueController = new StatistiqueController();

// ✅ ROUTES PROTÉGÉES - Statistiques financières (comptable et admin seulement)
router.get('/chiffre-affaire', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'read'),
  statistiqueController.getChiffreAffaire.bind(statistiqueController)
);

router.get('/top-clients', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'read'),
  statistiqueController.getTopClients.bind(statistiqueController)
);

router.get('/top-produits', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'read'),
  statistiqueController.getTopProduits.bind(statistiqueController)
);

router.get('/indicateurs', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'read'),
  statistiqueController.getIndicateurs.bind(statistiqueController)
);

export default router;
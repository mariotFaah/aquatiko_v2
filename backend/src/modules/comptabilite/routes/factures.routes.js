// src/modules/comptabilite/routes/factures.routes.js
import express from 'express';
import { FactureController } from '../controllers/FactureController.js';
import authMiddleware from '../../auth/middleware/authMiddleware.js';

const router = express.Router();
const factureController = new FactureController();

// ✅ ROUTES PROTÉGÉES - Lecture pour utilisateurs authentifiés
router.get('/', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'read'),
  factureController.getAll.bind(factureController)
);

router.get('/:id', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'read'),
  factureController.getById.bind(factureController)
);

router.get('/:id/paiements', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'read'),
  factureController.getHistoriquePaiements.bind(factureController)
);

router.get('/:id/penalites', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'read'),
  factureController.calculerPenalites.bind(factureController)
);

router.get('/statut/en-retard', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'read'),
  factureController.getFacturesEnRetard.bind(factureController)
);

// ✅ ROUTES PROTÉGÉES - Écriture (comptable et admin seulement)
router.post('/', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'write'),
  factureController.create.bind(factureController)
);

router.put('/:id', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'write'),
  factureController.update.bind(factureController)
);

router.post('/:id/paiements', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'write'),
  factureController.enregistrerPaiement.bind(factureController)
);

router.patch('/:id/config-paiement', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'write'),
  factureController.configurerPaiement.bind(factureController)
);

// ✅ ROUTES PROTÉGÉES - Validation/Annulation (comptable et admin seulement)
router.patch('/:id/valider', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'validate'),
  factureController.valider.bind(factureController)
);

router.patch('/:id/annuler', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'validate'),
  factureController.annuler.bind(factureController)
);

export default router;
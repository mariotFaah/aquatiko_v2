// src/modules/comptabilite/routes/paiements.routes.js
import express from 'express';
import { PaiementController } from '../controllers/PaiementController.js';
import authMiddleware from '../../auth/middleware/authMiddleware.js';

const router = express.Router();
const paiementController = new PaiementController();

// ✅ ROUTES PROTÉGÉES - Lecture pour utilisateurs authentifiés
router.get('/', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'read'),
  paiementController.getAll.bind(paiementController)
);

router.get('/facture/:numero_facture', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'read'),
  paiementController.getByFacture.bind(paiementController)
);

router.get('/:id', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'read'),
  paiementController.getById.bind(paiementController)
);

// ✅ ROUTES PROTÉGÉES - Écriture (comptable et admin seulement)
router.post('/', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'write'),
  paiementController.create.bind(paiementController)
);

router.put('/:id', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'write'),
  paiementController.update.bind(paiementController)
);

export default router;
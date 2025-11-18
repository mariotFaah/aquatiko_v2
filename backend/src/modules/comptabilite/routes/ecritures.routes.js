// src/modules/comptabilite/routes/ecritures.routes.js
import express from 'express';
import { EcritureComptableController } from '../controllers/EcritureComptableController.js';
import authMiddleware from '../../auth/middleware/authMiddleware.js';

const router = express.Router();
const ecritureController = new EcritureComptableController();

// ✅ ROUTES PROTÉGÉES - Lecture pour utilisateurs authentifiés
router.get('/', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'read'),
  ecritureController.getAll.bind(ecritureController)
);

router.get('/journal/:type', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'read'),
  ecritureController.getByJournal.bind(ecritureController)
);

router.get('/:id', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'read'),
  ecritureController.getById.bind(ecritureController)
);

// ✅ ROUTE PROTÉGÉE - Écriture manuelle (comptable et admin seulement)
router.post('/', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'write'),
  ecritureController.create.bind(ecritureController)
);

export default router;
// src/modules/comptabilite/routes/tiers.routes.js
import { Router } from 'express';
import { TiersController } from '../controllers/TiersController.js';
import { validateRequest } from '../../../core/middleware/validation.js';
import { createTiersSchema, updateTiersSchema } from '../validators/tiers.validator.js';
import authMiddleware from '../../auth/middleware/authMiddleware.js';

const router = Router();
const tiersController = new TiersController();

// ✅ ROUTES PROTÉGÉES - Lecture pour utilisateurs authentifiés
router.get('/', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'read'),
  tiersController.getAll.bind(tiersController)
);

router.get('/:id', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'read'),
  tiersController.getById.bind(tiersController)
);

// ✅ ROUTES PROTÉGÉES - Écriture (comptable et admin seulement)
router.post('/', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'write'),
  validateRequest(createTiersSchema), 
  tiersController.create.bind(tiersController)
);

router.put('/:id', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'write'),
  validateRequest(updateTiersSchema), 
  tiersController.update.bind(tiersController)
);

// ✅ ROUTE PROTÉGÉE - Suppression (admin seulement)
router.delete('/:id', 
  authMiddleware.authenticate,
  authMiddleware.requireRole(['admin']),
  tiersController.delete.bind(tiersController)
);

export default router;
// src/modules/comptabilite/routes/tiers.routes.js
import { Router } from 'express';
import { TiersController } from '../controllers/TiersController.js';
import { validateRequest } from '../../../core/middleware/validation.js';
import { createTiersSchema, updateTiersSchema } from '../validators/tiers.validator.js';

const router = Router();
const tiersController = new TiersController();

// AJOUTER .bind() pour toutes les méthodes
router.get('/', tiersController.getAll.bind(tiersController));
router.get('/:id', tiersController.getById.bind(tiersController));
router.post('/', validateRequest(createTiersSchema), tiersController.create.bind(tiersController));
router.put('/:id', validateRequest(updateTiersSchema), tiersController.update.bind(tiersController));
router.delete('/:id', tiersController.delete.bind(tiersController));

export default router;
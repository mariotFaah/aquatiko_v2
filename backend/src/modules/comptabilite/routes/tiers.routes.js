import { Router } from 'express';
import { TiersController } from '../controllers/TiersController.js';
import { validateRequest } from '../../../core/middleware/validation.js';
import { createTiersSchema, updateTiersSchema } from '../validators/tiers.validator.js';

const router = Router();
const tiersController = new TiersController();

router.get('/', tiersController.getAll);
router.get('/:id', tiersController.getById);
router.post('/', validateRequest(createTiersSchema), tiersController.create);
router.put('/:id', validateRequest(updateTiersSchema), tiersController.update);
router.delete('/:id', tiersController.delete);

export default router;
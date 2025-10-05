import { Router } from 'express';
import { FactureController } from '../controllers/FactureController.js';
import { validateRequest } from '../../../core/middleware/validation.js';
import { createFactureSchema, updateFactureSchema } from '../validators/factures.validator.js';

const router = Router();
const factureController = new FactureController();

router.get('/', factureController.getAll);
router.get('/:id', factureController.getById);
router.post('/', validateRequest(createFactureSchema), factureController.create);
router.put('/:id', validateRequest(updateFactureSchema), factureController.update);
router.delete('/:id', factureController.delete);
router.post('/:id/valider', factureController.validerFacture);
router.get('/:id/lignes', factureController.getLignesFacture);

export default router;
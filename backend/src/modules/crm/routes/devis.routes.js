import { Router } from 'express';
import { DevisController } from '../controllers/DevisController.js';

const router = Router();
const devisController = new DevisController();

// Routes pour les devis
router.get('/', devisController.getAllDevis);
router.get('/stats', devisController.getDevisStats);
router.get('/statut/:statut', devisController.getDevisByStatut);
router.get('/:id', devisController.getDevisById);
router.post('/', devisController.createDevis);
router.put('/:id', devisController.updateDevis);
router.patch('/:id/statut', devisController.updateDevisStatut);
// Dans devis.routes.js
router.post('/:id/transformer-contrat', devisController.transformerEnContrat);

export default router;

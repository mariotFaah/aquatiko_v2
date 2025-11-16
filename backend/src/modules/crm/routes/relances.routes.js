import { Router } from 'express';
import { RelanceController } from '../controllers/RelanceController.js';

const router = Router();
const relanceController = new RelanceController();

// Routes pour les relances
router.get('/', relanceController.getAllRelances);
router.get('/stats', relanceController.getStatsRelances);
router.get('/client/:id', relanceController.getRelancesByClient);
router.get('/statut/:statut', relanceController.getRelancesByStatut);
router.post('/', relanceController.createRelance);
router.post('/automatiques', relanceController.genererRelancesAutomatiques);
router.patch('/:id/statut', relanceController.updateRelanceStatut);

export default router;

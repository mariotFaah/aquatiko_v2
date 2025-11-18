import express from 'express';
import { ContratController } from '../controllers/ContratController.js';

const router = express.Router();
const contratController = new ContratController();

// Routes pour les contrats
router.get('/', contratController.getAllContrats);
router.get('/stats', contratController.getContratStats);
router.get('/:id', contratController.getContratById);
router.post('/', contratController.createContrat);
router.put('/:id', contratController.updateContrat);
router.patch('/:id/statut', contratController.updateContratStatut);

// Routes pour les contrats par client (déjà existantes via clients.routes.js)
// Elles restent accessibles via /api/crm/clients/:clientId/contrats

export default router;
import express from 'express';
import CommandeController from '../controllers/CommandeController.js';

const router = express.Router();
const commandeController = new CommandeController();

// Routes pour les commandes
router.get('/', commandeController.getAll);
router.get('/:id', commandeController.getById);
router.post('/', commandeController.create);
router.patch('/:id/statut', commandeController.updateStatut);

// Routes pour l'expédition
router.post('/expedition', commandeController.updateExpedition);

// Routes pour les coûts logistiques
router.post('/couts', commandeController.updateCouts);

// Routes pour le calcul de marge
router.get('/:id/marge', commandeController.calculerMarge);

export default router;

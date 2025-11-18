import express from 'express';
import { ActiviteController } from '../controllers/ActiviteController.js';

const router = express.Router();
const activiteController = new ActiviteController();

// Routes pour les activités
router.post('/', activiteController.createActivite);
router.get('/', activiteController.getAllActivites);
router.get('/client/:id', activiteController.getActivitesByClient);

export default router;
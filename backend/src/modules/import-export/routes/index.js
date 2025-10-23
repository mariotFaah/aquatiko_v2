import express from 'express';
import commandeRoutes from './commandes.routes.js';

const router = express.Router();

// Monter les routes des commandes
router.use('/commandes', commandeRoutes);

export default router;

// src/modules/import-export/routes/index.js
import express from 'express';
import commandeRoutes from './commandes.routes.js';
// ✅ AJOUT : Importer le middleware d'authentification
import { auth, requireRole } from '../../../core/middleware/auth.js';

const router = express.Router();

// ✅ PROTECTION GLOBALE POUR TOUTES LES ROUTES IMPORT-EXPORT
router.use(auth);
router.use(requireRole('commercial')); // Commercial et admin (via le middleware)

// Monter les routes des commandes
router.use('/commandes', commandeRoutes);

export default router;

// src/modules/comptabilite/routes/ecritures.routes.js
import express from 'express';
import { EcritureComptableController } from '../controllers/EcritureComptableController.js';

const router = express.Router();
const ecritureController = new EcritureComptableController();

// GET /api/comptabilite/ecritures - Liste toutes les écritures (avec filtres optionnels)
router.get('/', ecritureController.getAll.bind(ecritureController));

// GET /api/comptabilite/ecritures/journal/:type - Écritures par journal
router.get('/journal/:type', ecritureController.getByJournal.bind(ecritureController));

// GET /api/comptabilite/ecritures/:id - Détail d'une écriture
router.get('/:id', ecritureController.getById.bind(ecritureController));

// POST /api/comptabilite/ecritures - Créer une écriture manuelle
router.post('/', ecritureController.create.bind(ecritureController));

export default router;
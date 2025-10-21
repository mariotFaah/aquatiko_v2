// src/modules/comptabilite/routes/paiements.routes.js
import express from 'express';
import { PaiementController } from '../controllers/PaiementController.js';

const router = express.Router();
const paiementController = new PaiementController();

// ✅ Routes CRUD complètes
router.post('/', paiementController.create.bind(paiementController));
router.get('/', paiementController.getAll.bind(paiementController)); // <-- CORRIGÉ
router.get('/facture/:numero_facture', paiementController.getByFacture.bind(paiementController));
router.get('/:id', paiementController.getById.bind(paiementController)); // <-- AJOUT
router.put('/:id', paiementController.update.bind(paiementController)); // <-- AJOUT

export default router;
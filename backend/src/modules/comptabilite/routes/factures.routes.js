// src/modules/comptabilite/routes/factures.routes.js
import express from 'express';
import { FactureController } from '../controllers/FactureController.js';

const router = express.Router();
const factureController = new FactureController();

// Routes pour les factures (déjà correct avec .bind())
router.get('/', factureController.getAll.bind(factureController));
router.get('/:id', factureController.getById.bind(factureController));
router.post('/', factureController.create.bind(factureController));
router.put('/:id', factureController.update.bind(factureController));
router.patch('/:id/valider', factureController.valider.bind(factureController));
router.patch('/:id/annuler', factureController.annuler.bind(factureController));

export default router;
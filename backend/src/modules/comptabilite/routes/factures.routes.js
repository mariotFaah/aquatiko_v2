// src/modules/comptabilite/routes/factures.routes.js
import express from 'express';
import { FactureController } from '../controllers/FactureController.js';

const router = express.Router();
const factureController = new FactureController();

// Routes existantes
router.get('/', factureController.getAll.bind(factureController));
router.get('/:id', factureController.getById.bind(factureController));
router.post('/', factureController.create.bind(factureController));
router.put('/:id', factureController.update.bind(factureController));
router.patch('/:id/valider', factureController.valider.bind(factureController));
router.patch('/:id/annuler', factureController.annuler.bind(factureController));

// 🆕 NOUVELLES ROUTES PAIEMENT FLEXIBLE
router.post('/:id/paiements', factureController.enregistrerPaiement.bind(factureController));
router.get('/:id/paiements', factureController.getHistoriquePaiements.bind(factureController));
router.get('/:id/penalites', factureController.calculerPenalites.bind(factureController));
router.patch('/:id/config-paiement', factureController.configurerPaiement.bind(factureController));
router.get('/statut/en-retard', factureController.getFacturesEnRetard.bind(factureController));

export default router;
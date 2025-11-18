// src/modules/comptabilite/routes/referentiels.routes.js
import express from 'express';
import { ReferentielController } from '../controllers/ReferentielController.js';
import authMiddleware from '../../auth/middleware/authMiddleware.js';

const router = express.Router();
const referentielController = new ReferentielController();

// ✅ ROUTES PUBLIQUES - Référentiels de base (accessibles à tous)
router.get('/modes-paiement', referentielController.getModesPaiement.bind(referentielController));
router.get('/types-facture', referentielController.getTypesFacture.bind(referentielController));
router.get('/taux-tva', referentielController.getTauxTVA.bind(referentielController));

// ✅ ROUTES PROTÉGÉES - Plan comptable (utilisateurs authentifiés)
router.get('/plan-comptable', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'read'),
  referentielController.getPlanComptable.bind(referentielController)
);

// ✅ ROUTE PROTÉGÉE - Ajout compte (comptable et admin seulement)
router.post('/plan-comptable', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'write'),
  (req, res) => referentielController.addCompteComptable(req, res)
);

export default router;
import express from 'express';
import { ReferentielController } from '../controllers/ReferentielController.js';

const router = express.Router();
const referentielController = new ReferentielController();

router.get('/modes-paiement', referentielController.getModesPaiement.bind(referentielController));
router.get('/types-facture', referentielController.getTypesFacture.bind(referentielController));
router.get('/taux-tva', referentielController.getTauxTVA.bind(referentielController));
router.get('/plan-comptable', referentielController.getPlanComptable.bind(referentielController));
router.post('/plan-comptable', (req, res) => referentielController.addCompteComptable(req, res));

export default router;

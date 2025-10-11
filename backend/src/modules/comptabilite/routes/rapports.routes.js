import express from 'express';
import { RapportController } from '../controllers/RapportController.js';

const router = express.Router();
const rapportController = new RapportController();

// Routes existantes
router.get('/bilan', rapportController.bilan.bind(rapportController));
router.get('/compte-resultat', rapportController.compteResultat.bind(rapportController));
router.get('/tresorerie', rapportController.tresorerie.bind(rapportController));
router.get('/tva', rapportController.tva.bind(rapportController));

// Route racine temporaire
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Module Rapports fonctionnel',
    endpoints: {
      bilan: 'GET /api/comptabilite/rapports/bilan',
      compteResultat: 'GET /api/comptabilite/rapports/compte-resultat',
      tresorerie: 'GET /api/comptabilite/rapports/tresorerie',
      tva: 'GET /api/comptabilite/rapports/tva'
    }
  });
});

export default router;
import express from 'express';
import { PaiementController } from '../controllers/PaiementController.js';

const router = express.Router();
const paiementController = new PaiementController();

// Routes existantes seulement
router.post('/', paiementController.create.bind(paiementController));
router.get('/facture/:numero_facture', paiementController.getByFacture.bind(paiementController));

// Route racine temporaire
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Module Paiements fonctionnel',
    endpoints: {
      create: 'POST /api/comptabilite/paiements',
      getByFacture: 'GET /api/comptabilite/paiements/facture/:numero_facture'
    }
  });
});

export default router;
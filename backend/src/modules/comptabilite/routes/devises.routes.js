import express from 'express';
import { DeviseController } from '../controllers/DeviseController.js';

const router = express.Router();
const deviseController = new DeviseController();

// Routes existantes
router.post('/convertir', deviseController.convertir.bind(deviseController));
router.post('/taux', deviseController.updateTaux.bind(deviseController));
router.get('/taux', deviseController.getTauxActifs.bind(deviseController));

// Route racine temporaire
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Module Devises fonctionnel',
    endpoints: {
      convertir: 'POST /api/comptabilite/devises/convertir',
      taux: 'GET /api/comptabilite/devises/taux',
      updateTaux: 'POST /api/comptabilite/devises/taux'
    }
  });
});

export default router;
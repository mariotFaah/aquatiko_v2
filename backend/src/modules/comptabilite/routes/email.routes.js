// src/modules/comptabilite/routes/email.routes.js
import express from 'express';
import EmailController from '../controllers/EmailController.js';

const router = express.Router();
const emailController = new EmailController();

// Routes pour les relances email
router.post('/relance', (req, res) => emailController.envoyerRelance(req, res));
router.post('/relances-groupees', (req, res) => emailController.envoyerRelancesGroupees(req, res));
router.get('/test', (req, res) => emailController.testEmail(req, res));

// Route racine pour documentation
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Module Email fonctionnel',
    endpoints: {
      relance: 'POST /api/comptabilite/email/relance',
      relancesGroupees: 'POST /api/comptabilite/email/relances-groupees',
      test: 'GET /api/comptabilite/email/test'
    }
  });
});

export default router;
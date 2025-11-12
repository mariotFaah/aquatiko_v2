// src/modules/comptabilite/routes/email.routes.js
import { Router } from 'express';
import EmailController from '../controllers/EmailController.js';

const router = Router();
const controller = new EmailController();

// Routes pour les relances email
router.post('/relance', (req, res) => controller.envoyerRelance(req, res));
router.post('/relances-groupees', (req, res) => controller.envoyerRelancesGroupees(req, res));
router.get('/test-config', (req, res) => controller.testerConfiguration(req, res));

export default router;
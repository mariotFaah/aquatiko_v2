// src/modules/comptabilite/routes/email.routes.js
import { Router } from 'express';
import EmailController from '../controllers/EmailController.js';
import authMiddleware from '../../auth/middleware/authMiddleware.js';

const router = Router();
const controller = new EmailController();

// ✅ ROUTES PROTÉGÉES - Envoi d'emails (comptable et admin seulement)
router.post('/relance', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'write'),
  (req, res) => controller.envoyerRelance(req, res)
);

router.post('/relances-groupees', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'write'),
  (req, res) => controller.envoyerRelancesGroupees(req, res)
);

// ✅ ROUTE PROTÉGÉE - Test configuration (admin seulement)
router.get('/test-config', 
  authMiddleware.authenticate,
  authMiddleware.requireRole(['admin']),
  (req, res) => controller.testerConfiguration(req, res)
);

export default router;
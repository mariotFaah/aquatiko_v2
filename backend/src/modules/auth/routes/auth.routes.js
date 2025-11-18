// backend/src/modules/auth/routes/auth.routes.js
import express from 'express';
import AuthController from '../controllers/AuthController.js'; // ✅ Changement ici
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
const authController = new AuthController();

// Routes publiques
router.post('/login', authController.login);
// router.post('/register', authController.register); // ❌ Temporairement commenté si non implémenté
router.post('/validate-token', authController.validateToken);

// Routes protégées
router.get('/me', authMiddleware.authenticate, authController.me);
// router.post('/change-password', authMiddleware.authenticate, authController.changePassword); // ❌ Temporairement commenté

// Routes admin seulement
router.get('/admin/users', 
  authMiddleware.authenticate, 
  authMiddleware.requireRole(['admin']),
  (req, res) => {
    res.json({ message: 'Liste des utilisateurs (admin seulement)' });
  }
);

export default router;
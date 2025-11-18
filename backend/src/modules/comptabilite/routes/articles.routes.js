// src/modules/comptabilite/routes/articles.routes.js
import { Router } from 'express';
import { ArticleController } from '../controllers/ArticleController.js';
import { validateRequest } from '../../../core/middleware/validation.js';
import { 
  createArticleSchema, 
  updateArticleSchema, 
  updateStockSchema,
  adjustStockSchema 
} from '../validators/articles.validator.js';
import authMiddleware from '../../auth/middleware/authMiddleware.js'; // ✅ Nouveau import

const router = Router();
const articleController = new ArticleController();

// ✅ ROUTES PUBLIQUES (si nécessaire) - Lecture seule pour tous
router.get('/', articleController.getAll.bind(articleController));
router.get('/:code', articleController.getByCode.bind(articleController));
router.get('/statut/:statut', articleController.getByStockStatus.bind(articleController));
router.get('/:code/disponibilite', articleController.checkAvailability.bind(articleController));

// ✅ ROUTES PROTÉGÉES - Lecture pour utilisateurs authentifiés
router.get('/alertes/stock', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'read'),
  articleController.getStockAlerts.bind(articleController)
);

// ✅ ROUTES PROTÉGÉES - Écriture pour comptables et admin
router.post('/', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'write'),
  validateRequest(createArticleSchema), 
  articleController.create.bind(articleController)
);

router.put('/:code', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'write'),
  validateRequest(updateArticleSchema), 
  articleController.update.bind(articleController)
);

router.put('/:code/stock', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'write'),
  validateRequest(updateStockSchema), 
  articleController.updateStock.bind(articleController)
);

router.patch('/:code/stock/adjust', 
  authMiddleware.authenticate,
  authMiddleware.requirePermission('comptabilite', 'write'),
  validateRequest(adjustStockSchema), 
  articleController.adjustStock.bind(articleController)
);

// ✅ ROUTE PROTÉGÉE - Suppression admin seulement
router.delete('/:code', 
  authMiddleware.authenticate,
  authMiddleware.requireRole(['admin']), // Seulement admin peut supprimer
  articleController.delete.bind(articleController)
);

export default router;
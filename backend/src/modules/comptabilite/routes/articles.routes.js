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

const router = Router();
const articleController = new ArticleController();

// ROUTES EXISTANTES
router.get('/', articleController.getAll.bind(articleController));
router.get('/:code', articleController.getByCode.bind(articleController));
router.post('/', validateRequest(createArticleSchema), articleController.create.bind(articleController));
router.put('/:code', validateRequest(updateArticleSchema), articleController.update.bind(articleController));
router.delete('/:code', articleController.delete.bind(articleController));

// NOUVELLES ROUTES POUR LA GESTION DU STOCK
router.get('/statut/:statut', articleController.getByStockStatus.bind(articleController));
router.put('/:code/stock', validateRequest(updateStockSchema), articleController.updateStock.bind(articleController));
router.patch('/:code/stock/adjust', validateRequest(adjustStockSchema), articleController.adjustStock.bind(articleController));
router.get('/alertes/stock', articleController.getStockAlerts.bind(articleController));
router.get('/:code/disponibilite', articleController.checkAvailability.bind(articleController));

export default router;
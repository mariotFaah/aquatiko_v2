// src/modules/comptabilite/routes/articles.routes.js
import { Router } from 'express';
import { ArticleController } from '../controllers/ArticleController.js';
import { validateRequest } from '../../../core/middleware/validation.js';
import { createArticleSchema, updateArticleSchema } from '../validators/articles.validator.js';

const router = Router();
const articleController = new ArticleController();


router.get('/', articleController.getAll.bind(articleController));
router.get('/:code', articleController.getByCode.bind(articleController));
router.post('/', validateRequest(createArticleSchema), articleController.create.bind(articleController));
router.put('/:code', validateRequest(updateArticleSchema), articleController.update.bind(articleController));
router.delete('/:code', articleController.delete.bind(articleController));

export default router;
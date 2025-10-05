import { Router } from 'express';
import { ArticleController } from '../controllers/ArticleController.js';
import { validateRequest } from '../../../core/middleware/validation.js';
import { createArticleSchema, updateArticleSchema } from '../validators/articles.validator.js';

const router = Router();
const articleController = new ArticleController();

router.get('/', articleController.getAll);
router.get('/:code', articleController.getByCode);
router.post('/', validateRequest(createArticleSchema), articleController.create);
router.put('/:code', validateRequest(updateArticleSchema), articleController.update);
router.delete('/:code', articleController.delete);

export default router;
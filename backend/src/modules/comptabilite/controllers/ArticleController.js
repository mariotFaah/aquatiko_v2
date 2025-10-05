import { ArticleService } from '../services/ArticleService.js';
import { successResponse, errorResponse } from '../../../core/utils/response.js';

export class ArticleController {
  constructor() {
    this.articleService = new ArticleService();
  }

  // GET /api/comptabilite/articles
  getAll = async (req, res) => {
    try {
      const articles = await this.articleService.getArticles();
      successResponse(res, articles, 'Liste des articles récupérée avec succès');
    } catch (error) {
      errorResponse(res, error.message, 500);
    }
  };

  // GET /api/comptabilite/articles/:code
  getByCode = async (req, res) => {
    try {
      const { code } = req.params;
      const article = await this.articleService.getArticleByCode(code);
      successResponse(res, article, 'Article récupéré avec succès');
    } catch (error) {
      if (error.message === 'Article non trouvé') {
        errorResponse(res, error.message, 404);
      } else {
        errorResponse(res, error.message, 500);
      }
    }
  };

  // POST /api/comptabilite/articles
  create = async (req, res) => {
    try {
      const article = await this.articleService.createArticle(req.body);
      successResponse(res, article, 'Article créé avec succès', 201);
    } catch (error) {
      if (error.message.includes('existe déjà')) {
        errorResponse(res, error.message, 409);
      } else {
        errorResponse(res, error.message, 500);
      }
    }
  };

  // PUT /api/comptabilite/articles/:code
  update = async (req, res) => {
    try {
      const { code } = req.params;
      const article = await this.articleService.updateArticle(code, req.body);
      successResponse(res, article, 'Article modifié avec succès');
    } catch (error) {
      if (error.message === 'Article non trouvé') {
        errorResponse(res, error.message, 404);
      } else {
        errorResponse(res, error.message, 500);
      }
    }
  };

  // DELETE /api/comptabilite/articles/:code
  delete = async (req, res) => {
    try {
      const { code } = req.params;
      const result = await this.articleService.deleteArticle(code);
      successResponse(res, result, 'Article supprimé avec succès');
    } catch (error) {
      if (error.message === 'Article non trouvé') {
        errorResponse(res, error.message, 404);
      } else {
        errorResponse(res, error.message, 500);
      }
    }
  };
}

export default ArticleController;
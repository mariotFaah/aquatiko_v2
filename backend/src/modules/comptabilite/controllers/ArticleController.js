import { successResponse, errorResponse, createdResponse } from '../../../core/utils/response.js';
import { ArticleService } from '../services/ArticleService.js';

export class ArticleController {
  constructor() {
    this.articleService = new ArticleService();
  }

  async getAll(req, res) {
    try {
      const articles = await this.articleService.getArticles();
      successResponse(res, articles, 'Articles récupérés avec succès');
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async create(req, res) {
    try {
      const nouvelArticle = await this.articleService.createArticle(req.body);
      createdResponse(res, nouvelArticle, 'Article créé avec succès');
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async getByCode(req, res) {
    try {
      const article = await this.articleService.getArticleByCode(req.params.code);
      if (!article) {
        return errorResponse(res, 'Article non trouvé', 404);
      }
      successResponse(res, article);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async update(req, res) {
    try {
      const articleMaj = await this.articleService.updateArticle(req.params.code, req.body);
      successResponse(res, articleMaj, 'Article mis à jour avec succès');
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async delete(req, res) {
    try {
      await this.articleService.deleteArticle(req.params.code);
      successResponse(res, null, 'Article supprimé avec succès');
    } catch (error) {
      errorResponse(res, error.message);
    }
  }
}

export default ArticleController;
import { ArticleRepository } from '../repositories/ArticleRepository.js';

export class ArticleService {
  constructor() {
    this.articleRepository = new ArticleRepository();
  }

  // Récupérer tous les articles
  async getArticles() {
    try {
      return await this.articleRepository.findAll();
    } catch (error) {
      console.error('Erreur ArticleService.getArticles:', error);
      throw new Error('Erreur lors de la récupération des articles');
    }
  }

  // Récupérer un article par code
  async getArticleByCode(code_article) {
    try {
      const article = await this.articleRepository.findByCode(code_article);
      
      if (!article) {
        throw new Error('Article non trouvé');
      }

      return article;
    } catch (error) {
      console.error('Erreur ArticleService.getArticleByCode:', error);
      throw new Error(`Erreur lors de la récupération de l'article: ${error.message}`);
    }
  }

  // Créer un nouvel article
  async createArticle(articleData) {
    try {
      // Vérifier si le code existe déjà
      const codeExists = await this.articleRepository.codeExists(articleData.code_article);
      if (codeExists) {
        throw new Error('Un article avec ce code existe déjà');
      }

      return await this.articleRepository.create(articleData);
    } catch (error) {
      console.error('Erreur ArticleService.createArticle:', error);
      throw new Error(`Erreur lors de la création de l'article: ${error.message}`);
    }
  }

  // Mettre à jour un article
  async updateArticle(code_article, articleData) {
    try {
      // Vérifier que l'article existe
      const existingArticle = await this.articleRepository.findByCode(code_article);
      if (!existingArticle) {
        throw new Error('Article non trouvé');
      }

      return await this.articleRepository.update(code_article, articleData);
    } catch (error) {
      console.error('Erreur ArticleService.updateArticle:', error);
      throw new Error(`Erreur lors de la mise à jour de l'article: ${error.message}`);
    }
  }

  // Supprimer un article
  async deleteArticle(code_article) {
    try {
      const article = await this.articleRepository.findByCode(code_article);
      
      if (!article) {
        throw new Error('Article non trouvé');
      }

      return await this.articleRepository.delete(code_article);
    } catch (error) {
      console.error('Erreur ArticleService.deleteArticle:', error);
      throw new Error(`Erreur lors de la suppression de l'article: ${error.message}`);
    }
  }
}

export default ArticleService;
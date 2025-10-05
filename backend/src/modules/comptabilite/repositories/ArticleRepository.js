import { db } from '../../../core/database/connection.js';

export class ArticleRepository {
  
  // Récupérer tous les articles actifs
  async findAll() {
    try {
      const articles = await db('articles')
        .select('*')
        .where('actif', true)
        .orderBy('description', 'asc');
      
      return articles;
    } catch (error) {
      console.error('Erreur ArticleRepository.findAll:', error);
      throw new Error('Erreur lors de la récupération des articles');
    }
  }

  // Récupérer un article par code
  async findByCode(code_article) {
    try {
      const article = await db('articles')
        .where('code_article', code_article)
        .first();
      
      return article;
    } catch (error) {
      console.error('Erreur ArticleRepository.findByCode:', error);
      throw new Error('Erreur lors de la récupération de l\'article');
    }
  }

  // Créer un nouvel article
  async create(articleData) {
    try {
      await db('articles').insert(articleData);
      
      const nouvelArticle = await this.findByCode(articleData.code_article);
      return nouvelArticle;
    } catch (error) {
      console.error('Erreur ArticleRepository.create:', error);
      throw new Error('Erreur lors de la création de l\'article');
    }
  }

  // Mettre à jour un article
  async update(code_article, articleData) {
    try {
      await db('articles')
        .where('code_article', code_article)
        .update({
          ...articleData,
          updated_at: new Date()
        });
      
      const articleMaj = await this.findByCode(code_article);
      return articleMaj;
    } catch (error) {
      console.error('Erreur ArticleRepository.update:', error);
      throw new Error('Erreur lors de la mise à jour de l\'article');
    }
  }

  // Désactiver un article
  async delete(code_article) {
    try {
      await db('articles')
        .where('code_article', code_article)
        .update({
          actif: false,
          updated_at: new Date()
        });
      
      return { message: 'Article désactivé avec succès' };
    } catch (error) {
      console.error('Erreur ArticleRepository.delete:', error);
      throw new Error('Erreur lors de la désactivation de l\'article');
    }
  }

  // Vérifier si un code article existe
  async codeExists(code_article) {
    try {
      const exists = await db('articles')
        .where('code_article', code_article)
        .first();
      
      return !!exists;
    } catch (error) {
      console.error('Erreur ArticleRepository.codeExists:', error);
      throw new Error('Erreur lors de la vérification du code article');
    }
  }
}

export default ArticleRepository;
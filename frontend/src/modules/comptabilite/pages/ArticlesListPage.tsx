// src/modules/comptabilite/pages/ArticlesListPage.tsx
import React, { useState, useEffect } from 'react';
import './ArticlesListPage.css';
import { comptabiliteApi } from '../services/api';
import type { Article } from '../types';
import { ArticleFormModal } from './ArticleFormModal';

export const ArticlesListPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadArticles();
  }, []);

  // Dans ArticlesListPage.tsx - modifiez loadArticles
const loadArticles = async () => {
  try {
    const data = await comptabiliteApi.getArticles();
    console.log('📋 Tous les articles:', data);
    console.log('🔢 Codes existants:', data.map(a => a.code_article));
    setArticles(data);
  } catch (err) {
    console.error('Erreur lors du chargement des articles:', err);
    alert('Erreur lors du chargement des articles: ' + (err instanceof Error ? err.message : 'Erreur inconnue'));
  } finally {
    setLoading(false);
  }
};

  // Fonction pour générer le prochain code d'article
  // Dans ArticlesListPage.tsx - remplacez la fonction
const getNextArticleCode = (): string => {
  if (articles.length === 0) return 'ART001';
  
  console.log('🔍 Analyse des codes:', articles.map(a => a.code_article));
  
  // Extraire tous les codes numériques de manière plus robuste
  const codes = articles
    .map(article => {
      const match = article.code_article.match(/ART(\d+)/i);
      return match ? parseInt(match[1]) : 0;
    })
    .filter(code => code > 0); // Filtrer les codes valides
  
  if (codes.length === 0) return 'ART001';
  
  // Trouver le code maximum
  const maxCode = Math.max(...codes);
  console.log('📊 Code maximum trouvé:', maxCode);
  
  // Générer le prochain code
  const nextCode = maxCode + 1;
  const newCode = `ART${nextCode.toString().padStart(3, '0')}`;
  console.log('🎯 Prochain code généré:', newCode);
  
  return newCode;
};

  const handleDelete = async (code: string) => {
    if (!window.confirm('Supprimer cet article ?')) return;
    try {
      await comptabiliteApi.deleteArticle(code);
      loadArticles();
    } catch (err) {
      console.error('Erreur suppression:', err);
      alert('Erreur lors de la suppression: ' + (err instanceof Error ? err.message : 'Erreur inconnue'));
    }
  };

  const handleEdit = (article: Article) => {
    setSelectedArticle(article);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedArticle(null);
    setShowModal(true);
  };

  if (loading) {
    return <div className="articles-loading">Chargement des articles...</div>;
  }

  

  return (
    <div className="articles-page">
      <div className="articles-header">
        <div>
          <h1 className="articles-title">Gestion des Articles</h1>
          <p className="articles-subtitle">Créez et gérez votre catalogue d'articles</p>
        </div>
        <button className="articles-add-btn" onClick={handleAdd}>+ Nouvel Article</button>
      </div>

      <div className="articles-table-container">
        <table className="articles-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Description</th>
              <th>Prix Unitaire</th>
              <th>TVA</th>
              <th>Unité</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map(article => (
              <tr key={article.code_article}>
                <td className="article-code">{article.code_article}</td>
                <td className="article-description">{article.description}</td>
                <td className="article-price">{Number(article.prix_unitaire).toLocaleString('fr-MG')} Ar</td>
                <td className="article-tva">{article.taux_tva}%</td>
                <td className="article-unit">{article.unite}</td>
                <td className="articles-actions">
                  <button className="articles-edit-btn" onClick={() => handleEdit(article)}>Modifier</button>
                  <button className="articles-delete-btn" onClick={() => handleDelete(article.code_article)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {articles.length === 0 && (
          <div className="articles-empty">
            Aucun article trouvé. Cliquez sur "Nouvel Article" pour commencer.
          </div>
        )}
      </div>

      {showModal && (
        <ArticleFormModal
          article={selectedArticle}
          nextArticleCode={getNextArticleCode()} // 👈 Passe le code généré
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false);
            loadArticles();
          }}
        />
      )}
    </div>
  );
};
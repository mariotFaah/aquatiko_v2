// src/modules/comptabilite/pages/ArticlesListPage.tsx
import React, { useState, useEffect } from 'react';
import './ArticlesListPage.css';
import { comptabiliteApi } from '../services/api';
import type { Article } from '../types';
import { ArticleFormModal } from './ArticleFormModal';
import { useAlertDialog } from '../../../core/hooks/useAlertDialog';
import AlertDialog from '../../../core/components/AlertDialog/AlertDialog';

export const ArticlesListPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Utilisation du hook AlertDialog
  const { isOpen, message, title, type, alert, close } = useAlertDialog();

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await comptabiliteApi.getArticles();
      console.log('📋 Tous les articles:', data);
      console.log('🔢 Codes existants:', data.map(a => a.code_article));
      setArticles(data);
    } catch (err) {
      console.error('Erreur lors du chargement des articles:', err);
      alert('Erreur lors du chargement des articles: ' + (err instanceof Error ? err.message : 'Erreur inconnue'), {
        type: 'error',
        title: 'Erreur de chargement'
      });
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour générer le prochain code d'article
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
    // Utilisation de confirm natif pour la confirmation de suppression
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'article ${code} ?`)) return;
    
    try {
      setDeleting(code);
      await comptabiliteApi.deleteArticle(code);
      
      alert('Article supprimé avec succès', {
        type: 'success',
        title: 'Suppression réussie'
      });
      
      loadArticles();
    } catch (err) {
      console.error('Erreur suppression:', err);
      alert('Erreur lors de la suppression: ' + (err instanceof Error ? err.message : 'Erreur inconnue'), {
        type: 'error',
        title: 'Erreur de suppression'
      });
    } finally {
      setDeleting(null);
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
    return (
      <div className="articles-loading">
        <div className="articles-loading-spinner"></div>
        <div className="articles-loading-text">Chargement des articles...</div>
      </div>
    );
  }

  return (
    <div className="articles-page">
      <div className="articles-header">
        <div>
          <h1 className="articles-title">Gestion des Articles</h1>
          <p className="articles-subtitle">Créez et gérez votre catalogue d'articles</p>
        </div>
        <button 
          className="articles-add-btn" 
          onClick={handleAdd}
          disabled={loading}
        >
          + Nouvel Article
        </button>
      </div>

      <div className="articles-stats">
        <div className="articles-stat-card">
          <div className="articles-stat-number">{articles.length}</div>
          <div className="articles-stat-label">Articles au total</div>
        </div>
        <div className="articles-stat-card">
          <div className="articles-stat-number">
            {articles.filter(a => a.prix_unitaire > 0).length}
          </div>
          <div className="articles-stat-label">Articles avec prix</div>
        </div>
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
              <tr key={article.code_article} className={deleting === article.code_article ? 'deleting' : ''}>
                <td className="article-code">
                  <span className="article-code-badge">{article.code_article}</span>
                </td>
                <td className="article-description">
                  <div className="article-description-text">{article.description}</div>
                </td>
                <td className="article-price">
                  <span className="article-price-value">
                    {Number(article.prix_unitaire).toLocaleString('fr-MG')} Ar
                  </span>
                </td>
                <td className="article-tva">
                  <span className={`article-tva-badge ${article.taux_tva === 0 ? 'zero' : ''}`}>
                    {article.taux_tva}%
                  </span>
                </td>
                <td className="article-unit">
                  <span className="article-unit-text">{article.unite}</span>
                </td>
                <td className="articles-actions">
                  <button 
                    className="articles-edit-btn" 
                    onClick={() => handleEdit(article)}
                    disabled={deleting === article.code_article}
                  >
                    ✏️ Modifier
                  </button>
                  <button 
                    className="articles-delete-btn" 
                    onClick={() => handleDelete(article.code_article)}
                    disabled={deleting === article.code_article}
                  >
                    {deleting === article.code_article ? (
                      <>
                        <div className="articles-deleting-spinner"></div>
                        Suppression...
                      </>
                    ) : (
                      '🗑️ Supprimer'
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {articles.length === 0 && (
          <div className="articles-empty">
            <div className="articles-empty-icon">📦</div>
            <h3>Aucun article trouvé</h3>
            <p>Cliquez sur "Nouvel Article" pour commencer à créer votre catalogue.</p>
            <button className="articles-empty-btn" onClick={handleAdd}>
              + Créer votre premier article
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <ArticleFormModal
          article={selectedArticle}
          nextArticleCode={getNextArticleCode()}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false);
            loadArticles();
          }}
        />
      )}

      {/* Composant AlertDialog */}
      <AlertDialog
        isOpen={isOpen}
        title={title}
        message={message}
        type={type}
        onClose={close}
      />
    </div>
  );
};
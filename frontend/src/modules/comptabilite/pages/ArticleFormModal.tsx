// src/modules/comptabilite/pages/ArticleFormModal.tsx
import React, { useState } from 'react';
import './ArticleFormModal.css';
import { comptabiliteApi } from '../services/api';
import type { Article } from '../types';
import { useAlertDialog } from '../../../core/hooks/useAlertDialog';
import AlertDialog from '../../../core/components/AlertDialog/AlertDialog';

interface Props {
  article: Article | null;
  nextArticleCode?: string;
  onClose: () => void;
  onSave: () => void;
}

type ArticleFormData = Omit<Article, 'actif' | 'created_at' | 'updated_at'>;

export const ArticleFormModal: React.FC<Props> = ({ article, nextArticleCode, onClose, onSave }) => {
  const [form, setForm] = useState<ArticleFormData>(
    article ? {
      code_article: article.code_article,
      description: article.description,
      prix_unitaire: Number(article.prix_unitaire),
      taux_tva: Number(article.taux_tva),
      unite: article.unite,
    } : {
      code_article: nextArticleCode || 'ART001',
      description: '',
      prix_unitaire: 0,
      taux_tva: 20,
      unite: 'unite',
    }
  );

  const [saving, setSaving] = useState(false);

  const { isOpen, message, title, type, alert, close } = useAlertDialog();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: name.includes('prix') || name.includes('tva') ? Number(value) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.description.trim()) {
      alert('La description est obligatoire', {
        type: 'warning',
        title: 'Champ manquant'
      });
      return;
    }

    if (form.prix_unitaire < 0) {
      alert('Le prix unitaire ne peut pas être négatif', {
        type: 'warning',
        title: 'Prix invalide'
      });
      return;
    }

    if (form.taux_tva < 0 || form.taux_tva > 100) {
      alert('Le taux de TVA doit être compris entre 0 et 100%', {
        type: 'warning',
        title: 'TVA invalide'
      });
      return;
    }

    setSaving(true);
    
    try {
      console.log('📤 Données envoyées:', form);
      
      if (article) {
        const { code_article, ...updateData } = form;
        console.log('🔄 Données de modification:', updateData);
        await comptabiliteApi.updateArticle(article.code_article, updateData);
        
        alert('Article modifié avec succès', {
          type: 'success',
          title: 'Succès'
        });
      } else {
        // Création
        await comptabiliteApi.createArticle(form);
        
        alert('Article créé avec succès', {
          type: 'success',
          title: 'Succès'
        });
      }
      
      setTimeout(() => {
        onSave();
      }, 1000);
      
    } catch (err) {
      console.error('❌ Erreur sauvegarde:', err);
      
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Erreur inconnue lors de la sauvegarde';
      
      alert(`Erreur lors de la sauvegarde: ${errorMessage}`, {
        type: 'error',
        title: 'Erreur'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="article-modal-overlay">
      <div className="article-modal">
        <div className="article-modal-header">
          <h2>{article ? 'Modifier' : 'Ajouter'} un article</h2>
          <button 
            type="button" 
            className="article-modal-close" 
            onClick={onClose}
            disabled={saving}
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {!article && (
            <div className="article-form-group">
              <label className="article-form-label">Code Article *</label>
              <div className="article-code-display">
                <span className="code-prefix">ART</span>
                <span className="code-number">
                  {form.code_article.replace('ART', '')}
                </span>
                <small className="code-info">(Généré automatiquement)</small>
              </div>
              <input 
                type="hidden"
                name="code_article" 
                value={form.code_article} 
              />
            </div>
          )}

          <div className="article-form-group">
            <label className="article-form-label">Description *</label>
            <input 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              className="article-form-input"
              required 
              placeholder="Description de l'article"
              disabled={saving}
            />
          </div>

          <div className="article-form-group">
            <label className="article-form-label">Prix Unitaire (Ar) *</label>
            <input 
              name="prix_unitaire" 
              type="number" 
              step="0.01"
              min="0"
              value={form.prix_unitaire} 
              onChange={handleChange} 
              className="article-form-input"
              required 
              disabled={saving}
            />
          </div>

          <div className="article-form-group">
            <label className="article-form-label">Taux TVA (%)</label>
            <input 
              name="taux_tva" 
              type="number" 
              step="0.01"
              min="0"
              max="100"
              value={form.taux_tva} 
              onChange={handleChange} 
              className="article-form-input"
              disabled={saving}
            />
          </div>

          <div className="article-form-group">
            <label className="article-form-label">Unité</label>
            <select 
              name="unite" 
              value={form.unite} 
              onChange={handleChange} 
              className="article-form-select"
              disabled={saving}
            >
              <option value="unite">Unité</option>
              <option value="heure">Heure</option>
              <option value="jour">Jour</option>
              <option value="kg">Kilogramme</option>
              <option value="litre">Litre</option>
              <option value="mètre">Mètre</option>
              <option value="mois">Mois</option>
            </select>
          </div>

          <div className="article-modal-actions">
            <button 
              type="button" 
              className="article-cancel-btn" 
              onClick={onClose}
              disabled={saving}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="article-save-btn"
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="article-saving-spinner"></div>
                  {article ? 'Modification...' : 'Création...'}
                </>
              ) : (
                article ? '💾 Modifier' : '➕ Créer'
              )}
            </button>
          </div>
        </form>
      </div>

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
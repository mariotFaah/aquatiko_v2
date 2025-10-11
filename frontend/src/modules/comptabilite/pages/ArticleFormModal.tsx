// src/modules/comptabilite/pages/ArticleFormModal.tsx
import React, { useState } from 'react';
import './ArticleFormModal.css';
import { comptabiliteApi } from '../services/api';
import type { Article } from '../types';

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
      // Pour la modification, ne prenez que les champs éditables
      code_article: article.code_article,
      description: article.description,
      prix_unitaire: Number(article.prix_unitaire),
      taux_tva: Number(article.taux_tva),
      unite: article.unite,
    } : {
      // Pour la création
      code_article: nextArticleCode || 'ART001',
      description: '',
      prix_unitaire: 0,
      taux_tva: 20,
      unite: 'unite',
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: name.includes('prix') || name.includes('tva') ? Number(value) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('📤 Données envoyées:', form);
      
      if (article) {
        // Modification - on envoie seulement les champs modifiables (sans code_article)
        const { code_article, ...updateData } = form;
        console.log('🔄 Données de modification:', updateData);
        await comptabiliteApi.updateArticle(article.code_article, updateData);
      } else {
        // Création
        await comptabiliteApi.createArticle(form);
      }
      onSave();
    } catch (err) {
      console.error('❌ Erreur sauvegarde:', err);
      alert('Erreur lors de la sauvegarde: ' + (err instanceof Error ? err.message : 'Erreur inconnue'));
    }
  };

  return (
    <div className="article-modal-overlay">
      <div className="article-modal">
        <h2>{article ? 'Modifier' : 'Ajouter'} un article</h2>
        <form onSubmit={handleSubmit}>
          {!article && (
            <>
              <label>Code Article *</label>
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
            </>
          )}

          <label>Description *</label>
          <input 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            required 
            placeholder="Description de l'article"
          />

          <label>Prix Unitaire (Ar) *</label>
          <input 
            name="prix_unitaire" 
            type="number" 
            step="0.01"
            min="0"
            value={form.prix_unitaire} 
            onChange={handleChange} 
            required 
          />

          <label>Taux TVA (%)</label>
          <input 
            name="taux_tva" 
            type="number" 
            step="0.01"
            min="0"
            max="100"
            value={form.taux_tva} 
            onChange={handleChange} 
          />

          <label>Unité</label>
          <select name="unite" value={form.unite} onChange={handleChange}>
            <option value="unite">Unité</option>
            <option value="heure">Heure</option>
            <option value="jour">Jour</option>
            <option value="kg">Kilogramme</option>
            <option value="litre">Litre</option>
            <option value="mètre">Mètre</option>
            <option value="mois">Mois</option>
          </select>

          <div className="article-modal-actions">
            <button type="submit" className="article-save-btn">
              {article ? 'Modifier' : 'Créer'}
            </button>
            <button type="button" className="article-cancel-btn" onClick={onClose}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
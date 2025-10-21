import * as React from 'react';
import type { LigneFacture, Article } from '../../types';
import './LigneFactureRow.css';

interface LigneFactureRowProps {
  ligne: LigneFacture;
  articles: Article[];
  index: number;
  onChange: (index: number, field: string, value: any) => void;
  onRemove: (index: number) => void;
  showRemove: boolean;
  disabled?: boolean;
}

export const LigneFactureRow: React.FC<LigneFactureRowProps> = ({
  ligne,
  articles,
  index,
  onChange,
  onRemove,
  showRemove,
  disabled = false
}) => {
  // Fonction pour gérer le changement d'article
  const handleArticleChange = (articleCode: string) => {
    // Trouver l'article sélectionné
    const selectedArticle = articles.find(article => article.code_article === articleCode);
    
    if (selectedArticle) {
      // Mettre à jour le code article ET la description ET le taux TVA
      onChange(index, 'code_article', selectedArticle.code_article);
      onChange(index, 'description', selectedArticle.description);
      onChange(index, 'taux_tva', selectedArticle.taux_tva);
      
      // Optionnel : mettre à jour aussi le prix unitaire si tu veux
      // onChange(index, 'prix_unitaire', selectedArticle.prix_unitaire);
    } else {
      // Si aucun article sélectionné, réinitialiser
      onChange(index, 'code_article', '');
      onChange(index, 'description', '');
      onChange(index, 'taux_tva', 0);
    }
  };

  return (
    <tr className="ligne-facture-row">
      {/* Référence */}
      <td className="ligne-facture-cell">
        <select
          value={ligne.code_article}
          onChange={(e) => handleArticleChange(e.target.value)}
          className="ligne-article-select"
          disabled={disabled}
        >
          <option value="">Sélectionner</option>
          {articles.map(article => (
            <option key={article.code_article} value={article.code_article}>
              {article.code_article} - {article.description}
            </option>
          ))}
        </select>
      </td>

      {/* Libellé */}
      <td className="ligne-facture-cell">
        <input
          type="text"
          value={ligne.description}
          onChange={(e) => onChange(index, 'description', e.target.value)}
          className="ligne-input"
          placeholder="Description de l'article"
          disabled={disabled}
        />
      </td>

      {/* Prix Unitaire */}
      <td className="ligne-facture-cell">
        <input
          type="number"
          value={ligne.prix_unitaire}
          onChange={(e) => onChange(index, 'prix_unitaire', parseFloat(e.target.value) || 0)}
          className="ligne-input"
          min="0"
          step="0.01"
          disabled={disabled}
        />
      </td>

      {/* Quantité */}
      <td className="ligne-facture-cell">
        <input
          type="number"
          value={ligne.quantite}
          onChange={(e) => onChange(index, 'quantite', parseFloat(e.target.value) || 0)}
          className="ligne-input"
          min="0.01"
          step="0.01"
          disabled={disabled}
        />
      </td>

      {/* Remise */}
      <td className="ligne-facture-cell">
        <input
          type="number"
          value={ligne.remise}
          onChange={(e) => onChange(index, 'remise', parseFloat(e.target.value) || 0)}
          className="ligne-input"
          min="0"
          max="100"
          step="0.01"
          disabled={disabled}
        />
      </td>

      {/* Montant HT (lecture seule) */}
      <td className="ligne-facture-cell">
        <div className="ligne-montant-ht">
          {ligne.montant_ht?.toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })} Ar
        </div>
      </td>

      {/* TVA - Maintenant en lecture seule car rempli automatiquement */}
      <td className="ligne-facture-cell">
        <div className="ligne-tva-display">
          {ligne.taux_tva}%
        </div>
        {/* Cache le select si tu veux forcer l'utilisation du taux de l'article */}
        {!disabled && (
          <select
            value={ligne.taux_tva}
            onChange={(e) => onChange(index, 'taux_tva', parseFloat(e.target.value))}
            className="ligne-tva-select"
            style={{ display: 'none' }} // Cache le select
          >
            <option value={0}>0%</option>
            <option value={5}>5%</option>
            <option value={10}>10%</option>
            <option value={20}>20%</option>
          </select>
        )}
      </td>

      {/* Actions */}
      {!disabled && (
        <td className="ligne-facture-cell">
          {showRemove && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="ligne-remove-button"
            >
              ❌ Supprimer
            </button>
          )}
        </td>
      )}
    </tr>
  );
};

export default LigneFactureRow;
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
}

export const LigneFactureRow: React.FC<LigneFactureRowProps> = ({
  ligne,
  articles,
  index,
  onChange,
  onRemove,
  showRemove
}) => {
  return (
    <tr className="ligne-facture-row">
      {/* Référence */}
      <td className="ligne-facture-cell">
        <select
          value={ligne.code_article}
          onChange={(e) => onChange(index, 'code_article', e.target.value)}
          className="ligne-article-select"
        >
          <option value="">Sélectionner</option>
          {articles.map(article => (
            <option key={article.code_article} value={article.code_article}>
              {article.code_article}
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
        />
      </td>

      {/* Montant HT (lecture seule) */}
      <td className="ligne-facture-cell">
        <div className="ligne-montant-ht">
          {ligne.montant_ht.toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })} Ar
        </div>
      </td>

      {/* TVA */}
      <td className="ligne-facture-cell">
        <select
          value={ligne.taux_tva}
          onChange={(e) => onChange(index, 'taux_tva', parseFloat(e.target.value))}
          className="ligne-tva-select"
        >
          <option value={0}>0%</option>
          <option value={5}>5%</option>
          <option value={10}>10%</option>
          <option value={20}>20%</option>
        </select>
      </td>

      {/* Actions */}
      <td className="ligne-facture-cell">
        {showRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="ligne-remove-button"
          >
            Supprimer
          </button>
        )}
      </td>
    </tr>
  );
};

export default LigneFactureRow;
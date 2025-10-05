import * as React from 'react';
import './CalculsFacture.css';

interface CalculsFactureProps {
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  echeance: string;
  reglement: string;
}

export const CalculsFacture: React.FC<CalculsFactureProps> = ({
  totalHT,
  totalTVA,
  totalTTC,
  echeance,
  reglement
}) => {
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' Ar';
  };

  const getReglementLabel = (reglement: string): string => {
    const labels: { [key: string]: string } = {
      virement: 'Virement Bancaire',
      cheque: 'Chèque',
      espece: 'Espèces',
      carte: 'Carte Bancaire'
    };
    return labels[reglement] || reglement;
  };

  return (
    <div className="calculs-facture">
      {/* Colonne de gauche - Informations */}
      <div className="calculs-info-column">
        <div className="calculs-field">
          <label className="calculs-label">
            Échéance
          </label>
          <div className="calculs-value">
            {new Date(echeance).toLocaleDateString('fr-FR')}
          </div>
        </div>
        
        <div className="calculs-field">
          <label className="calculs-label">
            Mode de règlement
          </label>
          <div className="calculs-value">
            {getReglementLabel(reglement)}
          </div>
        </div>
        
        <div className="calculs-thank-you">
          <p className="calculs-thank-you-text">
            "Nous vous remercions de votre confiance"
          </p>
          <p className="calculs-thank-you-text">
            "Cordialement"
          </p>
        </div>
      </div>

      {/* Colonne de droite - Totaux */}
      <div className="calculs-totals-column">
        <div className="calculs-total-row">
          <span className="calculs-total-label">Total HT:</span>
          <span className="calculs-total-value">{formatCurrency(totalHT)}</span>
        </div>
        
        <div className="calculs-total-row">
          <span className="calculs-total-label">Remise globale:</span>
          <span className="calculs-total-value">0,00 Ar</span>
        </div>
        
        <div className="calculs-total-row">
          <span className="calculs-total-label">Total TVA:</span>
          <span className="calculs-total-value calculs-total-tva">
            {formatCurrency(totalTVA)}
          </span>
        </div>
        
        <div className="calculs-total-ttc">
          <span className="calculs-total-ttc-label">Total TTC:</span>
          <span className="calculs-total-ttc-value">
            {formatCurrency(totalTTC)}
          </span>
        </div>

        {/* Arrondi et Net à payer */}
        <div className="calculs-net-a-payer">
          <div className="calculs-net-row">
            <span className="calculs-net-label">Net à payer:</span>
            <span className="calculs-net-value">
              {formatCurrency(totalTTC)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculsFacture;
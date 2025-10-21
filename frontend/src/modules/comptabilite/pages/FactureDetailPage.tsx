import React, { useState, useEffect } from 'react';
import { useParams, Link, } from 'react-router-dom';
import type { Facture } from '../types';
import { comptabiliteApi } from '../services/api';
import './FactureDetailPage.css';

export const FactureDetailPage: React.FC = () => {
  const { numero } = useParams<{ numero: string }>();
  const [facture, setFacture] = useState<Facture | null>(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    if (numero) {
      loadFacture();
    }
  }, [numero]);

  const loadFacture = async () => {
    try {
      setLoading(true);
      const data = await comptabiliteApi.getFacture(parseInt(numero!));
      setFacture(data);
    } catch (error) {
      console.error('Erreur chargement facture:', error);
      alert('Erreur lors du chargement de la facture');
    } finally {
      setLoading(false);
    }
  };

  const validerFacture = async () => {
    if (!facture || !facture.numero_facture) return;

    try {
      setValidating(true);
      await comptabiliteApi.validerFacture(facture.numero_facture);
      alert('✅ Facture validée avec succès!');
      // Recharger les données
      await loadFacture();
    } catch (error: any) {
      console.error('Erreur validation:', error);
      alert(`❌ Erreur: ${error.message}`);
    } finally {
      setValidating(false);
    }
  };

  const annulerFacture = async () => {
    if (!facture || !facture.numero_facture) return;

    if (window.confirm('Êtes-vous sûr de vouloir annuler cette facture ?')) {
      try {
        setValidating(true);
        // Ici vous devriez avoir une fonction annulerFacture dans votre API
        // Pour l'instant, on va simuler avec updateFacture
        await comptabiliteApi.updateFacture(facture.numero_facture, {
          ...facture,
          statut: 'annulee'
        });
        alert('✅ Facture annulée avec succès!');
        await loadFacture();
      } catch (error: any) {
        console.error('Erreur annulation:', error);
        alert(`❌ Erreur: ${error.message}`);
      } finally {
        setValidating(false);
      }
    }
  };

  const imprimerFacture = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="facture-detail-loading">
        <div className="facture-detail-loading-text">Chargement de la facture...</div>
      </div>
    );
  }

  if (!facture) {
    return (
      <div className="facture-detail-error">
        <div className="facture-detail-error-text">Facture non trouvée</div>
        <Link to="/comptabilite/factures" className="facture-detail-back-button">
          ← Retour à la liste
        </Link>
      </div>
    );
  }

  const ENTREPRISE_INFO = {
    nom: 'Aquatiko',
    adresse: 'By pass tana 102',
    telephone: '020 22 840 61',
    email: 'aquatiko@shop.com'
  };

  return (
    <div className="facture-detail-page">
      {/* En-tête de page */}
      <div className="facture-detail-header">
        <div>
          <h1 className="facture-detail-title">
            Facture #{facture.numero_facture}
          </h1>
          <p className="facture-detail-subtitle">
            Détail de la facture - {facture.type_facture}
          </p>
        </div>
        <div className="facture-detail-actions">
          <Link
            to="/comptabilite/factures"
            className="facture-detail-back-button"
          >
            ← Retour
          </Link>
          {facture.statut === 'brouillon' && (
            <button
              onClick={validerFacture}
              disabled={validating}
              className="facture-detail-validate-button"
            >
              {validating ? 'Validation...' : '✅ Valider'}
            </button>
          )}
          {facture.statut === 'validee' && (
            <button
              onClick={imprimerFacture}
              className="facture-detail-print-button"
            >
              🖨️ Imprimer
            </button>
          )}
          {facture.statut !== 'annulee' && (
            <button
              onClick={annulerFacture}
              disabled={validating}
              className="facture-detail-cancel-button"
            >
              {validating ? 'Annulation...' : '❌ Annuler'}
            </button>
          )}
        </div>
      </div>

      {/* Carte de la facture */}
      <div className="facture-detail-card">
        {/* En-tête facture */}
        <div className="facture-detail-header-info">
          <div className="facture-detail-entreprise">
            <h3>Entreprise</h3>
            <div className="facture-detail-info">
              <div><strong>Nom:</strong> {ENTREPRISE_INFO.nom}</div>
              <div><strong>Adresse:</strong> {ENTREPRISE_INFO.adresse}</div>
              <div><strong>Tel:</strong> {ENTREPRISE_INFO.telephone}</div>
              <div><strong>Email:</strong> {ENTREPRISE_INFO.email}</div>
            </div>
          </div>

          <div className="facture-detail-client">
            <h3>{facture.nom_tiers}</h3>
            <div className="facture-detail-info">
              <div><strong>Adresse:</strong> {facture.adresse}</div>
              <div><strong>Tel:</strong> {facture.telephone}</div>
              <div><strong>Email:</strong> {facture.email}</div>
            </div>
          </div>

          <div className="facture-detail-meta">
            <div className="facture-detail-meta-item">
              <strong>N° Facture:</strong> {facture.numero_facture}
            </div>
            <div className="facture-detail-meta-item">
              <strong>Date:</strong> {new Date(facture.date).toLocaleDateString('fr-FR')}
            </div>
            <div className="facture-detail-meta-item">
              <strong>Échéance:</strong> {new Date(facture.echeance).toLocaleDateString('fr-FR')}
            </div>
            <div className="facture-detail-meta-item">
              <strong>Type:</strong> 
              <span className={`facture-detail-badge type-${facture.type_facture}`}>
                {facture.type_facture}
              </span>
            </div>
            <div className="facture-detail-meta-item">
              <strong>Statut:</strong>
              <span className={`facture-detail-badge statut-${facture.statut}`}>
                {facture.statut}
              </span>
            </div>
            <div className="facture-detail-meta-item">
              <strong>Règlement:</strong> {facture.reglement}
            </div>
          </div>
        </div>

        {/* Lignes de facture */}
        <div className="facture-detail-lignes">
          <h3>Articles et Services</h3>
          <div className="facture-detail-table-container">
            <table className="facture-detail-table">
              <thead>
                <tr>
                  <th>Référence</th>
                  <th>Description</th>
                  <th>Quantité</th>
                  <th>Prix Unitaire</th>
                  <th>Remise %</th>
                  <th>TVA %</th>
                  <th>Montant HT</th>
                  <th>Montant TVA</th>
                  <th>Montant TTC</th>
                </tr>
              </thead>
              <tbody>
                {facture.lignes && facture.lignes.map((ligne, index) => (
                  <tr key={index} className="facture-detail-ligne">
                    <td>{ligne.code_article}</td>
                    <td className="facture-detail-ligne-description">
                      {ligne.description}
                    </td>
                    <td className="facture-detail-ligne-quantite">
                      {ligne.quantite}
                    </td>
                    <td className="facture-detail-ligne-prix">
                      {ligne.prix_unitaire.toLocaleString('fr-FR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })} Ar
                    </td>
                    <td className="facture-detail-ligne-remise">
                      {ligne.remise}%
                    </td>
                    <td className="facture-detail-ligne-tva">
                      {ligne.taux_tva}%
                    </td>
                    <td className="facture-detail-ligne-montant">
                      {ligne.montant_ht?.toLocaleString('fr-FR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })} Ar
                    </td>
                    <td className="facture-detail-ligne-montant">
                      {ligne.montant_tva?.toLocaleString('fr-FR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })} Ar
                    </td>
                    <td className="facture-detail-ligne-montant">
                      {ligne.montant_ttc?.toLocaleString('fr-FR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })} Ar
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totaux */}
        <div className="facture-detail-totals">
          <div className="facture-detail-totals-grid">
            <div className="facture-detail-total-group">
              <div className="facture-detail-total-row">
                <span>Total HT:</span>
                <span className="facture-detail-total-value">
                  {facture.total_ht?.toLocaleString('fr-FR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} Ar
                </span>
              </div>
              <div className="facture-detail-total-row">
                <span>Total TVA:</span>
                <span className="facture-detail-total-value">
                  {facture.total_tva?.toLocaleString('fr-FR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} Ar
                </span>
              </div>
              <div className="facture-detail-total-row facture-detail-total-ttc">
                <span>Total TTC:</span>
                <span className="facture-detail-total-value">
                  {facture.total_ttc?.toLocaleString('fr-FR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} Ar
                </span>
              </div>
            </div>
            
            <div className="facture-detail-paiement-info">
              <div className="facture-detail-paiement-item">
                <strong>Mode de règlement:</strong> {facture.reglement}
              </div>
              <div className="facture-detail-paiement-item">
                <strong>Échéance:</strong> {new Date(facture.echeance).toLocaleDateString('fr-FR')}
              </div>
              {facture.statut === 'validee' && (
                <div className="facture-detail-merci">
                  <p>"Nous vous remercions de votre confiance"</p>
                  <p>"Cordialement"</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="facture-detail-footer">
          <div className="facture-detail-notes">
            <h4>Notes</h4>
            <p>{facture.notes || "Aucune note particulière"}</p>
          </div>
          <div className="facture-detail-timestamps">
            <div>
              <strong>Créée le:</strong> {facture.created_at ? new Date(facture.created_at).toLocaleString('fr-FR') : 'N/A'}
            </div>
            <div>
              <strong>Modifiée le:</strong> {facture.updated_at ? new Date(facture.updated_at).toLocaleString('fr-FR') : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactureDetailPage;
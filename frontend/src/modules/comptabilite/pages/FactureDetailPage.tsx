import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Facture } from '../types';
import { comptabiliteApi } from '../services/api';
import { useAlertDialog } from '../../../core/hooks/useAlertDialog';
import AlertDialog from '../../../core/components/AlertDialog/AlertDialog';
import { ExportPDFButton } from '../components/ExportPDFButton/ExportPDFButton';
import {ExportExcelButton} from '../components/ExportExcelButton/ExportExcelButton'
import './FactureDetailPage.css';

export const FactureDetailPage: React.FC = () => {
  const { numero } = useParams<{ numero: string }>();
  const [facture, setFacture] = useState<Facture | null>(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Utilisation du hook AlertDialog
  const { isOpen, message, title, type, alert, close } = useAlertDialog();

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
      alert('Erreur lors du chargement de la facture', {
        type: 'error',
        title: 'Erreur de chargement'
      });
    } finally {
      setLoading(false);
    }
  };

  const validerFacture = async () => {
    if (!facture || !facture.numero_facture) return;

    try {
      setValidating(true);
      await comptabiliteApi.validerFacture(facture.numero_facture);
      
      alert('Facture validée avec succès!', {
        type: 'success',
        title: 'Succès'
      });
      
      // Recharger les données
      await loadFacture();
    } catch (error: any) {
      console.error('Erreur validation:', error);
      alert(`Erreur lors de la validation: ${error.message}`, {
        type: 'error',
        title: 'Erreur'
      });
    } finally {
      setValidating(false);
    }
  };

  const annulerFacture = async () => {
    if (!facture || !facture.numero_facture) return;

    // Utilisation de confirm natif pour la confirmation d'annulation
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette facture ? Cette action est irréversible.')) {
      return;
    }

    try {
      setCancelling(true);
      // Ici vous devriez avoir une fonction annulerFacture dans votre API
      // Pour l'instant, on va simuler avec updateFacture
      await comptabiliteApi.updateFacture(facture.numero_facture, {
        ...facture,
        statut: 'annulee'
      });
      
      alert('Facture annulée avec succès!', {
        type: 'success',
        title: 'Succès'
      });
      
      await loadFacture();
    } catch (error: any) {
      console.error('Erreur annulation:', error);
      alert(`Erreur lors de l'annulation: ${error.message}`, {
        type: 'error',
        title: 'Erreur'
      });
    } finally {
      setCancelling(false);
    }
  };

  const imprimerFacture = () => {
    window.print();
  };

  const getDeviseSymbol = (devise: string = 'MGA') => {
    const symbols: { [key: string]: string } = {
      'MGA': 'Ar',
      'USD': '$',
      'EUR': '€'
    };
    return symbols[devise] || devise;
  };

  const getStatutLabel = (statut: string) => {
    const labels: { [key: string]: string } = {
      validee: '✅ Validée',
      brouillon: '📝 Brouillon',
      annulee: '❌ Annulée',
      partiellement_payee: '🔄 Partiellement payée',
      payee: '💰 Payée',
      en_retard: '⏰ En retard',
      non_payee: '💳 Non payée'
    };
    return labels[statut] || statut;
  };

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      facture: '📄 Facture',
      proforma: '📋 Proforma',
      avoir: '🧾 Avoir'
    };
    return labels[type] || type;
  };

  const getPaiementLabel = (typePaiement: string = 'comptant') => {
    const labels: { [key: string]: string } = {
      comptant: '💳 Comptant',
      flexible: '🔄 Flexible',
      acompte: '💰 Acompte',
      echeance: '📅 Échéance'
    };
    return labels[typePaiement] || typePaiement;
  };

  const getPaiementClass = (typePaiement: string = 'comptant') => {
    const classes = {
      comptant: 'facture-detail-paiement-comptant',
      flexible: 'facture-detail-paiement-flexible',
      acompte: 'facture-detail-paiement-acompte',
      echeance: 'facture-detail-paiement-echeance'
    };
    return `${classes[typePaiement as keyof typeof classes] || 'facture-detail-paiement-default'} facture-detail-paiement-badge`;
  };

  // Calculer la progression du paiement
  const calculerProgressionPaiement = () => {
    if (!facture?.total_ttc || facture.total_ttc === 0) return 0;
    const paye = facture.montant_paye || 0;
    return Math.min(100, (paye / facture.total_ttc) * 100);
  };

  
  // Calculer les jours restants
  const getJoursRestants = (): number | null => {
    if (!facture?.date_finale_paiement || facture.statut === 'payee') return null;
    const dateFinale = new Date(facture.date_finale_paiement);
    const aujourdhui = new Date();
    const diffTime = dateFinale.getTime() - aujourdhui.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="facture-detail-loading">
        <div className="facture-detail-loading-spinner"></div>
        <div className="facture-detail-loading-text">Chargement de la facture...</div>
      </div>
    );
  }

  if (!facture) {
    return (
      <div className="facture-detail-error">
        <div className="facture-detail-error-icon">❌</div>
        <div className="facture-detail-error-text">Facture non trouvée</div>
        <p className="facture-detail-error-description">
          La facture que vous recherchez n'existe pas ou a été supprimée.
        </p>
        <Link to="/comptabilite/factures" className="facture-detail-back-button">
          ← Retour à la liste des factures
        </Link>
      </div>
    );
  }

  const ENTREPRISE_INFO = {
    nom: 'OMNISERVE EXPERTS',
    adresse: '2239 Ambodisaina Ivondro Tamatave',
    telephone: '+261 32 77 531 69',
    email: 'contact@omniserve.experts'
  };

  const progressionPaiement = calculerProgressionPaiement();
  const joursRestants = getJoursRestants();
  const deviseSymbol = getDeviseSymbol(facture.devise);

  return (
    <div className="facture-detail-page">
      {/* En-tête de page */}
      <div className="facture-detail-header">
        <div>
          <h1 className="facture-detail-title">
            {getTypeLabel(facture.type_facture)} #{facture.numero_facture}
          </h1>
          <p className="facture-detail-subtitle">
            Détail du document - {facture.type_facture}
          </p>
        </div>
        <div className="facture-detail-actions">
          <Link
            to="/comptabilite/factures"
            className="facture-detail-back-button"
          >
            ← Retour
          </Link>

            {/* AJOUT: Bouton d'export PDF */}
          <ExportPDFButton
            type="facture"
            data={facture}
            label="📄 Exporter PDF"
            className="facture-detail-export-button"
            options={{
              filename: `${facture.type_facture}_${facture.numero_facture}.pdf`,
              title: `${getTypeLabel(facture.type_facture)} ${facture.numero_facture}`,
              includeHeader: true,
              includeFooter: true
            }}
          />
          <ExportExcelButton
             type='facture'
             data={facture}
             label='Excel'
              options={{
              filename: `${facture.type_facture}_${facture.numero_facture}.xlsx`,
              includeHeader: true
            }}
            />
          
          {facture.statut === 'brouillon' && (
            <button
              onClick={validerFacture}
              disabled={validating}
              className="facture-detail-validate-button"
            >
              {validating ? (
                <>
                  <div className="facture-detail-action-spinner"></div>
                  Validation...
                </>
              ) : (
                '✅ Valider'
              )}
            </button>
          )}
          
          {(facture.statut === 'validee' || facture.statut === 'partiellement_payee') && (
            <button
              onClick={imprimerFacture}
              className="facture-detail-print-button"
            >
              🖨️ Imprimer
            </button>
          )}
          
          {(facture.statut === 'validee' || facture.statut === 'brouillon') && (
            <button
              onClick={annulerFacture}
              disabled={cancelling}
              className="facture-detail-cancel-button"
            >
              {cancelling ? (
                <>
                  <div className="facture-detail-action-spinner"></div>
                  Annulation...
                </>
              ) : (
                '❌ Annuler'
              )}
            </button>
          )}
          
          {facture.statut === 'brouillon' && (
            <Link
              to={`/comptabilite/factures/${facture.numero_facture}/edit`}
              className="facture-detail-edit-button"
            >
              ✏️ Modifier
            </Link>
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
              <div><strong>Type:</strong> {facture.type_tiers}</div>
              <div><strong>Adresse:</strong> {facture.adresse}</div>
              <div><strong>Tel:</strong> {facture.telephone}</div>
              <div><strong>Email:</strong> {facture.email}</div>
              {facture.devise && facture.devise !== 'MGA' && (
                <div><strong>Devise:</strong> {facture.devise}</div>
              )}
            </div>
          </div>

          <div className="facture-detail-meta">
            <div className="facture-detail-meta-item">
              <strong>N° Document:</strong> 
              <span className="facture-detail-numero">{facture.numero_facture}</span>
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
                {getTypeLabel(facture.type_facture)}
              </span>
            </div>
            <div className="facture-detail-meta-item">
              <strong>Statut:</strong>
              <span className={`facture-detail-badge statut-${facture.statut}`}>
                {getStatutLabel(facture.statut)}
              </span>
            </div>
            <div className="facture-detail-meta-item">
              <strong>Règlement:</strong> 
              <span className="facture-detail-reglement">{facture.reglement}</span>
            </div>
            <div className="facture-detail-meta-item">
              <strong>Type Paiement:</strong>
              <span className={getPaiementClass(facture.type_paiement)}>
                {getPaiementLabel(facture.type_paiement)}
              </span>
            </div>
          </div>
        </div>

        {/* Section Information Paiement */}
        {(facture.type_paiement && facture.type_paiement !== 'comptant') && (
          <div className="facture-detail-paiement-section">
            <h3>Informations de Paiement</h3>
            <div className="facture-detail-paiement-grid">
              <div className="facture-detail-paiement-info">
                <div className="facture-detail-paiement-type">
                  <strong>Type:</strong> {getPaiementLabel(facture.type_paiement)}
                </div>
                
                {facture.date_finale_paiement && (
                  <div className="facture-detail-paiement-date">
                    <strong>Date finale:</strong> {new Date(facture.date_finale_paiement).toLocaleDateString('fr-FR')}
                    {joursRestants !== null && (
                      <span className={`facture-detail-jours-restants ${joursRestants < 0 ? 'retard' : joursRestants < 7 ? 'warning' : 'normal'}`}>
                        {joursRestants < 0 ? `${Math.abs(joursRestants)}j de retard` : `${joursRestants}j restant`}
                      </span>
                    )}
                  </div>
                )}

                {facture.montant_minimum_paiement && facture.montant_minimum_paiement > 0 && (
                  <div className="facture-detail-paiement-minimum">
                    <strong>Minimum par paiement:</strong> {facture.montant_minimum_paiement.toLocaleString('fr-FR')} {deviseSymbol}
                  </div>
                )}

                {facture.montant_acompte && facture.montant_acompte > 0 && (
                  <div className="facture-detail-paiement-acompte">
                    <strong>Acompte:</strong> {facture.montant_acompte.toLocaleString('fr-FR')} {deviseSymbol}
                    {facture.total_ttc && (
                      <span className="facture-detail-paiement-pourcentage">
                        ({(facture.montant_acompte / facture.total_ttc * 100).toFixed(1)}%)
                      </span>
                    )}
                  </div>
                )}

                {facture.penalite_retard && facture.penalite_retard > 0 && (
                  <div className="facture-detail-paiement-penalite">
                    <strong>Pénalité retard:</strong> {facture.penalite_retard}%
                  </div>
                )}
              </div>

              {/* Barre de progression du paiement */}
              {(facture.montant_paye || 0) > 0 && (
                <div className="facture-detail-progression">
                  <div className="facture-detail-progression-header">
                    <span>Progression du paiement</span>
                    <span className="facture-detail-progression-text">
                      {progressionPaiement.toFixed(0)}%
                    </span>
                  </div>
                  <div className="facture-detail-progression-bar">
                    <div 
                      className={`facture-detail-progression-fill ${progressionPaiement === 100 ? 'complete' : progressionPaiement > 0 ? 'partial' : 'empty'}`}
                      style={{ width: `${progressionPaiement}%` }}
                    />
                  </div>
                  <div className="facture-detail-progression-details">
                    <span>Payé: {(facture.montant_paye || 0).toLocaleString('fr-FR')} {deviseSymbol}</span>
                    <span>Reste: {(facture.montant_restant || facture.total_ttc || 0).toLocaleString('fr-FR')} {deviseSymbol}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

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
                  <th>Prix Unitaire ({facture.devise})</th>
                  <th>Remise %</th>
                  <th>TVA %</th>
                  <th>Montant HT ({facture.devise})</th>
                  <th>Montant TVA ({facture.devise})</th>
                  <th>Montant TTC ({facture.devise})</th>
                </tr>
              </thead>
              <tbody>
                {facture.lignes && facture.lignes.length > 0 ? (
                  facture.lignes.map((ligne, index) => (
                    <tr key={index} className="facture-detail-ligne">
                      <td className="facture-detail-ligne-reference">
                        <code>{ligne.code_article}</code>
                      </td>
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
                        })} {deviseSymbol}
                      </td>
                      <td className="facture-detail-ligne-remise">
                        {ligne.remise > 0 ? `${ligne.remise}%` : '-'}
                      </td>
                      <td className="facture-detail-ligne-tva">
                        {ligne.taux_tva}%
                      </td>
                      <td className="facture-detail-ligne-montant">
                        {ligne.montant_ht?.toLocaleString('fr-FR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })} {deviseSymbol}
                      </td>
                      <td className="facture-detail-ligne-montant">
                        {ligne.montant_tva?.toLocaleString('fr-FR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })} {deviseSymbol}
                      </td>
                      <td className="facture-detail-ligne-montant">
                        {ligne.montant_ttc?.toLocaleString('fr-FR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })} {deviseSymbol}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="facture-detail-no-lignes">
                      Aucun article dans cette facture
                    </td>
                  </tr>
                )}
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
                  })} {deviseSymbol}
                </span>
              </div>
              <div className="facture-detail-total-row">
                <span>Total TVA:</span>
                <span className="facture-detail-total-value">
                  {facture.total_tva?.toLocaleString('fr-FR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} {deviseSymbol}
                </span>
              </div>
              <div className="facture-detail-total-row facture-detail-total-ttc">
                <span>Total TTC:</span>
                <span className="facture-detail-total-value">
                  {facture.total_ttc?.toLocaleString('fr-FR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} {deviseSymbol}
                </span>
              </div>

              {/* Informations de paiement */}
              {(facture.montant_paye || 0) > 0 && (
                <>
                  <div className="facture-detail-total-row">
                    <span>Montant payé:</span>
                    <span className="facture-detail-total-value paye">
                      {(facture.montant_paye || 0).toLocaleString('fr-FR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })} {deviseSymbol}
                    </span>
                  </div>
                  <div className="facture-detail-total-row">
                    <span>Montant restant:</span>
                    <span className="facture-detail-total-value restant">
                      {(facture.montant_restant || facture.total_ttc || 0).toLocaleString('fr-FR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })} {deviseSymbol}
                    </span>
                  </div>
                </>
              )}
            </div>
            
            <div className="facture-detail-paiement-info">
              <div className="facture-detail-paiement-item">
                <strong>Mode de règlement:</strong> {facture.reglement}
              </div>
              <div className="facture-detail-paiement-item">
                <strong>Type de paiement:</strong> {getPaiementLabel(facture.type_paiement)}
              </div>
              <div className="facture-detail-paiement-item">
                <strong>Échéance:</strong> {new Date(facture.echeance).toLocaleDateString('fr-FR')}
              </div>
              {facture.devise && facture.devise !== 'MGA' && facture.taux_change && (
                <div className="facture-detail-paiement-item">
                  <strong>Taux de change:</strong> 1 {facture.devise} = {facture.taux_change} MGA
                </div>
              )}
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

export default FactureDetailPage;
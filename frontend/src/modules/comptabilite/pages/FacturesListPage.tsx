import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Facture } from '../types';
import { comptabiliteApi } from '../services/api';
import { useAlertDialog } from '../../../core/hooks/useAlertDialog';
import AlertDialog from '../../../core/components/AlertDialog/AlertDialog';
import './FacturesListPage.css';

export const FacturesListPage: React.FC = () => {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'validee' | 'brouillon' | 'annulee' | 'partiellement_payee' | 'payee' | 'en_retard'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'facture' | 'proforma' | 'avoir'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { isOpen, message, title, type, alert, close } = useAlertDialog();

  useEffect(() => {
    loadFactures();
  }, []);

  const loadFactures = async () => {
    try {
      setLoading(true);
      const data = await comptabiliteApi.getFactures();
      console.log('📋 Factures chargées:', data);
      setFactures(data);
    } catch (error) {
      console.error('Erreur chargement factures:', error);
      setFactures([]);
      alert('Erreur lors du chargement des factures', {
        type: 'error',
        title: 'Erreur de chargement'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredFactures = factures.filter(facture => {
    if (filter !== 'all' && facture.statut !== filter) {
      return false;
    }
    if (typeFilter !== 'all' && facture.type_facture !== typeFilter) {
      return false;
    }
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        facture.numero_facture?.toString().includes(searchLower) ||
        facture.nom_tiers?.toLowerCase().includes(searchLower) ||
        (facture as any).numero_tiers?.toString().includes(searchLower)
      );
    }
    return true;
  });

  const getStatutClass = (statut: string) => {
    const classes = {
      validee: 'ms-badge ms-badge-success',
      brouillon: 'ms-badge ms-badge-warning',
      annulee: 'ms-badge ms-badge-error',
      partiellement_payee: 'ms-badge ms-badge-info',
      payee: 'ms-badge ms-badge-success',
      en_retard: 'ms-badge ms-badge-error',
      non_payee: 'ms-badge ms-badge-warning'
    };
    return classes[statut as keyof typeof classes] || 'ms-badge ms-badge-default';
  };

  const getTypeClass = (type: string) => {
    const classes = {
      facture: 'ms-badge ms-badge-primary',
      proforma: 'ms-badge ms-badge-info',
      avoir: 'ms-badge ms-badge-warning'
    };
    return classes[type as keyof typeof classes] || 'ms-badge ms-badge-default';
  };

  const getStatutIcon = (statut: string) => {
    const icons: { [key: string]: string } = {
      validee: '✅',
      brouillon: '📝',
      annulee: '❌',
      partiellement_payee: '🔄',
      payee: '💰',
      en_retard: '⏰',
      non_payee: '💳'
    };
    return icons[statut] || '📄';
  };

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      facture: '🧾',
      proforma: '📋',
      avoir: '🔄'
    };
    return icons[type] || '📄';
  };

  const getStatutLabel = (statut: string) => {
    const labels: { [key: string]: string } = {
      validee: 'Validée',
      brouillon: 'Brouillon',
      annulee: 'Annulée',
      partiellement_payee: 'Partiellement payée',
      payee: 'Payée',
      en_retard: 'En retard',
      non_payee: 'Non payée'
    };
    return labels[statut] || statut;
  };

  const calculerProgressionPaiement = (facture: Facture) => {
    if (!facture.total_ttc || facture.total_ttc === 0) return 0;
    const paye = facture.montant_paye || 0;
    return Math.min(100, (paye / facture.total_ttc) * 100);
  };

  const estEnRetard = (facture: Facture): boolean => {
    if (!facture.date_finale_paiement || facture.statut === 'payee') return false;
    const dateFinale = new Date(facture.date_finale_paiement);
    const aujourdhui = new Date();
    return dateFinale < aujourdhui && (facture.montant_restant || 0) > 0;
  };

  const getJourRestant = (facture: Facture): number | null => {
    if (!facture.date_finale_paiement || facture.statut === 'payee') return null;
    const dateFinale = new Date(facture.date_finale_paiement);
    const aujourdhui = new Date();
    const diffTime = dateFinale.getTime() - aujourdhui.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleValiderFacture = async (numeroFacture: number) => {
    try {
      setLoading(true);
      await comptabiliteApi.validerFacture(numeroFacture);
      alert('Facture validée avec succès!', {
        type: 'success',
        title: 'Succès'
      });
      loadFactures();
    } catch (error: any) {
      alert(`Erreur lors de la validation: ${error.message}`, {
        type: 'error',
        title: 'Erreur'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnnulerFacture = async (numeroFacture: number) => {
    try {
      if (!comptabiliteApi.annulerFacture) {
        alert('Fonction annulerFacture non disponible', {
          type: 'error',
          title: 'Erreur'
        });
        return;
      }

      setLoading(true);
      await comptabiliteApi.annulerFacture(numeroFacture);
      alert('Facture annulée avec succès!', {
        type: 'success',
        title: 'Succès'
      });
      loadFactures();
    } catch (error: any) {
      alert(`Erreur lors de l'annulation: ${error.message}`, {
        type: 'error',
        title: 'Erreur'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="ms-crm-loading">
        <div className="ms-crm-spinner"></div>
        <span>Chargement des factures...</span>
      </div>
    );
  }

  return (
    <div className="ms-crm-container">
      {/* Header Microsoft Style */}
      <div className="ms-crm-header">
        <div className="ms-crm-header-left">
          <div className="ms-crm-title-section">
            <h1 className="ms-crm-page-title">🧾 Factures</h1>
            <p className="ms-crm-subtitle">Gestion de votre facturation et suivi des paiements</p>
          </div>
        </div>
        
        <div className="ms-crm-header-actions">
          <Link 
            to="/comptabilite/factures/nouvelle"
            className="ms-crm-btn ms-crm-btn-primary"
          >
            <span className="ms-crm-icon">➕</span>
            Nouvelle facture
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="ms-crm-content">
        
        {/* Filters and Search Bar */}
        <div className="ms-crm-filters-bar">
          <div className="ms-crm-search-box">
            <span className="ms-crm-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Rechercher par n° facture, client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ms-crm-search-input"
            />
          </div>
          
          <div className="ms-crm-filters">
            <div className="ms-crm-filter-group">
              <label className="ms-crm-filter-label">Statut:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="ms-crm-filter-select"
              >
                <option value="all">📋 Tous les statuts</option>
                <option value="brouillon">📝 Brouillons</option>
                <option value="validee">✅ Validées</option>
                <option value="payee">💰 Payées</option>
                <option value="partiellement_payee">🔄 Partiellement payées</option>
                <option value="en_retard">⏰ En retard</option>
                <option value="annulee">❌ Annulées</option>
              </select>
            </div>

            <div className="ms-crm-filter-group">
              <label className="ms-crm-filter-label">Type:</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="ms-crm-filter-select"
              >
                <option value="all">📄 Tous les types</option>
                <option value="facture">🧾 Factures</option>
                <option value="proforma">📋 Proformas</option>
                <option value="avoir">🔄 Avoirs</option>
              </select>
            </div>

            <div className="ms-crm-stats">
              <span className="ms-crm-stat-badge">
                📊 {filteredFactures.length} facture{filteredFactures.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Factures Grid */}
        <div className="ms-crm-card">
          <div className="ms-crm-table-container">
            {filteredFactures.length > 0 ? (
              <table className="ms-crm-table">
                <thead>
                  <tr>
                    <th className="ms-crm-table-header">N° Facture</th>
                    <th className="ms-crm-table-header">Client/Fournisseur</th>
                    <th className="ms-crm-table-header">Date</th>
                    <th className="ms-crm-table-header">Type</th>
                    <th className="ms-crm-table-header">Montant TTC</th>
                    <th className="ms-crm-table-header">Progression</th>
                    <th className="ms-crm-table-header">Statut</th>
                    <th className="ms-crm-table-header ms-crm-text-center">⚡ Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFactures.map((facture) => {
                    const progression = calculerProgressionPaiement(facture);
                    const enRetard = estEnRetard(facture);
                    const joursRestants = getJourRestant(facture);

                    return (
                      <tr key={facture.numero_facture} className={`ms-crm-table-row ${enRetard ? 'ms-crm-row-warning' : ''}`}>
                        <td className="ms-crm-table-cell">
                          <div className="ms-crm-facture-info">
                            <div className="ms-crm-facture-number">
                              {facture.numero_facture}
                            </div>
                            <div className="ms-crm-facture-devise">
                              {facture.devise}
                            </div>
                          </div>
                        </td>
                        <td className="ms-crm-table-cell">
                          <div className="ms-crm-client-info">
                            <div className="ms-crm-client-name">
                              {facture.nom_tiers}
                            </div>
                            <div className="ms-crm-client-type">
                              {facture.type_tiers}
                            </div>
                            {facture.date_finale_paiement && (
                              <div className="ms-crm-echeance-info">
                                <span className="ms-crm-echeance-label">Échéance:</span>
                                <span className="ms-crm-echeance-date">
                                  {new Date(facture.date_finale_paiement).toLocaleDateString('fr-FR')}
                                </span>
                                {joursRestants !== null && (
                                  <span className={`ms-crm-jours-restants ${joursRestants < 0 ? 'ms-crm-retard' : joursRestants < 7 ? 'ms-crm-warning' : 'ms-crm-normal'}`}>
                                    {joursRestants < 0 ? `${Math.abs(joursRestants)}j retard` : `${joursRestants}j restant`}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="ms-crm-table-cell">
                          <div className="ms-crm-date">
                            {new Date(facture.date).toLocaleDateString('fr-FR')}
                          </div>
                        </td>
                        <td className="ms-crm-table-cell">
                          <div className="ms-crm-type-info">
                            <span className="ms-crm-type-icon">
                              {getTypeIcon(facture.type_facture)}
                            </span>
                            <span className={getTypeClass(facture.type_facture)}>
                              {facture.type_facture}
                            </span>
                          </div>
                        </td>
                        <td className="ms-crm-table-cell ms-crm-text-right">
                          <div className="ms-crm-financial-info">
                            <div className="ms-crm-amount">
                              {facture.total_ttc?.toLocaleString('fr-FR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })} {facture.devise}
                            </div>
                            {(facture.montant_paye || 0) > 0 && (
                              <div className="ms-crm-paye">
                                Payé: {(facture.montant_paye || 0).toLocaleString('fr-FR')} {facture.devise}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="ms-crm-table-cell">
                          <div className="ms-crm-progression">
                            <div className="ms-crm-progression-bar">
                              <div 
                                className={`ms-crm-progression-fill ${progression === 100 ? 'ms-crm-complete' : progression > 0 ? 'ms-crm-partial' : 'ms-crm-empty'}`}
                                style={{ width: `${progression}%` }}
                              />
                            </div>
                            <div className="ms-crm-progression-text">
                              {progression.toFixed(0)}%
                            </div>
                          </div>
                        </td>
                        <td className="ms-crm-table-cell">
                          <div className="ms-crm-statut-info">
                            <span className="ms-crm-statut-icon">
                              {getStatutIcon(facture.statut)}
                            </span>
                            <span className={getStatutClass(facture.statut)}>
                              {getStatutLabel(facture.statut)}
                            </span>
                          </div>
                        </td>
                        <td className="ms-crm-table-cell ms-crm-text-center">
                          <div className="ms-crm-actions-container">
                            <Link
                              to={`/comptabilite/factures/${facture.numero_facture}`}
                              className="ms-crm-btn ms-crm-btn-icon ms-crm-btn-view"
                              title="Voir la facture"
                            >
                              👁️
                            </Link>
                            {facture.statut === 'brouillon' && (
                              <>
                                <Link
                                  to={`/comptabilite/factures/${facture.numero_facture}/edit`}
                                  className="ms-crm-btn ms-crm-btn-icon ms-crm-btn-edit"
                                  title="Modifier la facture"
                                >
                                  ✏️
                                </Link>
                                <button
                                  onClick={() => facture.numero_facture && handleValiderFacture(facture.numero_facture)}
                                  className="ms-crm-btn ms-crm-btn-icon ms-crm-btn-success"
                                  title="Valider la facture"
                                >
                                  ✅
                                </button>
                              </>
                            )}
                            {(facture.statut === 'validee' || facture.statut === 'brouillon') && (
                              <button
                                onClick={() => facture.numero_facture && handleAnnulerFacture(facture.numero_facture)}
                                className="ms-crm-btn ms-crm-btn-icon ms-crm-btn-danger"
                                title="Annuler la facture"
                              >
                                ❌
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="ms-crm-empty-state">
                <div className="ms-crm-empty-icon">🧾</div>
                <h3>Aucune facture trouvée</h3>
                <p>
                  {searchTerm || filter !== 'all' || typeFilter !== 'all'
                    ? 'Aucune facture ne correspond à vos critères de recherche.'
                    : 'Commencez par créer votre première facture.'
                  }
                </p>
                {!searchTerm && filter === 'all' && typeFilter === 'all' && (
                  <Link 
                    to="/comptabilite/factures/nouvelle"
                    className="ms-crm-btn ms-crm-btn-primary"
                  >
                    <span className="ms-crm-icon">➕</span>
                    Créer votre première facture
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        {filteredFactures.length > 0 && (
          <div className="ms-crm-stats-grid">
            <div className="ms-crm-stat-card">
              <div className="ms-crm-stat-icon">💰</div>
              <div className="ms-crm-stat-content">
                <div className="ms-crm-stat-value">
                  {factures.filter(f => f.statut === 'payee').length}
                </div>
                <div className="ms-crm-stat-label">Payées</div>
              </div>
            </div>
            <div className="ms-crm-stat-card">
              <div className="ms-crm-stat-icon">⏰</div>
              <div className="ms-crm-stat-content">
                <div className="ms-crm-stat-value">
                  {factures.filter(f => estEnRetard(f)).length}
                </div>
                <div className="ms-crm-stat-label">En retard</div>
              </div>
            </div>
            <div className="ms-crm-stat-card">
              <div className="ms-crm-stat-icon">📝</div>
              <div className="ms-crm-stat-content">
                <div className="ms-crm-stat-value">
                  {factures.filter(f => f.statut === 'brouillon').length}
                </div>
                <div className="ms-crm-stat-label">Brouillons</div>
              </div>
            </div>
            <div className="ms-crm-stat-card">
              <div className="ms-crm-stat-icon">🔄</div>
              <div className="ms-crm-stat-content">
                <div className="ms-crm-stat-value">
                  {factures.filter(f => f.statut === 'partiellement_payee').length}
                </div>
                <div className="ms-crm-stat-label">Partielles</div>
              </div>
            </div>
          </div>
        )}
      </div>

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

export default FacturesListPage;
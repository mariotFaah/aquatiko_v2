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
    // Filtre par statut
    if (filter !== 'all' && facture.statut !== filter) {
      return false;
    }

    // Filtre par type
    if (typeFilter !== 'all' && facture.type_facture !== typeFilter) {
      return false;
    }

    // Filtre par recherche
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
      validee: 'factures-badge-validee',
      brouillon: 'factures-badge-brouillon',
      annulee: 'factures-badge-annulee',
      partiellement_payee: 'factures-badge-partiel',
      payee: 'factures-badge-payee',
      en_retard: 'factures-badge-retard',
      non_payee: 'factures-badge-non-payee'
    };
    return `${classes[statut as keyof typeof classes] || 'factures-badge-default'} factures-badge`;
  };

  const getTypeClass = (type: string) => {
    const classes = {
      facture: 'factures-badge-facture',
      proforma: 'factures-badge-proforma',
      avoir: 'factures-badge-avoir'
    };
    return `${classes[type as keyof typeof classes] || 'factures-badge-default'} factures-badge`;
  };

  const getPaiementClass = (typePaiement: string = 'comptant') => {
    const classes = {
      comptant: 'factures-paiement-comptant',
      flexible: 'factures-paiement-flexible',
      acompte: 'factures-paiement-acompte',
      echeance: 'factures-paiement-echeance'
    };
    return `${classes[typePaiement as keyof typeof classes] || 'factures-paiement-default'} factures-paiement-badge`;
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

  const getPaiementLabel = (typePaiement: string = 'comptant') => {
    const labels: { [key: string]: string } = {
      comptant: '💳 Comptant',
      flexible: '🔄 Flexible',
      acompte: '💰 Acompte',
      echeance: '📅 Échéance'
    };
    return labels[typePaiement] || typePaiement;
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
      <div className="factures-loading">
        <div className="factures-loading-text">Chargement des factures...</div>
      </div>
    );
  }

  return (
    <div className="factures-list-page">
      

      {/* Filtres et Recherche */}
      <div className="factures-filters">
        <div className="factures-search">
          <input
            type="text"
            placeholder="Rechercher par n° facture, client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="factures-search-input"
          />
        </div>

        <div className="factures-filter-buttons">
          {[
            { key: 'all', label: '📋 Toutes' },
            { key: 'validee', label: '✅ Validées' },
            { key: 'brouillon', label: '📝 Brouillons' },
            { key: 'annulee', label: '❌ Annulées' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`factures-filter-button ${filter === key ? 'active' : 'inactive'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="factures-type-filters">
          {[
            { key: 'all', label: 'Tous types' },
            { key: 'facture', label: 'Factures' },
            { key: 'proforma', label: 'Proformas' },
            { key: 'avoir', label: 'Avoirs' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTypeFilter(key as any)}
              className={`factures-type-button ${typeFilter === key ? 'active' : 'inactive'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <Link
          to="/comptabilite/factures/nouvelle"
          className="factures-new-button"
        >
          + Nouvelle Facture
        </Link>

      {/* Tableau des factures */}
      <div className="factures-table-container">
        <table className="factures-table">
          <thead>
            <tr>
              <th>N° Facture</th>
              <th className="factures-cell-client">Client/Fournisseur</th>
              <th>Date</th>
              <th>Type</th>
              <th>Paiement</th>
              <th>Montant TTC</th>
              <th>Progression</th>
              <th>Statut</th>
              <th className="factures-cell-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFactures.map((facture) => {
              const progression = calculerProgressionPaiement(facture);
              const enRetard = estEnRetard(facture);
              const joursRestants = getJourRestant(facture);

              return (
                <tr key={facture.numero_facture} className={enRetard ? 'factures-row-retard' : ''}>
                  <td className="factures-cell-nowrap">
                    <div className="factures-cell-number">
                      {facture.numero_facture}
                    </div>
                    <div className="factures-cell-devise">
                      {facture.devise} {getDeviseSymbol(facture.devise)}
                    </div>
                  </td>
                  <td className="factures-cell-client">
                    <div className="factures-cell-client-name">
                      {facture.nom_tiers}
                    </div>
                    <div className="factures-cell-client-details">
                      {facture.type_tiers}
                    </div>
                    {facture.date_finale_paiement && (
                      <div className="factures-cell-echeance">
                        Échéance: {new Date(facture.date_finale_paiement).toLocaleDateString('fr-FR')}
                        {joursRestants !== null && (
                          <span className={`factures-jours-restants ${joursRestants < 0 ? 'retard' : joursRestants < 7 ? 'warning' : 'normal'}`}>
                            {joursRestants < 0 ? `${Math.abs(joursRestants)}j de retard` : `${joursRestants}j restant`}
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="factures-cell-nowrap">
                    <div className="factures-cell-date">
                      {new Date(facture.date).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="factures-cell-nowrap">
                    <span className={getTypeClass(facture.type_facture)}>
                      {facture.type_facture}
                    </span>
                  </td>
                  <td className="factures-cell-nowrap">
                    <span className={getPaiementClass(facture.type_paiement)}>
                      {getPaiementLabel(facture.type_paiement)}
                    </span>
                  </td>
                  <td className="factures-cell-nowrap">
                    <div className="factures-cell-amount">
                      {facture.total_ttc?.toLocaleString('fr-FR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })} {getDeviseSymbol(facture.devise)}
                    </div>
                    {(facture.montant_paye || 0) > 0 && (
                      <div className="factures-cell-paye">
                        Payé: {(facture.montant_paye || 0).toLocaleString('fr-FR')} {getDeviseSymbol(facture.devise)}
                      </div>
                    )}
                  </td>
                  <td className="factures-cell-progression">
                    <div className="factures-progression-bar">
                      <div 
                        className={`factures-progression-fill ${progression === 100 ? 'complete' : progression > 0 ? 'partial' : 'empty'}`}
                        style={{ width: `${progression}%` }}
                      />
                    </div>
                    <div className="factures-progression-text">
                      {progression.toFixed(0)}%
                    </div>
                  </td>
                  <td className="factures-cell-nowrap">
                    <span className={getStatutClass(facture.statut)}>
                      {getStatutLabel(facture.statut)}
                    </span>
                  </td>
                  <td className="factures-cell-nowrap">
                    <div className="factures-actions">
                      <Link
                        to={`/comptabilite/factures/${facture.numero_facture}`}
                        className="factures-action-link factures-action-view"
                      >
                        👁️ Voir
                      </Link>
                      {facture.statut === 'brouillon' && (
                        <>
                          <Link
                            to={`/comptabilite/factures/${facture.numero_facture}/edit`}
                            className="factures-action-link factures-action-edit"
                          >
                            ✏️ Modifier
                          </Link>
                          <button
                            onClick={() => facture.numero_facture && handleValiderFacture(facture.numero_facture)}
                            className="factures-action-link factures-action-validate"
                          >
                            ✅ Valider
                          </button>
                        </>
                      )}
                      {(facture.statut === 'validee' || facture.statut === 'brouillon') && (
                        <button
                          onClick={() => facture.numero_facture && handleAnnulerFacture(facture.numero_facture)}
                          className="factures-action-link factures-action-cancel"
                        >
                          ❌ Annuler
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredFactures.length === 0 && (
          <div className="factures-empty">
            <div className="factures-empty-text">
              {searchTerm || filter !== 'all' || typeFilter !== 'all'
                ? 'Aucune facture ne correspond aux critères de recherche'
                : 'Aucune facture trouvée'}
            </div>
            <Link
              to="/comptabilite/factures/nouvelle"
              className="factures-empty-button"
            >
              Créer votre première facture
            </Link>
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

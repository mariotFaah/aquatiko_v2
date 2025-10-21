import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Facture } from '../types';
import { comptabiliteApi } from '../services/api';
import './FacturesListPage.css';

export const FacturesListPage: React.FC = () => {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'validee' | 'brouillon' | 'annulee'>('all');

  useEffect(() => {
    loadFactures();
  }, []);

// Dans FacturesListPage.tsx - améliorer loadFactures
const loadFactures = async () => {
  try {
    setLoading(true);
    const data = await comptabiliteApi.getFactures();
    console.log('📋 Factures chargées:', data); // Debug
    setFactures(data);
  } catch (error) {
    console.error('Erreur chargement factures:', error);
    // En cas d'erreur, définir un tableau vide
    setFactures([]);
    alert('Erreur lors du chargement des factures');
  } finally {
    setLoading(false);
  }
};

  const filteredFactures = factures.filter(facture => {
    if (filter === 'all') return true;
    return facture.statut === filter;
  });

  const getStatutClass = (statut: string) => {
    const classes = {
      validee: 'factures-badge-validee',
      brouillon: 'factures-badge-brouillon',
      annulee: 'factures-badge-annulee'
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

  if (loading) {
    return (
      <div className="factures-loading">
        <div className="factures-loading-text">Chargement des factures...</div>
      </div>
    );
  }

  return (
    <div className="factures-list-page">
      <div className="factures-header">
        <div>
          <h1 className="factures-title">Gestion des Factures</h1>
          <p className="factures-subtitle">Créez et gérez vos factures, proformas et avoirs</p>
        </div>
        <Link
          to="/comptabilite/factures/nouvelle"
          className="factures-new-button"
        >
          + Nouvelle Facture
        </Link>
      </div>

      {/* Filtres */}
      <div className="factures-filters">
        <div className="factures-filter-buttons">
          {[
            { key: 'all', label: 'Toutes' },
            { key: 'validee', label: 'Validées' },
            { key: 'brouillon', label: 'Brouillons' },
            { key: 'annulee', label: 'Annulées' }
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
      </div>

      {/* Tableau des factures */}
      <div className="factures-table-container">
        <table className="factures-table">
          <thead>
            <tr>
              <th>N° Facture</th>
              <th className="factures-cell-client">Client</th>
              <th>Date</th>
              <th>Type</th>
              <th>Montant TTC</th>
              <th>Statut</th>
              <th className="factures-cell-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFactures.map((facture) => (
              <tr key={facture.numero_facture}>
                <td className="factures-cell-nowrap">
                  <div className="factures-cell-number">
                    {facture.numero_facture}
                  </div>
                </td>
                <td className="factures-cell-client">
                  <div className="factures-cell-client-name">
                    {facture.nom_tiers}
                  </div>
                  <div className="factures-cell-client-details">
                    {facture.numero_facture}
                  </div>
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
                  <div className="factures-cell-amount">
                    {facture.total_ttc?.toLocaleString('fr-FR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })} Ar
                  </div>
                </td>
                <td className="factures-cell-nowrap">
                  <span className={getStatutClass(facture.statut)}>
                    {facture.statut}
                  </span>
                </td>
                <td className="factures-cell-nowrap">
                  <div className="factures-actions">
                    <Link
                      to={`/comptabilite/factures/${facture.numero_facture}`}
                      className="factures-action-link factures-action-view"
                    >
                      Voir
                    </Link>
                    <Link
                      to={`/comptabilite/factures/${facture.numero_facture}/edit`}
                      className="factures-action-link factures-action-edit"
                    >
                      Modifier
                    </Link>
                    
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredFactures.length === 0 && (
          <div className="factures-empty">
            <div className="factures-empty-text">
              {filter === 'all' 
                ? 'Aucune facture trouvée' 
                : `Aucune facture avec le statut "${filter}"`}
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
    </div>
  );
};

export default FacturesListPage;
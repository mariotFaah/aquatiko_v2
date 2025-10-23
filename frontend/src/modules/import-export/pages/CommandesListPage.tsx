import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { importExportApi } from '../services/api';
import type { Commande } from '../types';
import './CommandesListPage.css'; // Import du CSS

const CommandesListPage: React.FC = () => {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', statut: '' });

  useEffect(() => {
    loadCommandes();
  }, [filters]);

  const loadCommandes = async () => {
    try {
      setLoading(true);
      const data = await importExportApi.getCommandes(filters);
      setCommandes(data);
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatutColor = (statut: string) => {
    const colors = {
      brouillon: 'statut-brouillon',
      confirmée: 'statut-confirmée',
      expédiée: 'statut-expédiée',
      livrée: 'statut-livrée',
      annulée: 'statut-annulée'
    };
    return colors[statut as keyof typeof colors] || 'statut-brouillon';
  };

  const getTypeIcon = (type: string) => {
    return type === 'import' ? '📥' : '📤';
  };

  if (loading) {
    return (
      <div className="commandes-container">
        <div className="commandes-content">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            Chargement des commandes...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="commandes-container">
      <div className="commandes-content">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Commandes Import/Export</h1>
            <p className="text-gray-600">Gestion des opérations internationales</p>
          </div>
          <Link
            to="/import-export/commandes/nouvelle"
            className="btn-nouvelle-commande"
          >
            + Nouvelle Commande
          </Link>
        </div>

        {/* Filtres */}
        <div className="filtres-section">
          <div className="filtres-grid">
            <div className="filtre-group">
              <label className="filtre-label">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="filtre-select"
              >
                <option value="">Tous les types</option>
                <option value="import">Import</option>
                <option value="export">Export</option>
              </select>
            </div>
            
            <div className="filtre-group">
              <label className="filtre-label">Statut</label>
              <select
                value={filters.statut}
                onChange={(e) => setFilters({ ...filters, statut: e.target.value })}
                className="filtre-select"
              >
                <option value="">Tous les statuts</option>
                <option value="brouillon">Brouillon</option>
                <option value="confirmée">Confirmée</option>
                <option value="expédiée">Expédiée</option>
                <option value="livrée">Livrée</option>
                <option value="annulée">Annulée</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des commandes */}
        <div className="table-container">
          <table className="commandes-table">
            <thead>
              <tr>
                <th>Commande</th>
                <th>Client</th>
                <th>Fournisseur</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {commandes.map((commande) => (
                <tr key={commande.id}>
                  <td>
                    <div className="commande-cell">
                      <span className="commande-icon">{getTypeIcon(commande.type)}</span>
                      <div className="commande-info">
                        <div className="commande-numero">{commande.numero_commande}</div>
                        <div className="commande-type">{commande.type}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-900">{commande.client?.nom}</div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-900">{commande.fournisseur?.nom}</div>
                  </td>
                  <td className="montant-cell">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: commande.devise }).format(commande.montant_total)}
                  </td>
                  <td>
                    <span className={`statut-badge ${getStatutColor(commande.statut)}`}>
                      {commande.statut}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <Link
                        to={`/import-export/commandes/${commande.id}`}
                        className="btn-action btn-voir"
                      >
                        Voir
                      </Link>
                      <Link
                        to={`/import-export/commandes/${commande.id}/edit`}
                        className="btn-action btn-modifier"
                      >
                        Modifier
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {commandes.length === 0 && (
            <div className="empty-state">
              <h3>Aucune commande trouvée</h3>
              <p>Aucune commande ne correspond à vos critères de recherche.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandesListPage;

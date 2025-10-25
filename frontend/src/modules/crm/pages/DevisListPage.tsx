// src/modules/crm/pages/DevisListPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { crmApi } from '../services/api';
import type { Devis, DevisStats } from '../types';
import './DevisListPage.css';

const DevisListPage: React.FC = () => {
  const [devis, setDevis] = useState<Devis[]>([]);
  const [stats, setStats] = useState<DevisStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statutFilter, setStatutFilter] = useState<string>('tous');

  useEffect(() => {
    loadDevis();
    loadStats();
  }, [statutFilter]);

  const loadDevis = async () => {
    try {
      setLoading(true);
      let data: Devis[];
      
      if (statutFilter === 'tous') {
        data = await crmApi.getDevis();
      } else {
        data = await crmApi.getDevisByStatut(statutFilter);
      }
      
      setDevis(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await crmApi.getDevisStats();
      setStats(data);
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'accepte': return 'statut-accepte';
      case 'envoye': return 'statut-envoye';
      case 'brouillon': return 'statut-brouillon';
      case 'refuse': return 'statut-refuse';
      case 'expire': return 'statut-expire';
      default: return 'statut-brouillon';
    }
  };

  if (loading) return <div className="loading-state">Chargement...</div>;
  if (error) return <div className="error-state">Erreur: {error}</div>;

  return (
    <div className="devis-list-container">
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Devis</div>
          <div className="stat-value stat-total">{devis.length}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Devis Acceptés</div>
          <div className="stat-value stat-accepte">
            {stats?.par_statut?.find(s => s.statut === 'accepte')?.count || 0}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Devis Envoyés</div>
          <div className="stat-value stat-envoye">
            {stats?.par_statut?.find(s => s.statut === 'envoye')?.count || 0}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Chiffre d'Affaires</div>
          <div className="stat-value stat-ca">
            {stats?.total_chiffre_affaires ? 
              new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(stats.total_chiffre_affaires)
              : '0 Ar'
            }
          </div>
        </div>
      </div>

      {/* Liste des devis */}
      <div className="devis-list-main">
        <div className="devis-list-header">
          <div className="devis-header-main">
            <div className="devis-title-section">
              <h1>Devis</h1>
              <p className="devis-subtitle">Gestion des propositions commerciales</p>
            </div>
            <div className="devis-controls">
              <select
                value={statutFilter}
                onChange={(e) => setStatutFilter(e.target.value)}
                className="filter-select"
              >
                <option value="tous">Tous les statuts</option>
                <option value="brouillon">Brouillon</option>
                <option value="envoye">Envoyé</option>
                <option value="accepte">Accepté</option>
                <option value="refuse">Refusé</option>
                <option value="expire">Expiré</option>
              </select>
              <button className="new-devis-btn">
                Nouveau devis
              </button>
            </div>
          </div>
        </div>

        <div className="devis-table-container">
          <table className="devis-table">
            <thead>
              <tr>
                <th>Devis</th>
                <th>Client</th>
                <th>Date</th>
                <th>Montant HT</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {devis.map((devis) => (
                <tr key={devis.id_devis}>
                  <td>
                    <div className="devis-info">
                      <h3>{devis.numero_devis}</h3>
                      <div className="devis-description">
                        {devis.objet}
                      </div>
                    </div>
                  </td>
                  <td className="client-name">
                    {devis.client_nom || 'Client inconnu'}
                  </td>
                  <td className="devis-date">
                    {new Date(devis.date_devis).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="devis-montant">
                    {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(devis.montant_ht)}
                  </td>
                  <td>
                    <span className={`statut-badge ${getStatutColor(devis.statut)}`}>
                      {devis.statut}
                    </span>
                  </td>
                  <td>
                    <div className="actions-container">
                      <Link
                        to={`/crm/devis/${devis.id_devis}`}
                        className="action-link"
                      >
                        Voir
                      </Link>
                      <button className="action-button">
                        Modifier
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {devis.length === 0 && (
            <div className="empty-state">
              Aucun devis trouvé
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevisListPage;
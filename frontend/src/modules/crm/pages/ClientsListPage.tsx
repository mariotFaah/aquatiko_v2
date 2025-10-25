// src/modules/crm/pages/ClientsListPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { crmApi } from '../services/api';
import type { Client } from '../types';
import './ClientsListPage.css';

const ClientsListPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categorieFilter, setCategorieFilter] = useState<string>('tous');

  useEffect(() => {
    loadClients();
  }, [categorieFilter]);

  const loadClients = async () => {
    try {
      setLoading(true);
      let data: Client[];
      
      if (categorieFilter === 'tous') {
        data = await crmApi.getClients();
      } else {
        data = await crmApi.getClientsByCategorie(categorieFilter);
      }
      
      setClients(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const getCategorieColor = (categorie?: string) => {
    switch (categorie) {
      case 'client': return 'categorie-client';
      case 'fournisseur': return 'categorie-fournisseur';
      case 'prospect': return 'categorie-prospect';
      case 'partenaire': return 'categorie-partenaire';
      default: return 'categorie-default';
    }
  };

  if (loading) return <div className="loading-state">Chargement...</div>;
  if (error) return <div className="error-state">Erreur: {error}</div>;

  return (
    <div className="clients-list-container">
      <div className="clients-header">
        <div>
          <h1 className="clients-title">Clients</h1>
          <p className="clients-subtitle">Gestion de votre portefeuille clients</p>
        </div>
        <div className="clients-filters">
          <select
            value={categorieFilter}
            onChange={(e) => setCategorieFilter(e.target.value)}
            className="filter-select"
          >
            <option value="tous">Tous les clients</option>
            <option value="client">Clients</option>
            <option value="fournisseur">Fournisseurs</option>
            <option value="prospect">Prospects</option>
            <option value="partenaire">Partenaires</option>
          </select>
        </div>
      </div>

      <div className="clients-table-container">
        <table className="clients-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Catégorie</th>
              <th>Responsable</th>
              <th>CA Annuel</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id_tiers}>
                <td>
                  <div className="client-info">
                    <div className="client-avatar">
                      {client.nom ? client.nom.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div className="client-details">
                      <h3>{client.nom}</h3>
                      <div className="client-contact">
                        {client.email} • {client.telephone}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`categorie-badge ${getCategorieColor(client.categorie)}`}>
                    {client.categorie || 'Non défini'}
                  </span>
                </td>
                <td>{client.responsable_commercial || 'Non assigné'}</td>
                <td>
                  {client.chiffre_affaires_annuel ? 
                    new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(client.chiffre_affaires_annuel)
                    : '-'
                  }
                </td>
                <td>
                  <div className="actions-container">
                    <Link
                      to={`/crm/clients/${client.id_tiers}`}
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
        
        {clients.length === 0 && (
          <div className="empty-state">
            Aucun client trouvé
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsListPage;
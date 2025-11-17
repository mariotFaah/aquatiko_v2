// src/modules/crm/pages/ContratsListPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ContratsListPage.css';

interface Contrat {
  id_contrat: number;
  numero_contrat: string;
  tiers_id: number;
  client_nom: string;
  type_contrat: string;
  date_debut: string;
  date_fin: string;
  statut: 'actif' | 'inactif' | 'resilie' | 'termine';
  montant_ht: number;
  periodicite: string;
}

const ContratsListPage: React.FC = () => {
  const [contrats, setContrats] = useState<Contrat[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtreStatut, setFiltreStatut] = useState<string>('');

  useEffect(() => {
    chargerContrats();
  }, []);

  const chargerContrats = async () => {
    try {
      // TODO: Appel API
      const contratsTest: Contrat[] = [
        {
          id_contrat: 1,
          numero_contrat: 'CT-2024-001',
          tiers_id: 1,
          client_nom: 'Entreprise ABC',
          type_contrat: 'Maintenance',
          date_debut: '2024-01-01',
          date_fin: '2024-12-31',
          statut: 'actif',
          montant_ht: 12000,
          periodicite: 'Mensuel'
        }
      ];
      setContrats(contratsTest);
    } catch (error) {
      console.error('Erreur chargement contrats:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtrerContrats = contrats.filter(contrat =>
    filtreStatut ? contrat.statut === filtreStatut : true
  );

  const getStatutClass = (statut: string) => {
    switch (statut) {
      case 'actif': return 'statut-actif';
      case 'inactif': return 'statut-inactif';
      case 'resilie': return 'statut-resilie';
      case 'termine': return 'statut-termine';
      default: return '';
    }
  };

  if (loading) return <div className="loading">Chargement des contrats...</div>;

  return (
    <div className="contrats-list-page">
      <div className="page-header">
        <h1>Gestion des Contrats</h1>
        <Link to="/crm/contrats/nouveau" className="btn-primary">
          Nouveau Contrat
        </Link>
      </div>

      <div className="filtres-section">
        <div className="filtre-group">
          <label>Filtrer par statut:</label>
          <select 
            value={filtreStatut} 
            onChange={(e) => setFiltreStatut(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
            <option value="resilie">Résilié</option>
            <option value="termine">Terminé</option>
          </select>
        </div>
      </div>

      <div className="contrats-table-container">
        <table className="contrats-table">
          <thead>
            <tr>
              <th>N° Contrat</th>
              <th>Client</th>
              <th>Type</th>
              <th>Date Début</th>
              <th>Date Fin</th>
              <th>Montant HT</th>
              <th>Périodicité</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtrerContrats.map(contrat => (
              <tr key={contrat.id_contrat}>
                <td>{contrat.numero_contrat}</td>
                <td>{contrat.client_nom}</td>
                <td>{contrat.type_contrat}</td>
                <td>{new Date(contrat.date_debut).toLocaleDateString()}</td>
                <td>{contrat.date_fin ? new Date(contrat.date_fin).toLocaleDateString() : '-'}</td>
                <td>{contrat.montant_ht.toLocaleString()} €</td>
                <td>{contrat.periodicite}</td>
                <td>
                  <span className={`statut-badge ${getStatutClass(contrat.statut)}`}>
                    {contrat.statut}
                  </span>
                </td>
                <td>
                  <Link 
                    to={`/crm/contrats/${contrat.id_contrat}`}
                    className="btn-view"
                  >
                    Voir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filtrerContrats.length === 0 && (
          <div className="no-data">
            Aucun contrat trouvé
          </div>
        )}
      </div>
    </div>
  );
};

export default ContratsListPage;
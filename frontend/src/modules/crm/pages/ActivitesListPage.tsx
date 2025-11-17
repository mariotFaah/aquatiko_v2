// src/modules/crm/pages/ActivitesListPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ActivitesListPage.css';

interface Activite {
  id_activite: number;
  tiers_id: number;
  client_nom: string;
  type_activite: string;
  sujet: string;
  description: string;
  date_activite: string;
  date_rappel: string | null;
  statut: 'planifie' | 'realise' | 'annule';
  priorite: 'basse' | 'normal' | 'haute';
  module_lie?: string;
  reference_liee?: string;
}

const ActivitesListPage: React.FC = () => {
  const [activites, setActivites] = useState<Activite[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtres, setFiltres] = useState({
    type: '',
    statut: '',
    priorite: '',
    dateDebut: '',
    dateFin: ''
  });

  useEffect(() => {
    chargerActivites();
  }, []);

  const chargerActivites = async () => {
    try {
      // TODO: Appel API pour activités consolidées
      const activitesTest: Activite[] = [
        {
          id_activite: 1,
          tiers_id: 1,
          client_nom: 'Entreprise ABC',
          type_activite: 'appel',
          sujet: 'Suivi devis maintenance',
          description: 'Appel de suivi pour le devis envoyé la semaine dernière',
          date_activite: '2024-11-16T10:00:00',
          date_rappel: null,
          statut: 'realise',
          priorite: 'normal',
          module_lie: 'crm'
        },
        {
          id_activite: 2,
          tiers_id: 1,
          client_nom: 'Entreprise ABC',
          type_activite: 'facture',
          sujet: 'Facture F-2024-001 impayée',
          description: 'Relance pour facture en retard de paiement',
          date_activite: '2024-11-15T14:30:00',
          date_rappel: '2024-11-20T09:00:00',
          statut: 'planifie',
          priorite: 'haute',
          module_lie: 'comptabilite'
        }
      ];
      setActivites(activitesTest);
    } catch (error) {
      console.error('Erreur chargement activités:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtrerActivites = activites.filter(activite => {
    const matchType = !filtres.type || activite.type_activite === filtres.type;
    const matchStatut = !filtres.statut || activite.statut === filtres.statut;
    const matchPriorite = !filtres.priorite || activite.priorite === filtres.priorite;
    
    let matchDate = true;
    if (filtres.dateDebut) {
      matchDate = new Date(activite.date_activite) >= new Date(filtres.dateDebut);
    }
    if (filtres.dateFin && matchDate) {
      matchDate = new Date(activite.date_activite) <= new Date(filtres.dateFin);
    }
    
    return matchType && matchStatut && matchPriorite && matchDate;
  });

  const getPrioriteClass = (priorite: string) => {
    switch (priorite) {
      case 'haute': return 'priorite-haute';
      case 'normal': return 'priorite-normal';
      case 'basse': return 'priorite-basse';
      default: return '';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'appel': return '📞';
      case 'email': return '✉️';
      case 'reunion': return '👥';
      case 'visite': return '🏢';
      case 'facture': return '🧾';
      case 'commande': return '📦';
      default: return '📝';
    }
  };

  if (loading) return <div className="loading">Chargement des activités...</div>;

  return (
    <div className="activites-list-page">
      <div className="page-header">
        <h1>Activités Clients - Vue 360°</h1>
        <Link to="/crm/activites/nouvelle" className="btn-primary">
          Nouvelle Activité
        </Link>
      </div>

      <div className="filtres-avances">
        <div className="filtre-row">
          <div className="filtre-group">
            <label>Type:</label>
            <select 
              value={filtres.type} 
              onChange={(e) => setFiltres({...filtres, type: e.target.value})}
            >
              <option value="">Tous types</option>
              <option value="appel">Appel</option>
              <option value="email">Email</option>
              <option value="reunion">Réunion</option>
              <option value="visite">Visite</option>
              <option value="facture">Facture</option>
              <option value="commande">Commande</option>
            </select>
          </div>

          <div className="filtre-group">
            <label>Statut:</label>
            <select 
              value={filtres.statut} 
              onChange={(e) => setFiltres({...filtres, statut: e.target.value})}
            >
              <option value="">Tous statuts</option>
              <option value="planifie">Planifié</option>
              <option value="realise">Réalisé</option>
              <option value="annule">Annulé</option>
            </select>
          </div>

          <div className="filtre-group">
            <label>Priorité:</label>
            <select 
              value={filtres.priorite} 
              onChange={(e) => setFiltres({...filtres, priorite: e.target.value})}
            >
              <option value="">Toutes priorités</option>
              <option value="haute">Haute</option>
              <option value="normal">Normale</option>
              <option value="basse">Basse</option>
            </select>
          </div>
        </div>

        <div className="filtre-row">
          <div className="filtre-group">
            <label>Date début:</label>
            <input 
              type="date" 
              value={filtres.dateDebut}
              onChange={(e) => setFiltres({...filtres, dateDebut: e.target.value})}
            />
          </div>

          <div className="filtre-group">
            <label>Date fin:</label>
            <input 
              type="date" 
              value={filtres.dateFin}
              onChange={(e) => setFiltres({...filtres, dateFin: e.target.value})}
            />
          </div>
        </div>
      </div>

      <div className="activites-grid">
        {filtrerActivites.map(activite => (
          <div key={activite.id_activite} className="activite-card">
            <div className="activite-header">
              <span className="type-icon">
                {getTypeIcon(activite.type_activite)}
              </span>
              <div className="activite-infos">
                <h3>{activite.sujet}</h3>
                <span className="client-nom">{activite.client_nom}</span>
              </div>
              <span className={`priorite-badge ${getPrioriteClass(activite.priorite)}`}>
                {activite.priorite}
              </span>
            </div>

            <div className="activite-body">
              <p className="description">{activite.description}</p>
              
              <div className="activite-meta">
                <div className="meta-item">
                  <strong>Date:</strong> 
                  {new Date(activite.date_activite).toLocaleString()}
                </div>
                {activite.date_rappel && (
                  <div className="meta-item">
                    <strong>Rappel:</strong> 
                    {new Date(activite.date_rappel).toLocaleString()}
                  </div>
                )}
                {activite.module_lie && (
                  <div className="meta-item">
                    <strong>Module:</strong> 
                    <span className="module-tag">{activite.module_lie}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="activite-footer">
              <span className={`statut ${activite.statut}`}>
                {activite.statut}
              </span>
              <div className="actions">
                <Link 
                  to={`/crm/activites/${activite.id_activite}`}
                  className="btn-view"
                >
                  Détails
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtrerActivites.length === 0 && (
        <div className="no-data">
          Aucune activité trouvée
        </div>
      )}
    </div>
  );
};

export default ActivitesListPage;
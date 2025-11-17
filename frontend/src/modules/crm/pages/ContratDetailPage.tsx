// src/modules/crm/pages/ContratDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Retirer useNavigate si non utilisé
import crmApi from '../services/api';
import './ContratDetailPage.css';

// Utiliser le même type que l'API pour éviter les incompatibilités
interface Contrat {
  id_contrat: number;
  numero_contrat: string;
  tiers_id: number;
  client_nom: string; // Cette propriété doit exister dans le type Contrat de l'API
  devis_id?: number;
  type_contrat: string;
  date_debut: string;
  date_fin?: string;
  statut: 'actif' | 'inactif' | 'resilie' | 'termine';
  montant_ht: number;
  periodicite: string;
  description: string;
  conditions: string;
  created_at: string;
  updated_at: string;
}

const ContratDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [contrat, setContrat] = useState<Contrat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      chargerContrat(parseInt(id));
    }
  }, [id]);

  const chargerContrat = async (contratId: number) => {
    try {
      setLoading(true);
      const data = await crmApi.getContrat(contratId);
      setContrat(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const changerStatut = async (nouveauStatut: string) => {
    if (!contrat) return;
    
    try {
      await crmApi.updateContratStatut(contrat.id_contrat, nouveauStatut);
      chargerContrat(contrat.id_contrat); // Recharger les données
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du changement de statut');
    }
  };

  const getJoursRestants = (dateFin?: string): number => {
    if (!dateFin) return 0;
    const fin = new Date(dateFin);
    const aujourdhui = new Date();
    const difference = fin.getTime() - aujourdhui.getTime();
    return Math.ceil(difference / (1000 * 3600 * 24));
  };

  // Fonction pour exporter en PDF (placeholder)
  const exporterPDF = () => {
    // TODO: Implémenter l'export PDF
    alert('Fonctionnalité d\'export PDF à implémenter');
  };

  if (loading) return <div className="loading">Chargement du contrat...</div>;
  if (error) return <div className="error">Erreur: {error}</div>;
  if (!contrat) return <div className="error">Contrat non trouvé</div>;

  const joursRestants = getJoursRestants(contrat.date_fin);

  return (
    <div className="contrat-detail-page">
      <div className="page-header">
        <div className="header-left">
          <Link to="/crm/contrats" className="back-link">
            ← Retour aux contrats
          </Link>
          <h1>Contrat {contrat.numero_contrat}</h1>
          <p className="client-name">{contrat.client_nom}</p>
        </div>
        <div className="header-actions">
          <Link 
            to={`/crm/contrats/${contrat.id_contrat}/modifier`}
            className="btn-secondary"
          >
            Modifier
          </Link>
          <button 
            className="btn-primary"
            onClick={exporterPDF}
          >
            Exporter PDF
          </button>
        </div>
      </div>

      <div className="contrat-content">
        {/* En-tête du contrat */}
        <div className="contrat-header">
          <div className="statut-section">
            <span className={`statut-badge ${contrat.statut}`}>
              {contrat.statut}
            </span>
            {contrat.date_fin && (
              <div className="jours-restants">
                {joursRestants > 0 ? (
                  <span className="jours-positif">{joursRestants} jours restants</span>
                ) : (
                  <span className="jours-negatif">Expiré depuis {Math.abs(joursRestants)} jours</span>
                )}
              </div>
            )}
          </div>
          
          <div className="actions-rapides">
            <h3>Actions rapides</h3>
            <div className="actions-buttons">
              {contrat.statut === 'actif' && (
                <>
                  <button 
                    onClick={() => changerStatut('resilie')}
                    className="btn-warning"
                  >
                    Résilier
                  </button>
                  <button 
                    onClick={() => changerStatut('termine')}
                    className="btn-info"
                  >
                    Marquer terminé
                  </button>
                </>
              )}
              {contrat.statut === 'inactif' && (
                <button 
                  onClick={() => changerStatut('actif')}
                  className="btn-success"
                >
                  Activer
                </button>
              )}
              {(contrat.statut === 'resilie' || contrat.statut === 'termine') && (
                <button 
                  onClick={() => changerStatut('actif')}
                  className="btn-success"
                >
                  Réactiver
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Informations principales */}
        <div className="info-grid">
          <div className="info-card">
            <h3>Informations du contrat</h3>
            <div className="info-list">
              <div className="info-item">
                <label>Type de contrat:</label>
                <span>{contrat.type_contrat}</span>
              </div>
              <div className="info-item">
                <label>Date de début:</label>
                <span>{new Date(contrat.date_debut).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="info-item">
                <label>Date de fin:</label>
                <span>{contrat.date_fin ? new Date(contrat.date_fin).toLocaleDateString('fr-FR') : 'Non définie'}</span>
              </div>
              <div className="info-item">
                <label>Périodicité:</label>
                <span>{contrat.periodicite}</span>
              </div>
              <div className="info-item">
                <label>Montant HT:</label>
                <span className="montant">{contrat.montant_ht.toLocaleString('fr-FR')} €</span>
              </div>
            </div>
          </div>

          {/* Description et conditions */}
          <div className="description-card">
            <h3>Description</h3>
            <p>{contrat.description || 'Aucune description'}</p>
          </div>

          {contrat.conditions && (
            <div className="conditions-card">
              <h3>Conditions particulières</h3>
              <p>{contrat.conditions}</p>
            </div>
          )}
        </div>

        {/* Liens vers documents associés */}
        <div className="documents-associes">
          <h3>Documents associés</h3>
          <div className="documents-list">
            {contrat.devis_id && (
              <Link 
                to={`/crm/devis/${contrat.devis_id}`}
                className="document-link"
              >
                📋 Devis associé
              </Link>
            )}
            <button className="document-link" onClick={() => alert('Fonctionnalité à implémenter')}>
              🧾 Factures
            </button>
            <button className="document-link" onClick={() => alert('Fonctionnalité à implémenter')}>
              📊 Rapports d'activité
            </button>
          </div>
        </div>

        {/* Métadonnées */}
        <div className="metadata">
          <div className="metadata-item">
            <strong>Créé le:</strong> 
            {new Date(contrat.created_at).toLocaleString('fr-FR')}
          </div>
          <div className="metadata-item">
            <strong>Modifié le:</strong> 
            {new Date(contrat.updated_at).toLocaleString('fr-FR')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContratDetailPage;
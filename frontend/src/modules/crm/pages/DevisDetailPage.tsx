// src/modules/crm/pages/DevisDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { crmApi } from '../services/api';
import type { Devis } from '../types';
import './DevisDetailPage.css';

const DevisDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [devis, setDevis] = useState<Devis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadDevis();
    }
  }, [id]);

  const loadDevis = async () => {
    try {
      setLoading(true);
      const data = await crmApi.getDevisById(parseInt(id!));
      setDevis(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
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
  if (!devis) return <div className="error-state">Devis non trouvé</div>;

  return (
    <div className="devis-detail-container">
      {/* En-tête du devis */}
      <div className="devis-header-card">
        <div className="devis-header-content">
          <div className="devis-title-section">
            <div className="devis-title-row">
              <h1 className="devis-title">{devis.numero_devis}</h1>
              <span className={`statut-badge ${getStatutColor(devis.statut)}`}>
                {devis.statut.toUpperCase()}
              </span>
            </div>
            <p className="devis-objet">{devis.objet}</p>
          </div>
          <div className="devis-montant-section">
            <div className="devis-montant-ht">
              {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(devis.montant_ht)}
            </div>
            <div className="devis-montant-label">HT</div>
          </div>
        </div>
      </div>

      <div className="devis-detail-grid">
        {/* Informations principales */}
        <div className="devis-main-content">
          {/* Informations client */}
          <div className="devis-info-card">
            <h2 className="devis-info-title">Client</h2>
            <div className="devis-info-content">
              <div className="info-row">
                <span className="info-label">Nom:</span> {devis.client_nom}
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span> {devis.client_email}
              </div>
              <div className="info-row">
                <span className="info-label">Téléphone:</span> {devis.client_telephone}
              </div>
              <div className="info-row">
                <span className="info-label">Adresse:</span> {devis.client_adresse}
              </div>
            </div>
          </div>

          {/* Détails du devis */}
          <div className="devis-info-card">
            <h2 className="devis-info-title">Détails du devis</h2>
            <div className="devis-details-grid">
              <div className="detail-item">
                <span className="detail-label">Date d'émission:</span>
                <div className="detail-value">
                  {new Date(devis.date_devis).toLocaleDateString('fr-FR')}
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-label">Date de validité:</span>
                <div className="detail-value">
                  {devis.date_validite ? 
                    new Date(devis.date_validite).toLocaleDateString('fr-FR') : 
                    'Non spécifiée'
                  }
                </div>
              </div>
            </div>
            
            {devis.conditions && (
              <div className="devis-notes-section">
                <span className="notes-label">Conditions:</span>
                <p className="notes-content">{devis.conditions}</p>
              </div>
            )}
            
            {devis.notes && (
              <div className="devis-notes-section">
                <span className="notes-label">Notes:</span>
                <p className="notes-content">{devis.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions et résumé */}
        <div className="devis-sidebar">
          {/* Résumé financier */}
          <div className="devis-info-card">
            <h2 className="devis-info-title">Résumé financier</h2>
            <div className="financial-summary">
              <div className="financial-row">
                <span className="financial-label">Montant HT:</span>
                <span className="financial-value">
                  {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(devis.montant_ht)}
                </span>
              </div>
              <div className="financial-row">
                <span className="financial-label">TVA (20%):</span>
                <span className="financial-value">
                  {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(devis.montant_ttc - devis.montant_ht)}
                </span>
              </div>
              <div className="financial-row total-row">
                <span className="financial-label total-label">Montant TTC:</span>
                <span className="financial-value total-value">
                  {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(devis.montant_ttc)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="devis-info-card">
            <h2 className="devis-info-title">Actions</h2>
            <div className="actions-grid">
              <button className="btn btn-primary">
                Modifier le devis
              </button>
              
              {devis.statut === 'brouillon' && (
                <button className="btn btn-success">
                  Envoyer au client
                </button>
              )}
              
              {devis.statut === 'envoye' && (
                <div className="actions-group">
                  <button className="btn btn-success">
                    Marquer comme accepté
                  </button>
                  <button className="btn btn-danger">
                    Marquer comme refusé
                  </button>
                </div>
              )}
              
              <button className="btn btn-secondary">
                Télécharger PDF
              </button>
              
              <button className="btn btn-outline-danger">
                Supprimer le devis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevisDetailPage;
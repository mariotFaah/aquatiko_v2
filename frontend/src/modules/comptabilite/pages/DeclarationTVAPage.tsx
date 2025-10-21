// src/modules/comptabilite/pages/DeclarationTVAPage.tsx - VERSION CORRIGÉE
import React, { useState, useEffect } from 'react';
import { rapportApi } from '../services/rapportApi';
import type { RapportTVA } from '../types';
import MontantDevise from '../components/MontantDevise/MontantDevise';
import './DeclarationTVAPage.css';

export const DeclarationTVAPage: React.FC = () => {
  const [tva, setTva] = useState<RapportTVA>({
    tva_collectee: 0,
    tva_deductable: 0,
    tva_a_payer: 0
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    date_debut: '2024-01-01',
    date_fin: '2024-12-31'
  });

  const loadTVA = async () => {
    setLoading(true);
    try {
      const data = await rapportApi.getTVA(filters.date_debut, filters.date_fin);
      setTva(data);
    } catch (error) {
      console.error('Erreur chargement TVA:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTVA();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    loadTVA();
  };

  return (
    <div className="declaration-tva-page">
      <div className="page-header">
        <h1>Déclaration TVA</h1>
        <p>Calcul et déclaration de la TVA - Données réelles du backend</p>
      </div>

      <div className="filters-section">
        <form onSubmit={handleGenerate} className="filters-form">
          <div className="filter-group">
            <label>Période du</label>
            <input
              type="date"
              value={filters.date_debut}
              onChange={(e) => handleFilterChange('date_debut', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>au</label>
            <input
              type="date"
              value={filters.date_fin}
              onChange={(e) => handleFilterChange('date_fin', e.target.value)}
            />
          </div>

          <button type="submit" className="generate-button">
            Générer la déclaration
          </button>
        </form>
      </div>

      {loading ? (
        <div className="loading">Génération de la déclaration TVA...</div>
      ) : (
        <div className="tva-container">
          <div className="tva-section tva-collectee">
            <h2>TVA COLLECTÉE</h2>
            <div className="tva-amount">
              <MontantDevise montant={tva.tva_collectee} devise="MGA" />
            </div>
            <div className="tva-description">
              TVA facturée à vos clients
            </div>
          </div>

          <div className="tva-section tva-deductible">
            <h2>TVA DÉDUCTIBLE</h2>
            <div className="tva-amount">
              <MontantDevise montant={tva.tva_deductable} devise="MGA" />
            </div>
            <div className="tva-description">
              TVA payée à vos fournisseurs
            </div>
          </div>

          <div className={`tva-resultat ${tva.tva_a_payer >= 0 ? 'tva-a-payer' : 'credit-tva'}`}>
            <h2>{tva.tva_a_payer >= 0 ? 'TVA À PAYER' : 'CRÉDIT DE TVA'}</h2>
            <div className="tva-montant-final">
              <MontantDevise montant={Math.abs(tva.tva_a_payer)} devise="MGA" />
            </div>
            <div className="tva-indicator">
              {tva.tva_a_payer >= 0 ? "À reverser à l'État" : 'Crédit à reporter'}
            </div>
          </div>

          <div className="tva-details">
            <h3>Détails de la période</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Période :</span>
                <span className="detail-value">{filters.date_debut} à {filters.date_fin}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Nombre d'écritures :</span>
                <span className="detail-value">{(tva as any).nombre_ecritures || 0}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Statut :</span>
                <span className={`detail-value status ${tva.tva_a_payer === 0 ? 'neutre' : tva.tva_a_payer > 0 ? 'a-payer' : 'credit'}`}>
                  {tva.tva_a_payer === 0 ? 'Équilibré' : tva.tva_a_payer > 0 ? 'À déclarer' : 'Crédit'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeclarationTVAPage;

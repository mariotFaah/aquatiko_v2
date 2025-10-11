// src/modules/comptabilite/pages/PaiementsListPage.tsx - VERSION CORRIGÉE
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Paiement, Facture } from '../types';
import { paiementApi } from '../services/paiementApi';
import { comptabiliteApi } from '../services/api';
import './PaiementsListPage.css';

export const PaiementsListPage: React.FC = () => {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [factures, setFactures] = useState<Facture[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'validé' | 'en_attente' | 'annulé'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [facturesData, paiementsData] = await Promise.all([
        comptabiliteApi.getFactures(),
        paiementApi.getPaiements() // ✅ UTILISER L'API RÉELLE
      ]);
      
      setFactures(facturesData);
      setPaiements(paiementsData);
    } catch (error) {
      console.error('Erreur chargement données:', error);
      // En cas d'erreur API, utiliser les données simulées
      const facturesData = await comptabiliteApi.getFactures();
      setFactures(facturesData);
      setPaiements(await simulerPaiements());
    } finally {
      setLoading(false);
    }
  };

  // Fonction de simulation SECOURS seulement
  const simulerPaiements = async (): Promise<Paiement[]> => {
    return [
      {
        id_paiement: 1,
        numero_facture: 1,
        date_paiement: '2025-10-09',
        montant: 50000,
        mode_paiement: 'virement',
        reference: 'VIR-001',
        statut: 'validé',
        devise: 'MGA',
        taux_change: 1,
        created_at: '2025-10-09T10:00:00Z'
      },
      {
        id_paiement: 2,
        numero_facture: 2,
        date_paiement: '2025-10-08',
        montant: 75000,
        mode_paiement: 'chèque',
        reference: 'CHQ-001',
        statut: 'en_attente',
        devise: 'MGA',
        taux_change: 1,
        created_at: '2025-10-08T14:30:00Z'
      }
    ];
  };

  // Fonction pour valider un paiement
  const handleValiderPaiement = async (idPaiement: number) => {
    try {
      const paiementValide = await paiementApi.validerPaiement(idPaiement);
      setPaiements(prev => prev.map(p => 
        p.id_paiement === idPaiement ? { ...p, ...paiementValide } : p
      ));
    } catch (error) {
      console.error('Erreur validation paiement:', error);
      alert('Erreur lors de la validation du paiement');
    }
  };

  // Fonction pour annuler un paiement
  const handleAnnulerPaiement = async (idPaiement: number) => {
    try {
      const paiementAnnule = await paiementApi.annulerPaiement(idPaiement);
      setPaiements(prev => prev.map(p => 
        p.id_paiement === idPaiement ? { ...p, ...paiementAnnule } : p
      ));
    } catch (error) {
      console.error('Erreur annulation paiement:', error);
      alert('Erreur lors de l\'annulation du paiement');
    }
  };

  const filteredPaiements = paiements.filter(paiement => {
    if (filter === 'all') return true;
    return paiement.statut === filter;
  });

  const getStatutClass = (statut: string) => {
    const classes = {
      'validé': 'paiements-badge-valide',
      'en_attente': 'paiements-badge-attente',
      'annulé': 'paiements-badge-annule'
    };
    return `${classes[statut as keyof typeof classes] || 'paiements-badge-default'} paiements-badge`;
  };

  const getModePaiementClass = (mode: string) => {
    const classes = {
      'virement': 'paiements-badge-virement',
      'chèque': 'paiements-badge-cheque',
      'espèce': 'paiements-badge-espece',
      'carte': 'paiements-badge-carte'
    };
    return `${classes[mode as keyof typeof classes] || 'paiements-badge-default'} paiements-badge`;
  };

  // CORRECTION: Ajouter la fonction pour obtenir le nom du client depuis la facture
  const getNomClient = (numeroFacture: number): string => {
    const facture = factures.find(f => f.numero_facture === numeroFacture);
    return facture?.nom_tiers || `Facture #${numeroFacture}`;
  };

  if (loading) {
    return (
      <div className="paiements-loading">
        <div className="paiements-loading-text">Chargement des paiements...</div>
      </div>
    );
  }

  return (
    <div className="paiements-list-page">
      <div className="paiements-header">
        <div>
          <h1 className="paiements-title">Gestion des Paiements</h1>
          <p className="paiements-subtitle">Suivez et gérez tous vos paiements clients et fournisseurs</p>
        </div>
        <Link
          to="/comptabilite/paiements/nouveau"
          className="paiements-new-button"
        >
          + Nouveau Paiement
        </Link>
      </div>

      {/* Statistiques rapides */}
      <div className="paiements-stats">
        <div className="paiements-stat-card">
          <div className="paiements-stat-value">{paiements.length}</div>
          <div className="paiements-stat-label">Total Paiements</div>
        </div>
        <div className="paiements-stat-card">
          <div className="paiements-stat-value">
            {paiements.filter(p => p.statut === 'validé').length}
          </div>
          <div className="paiements-stat-label">Validés</div>
        </div>
        <div className="paiements-stat-card">
          <div className="paiements-stat-value">
            {paiements.filter(p => p.statut === 'en_attente').length}
          </div>
          <div className="paiements-stat-label">En Attente</div>
        </div>
        <div className="paiements-stat-card">
          <div className="paiements-stat-value">
            {paiements
              .filter(p => p.statut === 'validé')
              .reduce((sum, p) => sum + p.montant, 0)
              .toLocaleString('fr-FR')} Ar
          </div>
          <div className="paiements-stat-label">Montant Total</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="paiements-filters">
        <div className="paiements-filter-buttons">
          {[
            { key: 'all', label: 'Tous' },
            { key: 'validé', label: 'Validés' },
            { key: 'en_attente', label: 'En Attente' },
            { key: 'annulé', label: 'Annulés' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`paiements-filter-button ${filter === key ? 'active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau des paiements */}
      <div className="paiements-table-container">
        <table className="paiements-table">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Facture/Client</th>
              <th>Date</th>
              <th>Montant</th>
              <th>Mode</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPaiements.map((paiement) => (
              <tr key={paiement.id_paiement}>
                <td>
                  <div className="paiements-cell-reference">
                    {paiement.reference || `PAY-${paiement.id_paiement}`}
                  </div>
                </td>
                <td>
                  <div className="paiements-cell-facture">
                    <div>Facture #{paiement.numero_facture}</div>
                    <div className="paiements-cell-client">
                      {getNomClient(paiement.numero_facture)}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="paiements-cell-date">
                    {new Date(paiement.date_paiement).toLocaleDateString('fr-FR')}
                  </div>
                </td>
                <td>
                  <div className="paiements-cell-amount">
                    {paiement.montant.toLocaleString('fr-FR')} {paiement.devise}
                  </div>
                </td>
                <td>
                  <span className={getModePaiementClass(paiement.mode_paiement)}>
                    {paiement.mode_paiement}
                  </span>
                </td>
                <td>
                  <span className={getStatutClass(paiement.statut)}>
                    {paiement.statut}
                  </span>
                </td>
                <td>
                  <div className="paiements-actions">
                    {paiement.statut === 'en_attente' && (
                      <>
                        <button 
                          className="paiements-action-valider"
                          onClick={() => handleValiderPaiement(paiement.id_paiement!)}
                        >
                          Valider
                        </button>
                        <button 
                          className="paiements-action-annuler"
                          onClick={() => handleAnnulerPaiement(paiement.id_paiement!)}
                        >
                          Annuler
                        </button>
                      </>
                    )}
                    {paiement.statut !== 'en_attente' && (
                      <span className="paiements-action-none">
                        Aucune action
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPaiements.length === 0 && (
          <div className="paiements-empty">
            <div className="paiements-empty-text">
              {filter === 'all' 
                ? 'Aucun paiement enregistré' 
                : `Aucun paiement avec le statut "${filter}"`}
            </div>
            <Link
              to="/comptabilite/paiements/nouveau"
              className="paiements-empty-button"
            >
              Enregistrer votre premier paiement
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaiementsListPage;
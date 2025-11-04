import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { importExportApi } from '../services/api';
import type { Commande, CalculMarge } from '../types';
import MargeIndicator from '../components/MargeIndicator/MargeIndicator';
import StatutBadge from '../components/StatutBadge/StatutBadge';
import './AnalysesMargePage.css';

interface AnalyseData {
  commandes: Commande[];
  marges: Map<number, CalculMarge>;
  loading: boolean;
}

const AnalysesMargePage: React.FC = () => {
  const [analyseData, setAnalyseData] = useState<AnalyseData>({
    commandes: [],
    marges: new Map(),
    loading: true
  });
  const [filtres, setFiltres] = useState({
    periode: '30j',
    type: 'tous',
    statut: 'tous'
  });

  useEffect(() => {
    chargerDonnees();
  }, [filtres]);

  const chargerDonnees = async () => {
    try {
      setAnalyseData(prev => ({ ...prev, loading: true }));
      
      const commandes = await importExportApi.getCommandes();
      const marges = new Map<number, CalculMarge>();

      // Charger les marges pour chaque commande
      for (const commande of commandes) {
        try {
          const marge = await importExportApi.calculerMarge(commande.id);
          marges.set(commande.id, marge);
        } catch (error) {
          console.warn(`Marge non disponible pour la commande ${commande.id}`);
        }
      }

      setAnalyseData({
        commandes: filtrerCommandes(commandes),
        marges,
        loading: false
      });
    } catch (error) {
      console.error('Erreur chargement analyses:', error);
      setAnalyseData(prev => ({ ...prev, loading: false }));
    }
  };

  const filtrerCommandes = (commandes: Commande[]): Commande[] => {
    return commandes.filter(commande => {
      // Filtre par type
      if (filtres.type !== 'tous' && commande.type !== filtres.type) {
        return false;
      }
      
      // Filtre par statut
      if (filtres.statut !== 'tous' && commande.statut !== filtres.statut) {
        return false;
      }
      
      // Filtre par période (simplifié)
      if (filtres.periode !== 'tous') {
        const dateCommande = new Date(commande.date_commande);
        const maintenant = new Date();
        const differenceJours = (maintenant.getTime() - dateCommande.getTime()) / (1000 * 3600 * 24);
        
        switch (filtres.periode) {
          case '7j': return differenceJours <= 7;
          case '30j': return differenceJours <= 30;
          case '90j': return differenceJours <= 90;
          default: return true;
        }
      }
      
      return true;
    });
  };

  // Calcul des statistiques globales
  const calculerStatistiques = () => {
    const { commandes, marges } = analyseData;
    
    let totalCA = 0;
    let totalCouts = 0;
    let totalMarge = 0;
    const margesParType = new Map<string, number[]>();
    const meilleuresMarges: { commande: Commande; marge: CalculMarge }[] = [];
    const moinsBonnesMarges: { commande: Commande; marge: CalculMarge }[] = [];

    commandes.forEach(commande => {
      const marge = marges.get(commande.id);
      if (marge) {
        totalCA += marge.chiffre_affaires;
        totalCouts += marge.total_couts;
        totalMarge += marge.marge_brute;

        // Regroupement par type
        if (!margesParType.has(commande.type)) {
          margesParType.set(commande.type, []);
        }
        margesParType.get(commande.type)?.push(marge.taux_marge);

        // Top performances
        if (marge.taux_marge > 0) {
          meilleuresMarges.push({ commande, marge });
          moinsBonnesMarges.push({ commande, marge });
        }
      }
    });

    // Trier les meilleures et moins bonnes marges
    meilleuresMarges.sort((a, b) => b.marge.taux_marge - a.marge.taux_marge);
    moinsBonnesMarges.sort((a, b) => a.marge.taux_marge - b.marge.taux_marge);

    return {
      totalCommandes: commandes.length,
      totalCA,
      totalCouts,
      totalMarge,
      tauxMargeMoyen: totalCA > 0 ? (totalMarge / totalCA) * 100 : 0,
      margesParType: Array.from(margesParType.entries()).map(([type, taux]) => ({
        type,
        moyenne: taux.reduce((a, b) => a + b, 0) / taux.length,
        count: taux.length
      })),
      topPerformances: meilleuresMarges.slice(0, 5),
      moinsPerformantes: moinsBonnesMarges.slice(0, 5)
    };
  };

  const stats = calculerStatistiques();

  if (analyseData.loading) {
    return (
      <div className="analyses-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Chargement des analyses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analyses-container">
      <div className="analyses-content">
        
        {/* En-tête */}
        <div className="analyses-header">
          <div className="header-main">
            <h1 className="page-title">Analyses de Marge Avancées</h1>
            <p className="page-subtitle">
              Analyse comparative et tendances des marges par produit, client et corridor
            </p>
          </div>
          <div className="header-actions">
            <Link to="/import-export/commandes" className="btn-secondary">
              📋 Retour aux commandes
            </Link>
          </div>
        </div>

        {/* Filtres */}
        <div className="filtres-section">
          <h3 className="section-title">Filtres d'Analyse</h3>
          <div className="filtres-grid">
            <div className="filtre-group">
              <label>Période</label>
              <select
                value={filtres.periode}
                onChange={(e) => setFiltres(prev => ({ ...prev, periode: e.target.value }))}
              >
                <option value="7j">7 derniers jours</option>
                <option value="30j">30 derniers jours</option>
                <option value="90j">90 derniers jours</option>
                <option value="tous">Toute période</option>
              </select>
            </div>

            <div className="filtre-group">
              <label>Type</label>
              <select
                value={filtres.type}
                onChange={(e) => setFiltres(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="tous">Tous les types</option>
                <option value="import">Import</option>
                <option value="export">Export</option>
              </select>
            </div>

            <div className="filtre-group">
              <label>Statut</label>
              <select
                value={filtres.statut}
                onChange={(e) => setFiltres(prev => ({ ...prev, statut: e.target.value }))}
              >
                <option value="tous">Tous statuts</option>
                <option value="livrée">Livrée</option>
                <option value="expédiée">Expédiée</option>
                <option value="confirmée">Confirmée</option>
              </select>
            </div>
          </div>
        </div>

        {/* KPI Globaux */}
        <div className="kpi-section">
          <h3 className="section-title">Indicateurs de Performance Globaux</h3>
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-icon">📊</div>
              <div className="kpi-content">
                <div className="kpi-value">{stats.totalCommandes}</div>
                <div className="kpi-label">Commandes analysées</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">💰</div>
              <div className="kpi-content">
                <div className="kpi-value">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 0,
                  }).format(stats.totalCA)}
                </div>
                <div className="kpi-label">Chiffre d'affaires total</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">📈</div>
              <div className="kpi-content">
                <div className="kpi-value">{stats.tauxMargeMoyen.toFixed(1)}%</div>
                <div className="kpi-label">Taux de marge moyen</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">🎯</div>
              <div className="kpi-content">
                <div className="kpi-value">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 0,
                  }).format(stats.totalMarge)}
                </div>
                <div className="kpi-label">Marge brute totale</div>
              </div>
            </div>
          </div>
        </div>

        {/* Analyse par type */}
        {stats.margesParType.length > 0 && (
          <div className="analyse-type-section">
            <h3 className="section-title">Performance par Type d'Opération</h3>
            <div className="type-grid">
              {stats.margesParType.map(({ type, moyenne, count }) => (
                <div key={type} className="type-card">
                  <div className="type-header">
                    <span className="type-icon">
                      {type === 'import' ? '📥' : '📤'}
                    </span>
                    <span className="type-name">
                      {type === 'import' ? 'Import' : 'Export'}
                    </span>
                  </div>
                  <div className="type-stats">
                    <div className="type-marge">
                      <MargeIndicator
                        margeBrute={moyenne * 1000} // Approximation pour l'affichage
                        chiffreAffaires={10000} // Valeur de référence
                        showTaux={true}
                        size="sm"
                      />
                    </div>
                    <div className="type-details">
                      <div className="type-moyenne">{moyenne.toFixed(1)}%</div>
                      <div className="type-count">{count} commandes</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top performances */}
        <div className="performances-section">
          <div className="performances-grid">
            
            {/* Meilleures performances */}
            <div className="performance-column">
              <h4 className="column-title">🏆 Top Performances</h4>
              <div className="performance-list">
                {stats.topPerformances.map(({ commande, marge }, index) => (
                  <div key={commande.id} className="performance-item positive">
                    <div className="performance-rank">#{index + 1}</div>
                    <div className="performance-info">
                      <div className="performance-numero">{commande.numero_commande}</div>
                      <div className="performance-client">{commande.client?.nom}</div>
                    </div>
                    <div className="performance-marge">
                      <div className="marge-taux">+{marge.taux_marge.toFixed(1)}%</div>
                      <div className="marge-montant">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR',
                        }).format(marge.marge_brute)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Moins bonnes performances */}
            <div className="performance-column">
              <h4 className="column-title">📉 À Optimiser</h4>
              <div className="performance-list">
                {stats.moinsPerformantes.map(({ commande, marge }, index) => (
                  <div key={commande.id} className="performance-item negative">
                    <div className="performance-rank">#{index + 1}</div>
                    <div className="performance-info">
                      <div className="performance-numero">{commande.numero_commande}</div>
                      <div className="performance-client">{commande.client?.nom}</div>
                    </div>
                    <div className="performance-marge">
                      <div className="marge-taux">{marge.taux_marge.toFixed(1)}%</div>
                      <div className="marge-montant">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR',
                        }).format(marge.marge_brute)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Détail des commandes analysées */}
        <div className="commandes-section">
          <h3 className="section-title">Détail des Commandes Analysées</h3>
          <div className="commandes-table-container">
            <table className="analyses-table">
              <thead>
                <tr>
                  <th>Commande</th>
                  <th>Client</th>
                  <th>Type</th>
                  <th>Statut</th>
                  <th>Chiffre d'Affaires</th>
                  <th>Marge Brute</th>
                  <th>Taux Marge</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {analyseData.commandes.map(commande => {
                  const marge = analyseData.marges.get(commande.id);
                  return (
                    <tr key={commande.id}>
                      <td>
                        <div className="commande-cell">
                          <div className="commande-numero">{commande.numero_commande}</div>
                          <div className="commande-date">
                            {new Date(commande.date_commande).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </td>
                      <td>{commande.client?.nom}</td>
                      <td>
                        <span className={`type-badge ${commande.type}`}>
                          {commande.type === 'import' ? '📥 Import' : '📤 Export'}
                        </span>
                      </td>
                      <td>
                        <StatutBadge statut={commande.statut} type="commande" />
                      </td>
                      <td className="montant">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: commande.devise,
                        }).format(commande.montant_total)}
                      </td>
                      <td className="montant">
                        {marge ? (
                          <span className={marge.marge_brute >= 0 ? 'positive' : 'negative'}>
                            {new Intl.NumberFormat('fr-FR', {
                              style: 'currency',
                              currency: commande.devise,
                            }).format(marge.marge_brute)}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="taux">
                        {marge ? (
                          <span className={`taux-badge ${marge.taux_marge >= 20 ? 'high' : marge.taux_marge >= 10 ? 'medium' : 'low'}`}>
                            {marge.taux_marge.toFixed(1)}%
                          </span>
                        ) : '-'}
                      </td>
                      <td>
                        <div className="actions-cell">
                          <Link
                            to={`/import-export/commandes/${commande.id}/marge`}
                            className="btn-action"
                            title="Voir analyse détaillée"
                          >
                            📊
                          </Link>
                          <Link
                            to={`/import-export/commandes/${commande.id}`}
                            className="btn-action"
                            title="Voir commande"
                          >
                            👁️
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {analyseData.commandes.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h4>Aucune commande trouvée</h4>
                <p>Aucune commande ne correspond à vos critères de filtrage.</p>
              </div>
            )}
          </div>
        </div>

        {/* Insights et recommandations */}
        <div className="insights-section">
          <h3 className="section-title">💡 Insights et Recommandations</h3>
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-icon">🎯</div>
              <div className="insight-content">
                <h4>Optimisation des Coûts</h4>
                <p>
                  {stats.moinsPerformantes.length > 0 
                    ? `Concentrez-vous sur l'optimisation des ${stats.moinsPerformantes.length} commandes les moins rentables`
                    : 'Toutes vos commandes présentent une bonne rentabilité'
                  }
                </p>
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-icon">📈</div>
              <div className="insight-content">
                <h4>Tendances</h4>
                <p>
                  {stats.tauxMargeMoyen >= 20 
                    ? 'Excellente performance globale - Maintenez cette trajectoire'
                    : stats.tauxMargeMoyen >= 10
                    ? 'Performance correcte - Potentiel d\'amélioration identifié'
                    : 'Marge moyenne faible - Analyse corrective recommandée'
                  }
                </p>
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-icon">🚀</div>
              <div className="insight-content">
                <h4>Opportunités</h4>
                <p>
                  {stats.topPerformances.length > 0
                    ? `Répliquez les stratégies de vos ${stats.topPerformances.length} meilleures performances`
                    : 'Analysez les facteurs de succès de vos opérations'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalysesMargePage;
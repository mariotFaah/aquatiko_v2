// src/modules/crm/pages/CRMPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CRMPage.css';
import { crmApi } from '../services/api';
import type { Client, Devis, Relance, DevisStats, RelanceStats, ActiviteConsolidee } from '../types';

const CRMPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [devis, setDevis] = useState<Devis[]>([]);
  const [relances, setRelances] = useState<Relance[]>([]);
  const [devisStats, setDevisStats] = useState<DevisStats>({ 
    par_statut: [], 
    total_chiffre_affaires: 0 
  });
  const [relanceStats, setRelanceStats] = useState<RelanceStats>({
    total: 0,
    par_statut: { en_attente: 0, envoyee: 0, traitee: 0, annulee: 0 },
    par_type: { paiement: 0, contrat: 0, echeance: 0, commerciale: 0 },
    par_canal: { email: 0, telephone: 0, courrier: 0, sms: 0 }
  });
  const [recentActivities, setRecentActivities] = useState<ActiviteConsolidee[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Chargement parallèle des données avec utilisation explicite des types
      const [clientsData, devisData, relancesData, devisStatsData, relanceStatsData, activitiesData] = await Promise.all([
        crmApi.getClients(),
        crmApi.getDevis(),
        crmApi.getRelances(),
        crmApi.getDevisStats(),
        crmApi.getRelancesStats(),
        crmApi.getClientActivitesConsolidees(1) // Client 1 pour démonstration
      ]);

      // Utilisation explicite de tous les types importés
      setClients(clientsData as Client[]);
      setDevis(devisData as Devis[]);
      setRelances(relancesData as Relance[]);
      setDevisStats(devisStatsData as DevisStats);
      setRelanceStats(relanceStatsData as RelanceStats);
      setRecentActivities((activitiesData as ActiviteConsolidee[]).slice(0, 5));
      
    } catch (error) {
      console.error('Erreur chargement dashboard CRM:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction utilitaire pour trouver les clients avec le plus de devis
  const getTopClients = (clients: Client[]): Client[] => {
    return clients
      .filter(client => client.stats && client.stats.total_devis > 0)
      .sort((a, b) => (b.stats?.total_devis || 0) - (a.stats?.total_devis || 0))
      .slice(0, 3);
  };

  // Fonction pour trouver les devis urgents (expirant bientôt)
  const getDevisUrgents = (devis: Devis[]): Devis[] => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return devis.filter(devis => {
      if (!devis.date_validite || devis.statut !== 'envoye') return false;
      const validite = new Date(devis.date_validite);
      return validite <= nextWeek && validite >= today;
    });
  };

  // Fonction pour trouver les relances prioritaires
  const getRelancesPrioritaires = (relances: Relance[]): Relance[] => {
    return relances.filter(relance => 
      relance.statut === 'en_attente' && 
      relance.type_relance === 'paiement'
    ).slice(0, 3);
  };

  // Navigation handlers avec utilisation des types
  const handleCreateDevis = () => {
    navigate('/crm/devis/nouveau');
  };

  const handleCreateClient = () => {
    navigate('/crm/clients/nouveau');
  };

  const handleViewClient = (client: Client) => {
    navigate(`/crm/clients/${client.id_tiers}`);
  };

  const handleViewDevis = (devis: Devis) => {
    navigate(`/crm/devis/${devis.id_devis}`);
  };

  if (loading) {
    return (
      <div className="crm-container">
        <div className="crm-loading">
          <div className="loading-spinner"></div>
          <p>Chargement du tableau de bord CRM...</p>
        </div>
      </div>
    );
  }

  const topClients = getTopClients(clients);
  const devisUrgents = getDevisUrgents(devis);
  const relancesPrioritaires = getRelancesPrioritaires(relances);

  return (
    <div className="crm-container">
      {/* En-tête */}
      <div className="crm-header">
        <div className="crm-header-content">
          <h1 className="crm-title">Tableau de Bord CRM</h1>
          <p className="crm-subtitle">
            Gestion complète de la relation client - Vue 360°
          </p>
        </div>
        <div className="crm-actions">
          <button className="btn btn-primary" onClick={handleCreateDevis}>
            <i className="icon-plus"></i>
            Nouveau Devis
          </button>
          <button className="btn btn-secondary" onClick={handleCreateClient}>
            <i className="icon-users"></i>
            Nouveau Client
          </button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="crm-metrics-grid">
        <div className="metric-card">
          <div className="metric-icon clients">
            <i className="icon-user"></i>
          </div>
          <div className="metric-content">
            <h3 className="metric-value">{clients.length}</h3>
            <p className="metric-label">Clients Actifs</p>
            <div className="metric-trend">
              <span className="trend-up">+{clients.filter(c => c.categorie === 'client').length} clients</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon devis">
            <i className="icon-file"></i>
          </div>
          <div className="metric-content">
            <h3 className="metric-value">{devis.length}</h3>
            <p className="metric-label">Devis en Cours</p>
            <div className="metric-breakdown">
              {devisStats.par_statut?.map((item, index) => (
                <span key={index} className={`statut-badge statut-${item.statut}`}>
                  {item.count} {item.statut}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon relances">
            <i className="icon-bell"></i>
          </div>
          <div className="metric-content">
            <h3 className="metric-value">{relances.length}</h3>
            <p className="metric-label">Relances Actives</p>
            <div className="metric-detail">
              <span className="relance-en-attente">
                {relanceStats.par_statut?.en_attente || 0} en attente
              </span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon activites">
            <i className="icon-activity"></i>
          </div>
          <div className="metric-content">
            <h3 className="metric-value">{recentActivities.length}</h3>
            <p className="metric-label">Activités Récentes</p>
            <div className="metric-subtext">
              Dernières 24h
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="crm-content-grid">
        {/* Section activités récentes */}
        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">Activités Récentes</h3>
            <Link to="/crm/activites" className="card-link">
              Voir tout
            </Link>
          </div>
          <div className="card-content">
            {recentActivities.length > 0 ? (
              <div className="activities-list">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      <i className={`icon-${activity.type_activite || 'default'}`}></i>
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">{activity.sujet}</div>
                      <div className="activity-meta">
                        <span className="activity-type">{activity.type_activite}</span>
                        <span className="activity-date">
                          {new Date(activity.date_activite).toLocaleDateString()}
                        </span>
                        {activity.montant && (
                          <span className="activity-montant">
                            {activity.montant.toLocaleString()} {activity.devise}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`activity-statut statut-${activity.statut}`}>
                      {activity.statut}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>Aucune activité récente</p>
              </div>
            )}
          </div>
        </div>

        {/* Section clients importants */}
        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">Clients Importants</h3>
            <Link to="/crm/clients" className="card-link">
              Voir tout
            </Link>
          </div>
          <div className="card-content">
            {topClients.length > 0 ? (
              <div className="clients-list">
                {topClients.map((client: Client) => (
                  <div 
                    key={client.id_tiers} 
                    className="client-item"
                    onClick={() => handleViewClient(client)}
                  >
                    <div className="client-avatar">
                      {client.nom.charAt(0).toUpperCase()}
                    </div>
                    <div className="client-info">
                      <div className="client-name">{client.nom}</div>
                      <div className="client-stats">
                        {client.stats?.total_devis || 0} devis • 
                        {client.stats?.total_contrats || 0} contrats
                      </div>
                    </div>
                    <div className="client-ca">
                      {client.chiffre_affaires_annuel ? 
                        `${(client.chiffre_affaires_annuel / 1000000).toFixed(1)}M` : 
                        'N/A'
                      }
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>Aucun client important</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Deuxième ligne de contenu */}
      <div className="crm-content-grid">
        {/* Section devis urgents */}
        <div className="content-card urgent-card">
          <div className="card-header">
            <h3 className="card-title">Devis à Traiter</h3>
            <span className="badge badge-warning">
              {devisUrgents.length} urgents
            </span>
          </div>
          <div className="card-content">
            {devisUrgents.length > 0 ? (
              <div className="devis-list">
                {devisUrgents.map((devis: Devis) => (
                  <div 
                    key={devis.id_devis} 
                    className="devis-item"
                    onClick={() => handleViewDevis(devis)}
                  >
                    <div className="devis-info">
                      <div className="devis-numero">{devis.numero_devis}</div>
                      <div className="devis-client">{devis.client_nom}</div>
                      <div className="devis-montant">
                        {devis.montant_ht.toLocaleString()} € HT
                      </div>
                    </div>
                    <div className="devis-date">
                      Expire le {new Date(devis.date_validite!).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>Aucun devis urgent</p>
              </div>
            )}
          </div>
        </div>

        {/* Section relances prioritaires */}
        <div className="content-card urgent-relances">
          <div className="card-header">
            <h3 className="card-title">Relances Prioritaires</h3>
            <span className="badge badge-warning">
              {relancesPrioritaires.length} requises
            </span>
          </div>
          <div className="card-content">
            {relancesPrioritaires.length > 0 ? (
              <div className="relances-list">
                {relancesPrioritaires.map((relance: Relance) => (
                  <div key={relance.id_relance} className="relance-item">
                    <div className="relance-type">{relance.type_relance}</div>
                    <div className="relance-objet">{relance.objet}</div>
                    <div className="relance-client">{relance.client?.nom}</div>
                    <div className="relance-date">
                      {new Date(relance.date_relance).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>Aucune relance prioritaire</p>
              </div>
            )}
            <div className="relance-actions">
              <button 
                className="btn btn-warning"
                onClick={async () => {
                  try {
                    await crmApi.genererRelancesAutomatiques();
                    loadDashboardData(); // Recharger les données
                  } catch (error) {
                    console.error('Erreur génération relances:', error);
                  }
                }}
              >
                <i className="icon-zap"></i>
                Générer Relances Auto
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section navigation rapide */}
      <div className="content-card">
        <div className="card-header">
          <h3 className="card-title">Navigation Rapide</h3>
        </div>
        <div className="card-content">
          <div className="quick-nav-grid">
            <Link to="/crm/clients" className="nav-card">
              <div className="nav-icon">
                <i className="icon-users"></i>
              </div>
              <div className="nav-content">
                <h4>Clients</h4>
                <p>Gestion des fiches clients</p>
              </div>
            </Link>

            <Link to="/crm/devis" className="nav-card">
              <div className="nav-icon">
                <i className="icon-file-text"></i>
              </div>
              <div className="nav-content">
                <h4>Devis</h4>
                <p>Création et suivi des devis</p>
              </div>
            </Link>

            <Link to="/crm/contrats" className="nav-card">
              <div className="nav-icon">
                <i className="icon-contract"></i>
              </div>
              <div className="nav-content">
                <h4>Contrats</h4>
                <p>Gestion des contrats de prestation</p>
              </div>
            </Link>

            <Link to="/crm/relances" className="nav-card">
              <div className="nav-icon">
                <i className="icon-bell"></i>
              </div>
              <div className="nav-content">
                <h4>Relances</h4>
                <p>Suivi des relances commerciales</p>
              </div>
            </Link>

            <Link to="/crm/activites" className="nav-card">
              <div className="nav-icon">
                <i className="icon-activity"></i>
              </div>
              <div className="nav-content">
                <h4>Activités</h4>
                <p>Historique des interactions</p>
              </div>
            </Link>

            <Link to="/crm/rapports" className="nav-card">
              <div className="nav-icon">
                <i className="icon-bar-chart"></i>
              </div>
              <div className="nav-content">
                <h4>Rapports</h4>
                <p>Statistiques et analyses</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMPage;
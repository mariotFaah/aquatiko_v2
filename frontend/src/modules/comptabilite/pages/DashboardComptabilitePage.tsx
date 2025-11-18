// src/modules/comptabilite/pages/DashboardComptabilitePage.tsx
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import './DashboardComptabilitePage.css';

interface DashboardStats {
  chiffreAffaires: number;
  facturesImpayees: number;
  clientsActifs: number;
  paiementsEnRetard: number;
  tresorerie: number;
  ratioEncaisse: number;
}

interface FactureEnAttente {
  id: number;
  numero: string;
  client: string;
  montant: number;
  dateEcheance: string;
  joursRetard: number;
}

interface IndicateurCle {
  label: string;
  valeur: string | number;
  variation: number;
  tendance: 'up' | 'down' | 'stable';
  icone: React.ReactNode;
}

const DashboardComptabilitePage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    chiffreAffaires: 0,
    facturesImpayees: 0,
    clientsActifs: 0,
    paiementsEnRetard: 0,
    tresorerie: 0,
    ratioEncaisse: 0
  });
  
  const [facturesEnAttente, setFacturesEnAttente] = useState<FactureEnAttente[]>([]);
  const [indicateurs, setIndicateurs] = useState<IndicateurCle[]>([]);
  const [periode, setPeriode] = useState<'semaine' | 'mois' | 'trimestre'>('mois');

  useEffect(() => {
    chargerDonneesDashboard();
  }, [periode]);

  const chargerDonneesDashboard = async () => {
    try {
      // Simulation des données - À remplacer par vos appels API
      const donneesStats: DashboardStats = {
        chiffreAffaires: 12500000,
        facturesImpayees: 8,
        clientsActifs: 45,
        paiementsEnRetard: 1250000,
        tresorerie: 3500000,
        ratioEncaisse: 72
      };

      const donneesFactures: FactureEnAttente[] = [
        {
          id: 1,
          numero: 'FAC-2024-001',
          client: 'SARL Ocean Products',
          montant: 450000,
          dateEcheance: '2024-01-15',
          joursRetard: 5
        },
        {
          id: 2,
          numero: 'FAC-2024-002',
          client: 'Aqua Market',
          montant: 320000,
          dateEcheance: '2024-01-10',
          joursRetard: 10
        }
      ];

      const donneesIndicateurs: IndicateurCle[] = [
        {
          label: 'Chiffre d\'affaires',
          valeur: '12.5M MGA',
          variation: 8.2,
          tendance: 'up',
          icone: <TrendingUp className="icon" />
        },
        {
          label: 'Trésorerie',
          valeur: '3.5M MGA',
          variation: 12.5,
          tendance: 'up',
          icone: <DollarSign className="icon" />
        },
        {
          label: 'Clients actifs',
          valeur: 45,
          variation: 5,
          tendance: 'up',
          icone: <Users className="icon" />
        },
        {
          label: 'Taux d\'encaissement',
          valeur: '72%',
          variation: -2.1,
          tendance: 'down',
          icone: <BarChart3 className="icon" />
        }
      ];

      setStats(donneesStats);
      setFacturesEnAttente(donneesFactures);
      setIndicateurs(donneesIndicateurs);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    }
  };

  const getCouleurTendance = (tendance: string) => {
    switch (tendance) {
      case 'up': return 'var(--success)';
      case 'down': return 'var(--error)';
      default: return 'var(--warning)';
    }
  };

  const getCouleurJoursRetard = (jours: number) => {
    if (jours <= 5) return 'var(--warning)';
    if (jours <= 15) return 'var(--error-light)';
    return 'var(--error)';
  };

  return (
    <div className="dashboard-comptabilite">
      {/* En-tête du Dashboard */}
      <div className="dashboard-header">
        <h1>Tableau de Bord Comptabilité</h1>
        <div className="period-selector">
          <button 
            className={periode === 'semaine' ? 'active' : ''}
            onClick={() => setPeriode('semaine')}
          >
            Semaine
          </button>
          <button 
            className={periode === 'mois' ? 'active' : ''}
            onClick={() => setPeriode('mois')}
          >
            Mois
          </button>
          <button 
            className={periode === 'trimestre' ? 'active' : ''}
            onClick={() => setPeriode('trimestre')}
          >
            Trimestre
          </button>
        </div>
      </div>

      {/* Indicateurs Clés */}
      <div className="indicateurs-grid">
        {indicateurs.map((indicateur, index) => (
          <div key={index} className="indicateur-card">
            <div className="indicateur-header">
              <div className="indicateur-icon" style={{ color: getCouleurTendance(indicateur.tendance) }}>
                {indicateur.icone}
              </div>
              <div className={`variation ${indicateur.tendance}`}>
                {indicateur.variation > 0 ? '+' : ''}{indicateur.variation}%
              </div>
            </div>
            <div className="indicateur-valeur">{indicateur.valeur}</div>
            <div className="indicateur-label">{indicateur.label}</div>
          </div>
        ))}
      </div>

      {/* Grille Principale */}
      <div className="dashboard-grid">
        {/* Carte Trésorerie */}
        <div className="dashboard-card tresorerie-card">
          <div className="card-header">
            <h3>💳 Trésorerie</h3>
            <span className="statut-badge positif">+12.5%</span>
          </div>
          <div className="tresorerie-montant">{stats.tresorerie.toLocaleString()} MGA</div>
          <div className="tresorerie-details">
            <div className="detail-item">
              <span>Disponible</span>
              <span>2.8M MGA</span>
            </div>
            <div className="detail-item">
              <span>En attente</span>
              <span>0.7M MGA</span>
            </div>
          </div>
        </div>

        {/* Alertes et Actions Rapides */}
        <div className="dashboard-card alertes-card">
          <div className="card-header">
            <h3>🚨 Alertes</h3>
            <span className="badge-urgent">{stats.facturesImpayees}</span>
          </div>
          <div className="alertes-list">
            <div className="alerte-item urgent">
              <AlertTriangle className="alerte-icon" />
              <div className="alerte-content">
                <span className="alerte-titre">{stats.facturesImpayees} factures impayées</span>
                <span className="alerte-sous-titre">{stats.paiementsEnRetard.toLocaleString()} MGA en retard</span>
              </div>
            </div>
            <div className="alerte-item warning">
              <Clock className="alerte-icon" />
              <div className="alerte-content">
                <span className="alerte-titre">3 échéances cette semaine</span>
                <span className="alerte-sous-titre">Total: 850K MGA</span>
              </div>
            </div>
            <div className="alerte-item success">
              <CheckCircle className="alerte-icon" />
              <div className="alerte-content">
                <span className="alerte-titre">12 paiements validés</span>
                <span className="alerte-sous-titre">Aujourd'hui</span>
              </div>
            </div>
          </div>
        </div>

        {/* Factures en Attente */}
        <div className="dashboard-card factures-card">
          <div className="card-header">
            <h3>📋 Factures en Attente</h3>
            <span className="badge-attention">{facturesEnAttente.length}</span>
          </div>
          <div className="factures-list">
            {facturesEnAttente.map(facture => (
              <div key={facture.id} className="facture-item">
                <div className="facture-info">
                  <div className="facture-numero">{facture.numero}</div>
                  <div className="facture-client">{facture.client}</div>
                </div>
                <div className="facture-details">
                  <div 
                    className="jours-retard"
                    style={{ color: getCouleurJoursRetard(facture.joursRetard) }}
                  >
                    +{facture.joursRetard} jours
                  </div>
                  <div className="facture-montant">
                    {facture.montant.toLocaleString()} MGA
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Graphique CA et Statistiques */}
        <div className="dashboard-card stats-card">
          <div className="card-header">
            <h3>📈 Chiffre d'Affaires</h3>
            <span className="statut-badge positif">+8.2%</span>
          </div>
          <div className="ca-montant">{stats.chiffreAffaires.toLocaleString()} MGA</div>
          <div className="graphique-placeholder">
            {/* À remplacer par un vrai graphique Chart.js ou Recharts */}
            <div className="graphique-simulation">
              <div className="barre" style={{ height: '80%' }}></div>
              <div className="barre" style={{ height: '60%' }}></div>
              <div className="barre" style={{ height: '90%' }}></div>
              <div className="barre" style={{ height: '75%' }}></div>
              <div className="barre" style={{ height: '85%' }}></div>
              <div className="barre" style={{ height: '95%' }}></div>
            </div>
          </div>
        </div>

        {/* Actions Rapides */}
        <div className="dashboard-card actions-card">
          <div className="card-header">
            <h3>⚡ Actions Rapides</h3>
          </div>
          <div className="actions-grid">
            <button className="action-btn primary">
              <FileText />
              Nouvelle Facture
            </button>
            <button className="action-btn secondary">
              <Users />
              Ajouter Client
            </button>
            <button className="action-btn success">
              <TrendingUp />
              Voir Rapports
            </button>
            <button className="action-btn warning">
              <Clock />
              Échéances
            </button>
          </div>
        </div>

        {/* Dernières Activités */}
        <div className="dashboard-card activites-card">
          <div className="card-header">
            <h3>🕒 Activités Récentes</h3>
          </div>
          <div className="activites-list">
            <div className="activite-item">
              <div className="activite-icon success">✓</div>
              <div className="activite-content">
                <span>Facture FAC-2024-015 validée</span>
                <span className="activite-date">Il y a 2 min</span>
              </div>
              <div className="activite-montant">+250K MGA</div>
            </div>
            <div className="activite-item">
              <div className="activite-icon warning">!</div>
              <div className="activite-content">
                <span>Paiement en retard détecté</span>
                <span className="activite-date">Il y a 15 min</span>
              </div>
              <div className="activite-montant">-180K MGA</div>
            </div>
            <div className="activite-item">
              <div className="activite-icon info">+</div>
              <div className="activite-content">
                <span>Nouveau client ajouté</span>
                <span className="activite-date">Il y a 1 h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardComptabilitePage;
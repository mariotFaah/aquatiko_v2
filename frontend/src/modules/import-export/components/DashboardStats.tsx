// Composant de statistiques pour le dashboard
import React from 'react';
import { Link } from 'react-router-dom';
import type { Commande } from '../types';
import './DashboardStats.css';

interface DashboardStatsProps {
  commandes: Commande[];
  loading: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ commandes, loading }) => {
  if (loading) {
    return (
      <div className="dashboard-stats loading">
        <div className="stat-skeleton"></div>
        <div className="stat-skeleton"></div>
        <div className="stat-skeleton"></div>
        <div className="stat-skeleton"></div>
      </div>
    );
  }

  const stats = {
    total: commandes.length,
    import: commandes.filter(c => c.type === 'import').length,
    export: commandes.filter(c => c.type === 'export').length,
    enCours: commandes.filter(c => 
      c.statut === 'confirmée' || c.statut === 'expédiée'
    ).length,
    livree: commandes.filter(c => c.statut === 'livrée').length,
    chiffreAffaires: commandes.reduce((sum, c) => sum + c.montant_total, 0),
  };

  const statCards = [
    {
      title: 'Total Commandes',
      value: stats.total,
      icon: '📋',
      color: 'blue',
      link: '/import-export/commandes'
    },
    {
      title: 'Import',
      value: stats.import,
      icon: '📥',
      color: 'green',
      link: '/import-export/commandes?type=import'
    },
    {
      title: 'Export',
      value: stats.export,
      icon: '📤',
      color: 'purple',
      link: '/import-export/commandes?type=export'
    },
    {
      title: 'En Cours',
      value: stats.enCours,
      icon: '🔄',
      color: 'orange',
      link: '/import-export/commandes?statut=confirmée'
    },
    {
      title: 'Livrée',
      value: stats.livree,
      icon: '✅',
      color: 'teal',
      link: '/import-export/commandes?statut=livrée'
    },
    {
      title: 'Chiffre Affaires',
      value: new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
      }).format(stats.chiffreAffaires),
      icon: '💰',
      color: 'indigo',
      link: '/import-export/analyses'
    }
  ];

  return (
    <div className="dashboard-stats">
      {statCards.map((stat, index) => (
        <Link key={index} to={stat.link} className={`stat-card stat-${stat.color}`}>
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-content">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-title">{stat.title}</div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default DashboardStats;
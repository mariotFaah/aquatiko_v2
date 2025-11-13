import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Commande } from '../types';
import './DashboardStats.css';

interface DashboardStatsProps {
  commandes: Commande[];
  loading: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ commandes, loading }) => {
  const [showAll, setShowAll] = useState(false);

  // Filtrer les commandes valides (avec lignes et CA > 0)
  const commandesValides = commandes.filter(commande => 
    commande.lignes && 
    commande.lignes.length > 0 && 
    parseFloat(commande.montant_total.toString()) > 0
  );

  if (loading) {
    return (
      <div className="dashboard-stats loading">
        <div className="stat-skeleton"></div>
        <div className="stat-skeleton"></div>
        <div className="stat-skeleton"></div>
        <div className="stat-skeleton"></div>
        <div className="stat-skeleton"></div>
        <div className="stat-skeleton"></div>
        <div className="stat-skeleton"></div>
        <div className="stat-skeleton"></div>
      </div>
    );
  }

  // Calcul des statistiques AVEC les vraies données
  const stats = {
    // Commandes valides seulement
    total: commandesValides.length,
    
    // Types d'opérations
    import: commandesValides.filter(c => c.type === 'import').length,
    export: commandesValides.filter(c => c.type === 'export').length,
    
    // Statuts avec les vrais workflows
    brouillon: commandesValides.filter(c => c.statut === 'brouillon').length,
    confirmee: commandesValides.filter(c => c.statut === 'confirmée').length,
    expediee: commandesValides.filter(c => c.statut === 'expédiée').length,
    livree: commandesValides.filter(c => c.statut === 'livrée').length,
    annulee: commandesValides.filter(c => c.statut === 'annulée').length,
    
    // Chiffre d'affaires réel (seulement commandes valides)
    chiffreAffaires: commandesValides.reduce((sum, c) => sum + parseFloat(c.montant_total.toString()), 0),
    
    // Commandes avec expédition créée
    avecExpedition: commandesValides.filter(c => c.expedition).length,
    
    // Commandes avec coûts logistiques
    avecCouts: commandesValides.filter(c => 
      c.couts_logistiques && 
      (parseFloat(c.couts_logistiques.fret_maritime?.toString() || '0') > 0 ||
       parseFloat(c.couts_logistiques.fret_aerien?.toString() || '0') > 0 ||
       parseFloat(c.couts_logistiques.assurance?.toString() || '0') > 0)
    ).length
  };

  // Déterminer la devise principale pour l'affichage
  const getDevisePrincipale = () => {
    const devises = commandesValides.reduce((acc, cmd) => {
      acc[cmd.devise] = (acc[cmd.devise] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(devises).reduce((a, b) => 
      devises[a] > devises[b] ? a : b, 'EUR'
    );
  };

  const devisePrincipale = getDevisePrincipale();

  // Cartes principales (toujours visibles)
  const mainStatCards = [
    {
      title: 'Commandes Actives',
      value: stats.total,
      icon: '📋',
      color: 'blue',
      link: '/import-export/commandes',
      description: 'Commandes avec articles',
      priority: 1
    },
    {
      title: 'Chiffre d\'Affaires',
      value: new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: devisePrincipale,
        minimumFractionDigits: 0,
      }).format(stats.chiffreAffaires),
      icon: '💰',
      color: 'indigo',
      link: '/import-export/analyses',
      description: `${stats.total} commandes valides`,
      priority: 1
    },
    {
      title: 'Opérations Import',
      value: stats.import,
      icon: '📥',
      color: 'green',
      link: '/import-export/commandes?type=import',
      description: `${stats.import} commandes`,
      priority: 1
    },
    {
      title: 'Opérations Export',
      value: stats.export,
      icon: '📤',
      color: 'purple',
      link: '/import-export/commandes?type=export',
      description: `${stats.export} commandes`,
      priority: 1
    }
  ];

  // Cartes secondaires (visibles quand showAll = true)
  const secondaryStatCards = [
    {
      title: 'En Préparation',
      value: stats.brouillon + stats.confirmee,
      icon: '🔄',
      color: 'orange',
      link: '/import-export/commandes?statut=brouillon,confirmée',
      description: `${stats.brouillon} brouillon + ${stats.confirmee} confirmée`,
      priority: 2
    },
    {
      title: 'Expédiées/Livrées',
      value: stats.expediee + stats.livree,
      icon: '🚚',
      color: 'teal',
      link: '/import-export/expeditions',
      description: `${stats.expediee} expédiée + ${stats.livree} livrée`,
      priority: 2
    },
    {
      title: 'Avec Expédition',
      value: stats.avecExpedition,
      icon: '📦',
      color: 'cyan',
      link: '/import-export/expeditions',
      description: `${Math.round((stats.avecExpedition / stats.total) * 100)}% des commandes`,
      priority: 2
    },
    {
      title: 'Avec Coûts Logistiques',
      value: stats.avecCouts,
      icon: '🧾',
      color: 'amber',
      link: '/import-export/analyses',
      description: 'Coûts enregistrés',
      priority: 2
    }
  ];


  return (
    <div className="dashboard-stats">
      <div className="stats-header">
        <h3 className="stats-title">Tableau de Bord Import-Export</h3>
        <p className="stats-subtitle">
          {stats.total} commandes actives • {devisePrincipale}
        </p>
      </div>
      
      {/* Grille principale - 4 cartes en haut */}
      <div className="stats-grid main-grid">
        {mainStatCards.map((stat, index) => (
          <Link key={index} to={stat.link} className={`stat-card stat-${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-title">{stat.title}</div>
              {stat.description && (
                <div className="stat-description">{stat.description}</div>
              )}
            </div>
            <div className="stat-arrow">→</div>
          </Link>
        ))}
      </div>

      {/* Grille secondaire - 4 cartes en bas (conditionnelle) */}
      {showAll && (
        <div className="stats-grid secondary-grid">
          {secondaryStatCards.map((stat, index) => (
            <Link key={index} to={stat.link} className={`stat-card stat-${stat.color}`}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-title">{stat.title}</div>
                {stat.description && (
                  <div className="stat-description">{stat.description}</div>
                )}
              </div>
              <div className="stat-arrow">→</div>
            </Link>
          ))}
        </div>
      )}

      {/* Bouton toggle pour afficher/masquer les cartes secondaires */}
      <div className="stats-toggle">
        <button 
          className="toggle-btn"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? '▲ Voir moins' : '▼ Voir plus d\'indicateurs'}
        </button>
      </div>

      {/* Alertes et indicateurs importants */}
      <div className="stats-alerts">
        {stats.brouillon > 0 && (
          <div className="alert-item warning">
            <span className="alert-icon">📝</span>
            <span className="alert-text">
              {stats.brouillon} commande(s) en brouillon à finaliser
            </span>
          </div>
        )}
        
        {stats.avecExpedition < stats.total && (
          <div className="alert-item info">
            <span className="alert-icon">🚚</span>
            <span className="alert-text">
              {stats.total - stats.avecExpedition} commande(s) sans expédition
            </span>
          </div>
        )}

        {stats.annulee > 0 && (
          <div className="alert-item error">
            <span className="alert-icon">❌</span>
            <span className="alert-text">
              {stats.annulee} commande(s) annulée(s)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardStats;
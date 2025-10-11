// src/modules/comptabilite/pages/RapportsPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './RapportsPage.css';

export const RapportsPage: React.FC = () => {
  const rapports = [
    {
      title: 'Journal Comptable',
      description: 'Consultation de toutes les écritures comptables par journal',
      path: '/comptabilite/journal',
      icon: '📒',
      color: '#3B82F6'
    },
    {
      title: 'Balance Comptable',
      description: 'Balance générale des comptes avec soldes débiteurs et créditeurs',
      path: '/comptabilite/balance',
      icon: '⚖️',
      color: '#10B981'
    },
    {
      title: 'Bilan Comptable',
      description: 'Bilan actif/passif à une date donnée',
      path: '/comptabilite/bilan',
      icon: '📊',
      color: '#8B5CF6'
    },
    {
      title: 'Compte de Résultat',
      description: 'Produits et charges sur une période',
      path: '/comptabilite/compte-resultat',
      icon: '📈',
      color: '#F59E0B'
    },
    {
      title: 'Trésorerie',
      description: 'Situation de trésorerie et prévisions',
      path: '/comptabilite/tresorerie',
      icon: '💰',
      color: '#EF4444'
    },
    {
      title: 'Déclaration TVA',
      description: 'Calcul et déclaration de la TVA',
      path: '/comptabilite/tva',
      icon: '🧾',
      color: '#06B6D4'
    },
    {
      title: 'Taux de Change',
      description: 'Gestion des devises et taux de change',
      path: '/comptabilite/taux-change',
      icon: '🔄',
      color: '#EC4899'
    },
    {
      title: 'Grand Livre',
      description: 'Détail des mouvements par compte',
      path: '/comptabilite/grand-livre',
      icon: '📚',
      color: '#84CC16'
    }
  ];

  return (
    <div className="rapports-page">
      <div className="page-header">
        <h1>Rapports Financiers</h1>
        <p>Générez et consultez vos états financiers et rapports comptables</p>
      </div>

      <div className="rapports-grid">
        {rapports.map((rapport) => (
          <Link key={rapport.path} to={rapport.path} className="rapport-card">
            <div 
              className="rapport-icon"
              style={{ backgroundColor: rapport.color }}
            >
              {rapport.icon}
            </div>
            <div className="rapport-content">
              <h3>{rapport.title}</h3>
              <p>{rapport.description}</p>
            </div>
            <div className="rapport-arrow">→</div>
          </Link>
        ))}
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <span className="stat-value">Mois en cours</span>
            <span className="stat-label">{new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💼</div>
          <div className="stat-info">
            <span className="stat-value">Module Comptable</span>
            <span className="stat-label">Version 2.0.0</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🌐</div>
          <div className="stat-info">
            <span className="stat-value">Multi-devises</span>
            <span className="stat-label">MGA, USD, EUR</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RapportsPage;
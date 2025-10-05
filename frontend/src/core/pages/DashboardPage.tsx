import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          Tableau de Bord Aquatiko
        </h1>
        <p className="dashboard-subtitle">
          Bienvenue sur votre plateforme de gestion intégrée
        </p>
      </div>

      {/* Cartes des modules */}
      <div className="dashboard-grid">
        {/* Module Comptabilité */}
        <Link 
          to="/comptabilite" 
          className="dashboard-card dashboard-card-comptabilite"
        >
          <div className="dashboard-card-header">
            <div className="dashboard-card-icon">
              €
            </div>
            <h2 className="dashboard-card-title">Comptabilité</h2>
          </div>
          <p className="dashboard-card-description">
            Gestion financière, transactions, comptes et rapports
          </p>
          <div className="dashboard-card-cta">
            Accéder au module →
          </div>
        </Link>

        {/* Module Import-Export */}
        <Link 
          to="/import-export" 
          className="dashboard-card dashboard-card-import-export"
        >
          <div className="dashboard-card-header">
            <div className="dashboard-card-icon">
              ↔
            </div>
            <h2 className="dashboard-card-title">Import-Export</h2>
          </div>
          <p className="dashboard-card-description">
            Gestion des opérations internationales et logistique
          </p>
          <div className="dashboard-card-cta">
            Accéder au module →
          </div>
        </Link>

        {/* Module CRM */}
        <Link 
          to="/crm" 
          className="dashboard-card dashboard-card-crm"
        >
          <div className="dashboard-card-header">
            <div className="dashboard-card-icon">
              👥
            </div>
            <h2 className="dashboard-card-title">CRM</h2>
          </div>
          <p className="dashboard-card-description">
            Gestion des clients, contacts et opportunités commerciales
          </p>
          <div className="dashboard-card-cta">
            Accéder au module →
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
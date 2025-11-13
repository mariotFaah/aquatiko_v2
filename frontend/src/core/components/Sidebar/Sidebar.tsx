import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

// Définir les interfaces pour les types de menu
interface MenuItemBase {
  name: string;
  path: string;
  icon: string;
  badge?: string | null;
}

interface MenuItemWithChildren extends MenuItemBase {
  children: MenuItemBase[];
}

interface MenuItemWithoutChildren extends MenuItemBase {
  children?: undefined;
}

type MenuItem = MenuItemWithChildren | MenuItemWithoutChildren;

// Type guard pour vérifier si un item a des enfants
const hasChildren = (item: MenuItem): item is MenuItemWithChildren => {
  return Array.isArray((item as MenuItemWithChildren).children);
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    crm: location.pathname.startsWith('/crm'),
    comptabilite: location.pathname.startsWith('/comptabilite'),
    importExport: location.pathname.startsWith('/import-export')
  });

  const toggleSubmenu = (menu: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const menuItems: MenuItem[] = [
    { 
      name: 'Tableau de Bord', 
      path: '/', 
      icon: '📊',
      badge: null
    },
    {
      name: 'Comptabilité',
      path: '/comptabilite',
      icon: '💰',
      badge: '3',
      children: [
        { name: 'Vue générale', path: '/comptabilite', icon: '📈' },
        { name: 'Factures', path: '/comptabilite/factures', icon: '🧾' },
        { name: 'Tiers', path: '/comptabilite/tiers', icon: '👥' },
        { name: 'Articles', path: '/comptabilite/articles', icon: '📦' },
         {name: 'Suivi Paiements', path: '/comptabilite/suivi-paiements', icon: '📋' },
       // { name: 'Paiements', path: '/comptabilite/paiements', icon: '💳' },
        //{ name: 'Échéances', path: '/comptabilite/echeances', icon: '📅' },
        { name: 'Journal', path: '/comptabilite/journal', icon: '📔' },
        { name: 'Balance', path: '/comptabilite/balance', icon: '⚖️' },
        { name: 'Bilan', path: '/comptabilite/bilan', icon: '📊' },
        { name: 'Declaration TVA', path:'/comptabilite/tva', icon:'🧾'},
        { name: 'Taux Change', path: '/comptabilite/taux-change', icon: '💹' }
       
      ],
    },
    {
      name: 'Import-Export',
      path: '/import-export',
      icon: '🌐',
      badge: 'New',
      children: [
        { name: 'Vue générale', path: '/import-export', icon: '📈' },
        { name: 'Commandes', path: '/import-export/commandes', icon: '📋' },
        { name: 'Expéditions', path: '/import-export/expeditions', icon: '🚚' },
        { name: 'Analyses', path: '/import-export/analyses', icon: '📊' },
      ],
    },
    {
      name: 'CRM',
      path: '/crm',
      icon: '🤝',
      badge: '12',
      children: [
        { name: 'Vue générale', path: '/crm', icon: '📈' },
        { name: 'Clients', path: '/crm/clients', icon: '👤' },
        { name: 'Devis', path: '/crm/devis', icon: '📄' },
      ],
    },
  ];

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}

      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          {isOpen && (
            <div className="sidebar-brand">
              <div className="brand-logo">🌊</div>
              <h1 className="sidebar-title">OMNISERVE EXPERTS </h1>
            </div>
          )}
          
          <button onClick={onToggle} className="sidebar-toggle inside">
            {isOpen ? '‹' : '›'}
          </button>
        </div>

        {/* Container scrollable pour le contenu */}
        <div className="sidebar-content">
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <div key={item.path} className="sidebar-menu">
                {hasChildren(item) ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(item.name)}
                      className={`sidebar-link ${
                        location.pathname.startsWith(item.path) ? 'active' : ''
                      }`}
                    >
                      <span className="sidebar-icon">{item.icon}</span>
                      {isOpen && (
                        <>
                          <span className="sidebar-text">{item.name}</span>
                          <div className="sidebar-right">
                            {item.badge && (
                              <span className="sidebar-badge">{item.badge}</span>
                            )}
                            <span className="sidebar-arrow">
                              {openSubmenus[item.name] ? '▾' : '▸'}
                            </span>
                          </div>
                        </>
                      )}
                    </button>
                    
                    {openSubmenus[item.name] && isOpen && (
                      <div className="sidebar-submenu">
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={`sidebar-submenu-link ${
                              location.pathname === child.path ? 'active' : ''
                            }`}
                          >
                            <span className="submenu-icon">{child.icon}</span>
                            <span className="submenu-text">{child.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`sidebar-link ${
                      location.pathname === item.path ? 'active' : ''
                    }`}
                  >
                    <span className="sidebar-icon">{item.icon}</span>
                    {isOpen && (
                      <>
                        <span className="sidebar-text">{item.name}</span>
                        {item.badge && (
                          <span className="sidebar-badge">{item.badge}</span>
                        )}
                      </>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* User profile section */}
          {isOpen && (
            <div className="sidebar-footer">
              <div className="user-profile">
                <div className="user-avatar">AK</div>
                <div className="user-info">
                  <div className="user-name">OMNISERVE EXPERTS  Team</div>
                  <div className="user-role">Administrateur</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
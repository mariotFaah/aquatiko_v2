import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 
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
  requiredRole?: ('admin' | 'comptable' | 'commercial')[]; // ✅ CORRIGER le type
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
  const { user } = useAuth();

  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    crm: location.pathname.startsWith('/crm'),
    comptabilite: location.pathname.startsWith('/comptabilite'),
    importExport: location.pathname.startsWith('/import-export'),
    admin: location.pathname.startsWith('/admin')
  });

  const toggleSubmenu = (menu: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  // ✅ CORRIGER la fonction hasAccess
  const hasAccess = (item: MenuItemBase): boolean => {
    if (!item.requiredRole) return true; // Pas de restriction
    if (!user) return false; // Utilisateur non connecté
    
    // Admin a accès à tout
    if (user.role === 'admin') return true;
    
    // Vérifier si l'utilisateur a un des rôles requis
    return item.requiredRole.includes(user.role);
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
      requiredRole: ['admin', 'comptable'],
      children: [
        { name: 'Vue générale', path: '/comptabilite', icon: '📈' },
        { name: 'Factures', path: '/comptabilite/factures', icon: '🧾' },
        { name: 'Tiers', path: '/comptabilite/tiers', icon: '👥' },
        { name: 'Articles', path: '/comptabilite/articles', icon: '📦' },
        { name: 'Suivi Paiements', path: '/comptabilite/suivi-paiements', icon: '📋' },
        { name: 'Journal', path: '/comptabilite/journal', icon: '📔' },
        { name: 'Balance', path: '/comptabilite/balance', icon: '⚖️' },
        { name: 'Bilan', path: '/comptabilite/bilan', icon: '📊' },
        { name: 'Declaration TVA', path: '/comptabilite/tva', icon: '🧾' },
        { name: 'Taux Change', path: '/comptabilite/taux-change', icon: '💹' }
      ],
    },
    {
      name: 'Import-Export',
      path: '/import-export',
      icon: '🌐',
      badge: 'New',
      requiredRole: ['admin', 'commercial'],
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
      requiredRole: ['admin', 'commercial'],
      children: [
        { name: 'Vue générale', path: '/crm', icon: '📈' },
        { name: 'Clients', path: '/crm/clients', icon: '👥' },
        { name: 'Devis', path: '/crm/devis', icon: '📄' },
        { name: 'Contrats', path: '/crm/contrats', icon: '📑' },
        { name: 'Activités', path: '/crm/activites', icon: '📋' },
        { name: 'Contacts', path: '/crm/contacts', icon: '👤' },
        { name: 'Relances', path: '/crm/relances', icon: '🔔' },
      ],
    },
    {
      name: 'Administration',
      path: '/admin',
      icon: '⚙️',
      badge: null,
      requiredRole: ['admin'],
      children: [
        { name: 'Gestion Utilisateurs', path: '/admin/users', icon: '👥' },
      ],
    },
  ];

  // Filtrer les menus selon les permissions
  const filteredMenuItems = menuItems.filter(hasAccess);

  // ✅ CORRIGER l'affichage du profil utilisateur
  const getUserDisplayName = () => {
    if (user?.prenom && user?.nom) {
      return `${user.prenom} ${user.nom}`;
    }
    return user?.nom || user?.email || 'Utilisateur';
  };

  const getUserRoleDisplay = () => {
    const roleMap = {
      'admin': 'Administrateur',
      'comptable': 'Comptable', 
      'commercial': 'Commercial'
    };
    return roleMap[user?.role as keyof typeof roleMap] || user?.role || 'Utilisateur';
  };

  const getUserInitials = () => {
    if (user?.prenom && user?.nom) {
      return `${user.prenom.charAt(0)}${user.nom.charAt(0)}`;
    }
    return user?.nom?.charAt(0) || user?.email?.charAt(0) || 'U';
  };

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}

      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          {isOpen && (
            <div className="sidebar-brand">
              <div className="brand-logo">🌊</div>
              <h1 className="sidebar-title">OMNISERVE EXPERTS</h1>
            </div>
          )}
          
          <button onClick={onToggle} className="sidebar-toggle inside">
            {isOpen ? '‹' : '›'}
          </button>
        </div>

        {/* Container scrollable pour le contenu */}
        <div className="sidebar-content">
          <nav className="sidebar-nav">
            {filteredMenuItems.map((item) => (
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
                        {item.children
                          .filter(hasAccess)
                          .map((child) => (
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
          {isOpen && user && (
            <div className="sidebar-footer">
              <div className="user-profile">
                <div className="user-avatar">
                  {getUserInitials()}
                </div>
                <div className="user-info">
                  <div className="user-name">{getUserDisplayName()}</div>
                  <div className="user-role">{getUserRoleDisplay()}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
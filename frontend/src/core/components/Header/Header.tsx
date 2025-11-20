// src/core/components/Header/Header.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Gérer le mode sombre/clair
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Fonction sécurisée pour obtenir les initiales
  const getUserInitials = (): string => {
    if (!user) return 'U';
    
    // Essayez différentes propriétés possibles
    const userName = (user as any).name || (user as any).nom || (user as any).username || (user as any).prenom || '';
    
    if (!userName) return 'U';
    
    return userName
      .split(' ')
      .map((word: string) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Fonction sécurisée pour obtenir le nom affiché
  const getDisplayName = (): string => {
    if (!user) return 'Utilisateur';
    
    return (user as any).name || (user as any).nom || (user as any).username || (user as any).prenom || 'Utilisateur';
  };

  // Fonction sécurisée pour obtenir l'email
  const getEmail = (): string => {
    if (!user) return '';
    return user.email || '';
  };

  // Fonction sécurisée pour obtenir le rôle
  const getRole = (): string => {
    if (!user) return '';
    return user.code_role || '';
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-title-section">
          <h2 className="header-title">
            Tableau de Bord
          </h2>
        </div>
        
        <div className="header-actions">
          <button className="header-notification">
            🔔
          </button>
          
          <div className="header-profile" ref={profileMenuRef}>
            <button 
              className="header-profile-trigger"
              onClick={toggleProfileMenu}
            >
              <div className="header-avatar">
                {getUserInitials()}
              </div>
              <span className="header-username">
                {getDisplayName()}
              </span>
              <span className={`header-arrow ${isProfileMenuOpen ? 'open' : ''}`}>
                ▼
              </span>
            </button>

            {isProfileMenuOpen && (
              <div className="header-profile-menu">
                <div className="profile-menu-header">
                  <div className="menu-avatar">
                    {getUserInitials()}
                  </div>
                  <div className="menu-user-info">
                    <div className="menu-username">{getDisplayName()}</div>
                    <div className="menu-user-email">{getEmail()}</div>
                    <div className="menu-user-role">{getRole()}</div>
                  </div>
                </div>

                <div className="profile-menu-divider"></div>

                <button 
                  className="profile-menu-item"
                  onClick={toggleDarkMode}
                >
                  <span className="menu-item-icon">
                    {isDarkMode ? '☀️' : '🌙'}
                  </span>
                  <span className="menu-item-text">
                    {isDarkMode ? 'Mode clair' : 'Mode sombre'}
                  </span>
                </button>

                <div className="profile-menu-divider"></div>

                <button 
                  className="profile-menu-item logout"
                  onClick={handleLogout}
                >
                  <span className="menu-item-icon">🚪</span>
                  <span className="menu-item-text">Déconnexion</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
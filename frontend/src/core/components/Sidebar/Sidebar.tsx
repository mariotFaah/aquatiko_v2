import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Tableau de Bord', path: '/', icon: '📊' },
    {
      name: 'Comptabilité',
      path: '/comptabilite',
      icon: '€',
      children: [
        { name: 'Tableau de Bord', path: '/comptabilite' },
        { name: 'Factures', path: '/comptabilite/factures' },
        { name: 'Tiers', path: '/comptabilite/tiers' },
        { name: 'Articles', path: '/comptabilite/articles' },
        { name: 'Paiements', path: '/comptabilite/paiements' },
        { name: 'Échéances', path: '/comptabilite/echeances' },
        { name: 'Journal', path: '/comptabilite/journal' },
        { name: 'Balance', path: '/comptabilite/balance' },
        { name: 'Bilan', path: '/comptabilite/bilan' },
        { name: 'Taux Change', path: '/comptabilite/taux-change' },
      ],
    },
    {
      name: 'Import-Export',
      path: '/import-export',
      icon: '↔',
      children: [
        { name: 'Tableau de Bord', path: '/import-export' },
        { name: 'Commandes', path: '/import-export/commandes' },
        { name: 'Expéditions', path: '/import-export/expeditions' },
        { name: 'Analyses', path: '/import-export/analyses' },
      ],
    },
    {
      name: 'CRM',
      path: '/crm',
      icon: '👥',
      children: [
        { name: 'Clients', path: '/crm/clients' },
        { name: 'Contacts', path: '/crm/contacts' },
        { name: 'Opportunités', path: '/crm/opportunites' },
      ],
    },
  ];

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}

      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          {isOpen && <h1 className="sidebar-title">Aquatiko</h1>}

          {/* ✅ Bouton toggle intégré mais toujours visible */}
          <button onClick={onToggle} className="sidebar-toggle inside">
            {isOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <div key={item.path} className="sidebar-menu">
              <Link
                to={item.path}
                className={`sidebar-link ${
                  location.pathname === item.path ? 'active' : ''
                }`}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-text">{item.name}</span>
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
};

import './Header.css';

export const Header: React.FC = () => {
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
          <div className="header-profile">
            <div className="header-avatar">
              A
            </div>
            <span className="header-username">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};
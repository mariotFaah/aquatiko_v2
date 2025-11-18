import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { Header } from '../components/Header/Header';
import { useAuth } from '../contexts/AuthContext';
import './MainLayout.css';

export const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();

  return (
    <div className="main-layout">
      {/* Sidebar et bouton toggle */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        userRole={user?.code_role} // ✅ Passer le rôle utilisateur
      />
      
      {/* Main content */}
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Header 
          user={user} // ✅ Passer les infos utilisateur
          onLogout={logout} // ✅ Passer la fonction de déconnexion
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <main className="main-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
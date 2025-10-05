import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { Header } from '../components/Header/Header';
import './MainLayout.css';

export const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="main-layout">
      {/* Sidebar et bouton toggle */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
      />
      
      {/* Main content */}
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Header />
        
        <main className="main-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
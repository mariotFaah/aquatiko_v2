import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { importExportApi } from '../services/api';
import type { Commande } from '../types';
import DashboardStats from '../components/DashboardStats';

const ImportExportPage: React.FC = () => {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    loadCommandes();
  }, []);

  const loadCommandes = async () => {
    try {
      const data = await importExportApi.getCommandes();
      setCommandes(data);
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Si on est sur la page d'accueil (/import-export), afficher le dashboard
  const isHomePage = location.pathname === '/import-export';

  return (
    <div className="space-y-6">
      {isHomePage && (
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900">Module Import-Export</h1>
          <p className="text-gray-600 mt-2">
            Gestion des opérations internationales
          </p>
          
          {/* DashboardStats intégré */}
          <DashboardStats commandes={commandes} loading={loading} />
        </div>
      )}
      
      <Outlet />
    </div>
  );
};

export default ImportExportPage;
// src/modules/import-export/pages/ImportExportPage.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const ImportExportPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Module Import-Export</h1>
        <p className="text-gray-600 mt-2">
          Gestion des opérations internationales
        </p>
      </div>
      
      {/* ✅ IMPORTANT: Outlet pour afficher les sous-routes */}
      <Outlet />
    </div>
  );
};

export default ImportExportPage;

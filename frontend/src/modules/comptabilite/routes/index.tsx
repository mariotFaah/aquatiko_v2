// src/modules/comptabilite/routes/index.tsx
import type { RouteObject } from 'react-router-dom';
import ComptabilitePage from '../pages/ComptabilitePage';
import FacturesListPage from '../pages/FacturesListPage';
import { FactureForm } from '../components/FactureForm/FactureForm.tsx';

// 👇 Nouveau composant pour gérer les tiers
import {TiersListPage} from '../pages/TiersListPage';

export const comptabiliteRoutes: RouteObject[] = [
  {
    path: 'comptabilite',
    element: <ComptabilitePage />,
    children: [
      {
        index: true,
        element: (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Tableau de Bord Comptabilité</h2>
            <p>Bienvenue dans le module comptabilité. Sélectionnez une section dans le menu.</p>
          </div>
        ),
      },
      {
        path: 'factures',
        element: <FacturesListPage />,
      },
      {
        path: 'factures/nouvelle',
        element: <FactureForm />,
      },
      // 👇 Gestion des tiers
      {
        path: 'tiers',
        element: <TiersListPage />,
      },
      {
        path: 'articles',
        element: (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Gestion des Articles</h2>
            <p>Page en cours de développement...</p>
          </div>
        ),
      },
      {
        path: 'rapports',
        element: (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Rapports Comptables</h2>
            <p>Page en cours de développement...</p>
          </div>
        ),
      },
    ],
  },
];

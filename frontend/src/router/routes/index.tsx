// src/router/routes/index.tsx
import type { RouteObject } from 'react-router-dom';
import { MainLayout } from '../../core/layouts/MainLayout';
import DashboardPage from '../../core/pages/DashboardPage';
import LoginPage from '../../core/pages/LoginPage';
import { comptabiliteRoutes } from '../../modules/comptabilite/routes';import ImportExportPage from '../../modules/import-export/pages/ImportExportPage';
import CRMPage from '../../modules/crm/pages/CRMPage';

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      // 👇 REMPLACE cette route simple par les routes complètes du module
      ...comptabiliteRoutes, // 👈 Au lieu de la route simple
      {
        path: 'import-export',
        element: <ImportExportPage />,
      },
      {
        path: 'crm',
        element: <CRMPage />,
      },
    ],
  },
];
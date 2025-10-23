// src/router/routes/index.tsx
import type { RouteObject } from 'react-router-dom';
import { MainLayout } from '../../core/layouts/MainLayout';
import DashboardPage from '../../core/pages/DashboardPage';
import LoginPage from '../../core/pages/LoginPage';
import { comptabiliteRoutes } from '../../modules/comptabilite/routes';
import { importExportRoutes } from '../../modules/import-export/routes';
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
      // Modules
      ...comptabiliteRoutes,
      ...importExportRoutes,
      {
        path: 'crm',
        element: <CRMPage />,
      },
    ],
  },
];

// src/router/routes/index.tsx
import type { RouteObject } from 'react-router-dom';
import { MainLayout } from '../../core/layouts/MainLayout';
import DashboardPage from '../../core/pages/DashboardPage';
import LoginPage from '../../core/auth/pages/LoginPage'; // ✅ Corriger l'import
import { comptabiliteRoutes } from '../../modules/comptabilite/routes';
import { importExportRoutes } from '../../modules/import-export/routes';
import CRMRoutes from '../../modules/crm/routes';
import { ProtectedRoute } from '../../core/auth/components/ProtectedRoute'; // ✅ Nouvel import

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      // Modules avec différentes structures
      ...comptabiliteRoutes.map(route => ({
        ...route,
        element: (
          <ProtectedRoute 
            requiredPermission={{ module: 'comptabilite', action: 'read' }}
          >
            {route.element}
          </ProtectedRoute>
        )
      })),
      ...importExportRoutes.map(route => ({
        ...route,
        element: (
          <ProtectedRoute 
            requiredPermission={{ module: 'import-export', action: 'read' }}
          >
            {route.element}
          </ProtectedRoute>
        )
      })),
      {
        path: 'crm/*',
        element: (
          <ProtectedRoute 
            requiredPermission={{ module: 'crm', action: 'read' }}
          >
            <CRMRoutes />
          </ProtectedRoute>
        ), 
      },
    ],
  },
];
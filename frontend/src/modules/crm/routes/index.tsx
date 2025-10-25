// src/modules/crm/routes/index.tsx
import type { RouteObject } from 'react-router-dom';
import CRMPage from '../pages/CRMPage';
import ClientsListPage from '../pages/ClientsListPage';
import ClientDetailPage from '../pages/ClientDetailPage';
import DevisListPage from '../pages/DevisListPage';
import DevisDetailPage from '../pages/DevisDetailPage';

export const crmRoutes: RouteObject[] = [
  {
    path: 'crm',
    element: <CRMPage />,
  },
  {
    path: 'crm/clients',
    element: <ClientsListPage />,
  },
  {
    path: 'crm/clients/:id',
    element: <ClientDetailPage />,
  },
  {
    path: 'crm/devis',
    element: <DevisListPage />,
  },
  {
    path: 'crm/devis/:id',
    element: <DevisDetailPage />,
  },
];

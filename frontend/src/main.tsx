// src/main.tsx
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './router/routes';
import { AuthProvider } from './core/contexts/AuthContext'; // ✅ Ajouter cet import
import './index.css';

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider> {/* ✅ Envelopper le RouterProvider avec AuthProvider */}
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
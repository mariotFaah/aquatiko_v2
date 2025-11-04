import type { RouteObject } from 'react-router-dom';

// Pages
import ImportExportPage from '../pages/ImportExportPage';
import CommandesListPage from '../pages/CommandesListPage';
import CommandeFormPage from '../pages/CommandeFormPage';
import CommandeEditPage from '../pages/CommandeEditPage';
import CommandeDetailPage from '../pages/CommandeDetailPage';
import CalculMargePage from '../pages/CalculMargePage';
import ExpeditionsListPage from '../pages/ExpeditionsListPage';
import ExpeditionDetailPage from '../pages/ExpeditionDetailPage';
import ExpeditionFormPage from '../pages/ExpeditionFormPage';
import GestionCoutsPage from '../pages/GestionCoutsPage';
import AnalysesMargePage from '../pages/AnalysesMargePage';


export const importExportRoutes: RouteObject[] = [
  {
    path: 'import-export',
    element: <ImportExportPage />,
    children: [
      {
        index: true,
        // Le contenu du dashboard est maintenant géré par ImportExportPage
        element: null, // Laisse ImportExportPage gérer l'affichage
      },
      
      // Gestion des commandes
      {
        path: 'commandes',
        element: <CommandesListPage />,
      },
      {
        path: 'commandes/nouvelle',
        element: <CommandeFormPage />,
      },
      {
        path: 'commandes/:id',
        element: <CommandeDetailPage />,
      },
      {
        path: 'commandes/:id/edit',
        element: <CommandeEditPage />,
      },
      {
        path: 'commandes/:id/detail',
        element: <CommandeDetailPage />,
      },
      {
        path: 'commandes/:id/marge',
        element: <CalculMargePage />,
      },
      {
        path: 'commandes/:id/couts',
        element: <GestionCoutsPage />,
      },
      
      // Expéditions
      {
        path: 'expeditions',
        element: <ExpeditionsListPage />,
      },
      {
        path: 'expeditions/:id',
        element: <ExpeditionDetailPage />,
      },
      {
        path: 'commandes/:id/expedition',
        element: <ExpeditionFormPage />,
      },
      
      // Analyses
      {
        path: 'analyses',
        element: <AnalysesMargePage />,
      }
    ],
  },
];
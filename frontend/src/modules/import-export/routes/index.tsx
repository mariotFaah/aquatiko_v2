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

// Pages à créer (placeholders pour l'instant)
const AnalysesMargePage = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-4">Analyses de Marge</h2>
    <p>Page en cours de développement...</p>
  </div>
);

export const importExportRoutes: RouteObject[] = [
  {
    path: 'import-export',
    element: <ImportExportPage />,
    children: [
      {
        index: true,
        element: (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Tableau de Bord Import/Export</h2>
            <p>Bienvenue dans le module Import/Export. Sélectionnez une section dans le menu.</p>
            
            {/* Quick stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900">📥 Import</h3>
                <p className="text-blue-700 text-sm">Gestion des achats internationaux</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900">📤 Export</h3>
                <p className="text-green-700 text-sm">Gestion des ventes internationales</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h3 className="font-semibold text-orange-900">🚚 Logistique</h3>
                <p className="text-orange-700 text-sm">Suivi des expéditions</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-900">💰 Marges</h3>
                <p className="text-purple-700 text-sm">Analyse de rentabilité</p>
              </div>
            </div>

            {/* Liens rapides */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Accès Rapide</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="/import-export/commandes" className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                  <h4 className="font-semibold text-gray-900">📋 Commandes</h4>
                  <p className="text-gray-600 text-sm">Gérer les commandes</p>
                </a>
                <a href="/import-export/expeditions" className="bg-white p-4 rounded-lg border border-gray-200 hover:border-green-500 transition-colors">
                  <h4 className="font-semibold text-gray-900">🚚 Expéditions</h4>
                  <p className="text-gray-600 text-sm">Suivi logistique</p>
                </a>
                <a href="/import-export/analyses" className="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-500 transition-colors">
                  <h4 className="font-semibold text-gray-900">📊 Analyses</h4>
                  <p className="text-gray-600 text-sm">Calcul des marges</p>
                </a>
              </div>
            </div>
          </div>
        ),
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

// src/modules/comptabilite/routes/index.tsx
import type { RouteObject } from 'react-router-dom';

// Pages existantes
import ComptabilitePage from '../pages/ComptabilitePage';
import FacturesListPage from '../pages/FacturesListPage';
import { FactureForm } from '../components/FactureForm/FactureForm';
import { TiersListPage } from '../pages/TiersListPage';
import { ArticlesListPage } from '../pages/ArticlesListPage';
import { PaiementsListPage } from '../pages/PaiementsListPage';

// Nouvelles pages
import RapportsPage from '../pages/RapportsPage';
import JournalComptablePage from '../pages/JournalComptablePage';
import BalanceComptablePage from '../pages/BalanceComptablePage';
import BilanComptablePage from '../pages/BilanComptablePage';
import TauxChangePage from '../pages/TauxChangePage';

// Pages à créer (placeholders)
const CompteResultatPage = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-4">Compte de Résultat</h2>
    <p>Page en cours de développement...</p>
  </div>
);

const TresoreriePage = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-4">Trésorerie</h2>
    <p>Page en cours de développement...</p>
  </div>
);

const TVAPage = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-4">Déclaration TVA</h2>
    <p>Page en cours de développement...</p>
  </div>
);

const GrandLivrePage = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-4">Grand Livre</h2>
    <p>Page en cours de développement...</p>
  </div>
);

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
            
            {/* Quick stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900">Multi-devises</h3>
                <p className="text-blue-700 text-sm">Support MGA, USD, EUR</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900">Comptabilité Complète</h3>
                <p className="text-green-700 text-sm">Journal, Balance, Bilan</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-900">Rapports</h3>
                <p className="text-purple-700 text-sm">États financiers intégrés</p>
              </div>
            </div>
          </div>
        ),
      },
      
      // Gestion des données
      {
        path: 'factures',
        element: <FacturesListPage />,
      },
      {
        path: 'factures/nouvelle',
        element: <FactureForm />,
      },
      {
        path: 'tiers',
        element: <TiersListPage />,
      },
      {
        path: 'articles',
        element: <ArticlesListPage />,
      },
      {
        path: 'paiements',
        element: <PaiementsListPage />,
      },
      
      // Rapports financiers
      {
        path: 'rapports',
        element: <RapportsPage />,
      },
      {
        path: 'journal',
        element: <JournalComptablePage />,
      },
      {
        path: 'balance',
        element: <BalanceComptablePage />,
      },
      {
        path: 'bilan',
        element: <BilanComptablePage />,
      },
      {
        path: 'compte-resultat',
        element: <CompteResultatPage />,
      },
      {
        path: 'tresorerie',
        element: <TresoreriePage />,
      },
      {
        path: 'tva',
        element: <TVAPage />,
      },
      {
        path: 'grand-livre',
        element: <GrandLivrePage />,
      },
      
      // Multi-devises
      {
        path: 'taux-change',
        element: <TauxChangePage />,
      },
    ],
  },
];
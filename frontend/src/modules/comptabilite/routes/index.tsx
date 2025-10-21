import type { RouteObject } from 'react-router-dom';

// Pages existantes
import ComptabilitePage from '../pages/ComptabilitePage';
import FacturesListPage from '../pages/FacturesListPage';
import { FactureForm } from '../components/FactureForm/FactureForm';
import { TiersListPage } from '../pages/TiersListPage';
import { ArticlesListPage } from '../pages/ArticlesListPage';
import { PaiementsListPage } from '../pages/PaiementsListPage';

// TOUTES les pages réelles
import RapportsPage from '../pages/RapportsPage';
import JournalComptablePage from '../pages/JournalComptablePage';
import BalanceComptablePage from '../pages/BalanceComptablePage';
import BilanComptablePage from '../pages/BilanComptablePage';
import TauxChangePage from '../pages/TauxChangePage';
import FactureDetailPage from '../pages/FactureDetailPage';
import FactureEditPage from '../pages/FactureEditPage';
import EcheancesPage from '../pages/EcheancesPage';
import CompteResultatPage from '../pages/CompteResultatPage';
import TresoreriePage from '../pages/TresoreriePage';
import DeclarationTVAPage from '../pages/DeclarationTVAPage';

// Page placeholder restante
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

            {/* Section États Financiers */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">États Financiers Disponibles</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <a href="/comptabilite/bilan" className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                  <h4 className="font-semibold text-gray-900">📊 Bilan</h4>
                  <p className="text-gray-600 text-sm">Actif et passif</p>
                </a>
                <a href="/comptabilite/compte-resultat" className="bg-white p-4 rounded-lg border border-gray-200 hover:border-green-500 transition-colors">
                  <h4 className="font-semibold text-gray-900">📈 Compte de Résultat</h4>
                  <p className="text-gray-600 text-sm">Produits et charges</p>
                </a>
                <a href="/comptabilite/tva" className="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-500 transition-colors">
                  <h4 className="font-semibold text-gray-900">🧾 Déclaration TVA</h4>
                  <p className="text-gray-600 text-sm">Calcul TVA</p>
                </a>
                <a href="/comptabilite/tresorerie" className="bg-white p-4 rounded-lg border border-gray-200 hover:border-orange-500 transition-colors">
                  <h4 className="font-semibold text-gray-900">💰 Trésorerie</h4>
                  <p className="text-gray-600 text-sm">Situation financière</p>
                </a>
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
      
      // SECTION C: SUIVI DES PAIEMENTS
      {
        path: 'echeances',
        element: <EcheancesPage />,
      },
      
      // Rapports financiers - MAINTENANT AVEC LES VRAIES PAGES
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
        element: <DeclarationTVAPage />,
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
      {
        path:'factures/:numero',
        element: <FactureDetailPage />,
      },
      {
        path:'factures/:numero/edit',
        element: <FactureEditPage />,
      }
    ],
  },
];

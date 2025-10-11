import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ComptabiliteService } from '../../services/comptabilite';
import { Button } from '../../components/ui/Button';

export const Dashboard: React.FC = () => {
  const { data: tiers, isLoading: loadingTiers } = useQuery({
    queryKey: ['tiers'],
    queryFn: ComptabiliteService.getTiers,
  });

  const { data: factures, isLoading: loadingFactures } = useQuery({
    queryKey: ['factures'],
    queryFn: ComptabiliteService.getFactures,
  });

  if (loadingTiers || loadingFactures) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'validee': return 'text-green-600';
      case 'brouillon': return 'text-yellow-600';
      case 'annulee': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Comptabilité</h1>
        <Button>Nouvelle Facture</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Tiers</h3>
          <p className="text-3xl font-bold text-blue-600">{tiers?.length || 0}</p>
          <p className="text-gray-600">Clients/Fournisseurs</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Factures</h3>
          <p className="text-3xl font-bold text-green-600">{factures?.length || 0}</p>
          <p className="text-gray-600">Documents créés</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Trésorerie</h3>
          <p className="text-3xl font-bold text-purple-600">
            {factures?.reduce((sum, f) => sum + f.total_ttc, 0)?.toLocaleString('fr-FR') || 0} MGA
          </p>
          <p className="text-gray-600">Chiffre d'affaires</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Dernières Factures</h2>
        </div>
        <div className="p-6">
          {factures && factures.length > 0 ? (
            <div className="space-y-4">
              {factures.slice(0, 5).map((facture) => (
                <div key={facture.numero_facture} className="flex justify-between items-center py-3 border-b">
                  <div>
                    <p className="font-medium">Facture #{facture.numero_facture}</p>
                    <p className="text-gray-600 text-sm">{facture.nom_tiers}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{facture.total_ttc.toLocaleString('fr-FR')} MGA</p>
                    <p className={`text-sm ${getStatusColor(facture.statut)}`}>
                      {facture.statut}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Aucune facture créée</p>
          )}
        </div>
      </div>
    </div>
  );
};
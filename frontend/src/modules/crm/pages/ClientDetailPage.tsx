// src/modules/crm/pages/ClientDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { crmApi } from '../services/api';
import type { Client } from '../types';
import './ClientDetailPage.css';


const ClientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'infos' | 'contacts' | 'devis' | 'activites'>('infos');

  useEffect(() => {
    if (id) {
      loadClient();
    }
  }, [id]);

  const loadClient = async () => {
    try {
      setLoading(true);
      const data = await crmApi.getClient(parseInt(id!));
      setClient(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8">Chargement...</div>;
  if (error) return <div className="text-red-600 p-4">Erreur: {error}</div>;
  if (!client) return <div className="text-red-600 p-4">Client non trouvé</div>;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{client.nom}</h1>
            <p className="text-gray-600 mt-1">{client.email} • {client.telephone}</p>
            <p className="text-gray-500 text-sm mt-1">{client.adresse}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Responsable commercial</div>
            <div className="font-medium">{client.responsable_commercial || 'Non assigné'}</div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { id: 'infos', label: 'Informations' },
              { id: 'contacts', label: `Contacts (${client.contacts?.length || 0})` },
              { id: 'devis', label: `Devis (${client.devis?.length || 0})` },
              { id: 'activites', label: `Activités (${client.activites?.length || 0})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`mr-8 py-4 px-1 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Onglet Informations */}
          {activeTab === 'infos' && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations générales</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">SIRET</dt>
                    <dd className="text-sm text-gray-900">{client.siret || 'Non renseigné'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Forme juridique</dt>
                    <dd className="text-sm text-gray-900">{client.forme_juridique || 'Non renseigné'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Secteur d'activité</dt>
                    <dd className="text-sm text-gray-900">{client.secteur_activite || 'Non renseigné'}</dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Données commerciales</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Catégorie</dt>
                    <dd className="text-sm text-gray-900 capitalize">{client.categorie || 'Non définie'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Chiffre d'affaires annuel</dt>
                    <dd className="text-sm text-gray-900">
                      {client.chiffre_affaires_annuel ? 
                        new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(client.chiffre_affaires_annuel)
                        : 'Non renseigné'
                      }
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Effectif</dt>
                    <dd className="text-sm text-gray-900">{client.effectif ? `${client.effectif} personnes` : 'Non renseigné'}</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {/* Onglet Contacts */}
          {activeTab === 'contacts' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Contacts</h3>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700">
                  Ajouter un contact
                </button>
              </div>
              
              <div className="space-y-4">
                {client.contacts?.map((contact) => (
                  <div key={contact.id_contact} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {contact.prenom} {contact.nom}
                          {contact.principal && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Principal
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-gray-600">{contact.fonction}</p>
                        <p className="text-sm text-gray-500">{contact.email} • {contact.telephone}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-indigo-600 hover:text-indigo-900 text-sm">Modifier</button>
                        <button className="text-red-600 hover:text-red-900 text-sm">Supprimer</button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {(!client.contacts || client.contacts.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    Aucun contact enregistré
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Onglet Devis */}
          {activeTab === 'devis' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Devis</h3>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700">
                  Créer un devis
                </button>
              </div>
              
              <div className="space-y-3">
                {client.devis?.map((devis) => (
                  <div key={devis.id_devis} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{devis.numero_devis}</h4>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            devis.statut === 'accepte' ? 'bg-green-100 text-green-800' :
                            devis.statut === 'envoye' ? 'bg-blue-100 text-blue-800' :
                            devis.statut === 'brouillon' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {devis.statut}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{devis.objet}</p>
                        <p className="text-sm text-gray-500">
                          Émis le {new Date(devis.date_devis).toLocaleDateString('fr-FR')} • 
                          Montant: {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(devis.montant_ht)}
                        </p>
                      </div>
                      <Link
                        to={`/crm/devis/${devis.id_devis}`}
                        className="text-indigo-600 hover:text-indigo-900 text-sm"
                      >
                        Voir le devis
                      </Link>
                    </div>
                  </div>
                ))}
                
                {(!client.devis || client.devis.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    Aucun devis enregistré
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Onglet Activités */}
          {activeTab === 'activites' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Activités</h3>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700">
                  Ajouter une activité
                </button>
              </div>
              
              <div className="space-y-3">
                {client.activites?.map((activite) => (
                  <div key={activite.id_activite} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{activite.sujet}</h4>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            activite.priorite === 'urgent' ? 'bg-red-100 text-red-800' :
                            activite.priorite === 'haut' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {activite.priorite}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            activite.statut === 'realise' ? 'bg-green-100 text-green-800' :
                            activite.statut === 'planifie' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {activite.statut}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 capitalize">{activite.type_activite}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(activite.date_activite).toLocaleString('fr-FR')}
                        </p>
                        {activite.description && (
                          <p className="text-sm text-gray-700 mt-2">{activite.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {(!client.activites || client.activites.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    Aucune activité enregistrée
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDetailPage;

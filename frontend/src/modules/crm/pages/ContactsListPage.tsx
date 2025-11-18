// src/modules/crm/pages/ContactsListPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { crmApi } from '../services/api';
import type { Contact, Client } from '../types';
import './ContactsListPage.css';

const ContactsListPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    try {
      setLoading(true);
      setError('');

      // Charger tous les clients pour le filtre
      const clientsData = await crmApi.getClients();
      setClients(clientsData);

      // Charger les contacts
      await chargerContacts();

    } catch (error) {
      console.error('Erreur chargement données:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const chargerContacts = async (clientId?: number) => {
    try {
      let contactsData: Contact[] = [];

      if (clientId) {
        // Charger les contacts d'un client spécifique
        contactsData = await crmApi.getContactsByClient(clientId);
      } else {
        // Pour charger tous les contacts, on doit récupérer les contacts de chaque client
        const allContacts: Contact[] = [];
        const clientsData = await crmApi.getClients();
        
        for (const client of clientsData) {
          try {
            const clientContacts = await crmApi.getContactsByClient(client.id_tiers);
            allContacts.push(...clientContacts);
          } catch (error) {
            console.error(`Erreur chargement contacts client ${client.id_tiers}:`, error);
          }
        }
        
        contactsData = allContacts;
      }

      setContacts(contactsData);
    } catch (error) {
      console.error('Erreur chargement contacts:', error);
      throw error;
    }
  };

  const handleClientFilterChange = async (clientId: number) => {
    setSelectedClient(clientId);
    setLoading(true);
    
    try {
      if (clientId === 0) {
        await chargerContacts(); // Tous les contacts
      } else {
        await chargerContacts(clientId); // Contacts d'un client spécifique
      }
    } catch (error) {
      console.error('Erreur filtrage contacts:', error);
      setError('Erreur lors du filtrage des contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (contactId: number, contactNom: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le contact "${contactNom}" ?`)) {
      try {
        await crmApi.deleteContact(contactId);
        // Recharger les contacts après suppression
        await chargerContacts(selectedClient === 0 ? undefined : selectedClient);
      } catch (error) {
        console.error('Erreur suppression contact:', error);
        setError('Erreur lors de la suppression du contact');
      }
    }
  };

  // Filtrer les contacts selon la recherche
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.fonction?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Obtenir le nom du client pour un contact
  const getClientName = (tiersId: number) => {
    const client = clients.find(c => c.id_tiers === tiersId);
    return client ? (client.raison_sociale || client.nom) : 'Client inconnu';
  };

  // Obtenir les initiales pour l'avatar
  const getInitials = (contact: Contact) => {
    const first = contact.prenom?.[0] || '';
    const last = contact.nom?.[0] || '';
    return `${first}${last}`.toUpperCase();
  };

  if (loading && contacts.length === 0) {
    return (
      <div className="ms-page-container">
        <div className="ms-loading">Chargement des contacts...</div>
      </div>
    );
  }

  return (
    <div className="ms-page-container">
      {/* Header de page */}
      <div className="ms-page-header">
        <div className="ms-header-left">
          <h1 className="ms-page-title">Contacts</h1>
          <div className="ms-page-subtitle">
            {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''} trouvé{filteredContacts.length !== 1 ? 's' : ''}
          </div>
        </div>
        <div className="ms-header-actions">
          <Link to="/crm/contacts/nouveau" className="ms-btn ms-btn-primary">
            Nouveau contact
          </Link>
        </div>
      </div>

      {/* Barre d'outils */}
      <div className="ms-toolbar">
        <div className="ms-search-box">
          <input
            type="text"
            placeholder="Rechercher un contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ms-search-input"
          />
          <span className="ms-search-icon">🔍</span>
        </div>

        <div className="ms-filter-group">
          <select
            value={selectedClient}
            onChange={(e) => handleClientFilterChange(parseInt(e.target.value))}
            className="ms-filter-select"
          >
            <option value={0}>Tous les clients</option>
            {clients.map(client => (
              <option key={client.id_tiers} value={client.id_tiers}>
                {client.raison_sociale || client.nom}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="ms-error-message">
          <span className="ms-error-icon">⚠</span>
          {error}
        </div>
      )}

      {/* Grille des contacts */}
      <div className="ms-grid-container">
        {filteredContacts.length > 0 ? (
          <div className="ms-grid">
            {filteredContacts.map(contact => (
              <div key={contact.id_contact} className="ms-card">
                <div className="ms-card-header">
                  <div className="ms-avatar">
                    {getInitials(contact)}
                  </div>
                  <div className="ms-card-title-section">
                    <h3 className="ms-card-title">
                      {contact.prenom} {contact.nom}
                    </h3>
                    <div className="ms-card-subtitle">
                      {getClientName(contact.tiers_id)}
                    </div>
                    {contact.principal && (
                      <div className="ms-badge ms-badge-primary">
                        Principal
                      </div>
                    )}
                  </div>
                </div>

                <div className="ms-card-content">
                  {contact.fonction && (
                    <div className="ms-property">
                      <span className="ms-property-label">Fonction</span>
                      <span className="ms-property-value">{contact.fonction}</span>
                    </div>
                  )}

                  {contact.email && (
                    <div className="ms-property">
                      <span className="ms-property-label">Email</span>
                      <a 
                        href={`mailto:${contact.email}`} 
                        className="ms-property-value ms-link"
                      >
                        {contact.email}
                      </a>
                    </div>
                  )}

                  {contact.telephone && (
                    <div className="ms-property">
                      <span className="ms-property-label">Téléphone</span>
                      <a 
                        href={`tel:${contact.telephone}`} 
                        className="ms-property-value ms-link"
                      >
                        {contact.telephone}
                      </a>
                    </div>
                  )}

                  {contact.notes && (
                    <div className="ms-property">
                      <span className="ms-property-label">Notes</span>
                      <span className="ms-property-value ms-notes">
                        {contact.notes.length > 100 
                          ? `${contact.notes.substring(0, 100)}...` 
                          : contact.notes
                        }
                      </span>
                    </div>
                  )}

                  <div className="ms-property">
                    <span className="ms-property-label">Créé le</span>
                    <span className="ms-property-value">
                      {new Date(contact.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="ms-card-actions">
                  <button
                    onClick={() => navigate(`/crm/contacts/${contact.id_contact}`)}
                    className="ms-btn ms-btn-secondary ms-btn-sm"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteContact(contact.id_contact, `${contact.prenom} ${contact.nom}`)}
                    className="ms-btn ms-btn-danger ms-btn-sm"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="ms-empty-state">
            <div className="ms-empty-icon">👥</div>
            <h3 className="ms-empty-title">Aucun contact trouvé</h3>
            <p className="ms-empty-description">
              {searchTerm || selectedClient !== 0 
                ? 'Aucun contact ne correspond à vos critères de recherche.' 
                : 'Commencez par créer votre premier contact.'
              }
            </p>
            {!searchTerm && selectedClient === 0 && (
              <Link to="/crm/contacts/nouveau" className="ms-btn ms-btn-primary">
                Créer un contact
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsListPage;
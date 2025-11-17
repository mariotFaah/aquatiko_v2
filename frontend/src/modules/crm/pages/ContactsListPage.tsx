// src/modules/crm/pages/ContactsListPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ContactsListPage.css';

interface Contact {
  id_contact: number;
  tiers_id: number;
  client_nom: string;
  nom: string;
  prenom: string;
  fonction: string;
  email: string;
  telephone: string;
  principal: boolean;
  notes: string;
}

const ContactsListPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chargerContacts();
  }, []);

  const chargerContacts = async () => {
    try {
      // TODO: Appel API
      const contactsTest: Contact[] = [
        {
          id_contact: 1,
          tiers_id: 1,
          client_nom: 'Entreprise ABC',
          nom: 'Dupont',
          prenom: 'Jean',
          fonction: 'Directeur Commercial',
          email: 'j.dupont@entreprise-abc.com',
          telephone: '+33 1 23 45 67 89',
          principal: true,
          notes: 'Contact principal pour tous les projets'
        }
      ];
      setContacts(contactsTest);
    } catch (error) {
      console.error('Erreur chargement contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Chargement des contacts...</div>;

  return (
    <div className="contacts-list-page">
      <div className="page-header">
        <h1>Gestion des Contacts</h1>
        <Link to="/crm/contacts/nouveau" className="btn-primary">
          Nouveau Contact
        </Link>
      </div>

      <div className="contacts-grid">
        {contacts.map(contact => (
          <div key={contact.id_contact} className="contact-card">
            <div className="contact-header">
              <div className="contact-avatar">
                {contact.prenom[0]}{contact.nom[0]}
              </div>
              <div className="contact-infos">
                <h3>{contact.prenom} {contact.nom}</h3>
                <p className="client-nom">{contact.client_nom}</p>
                {contact.principal && (
                  <span className="principal-badge">Contact Principal</span>
                )}
              </div>
            </div>

            <div className="contact-details">
              <div className="detail-item">
                <span className="label">Fonction:</span>
                <span className="value">{contact.fonction}</span>
              </div>
              <div className="detail-item">
                <span className="label">Email:</span>
                <a href={`mailto:${contact.email}`} className="value link">
                  {contact.email}
                </a>
              </div>
              <div className="detail-item">
                <span className="label">Téléphone:</span>
                <a href={`tel:${contact.telephone}`} className="value link">
                  {contact.telephone}
                </a>
              </div>
              {contact.notes && (
                <div className="detail-item">
                  <span className="label">Notes:</span>
                  <span className="value notes">{contact.notes}</span>
                </div>
              )}
            </div>

            <div className="contact-actions">
              <Link 
                to={`/crm/contacts/${contact.id_contact}`}
                className="btn-view"
              >
                Modifier
              </Link>
            </div>
          </div>
        ))}
      </div>

      {contacts.length === 0 && (
        <div className="no-data">
          Aucun contact trouvé
        </div>
      )}
    </div>
  );
};

export default ContactsListPage;
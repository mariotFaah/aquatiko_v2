// src/modules/crm/services/api.ts
import type { Client, Devis, Contact, Activite, ClientStats } from '../types';

const API_BASE_URL = 'http://localhost:3001/api/crm';

// Types de réponse API
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const crmApi = {
  // ---- Clients API ----
  getClients: async (): Promise<Client[]> => {
    const res = await fetch(`${API_BASE_URL}/clients`);
    const data: ApiResponse<Client[]> = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  },

  getClient: async (id: number): Promise<Client> => {
    const res = await fetch(`${API_BASE_URL}/clients/${id}`);
    const data: ApiResponse<Client> = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Erreur lors du chargement du client');
    }
    return data.data;
  },

  updateClientCRM: async (id: number, crmData: Partial<Client>): Promise<Client> => {
    const res = await fetch(`${API_BASE_URL}/clients/${id}/crm`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(crmData),
    });
    const data: ApiResponse<Client> = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Erreur lors de la mise à jour du client');
    }
    return data.data;
  },

  getClientsByCategorie: async (categorie: string): Promise<Client[]> => {
    const res = await fetch(`${API_BASE_URL}/clients/categorie/${categorie}`);
    const data: ApiResponse<Client[]> = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  },

  getClientActivites: async (clientId: number): Promise<Activite[]> => {
    const res = await fetch(`${API_BASE_URL}/clients/${clientId}/activites`);
    const data: ApiResponse<Activite[]> = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  },

  getClientDevis: async (clientId: number): Promise<Devis[]> => {
    const res = await fetch(`${API_BASE_URL}/clients/${clientId}/devis`);
    const data: ApiResponse<Devis[]> = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  },

  // ---- Devis API ----
  getDevis: async (): Promise<Devis[]> => {
    const res = await fetch(`${API_BASE_URL}/devis`);
    const data: ApiResponse<Devis[]> = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  },

  getDevisById: async (id: number): Promise<Devis> => {
    const res = await fetch(`${API_BASE_URL}/devis/${id}`);
    const data: ApiResponse<Devis> = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Erreur lors du chargement du devis');
    }
    return data.data;
  },

  createDevis: async (devisData: Partial<Devis>): Promise<Devis> => {
    const res = await fetch(`${API_BASE_URL}/devis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(devisData),
    });
    const data: ApiResponse<Devis> = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Erreur lors de la création du devis');
    }
    return data.data;
  },

  updateDevis: async (id: number, devisData: Partial<Devis>): Promise<Devis> => {
    const res = await fetch(`${API_BASE_URL}/devis/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(devisData),
    });
    const data: ApiResponse<Devis> = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Erreur lors de la mise à jour du devis');
    }
    return data.data;
  },

  updateDevisStatut: async (id: number, statut: string): Promise<Devis> => {
    const res = await fetch(`${API_BASE_URL}/devis/${id}/statut`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut }),
    });
    const data: ApiResponse<Devis> = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Erreur lors du changement de statut');
    }
    return data.data;
  },

  getDevisStats: async (): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/devis/stats`);
    const data: ApiResponse<any> = await res.json();
    return data.data;
  },

  getDevisByStatut: async (statut: string): Promise<Devis[]> => {
    const res = await fetch(`${API_BASE_URL}/devis/statut/${statut}`);
    const data: ApiResponse<Devis[]> = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  },

  // ---- Contacts API ----
  getContactsByClient: async (clientId: number): Promise<Contact[]> => {
    const res = await fetch(`${API_BASE_URL}/contacts/client/${clientId}`);
    const data: ApiResponse<Contact[]> = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  },

  getContact: async (id: number): Promise<Contact> => {
    const res = await fetch(`${API_BASE_URL}/contacts/${id}`);
    const data: ApiResponse<Contact> = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Erreur lors du chargement du contact');
    }
    return data.data;
  },

  createContact: async (contactData: Partial<Contact>): Promise<Contact> => {
    const res = await fetch(`${API_BASE_URL}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData),
    });
    const data: ApiResponse<Contact> = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Erreur lors de la création du contact');
    }
    return data.data;
  },

  updateContact: async (id: number, contactData: Partial<Contact>): Promise<Contact> => {
    const res = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData),
    });
    const data: ApiResponse<Contact> = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Erreur lors de la mise à jour du contact');
    }
    return data.data;
  },

  deleteContact: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: 'DELETE',
    });
    const data: ApiResponse<null> = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Erreur lors de la suppression du contact');
    }
  },
};

export default crmApi;

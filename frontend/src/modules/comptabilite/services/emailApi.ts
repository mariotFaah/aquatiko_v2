// src/modules/comptabilite/services/emailApi.ts
import type { Facture } from '../types';

const API_BASE_URL = 'http://localhost:3001/api/comptabilite';

export const emailApi = {
  // Envoyer une relance pour une facture spécifique
  envoyerRelance: async (facture: Facture, messagePersonnalise?: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/email/relance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numero_facture: facture.numero_facture,
          email_client: facture.email,
          nom_client: facture.nom_tiers,
          montant: facture.total_ttc,
          jours_retard: Math.floor((new Date().getTime() - new Date(facture.echeance).getTime()) / (1000 * 60 * 60 * 24)),
          message_personnalise: messagePersonnalise
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi de la relance');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur API relance:', error);
      throw new Error('Impossible d\'envoyer la relance. Vérifiez la connexion au serveur.');
    }
  },

  // Envoyer des relances groupées
  envoyerRelancesGroupées: async (factures: Facture[]): Promise<{ success: boolean; message: string; details: any }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/email/relances-groupees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          factures: factures.map(facture => ({
            numero_facture: facture.numero_facture,
            email_client: facture.email,
            nom_client: facture.nom_tiers,
            montant: facture.total_ttc,
            jours_retard: Math.floor((new Date().getTime() - new Date(facture.echeance).getTime()) / (1000 * 60 * 60 * 24))
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi des relances groupées');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur API relances groupées:', error);
      throw new Error('Impossible d\'envoyer les relances groupées.');
    }
  }
};

export default emailApi;

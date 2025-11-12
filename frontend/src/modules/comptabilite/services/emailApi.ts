// src/modules/comptabilite/services/emailApi.ts
import type { Facture, RelanceData, RelanceResponse, RelancesGroupeesResponse } from '../types';

const API_BASE_URL = 'http://localhost:3001/api/comptabilite';

export const emailApi = {
  // Envoyer une relance pour une facture spécifique
  // emailApi.ts - Version finale simple
async envoyerRelance(facture: Facture, messagePersonnalise?: string): Promise<RelanceResponse> {
  try {
    // Le backend fournit maintenant directement l'email correct
    const emailCorrect = facture.email;

    if (!emailCorrect) {
      throw new Error('Aucun email disponible pour ce client');
    }

    const aujourdhui = new Date();
    const dateEcheance = facture.date_finale_paiement ? new Date(facture.date_finale_paiement) : aujourdhui;
    const joursRetard = Math.floor((aujourdhui.getTime() - dateEcheance.getTime()) / (1000 * 60 * 60 * 24));

    const relanceData: RelanceData = {
      numero_facture: facture.numero_facture ?? 0,
      email_client: emailCorrect,
      nom_client: facture.nom_tiers || 'Client',
      montant: facture.montant_restant || facture.total_ttc || 0,
      jours_retard: Math.max(joursRetard, 0),
      message_personnalise: messagePersonnalise
    };

    console.log('📧 Envoi relance AVEC EMAIL CORRECT:', relanceData);

    const response = await fetch(`${API_BASE_URL}/email/relance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(relanceData),
    });

    if (!response.ok) {
      throw new Error(`Erreur serveur: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error('❌ Erreur API relance:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    throw new Error(errorMessage);
  }
},

  // Envoyer des relances groupées
  async envoyerRelancesGroupees(factures: Facture[]): Promise<RelancesGroupeesResponse> {
    try {
      const relancesData = factures.map(facture => {
        const aujourdhui = new Date();
        const dateEcheance = facture.date_finale_paiement ? new Date(facture.date_finale_paiement) : aujourdhui;
        const joursRetard = Math.floor((aujourdhui.getTime() - dateEcheance.getTime()) / (1000 * 60 * 60 * 24));

        return {
          numero_facture: facture.numero_facture ?? 0,
          email_client: facture.email || 'client@example.com',
          nom_client: facture.nom_tiers || 'Client',
          montant: facture.montant_restant ?? facture.total_ttc ?? 0,
          jours_retard: Math.max(joursRetard, 0)
        };
      });

      console.log('📧 Envoi relances groupées:', relancesData.length, 'factures');

      const response = await fetch(`${API_BASE_URL}/email/relances-groupees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ factures: relancesData }),
      });

      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`);
      }

      const data: RelancesGroupeesResponse = await response.json();
      return data;

    } catch (error) {
      console.error('❌ Erreur API relance:', error);
      
      // ✅ CORRECTION : Gestion sécurisée du type error
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Impossible d\'envoyer la relance';
      
      throw new Error(errorMessage);
    }
  },

  // Tester la configuration email
  async testerConfiguration(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/email/test-config`);
      
      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Erreur API relances groupées:', error);
      
      // ✅ CORRECTION : Gestion sécurisée du type error
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Impossible d\'envoyer les relances groupées';
      
      throw new Error(errorMessage);
    }
  }
};

export default emailApi;
// src/modules/comptabilite/controllers/EmailController.js
import EmailService from '../services/EmailService.js';

class EmailController {
  constructor() {
    this.emailService = new EmailService();
  }

  async envoyerRelance(req, res) {
    try {
      const { numero_facture, email_client, nom_client, montant, jours_retard, message_personnalise } = req.body;

      if (!numero_facture || !email_client || !nom_client || !montant) {
        return res.status(400).json({
          success: false,
          message: 'Données manquantes pour l\'envoi de relance'
        });
      }

      const result = await this.emailService.envoyerRelance({
        numero_facture,
        email_client,
        nom_client,
        montant,
        jours_retard: jours_retard || 0,
        message_personnalise
      });

      res.json({
        success: true,
        message: `Relance envoyée à ${nom_client} (${email_client})`,
        data: result
      });

    } catch (error) {
      console.error('Erreur envoi relance:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async envoyerRelancesGroupees(req, res) {
    try {
      const { factures } = req.body;

      if (!factures || !Array.isArray(factures) || factures.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Liste de factures manquante ou vide'
        });
      }

      const result = await this.emailService.envoyerRelancesGroupees(factures);

      res.json({
        success: true,
        message: `${result.reussis}/${result.total} relance(s) envoyée(s) avec succès`,
        data: result
      });

    } catch (error) {
      console.error('Erreur envoi relances groupées:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async testEmail(req, res) {
    try {
      const result = await this.emailService.envoyerRelance({
        numero_facture: 999,
        email_client: 'test@aquatiko.mg',
        nom_client: 'Client Test',
        montant: 100000,
        jours_retard: 30
      });

      res.json({
        success: true,
        message: 'Email de test envoyé avec succès',
        data: result
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default EmailController;
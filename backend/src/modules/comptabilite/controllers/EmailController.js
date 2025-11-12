// src/modules/comptabilite/controllers/EmailController.js
import EmailService from '../services/EmailService.js';

export class EmailController {
  constructor() {
    this.emailService = new EmailService();
  }

  async envoyerRelance(req, res) {
    try {
      console.log('📧 Requête relance reçue:', req.body);
      
      const { numero_facture, email_client, nom_client, montant, jours_retard, message_personnalise } = req.body;

      // Validation des données requises
      if (!numero_facture || !email_client || !nom_client || !montant) {
        return res.status(400).json({
          success: false,
          message: 'Données manquantes: numero_facture, email_client, nom_client et montant sont requis'
        });
      }

      const resultat = await this.emailService.envoyerRelance({
        numero_facture,
        email_client,
        nom_client,
        montant,
        jours_retard: jours_retard || 0,
        message_personnalise
      });

      res.json({
        success: true,
        message: 'Relance envoyée avec succès',
        data: resultat
      });

    } catch (error) {
      console.error('❌ Erreur EmailController.envoyerRelance:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async envoyerRelancesGroupees(req, res) {
    try {
      console.log('📧 Requête relances groupées reçue:', req.body.factures?.length, 'factures');
      
      const { factures } = req.body;

      if (!factures || !Array.isArray(factures)) {
        return res.status(400).json({
          success: false,
          message: 'Tableau de factures requis'
        });
      }

      const resultat = await this.emailService.envoyerRelancesGroupees(factures);

      res.json({
        success: true,
        message: `Relances groupées envoyées: ${resultat.reussis}/${resultat.total} réussies`,
        data: resultat
      });

    } catch (error) {
      console.error('❌ Erreur EmailController.envoyerRelancesGroupees:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async testerConfiguration(req, res) {
    try {
      const resultat = await this.emailService.testConfiguration();
      
      res.json({
        success: true,
        message: 'Configuration email testée avec succès',
        data: resultat
      });

    } catch (error) {
      console.error('❌ Erreur test configuration email:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

// ✅ EXPORT CORRECT
export default EmailController;
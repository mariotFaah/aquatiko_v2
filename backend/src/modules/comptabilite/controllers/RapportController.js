// src/modules/comptabilite/controllers/RapportController.js
import { RapportService } from '../services/RapportService.js';
import { sendSuccess, sendError } from '../../../core/utils/response.js';

export class RapportController {
  constructor() {
    this.rapportService = new RapportService();
  }

  async bilan(req, res) {
    try {
      const { date_fin } = req.query;
      const bilan = await this.rapportService.genererBilan(date_fin);
      sendSuccess(res, bilan, 'Bilan généré avec succès');
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  async compteResultat(req, res) {
    try {
      const { date_debut, date_fin } = req.query;
      const resultat = await this.rapportService.genererCompteResultat(date_debut, date_fin);
      sendSuccess(res, resultat, 'Compte de résultat généré avec succès');
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  async tresorerie(req, res) {
    try {
      const { date_debut, date_fin } = req.query;
      const tresorerie = await this.rapportService.genererTresorerie(date_debut, date_fin);
      sendSuccess(res, tresorerie, 'Rapport de trésorerie généré avec succès');
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  async tva(req, res) {
    try {
      const { date_debut, date_fin } = req.query;
      const tva = await this.rapportService.genererRapportTVA(date_debut, date_fin);
      sendSuccess(res, tva, 'Déclaration TVA générée avec succès');
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }
}

export default RapportController;

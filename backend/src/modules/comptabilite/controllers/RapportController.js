// src/modules/comptabilite/controllers/RapportController.js
import { RapportService } from '../services/RapportService.js';
import { Response } from '../../../core/utils/response.js';

export class RapportController {  // <-- Doit avoir 'export'
  constructor() {
    this.rapportService = new RapportService();
  }

  async bilan(req, res) {
    try {
      const { date_fin } = req.query;
      const bilan = await this.rapportService.genererBilan(date_fin);
      Response.success(res, bilan);
    } catch (error) {
      Response.error(res, error.message);
    }
  }

  async compteResultat(req, res) {
    try {
      const { date_debut, date_fin } = req.query;
      const resultat = await this.rapportService.genererCompteResultat(date_debut, date_fin);
      Response.success(res, resultat);
    } catch (error) {
      Response.error(res, error.message);
    }
  }

  async tresorerie(req, res) {
    try {
      const { date_debut, date_fin } = req.query;
      const tresorerie = await this.rapportService.genererTresorerie(date_debut, date_fin);
      Response.success(res, tresorerie);
    } catch (error) {
      Response.error(res, error.message);
    }
  }

  async tva(req, res) {
    try {
      const { date_debut, date_fin } = req.query;
      const tva = await this.rapportService.genererRapportTVA(date_debut, date_fin);
      Response.success(res, tva);
    } catch (error) {
      Response.error(res, error.message);
    }
  }
}

// Ajouter aussi l'export par défaut
export default RapportController;
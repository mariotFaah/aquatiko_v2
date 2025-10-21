// src/modules/comptabilite/controllers/StatistiqueController.js
import { StatistiqueService } from '../services/StatistiqueService.js';
import { Response } from '../../../core/utils/response.js';

export class StatistiqueController {
  constructor() {
    this.statistiqueService = new StatistiqueService();
  }

  async getChiffreAffaire(req, res) {
    try {
      const { date_debut, date_fin } = req.query;
      const ca = await this.statistiqueService.getChiffreAffaire(date_debut, date_fin);
      Response.success(res, ca, 'Chiffre d\'affaire calculé avec succès');
    } catch (error) {
      Response.error(res, error.message);
    }
  }

  async getTopClients(req, res) {
    try {
      const { limit = 10 } = req.query;
      const topClients = await this.statistiqueService.getTopClients(parseInt(limit));
      Response.success(res, topClients, 'Top clients récupéré avec succès');
    } catch (error) {
      Response.error(res, error.message);
    }
  }

  async getTopProduits(req, res) {
    try {
      const { limit = 10 } = req.query;
      const topProduits = await this.statistiqueService.getTopProduits(parseInt(limit));
      Response.success(res, topProduits, 'Top produits récupéré avec succès');
    } catch (error) {
      Response.error(res, error.message);
    }
  }

  async getIndicateurs(req, res) {
    try {
      const indicateurs = await this.statistiqueService.getIndicateurs();
      Response.success(res, indicateurs, 'Indicateurs récupérés avec succès');
    } catch (error) {
      Response.error(res, error.message);
    }
  }
}

export default StatistiqueController;
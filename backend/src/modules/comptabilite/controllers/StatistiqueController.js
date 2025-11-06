// src/modules/comptabilite/controllers/StatistiqueController.js
import { StatistiqueService } from '../services/StatistiqueService.js';

export class StatistiqueController {
  constructor() {
    this.statistiqueService = new StatistiqueService();
  }

  async getChiffreAffaire(req, res) {
    try {
      const { date_debut, date_fin } = req.query;
      const ca = await this.statistiqueService.getChiffreAffaire(date_debut, date_fin);
      res.status(200).json({
        success: true,
        data: ca,
        message: 'Chiffre d\'affaire calculé avec succès',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Erreur StatistiqueController.getChiffreAffaire:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  async getTopClients(req, res) {
    try {
      const { limit = 10 } = req.query;
      const topClients = await this.statistiqueService.getTopClients(parseInt(limit));
      res.status(200).json({
        success: true,
        data: topClients,
        message: 'Top clients récupéré avec succès',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Erreur StatistiqueController.getTopClients:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  async getTopProduits(req, res) {
    try {
      const { limit = 10 } = req.query;
      const topProduits = await this.statistiqueService.getTopProduits(parseInt(limit));
      res.status(200).json({
        success: true,
        data: topProduits,
        message: 'Top produits récupéré avec succès',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Erreur StatistiqueController.getTopProduits:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  async getIndicateurs(req, res) {
    try {
      const indicateurs = await this.statistiqueService.getIndicateurs();
      res.status(200).json({
        success: true,
        data: indicateurs,
        message: 'Indicateurs récupérés avec succès',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Erreur StatistiqueController.getIndicateurs:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
}

export default StatistiqueController;
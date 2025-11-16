import { RelanceService } from '../services/RelanceService.js';
import { successResponse, errorResponse, notFoundResponse } from '../../../core/utils/response.js';

export class RelanceController {
  constructor() {
    this.relanceService = new RelanceService();
  }

  // Récupérer toutes les relances
  getAllRelances = async (req, res) => {
    try {
      const relances = await this.relanceService.getAllRelances();
      successResponse(res, relances, 'Relances récupérées avec succès');
    } catch (error) {
      console.error('Erreur RelanceController.getAllRelances:', error);
      errorResponse(res, error.message, 500);
    }
  };

  // Récupérer les relances d'un client
  getRelancesByClient = async (req, res) => {
    try {
      const { id } = req.params;
      const relances = await this.relanceService.getRelancesByClient(parseInt(id));
      successResponse(res, relances, 'Relances client récupérées avec succès');
    } catch (error) {
      console.error('Erreur RelanceController.getRelancesByClient:', error);
      errorResponse(res, error.message, 500);
    }
  };

  // Récupérer les relances par statut
  getRelancesByStatut = async (req, res) => {
    try {
      const { statut } = req.params;
      const relances = await this.relanceService.getRelancesByStatut(statut);
      successResponse(res, relances, `Relances ${statut} récupérées avec succès`);
    } catch (error) {
      console.error('Erreur RelanceController.getRelancesByStatut:', error);
      errorResponse(res, error.message, 500);
    }
  };

  // Créer une relance manuelle
  createRelance = async (req, res) => {
    try {
      const relanceData = req.body;
      const relance = await this.relanceService.createRelance(relanceData);
      successResponse(res, relance, 'Relance créée avec succès');
    } catch (error) {
      console.error('Erreur RelanceController.createRelance:', error);
      errorResponse(res, error.message, 400);
    }
  };

  // Mettre à jour le statut d'une relance
  updateRelanceStatut = async (req, res) => {
    try {
      const { id } = req.params;
      const { statut } = req.body;
      
      const relance = await this.relanceService.updateRelanceStatut(parseInt(id), statut);
      successResponse(res, relance, 'Statut relance mis à jour avec succès');
    } catch (error) {
      console.error('Erreur RelanceController.updateRelanceStatut:', error);
      errorResponse(res, error.message, 400);
    }
  };

  // Générer les relances automatiques (paiements + contrats)
  genererRelancesAutomatiques = async (req, res) => {
    try {
      const result = await this.relanceService.genererRelancesAutomatiques();
      successResponse(res, result, 'Relances automatiques générées avec succès');
    } catch (error) {
      console.error('Erreur RelanceController.genererRelancesAutomatiques:', error);
      errorResponse(res, error.message, 500);
    }
  };

  // Récupérer les statistiques des relances
  getStatsRelances = async (req, res) => {
    try {
      const stats = await this.relanceService.getStatsRelances();
      successResponse(res, stats, 'Statistiques relances récupérées avec succès');
    } catch (error) {
      console.error('Erreur RelanceController.getStatsRelances:', error);
      errorResponse(res, error.message, 500);
    }
  };
}

export default RelanceController;

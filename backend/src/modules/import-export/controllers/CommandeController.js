import CommandeService from '../services/CommandeService.js';
import { sendSuccess, sendError } from '../../../core/utils/response.js';

class CommandeController {
  constructor() {
    this.commandeService = new CommandeService();
  }

  getAll = async (req, res) => {
    try {
      const filters = req.query;
      const commandes = await this.commandeService.getAllCommandes(filters);
      sendSuccess(res, commandes, 'Liste des commandes récupérée avec succès');
    } catch (error) {
      sendError(res, 500, error.message);
    }
  };

  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const commande = await this.commandeService.getCommandeById(parseInt(id));
      sendSuccess(res, commande, 'Commande récupérée avec succès');
    } catch (error) {
      sendError(res, 404, error.message);
    }
  };

  create = async (req, res) => {
    try {
      const { lignes, ...commandeData } = req.body;
      const commande = await this.commandeService.createCommande(commandeData, lignes);
      sendSuccess(res, commande, 'Commande créée avec succès', 201);
    } catch (error) {
      sendError(res, 400, error.message);
    }
  };

  updateStatut = async (req, res) => {
    try {
      const { id } = req.params;
      const { statut } = req.body;
      const commande = await this.commandeService.updateCommandeStatut(parseInt(id), statut);
      sendSuccess(res, commande, 'Statut de la commande mis à jour avec succès');
    } catch (error) {
      sendError(res, 400, error.message);
    }
  };

  updateExpedition = async (req, res) => {
    try {
      const expeditionData = req.body;
      const commande = await this.commandeService.updateExpedition(expeditionData);
      sendSuccess(res, commande, 'Expédition mise à jour avec succès');
    } catch (error) {
      sendError(res, 400, error.message);
    }
  };

  updateCouts = async (req, res) => {
    try {
      const coutsData = req.body;
      const commande = await this.commandeService.updateCoutsLogistiques(coutsData);
      sendSuccess(res, commande, 'Coûts logistiques mis à jour avec succès');
    } catch (error) {
      sendError(res, 400, error.message);
    }
  };

  calculerMarge = async (req, res) => {
    try {
      const { id } = req.params;
      const marge = await this.commandeService.calculerMarge(parseInt(id));
      sendSuccess(res, marge, 'Calcul de marge effectué avec succès');
    } catch (error) {
      sendError(res, 400, error.message);
    }
  };
}

export default CommandeController;

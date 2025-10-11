// src/modules/comptabilite/controllers/PaiementController.js
import { PaiementService } from '../services/PaiementService.js';
import { Response } from '../../../core/utils/response.js';

export class PaiementController {
  constructor() {
    this.paiementService = new PaiementService();
  }

  async create(req, res) {
    try {
      const paiement = await this.paiementService.enregistrerPaiement(req.body);
      Response.success(res, paiement, 'Paiement enregistré avec succès');
    } catch (error) {
      Response.error(res, error.message);
    }
  }

  async getByFacture(req, res) {
    try {
      const { numero_facture } = req.params;
      const paiements = await this.paiementService.getPaiementsFacture(numero_facture);
      Response.success(res, paiements);
    } catch (error) {
      Response.error(res, error.message);
    }
  }

    async getAll(req, res) {
    try {
      const paiements = await this.paiementService.getPaiements();
      successResponse(res, paiements, 'Paiements récupérés avec succès');
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async getById(req, res) {
    try {
      const paiement = await this.paiementService.getPaiementById(req.params.id);
      if (!paiement) {
        return errorResponse(res, 'Paiement non trouvé', 404);
      }
      successResponse(res, paiement);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async update(req, res) {
    try {
      const paiementMaj = await this.paiementService.updatePaiement(req.params.id, req.body);
      successResponse(res, paiementMaj, 'Paiement mis à jour avec succès');
    } catch (error) {
      errorResponse(res, error.message);
    }
  }
}
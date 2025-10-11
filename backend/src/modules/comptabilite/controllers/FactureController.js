import { successResponse, errorResponse, createdResponse } from '../../../core/utils/response.js';
import { FacturationService } from '../services/FacturationService.js';

export class FactureController {
  constructor() {
    this.facturationService = new FacturationService();
  }

  async getAll(req, res) {
    try {
      const factures = await this.facturationService.getFactures();
      successResponse(res, factures, 'Factures récupérées avec succès');
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async create(req, res) {
    try {
      const nouvelleFacture = await this.facturationService.creerFacture(req.body);
      createdResponse(res, nouvelleFacture, 'Facture créée avec succès');
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async getById(req, res) {
    try {
      const facture = await this.facturationService.getFactureComplete(req.params.id);
      if (!facture) {
        return errorResponse(res, 'Facture non trouvée', 404);
      }
      successResponse(res, facture);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async update(req, res) {
    try {
      const factureMaj = await this.facturationService.updateFacture(req.params.id, req.body);
      successResponse(res, factureMaj, 'Facture mise à jour avec succès');
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async valider(req, res) {
    try {
      const factureValidee = await this.facturationService.validerFacture(req.params.id);
      successResponse(res, factureValidee, 'Facture validée avec succès');
    } catch (error) {
      errorResponse(res, error.message);
    }
  }
}

export default FactureController;
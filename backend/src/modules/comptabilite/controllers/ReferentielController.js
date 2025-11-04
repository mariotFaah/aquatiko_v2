import { ReferentielService } from '../services/ReferentielService.js';
import { successResponse, errorResponse } from '../../../core/utils/response.js';

export class ReferentielController {
  constructor() {
    this.referentielService = new ReferentielService();
  }

  async getModesPaiement(req, res) {
    try {
      const modes = await this.referentielService.getModesPaiement();
      successResponse(res, modes, 'Modes de paiement récupérés');
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async getTypesFacture(req, res) {
    try {
      const types = await this.referentielService.getTypesFacture();
      successResponse(res, types, 'Types de facture récupérés');
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async getTauxTVA(req, res) {
    try {
      const taux = await this.referentielService.getTauxTVA();
      successResponse(res, taux, 'Taux de TVA récupérés');
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async getPlanComptable(req, res) {
    try {
      const plan = await this.referentielService.getPlanComptable();
      successResponse(res, plan, 'Plan comptable récupéré');
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async addCompteComptable(req, res) {
  try {
    const compte = await this.referentielService.addCompteComptable(req.body);
    successResponse(res, compte, 'Compte comptable ajouté avec succès');
  } catch (error) {
    errorResponse(res, error.message);
  }
}
}
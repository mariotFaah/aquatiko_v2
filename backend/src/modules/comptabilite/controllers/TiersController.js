import { TiersService } from '../services/TiersService.js';
import { successResponse, errorResponse } from '../../../core/utils/response.js';

export class TiersController {
  constructor() {
    this.tiersService = new TiersService();
  }

  // GET /api/comptabilite/tiers
  getAll = async (req, res) => {
    try {
      const tiers = await this.tiersService.getTiers();
      successResponse(res, tiers, 'Liste des tiers récupérée avec succès');
    } catch (error) {
      errorResponse(res, error.message, 500);
    }
  };

  // GET /api/comptabilite/tiers/:id
  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const tiers = await this.tiersService.getTiersById(parseInt(id));
      successResponse(res, tiers, 'Tiers récupéré avec succès');
    } catch (error) {
      if (error.message === 'Tiers non trouvé') {
        errorResponse(res, error.message, 404);
      } else {
        errorResponse(res, error.message, 500);
      }
    }
  };

  // POST /api/comptabilite/tiers
  create = async (req, res) => {
    try {
      const tiers = await this.tiersService.createTiers(req.body);
      successResponse(res, tiers, 'Tiers créé avec succès', 201);
    } catch (error) {
      if (error.message.includes('existe déjà')) {
        errorResponse(res, error.message, 409);
      } else {
        errorResponse(res, error.message, 500);
      }
    }
  };

  // PUT /api/comptabilite/tiers/:id
  update = async (req, res) => {
    try {
      const { id } = req.params;
      const tiers = await this.tiersService.updateTiers(parseInt(id), req.body);
      successResponse(res, tiers, 'Tiers modifié avec succès');
    } catch (error) {
      if (error.message === 'Tiers non trouvé') {
        errorResponse(res, error.message, 404);
      } else if (error.message.includes('existe déjà')) {
        errorResponse(res, error.message, 409);
      } else {
        errorResponse(res, error.message, 500);
      }
    }
  };

  // DELETE /api/comptabilite/tiers/:id
  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.tiersService.deleteTiers(parseInt(id));
      successResponse(res, result, 'Tiers supprimé avec succès');
    } catch (error) {
      if (error.message === 'Tiers non trouvé') {
        errorResponse(res, error.message, 404);
      } else {
        errorResponse(res, error.message, 500);
      }
    }
  };
}

export default TiersController;
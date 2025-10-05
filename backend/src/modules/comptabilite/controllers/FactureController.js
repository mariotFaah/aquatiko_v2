import { FacturationService } from '../services/FacturationService.js';
import { successResponse, errorResponse } from '../../../core/utils/response.js';

export class FactureController {
  constructor() {
    this.facturationService = new FacturationService();
  }

  // GET /api/comptabilite/factures
  getAll = async (req, res) => {
    try {
      const factures = await this.facturationService.factureRepository.findAll();
      successResponse(res, factures, 'Liste des factures récupérée avec succès');
    } catch (error) {
      errorResponse(res, error.message, 500);
    }
  };

  // GET /api/comptabilite/factures/:id
  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const facture = await this.facturationService.getFactureComplete(parseInt(id));
      successResponse(res, facture, 'Facture récupérée avec succès');
    } catch (error) {
      if (error.message === 'Facture non trouvée') {
        errorResponse(res, error.message, 404);
      } else {
        errorResponse(res, error.message, 500);
      }
    }
  };

  // POST /api/comptabilite/factures
  create = async (req, res) => {
    try {
      const facture = await this.facturationService.creerFacture(req.body);
      successResponse(res, facture, 'Facture créée avec succès', 201);
    } catch (error) {
      if (error.message.includes('non trouvé')) {
        errorResponse(res, error.message, 404);
      } else {
        errorResponse(res, error.message, 500);
      }
    }
  };

  // PUT /api/comptabilite/factures/:id
  update = async (req, res) => {
    try {
      const { id } = req.params;
      const facture = await this.facturationService.factureRepository.update(parseInt(id), req.body);
      successResponse(res, facture, 'Facture modifiée avec succès');
    } catch (error) {
      if (error.message === 'Facture non trouvée') {
        errorResponse(res, error.message, 404);
      } else {
        errorResponse(res, error.message, 500);
      }
    }
  };

  // ✅ AJOUT: Méthode DELETE manquante
  delete = async (req, res) => {
    try {
      const { id } = req.params;
      // Pour l'instant, on va juste désactiver la facture
      const result = await this.facturationService.factureRepository.update(parseInt(id), {
        statut: 'annulee'
      });
      successResponse(res, result, 'Facture annulée avec succès');
    } catch (error) {
      if (error.message === 'Facture non trouvée') {
        errorResponse(res, error.message, 404);
      } else {
        errorResponse(res, error.message, 500);
      }
    }
  };

  // POST /api/comptabilite/factures/:id/valider
  validerFacture = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.facturationService.validerFacture(parseInt(id));
      successResponse(res, result, 'Facture validée avec succès');
    } catch (error) {
      if (error.message === 'Facture non trouvée') {
        errorResponse(res, error.message, 404);
      } else if (error.message.includes('déjà validée') || error.message.includes('sans lignes')) {
        errorResponse(res, error.message, 400);
      } else {
        errorResponse(res, error.message, 500);
      }
    }
  };

  // GET /api/comptabilite/factures/:id/lignes
  getLignesFacture = async (req, res) => {
    try {
      const { id } = req.params;
      const lignes = await this.facturationService.ligneFactureRepository.findByFacture(parseInt(id));
      successResponse(res, lignes, 'Lignes de facture récupérées avec succès');
    } catch (error) {
      errorResponse(res, error.message, 500);
    }
  };
}

export default FactureController;
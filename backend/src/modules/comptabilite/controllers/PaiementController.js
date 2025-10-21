// src/modules/comptabilite/controllers/PaiementController.js
import { PaiementService } from '../services/PaiementService.js';
import { successResponse, errorResponse, createdResponse } from '../../../core/utils/response.js'; // CORRECTION: Utiliser les bonnes fonctions

export class PaiementController {
  constructor() {
    this.paiementService = new PaiementService();
  }

  async create(req, res) {
    try {
      console.log('🔄 Création paiement avec données:', req.body);
      const paiement = await this.paiementService.enregistrerPaiement(req.body);
      createdResponse(res, paiement, 'Paiement enregistré avec succès'); // CORRECTION: createdResponse
    } catch (error) {
      console.error('❌ Erreur création paiement:', error);
      errorResponse(res, error.message);
    }
  }

  // Dans PaiementController.js - méthode getByFacture
// Dans PaiementController.js - méthode getByFacture
async getByFacture(req, res) {
  try {
    // CORRECTION: Utiliser 'numero_facture' qui correspond à la route
    const { numero_facture } = req.params;
    console.log('🔍 Récupération paiements pour facture:', numero_facture);
    
    if (!numero_facture) {
      return errorResponse(res, 'Numéro de facture requis', 400);
    }
    
    const paiements = await this.paiementService.getPaiementsFacture(numero_facture);
    successResponse(res, paiements, 'Succès');
  } catch (error) {
    console.error('❌ Erreur récupération paiements facture:', error);
    errorResponse(res, error.message);
  }
}

  async getAll(req, res) {
    try {
      const paiements = await this.paiementService.getPaiements();
      successResponse(res, paiements, 'Paiements récupérés avec succès'); // CORRECTION: successResponse
    } catch (error) {
      console.error('❌ Erreur récupération paiements:', error);
      errorResponse(res, error.message);
    }
  }

  async getById(req, res) {
    try {
      const paiement = await this.paiementService.getPaiementById(req.params.id);
      if (!paiement) {
        return errorResponse(res, 'Paiement non trouvé', 404); // CORRECTION: errorResponse
      }
      successResponse(res, paiement); // CORRECTION: successResponse
    } catch (error) {
      console.error('❌ Erreur récupération paiement:', error);
      errorResponse(res, error.message);
    }
  }

  async update(req, res) {
    try {
      const paiementMaj = await this.paiementService.updatePaiement(req.params.id, req.body);
      successResponse(res, paiementMaj, 'Paiement mis à jour avec succès'); // CORRECTION: successResponse
    } catch (error) {
      console.error('❌ Erreur mise à jour paiement:', error);
      errorResponse(res, error.message);
    }
  }
}
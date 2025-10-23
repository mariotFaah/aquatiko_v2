// src/modules/comptabilite/controllers/EcritureComptableController.js
import { EcritureComptableRepository } from '../repositories/EcritureComptableRepository.js';
import { sendSuccess, sendError } from '../../../core/utils/response.js';

export class EcritureComptableController {
  constructor() {
    this.ecritureRepo = new EcritureComptableRepository();
  }

  // GET /ecritures - Liste toutes les écritures
  async getAll(req, res) {
    try {
      const { journal, date_debut, date_fin, page = 1, limit = 50 } = req.query;
      
      let ecritures;
      
      if (journal) {
        // Écritures par journal
        ecritures = await this.ecritureRepo.findByJournal(journal, date_debut, date_fin);
      } else {
        // Toutes les écritures avec pagination
        const offset = (page - 1) * limit;
        ecritures = await this.ecritureRepo.query()
          .orderBy('date', 'desc')
          .orderBy('numero_ecriture', 'desc')
          .offset(offset)
          .limit(parseInt(limit));
      }
      
      sendSuccess(res, ecritures, 'Écritures récupérées avec succès');
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  // GET /ecritures/:id - Détail d'une écriture
  async getById(req, res) {
    try {
      const { id } = req.params;
      const ecriture = await this.ecritureRepo.query()
        .where('id_ecriture', id)
        .first();
      
      if (!ecriture) {
        return sendError(res, 404, 'Écriture non trouvée');
      }
      
      sendSuccess(res, ecriture, 'Écriture récupérée avec succès');
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  // POST /ecritures - Créer une écriture manuelle
  async create(req, res) {
    try {
      const ecritureData = req.body;
      
      // Générer le numéro d'écriture
      const numero_ecriture = await this.ecritureRepo.getNextNumeroEcriture();
      
      const ecritureComplete = {
        ...ecritureData,
        numero_ecriture,
        date: ecritureData.date || new Date()
      };
      
      const nouvelleEcriture = await this.ecritureRepo.create(ecritureComplete);
      sendSuccess(res, nouvelleEcriture, 'Écriture créée avec succès', 201);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  // GET /ecritures/journal/:type - Écritures par journal
  async getByJournal(req, res) {
    try {
      const { type } = req.params;
      const { date_debut, date_fin } = req.query;
      
      const ecritures = await this.ecritureRepo.findByJournal(type, date_debut, date_fin);
      sendSuccess(res, ecritures, `Écritures du journal ${type} récupérées`);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }
}

export default EcritureComptableController;

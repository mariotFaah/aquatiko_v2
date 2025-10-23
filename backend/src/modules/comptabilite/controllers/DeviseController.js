import { DeviseService } from '../services/DeviseService.js';
import { sendSuccess, sendError } from '../../../core/utils/response.js';

export class DeviseController {
  constructor() {
    this.deviseService = new DeviseService();
  }

  async convertir(req, res) {
    try {
      const { montant, devise_source, devise_cible, date } = req.body;
      const resultat = await this.deviseService.convertirMontant(
        montant, 
        devise_source, 
        devise_cible, 
        date
      );
      sendSuccess(res, { montant_converti: resultat }, 'Conversion effectuée avec succès');
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  async updateTaux(req, res) {
    try {
      const { devise_source, devise_cible, taux, date_effet } = req.body;
      const nouveauTaux = await this.deviseService.mettreAJourTaux(
        devise_source,
        devise_cible,
        taux,
        date_effet
      );
      sendSuccess(res, nouveauTaux, 'Taux de change mis à jour');
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  // AJOUTER CETTE MÉTHODE
  async getTauxActifs(req, res) {
    try {
      const tauxActifs = await this.deviseService.tauxChangeRepo.findAllActifs();
      sendSuccess(res, tauxActifs, 'Taux de change actifs récupérés');
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }
}

export default DeviseController;

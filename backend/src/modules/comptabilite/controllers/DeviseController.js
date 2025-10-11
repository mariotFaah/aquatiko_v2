import { DeviseService } from '../services/DeviseService.js';
import { Response } from '../../../core/utils/response.js';

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
      Response.success(res, { montant_converti: resultat });
    } catch (error) {
      Response.error(res, error.message);
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
      Response.success(res, nouveauTaux, 'Taux de change mis à jour');
    } catch (error) {
      Response.error(res, error.message);
    }
  }

  // AJOUTER CETTE MÉTHODE
  async getTauxActifs(req, res) {
    try {
      const tauxActifs = await this.deviseService.tauxChangeRepo.findAllActifs();
      Response.success(res, tauxActifs, 'Taux de change actifs récupérés');
    } catch (error) {
      Response.error(res, error.message);
    }
  }
}

export default DeviseController;
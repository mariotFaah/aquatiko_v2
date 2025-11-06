// src/modules/comptabilite/controllers/FactureController.js
import { successResponse, errorResponse, createdResponse } from '../../../core/utils/response.js';
import { FacturationService } from '../services/FacturationService.js';
import { JournalService } from '../services/JournalService.js';
import { FactureRepository } from '../repositories/FactureRepository.js';

export class FactureController {
  constructor() {
    this.facturationService = new FacturationService();
    this.journalService = new JournalService();
    this.factureRepository = new FactureRepository();
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
      
      //  Régénérer les totaux AVANT de générer les écritures
        // S'assurer que les totaux sont calculés
        // Récupérer la facture avec les totaux actualisés
        // Vérifier que les totaux ne sont pas nuls avant de générer les écritures


      if (req.body.statut === 'validee') {
        await this.facturationService.calculerTotalsFacture(nouvelleFacture.numero_facture);
        
        
        const factureAvecTotaux = await this.facturationService.getFactureComplete(nouvelleFacture.numero_facture);
        
        if (factureAvecTotaux.total_ttc > 0) {
          await this.journalService.genererEcritureFacture(factureAvecTotaux);
          console.log('✅ Écritures comptables générées pour la facture', nouvelleFacture.numero_facture);
        } else {
          console.warn('⚠️ Facture sans totaux, écritures non générées');
        }
      }
      
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
      const numero = req.params.id;
      const factureData = req.body;

      // Valider que la facture existe
      const factureExistante = await this.factureRepository.findById(numero);
      if (!factureExistante) {
        return res.status(404).json({
          success: false,
          message: 'Facture non trouvée'
        });
      }

      // Mettre à jour la facture via le service
      const factureModifiee = await this.facturationService.updateFacture(numero, factureData);

      successResponse(res, factureModifiee, 'Facture modifiée avec succès');

    } catch (error) {
      console.error('❌ Erreur modification facture:', error);
      errorResponse(res, error.message);
    }
  }



   async annuler(req, res) {
    try {
      const factureAnnulee = await this.facturationService.annulerFacture(req.params.id);
      
      successResponse(res, factureAnnulee, 'Facture annulée avec succès');
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  // MODIFIER: Méthode valider pour inclure la gestion du stock
  async valider(req, res) {
    try {
      const factureValidee = await this.facturationService.validerFacture(req.params.id);
      
      // Recalculer les totaux
      await this.facturationService.calculerTotalsFacture(req.params.id);

      const factureAvecTotaux = await this.facturationService.getFactureComplete(req.params.id);
      
      // Générer les écritures comptables
      await this.journalService.genererEcritureFacture(factureAvecTotaux);
      
      successResponse(res, factureValidee, 'Facture validée avec succès');
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

   async enregistrerPaiement(req, res) {
    try {
      const { id } = req.params;
      const paiementData = {
        ...req.body,
        numero_facture: parseInt(id)
      };

      const resultat = await this.facturationService.enregistrerPaiement(paiementData);
      
      createdResponse(res, resultat, 'Paiement enregistré avec succès');
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  // 🆕 NOUVELLE MÉTHODE : Historique des paiements d'une facture
  async getHistoriquePaiements(req, res) {
    try {
      const { id } = req.params;
      const historique = await this.facturationService.getHistoriquePaiements(id);
      
      successResponse(res, historique, 'Historique des paiements récupéré');
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  // 🆕 NOUVELLE MÉTHODE : Calculer les pénalités de retard
  async calculerPenalites(req, res) {
    try {
      const { id } = req.params;
      const penalites = await this.facturationService.calculerPenalites(id);
      
      successResponse(res, penalites, 'Pénalités calculées');
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  // 🆕 NOUVELLE MÉTHODE : Configurer le paiement flexible
  async configurerPaiement(req, res) {
    try {
      const { id } = req.params;
      const config = req.body;
      
      const factureConfig = await this.facturationService.configurerPaiementFlexible(id, config);
      
      successResponse(res, factureConfig, 'Configuration de paiement mise à jour');
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  // 🆕 NOUVELLE MÉTHODE : Récupérer les factures en retard
  async getFacturesEnRetard(req, res) {
    try {
      const facturesEnRetard = await this.facturationService.verifierFacturesEnRetard();
      
      successResponse(res, facturesEnRetard, 'Factures en retard récupérées');
    } catch (error) {
      errorResponse(res, error.message);
    }
  }
}

export default FactureController;
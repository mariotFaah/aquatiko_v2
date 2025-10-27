// src/modules/comptabilite/services/PaiementService.js
import { PaiementRepository } from '../repositories/PaiementRepository.js';
import { FactureRepository } from '../repositories/FactureRepository.js';
import { DeviseService } from './DeviseService.js';
import { JournalService } from './JournalService.js';

export class PaiementService {
  constructor() {
    this.paiementRepo = new PaiementRepository();
    this.factureRepo = new FactureRepository();
    this.deviseService = new DeviseService();
    this.journalService = new JournalService();
  }

  async enregistrerPaiement(paiementData) {
    try {
      
      const numeroFacture = paiementData.numero_facture;
      
      if (!numeroFacture) {
        throw new Error('Numéro de facture requis');
      }

      const facture = await this.factureRepo.findByNumero(numeroFacture);

      if (!facture) {
        throw new Error(`Facture ${numeroFacture} non trouvée`);
      }


      // Supprimer les champs qui n'existent pas dans la table
      const { id_facture, mode_reglement, ...paiementCorrige } = paiementData;

      const paiementComplet = {
        ...paiementCorrige,
        numero_facture: numeroFacture,
        date_paiement: paiementData.date_paiement || new Date(),
        devise: facture.devise,
        taux_change: 1,
        statut: paiementData.statut || 'validé',
        // Utiliser mode_paiement (nom correct de la colonne)
        mode_paiement: paiementData.mode_reglement || paiementData.mode_paiement
      };

      console.log('💾 Données paiement corrigées:', paiementComplet);

      const paiement = await this.paiementRepo.create(paiementComplet);

      // GÉNÉRER L'ÉCRITURE COMPTABLE DU PAIEMENT
      await this.journalService.genererEcriturePaiement(paiement);

      await this.mettreAJourStatutFacture(numeroFacture);

      return paiement;
    } catch (error) {
      console.error('❌ Erreur PaiementService.enregistrerPaiement:', error);
      throw new Error(`Erreur lors de la création du paiement: ${error.message}`);
    }
  }

  async mettreAJourStatutFacture(numero_facture) {
    try {
      const totalPaiements = await this.paiementRepo.getTotalPaiementsFacture(numero_facture);
      const facture = await this.factureRepo.findByNumero(numero_facture);

      let nouveauStatut = facture.statut;
      
      if (totalPaiements >= facture.total_ttc && facture.statut !== 'validee') {
        nouveauStatut = 'validee';
      }

      if (nouveauStatut !== facture.statut) {
        await this.factureRepo.update(numero_facture, { statut: nouveauStatut });
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour statut facture:', error);
    }
  }
  
  async getPaiementsFacture(numero_facture) {
    return this.paiementRepo.findByFacture(numero_facture);
  }

  async getPaiements() {
    return this.paiementRepo.getPaiements();
  }

  async getPaiementById(id_paiement) {
    return this.paiementRepo.findById(id_paiement);
  }

  async updatePaiement(id_paiement, data) {
    return this.paiementRepo.update(id_paiement, data);
  }
}
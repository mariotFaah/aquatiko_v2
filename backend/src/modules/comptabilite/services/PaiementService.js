// src/modules/comptabilite/services/PaiementService.js
import { PaiementRepository } from '../repositories/PaiementRepository.js';
import { FactureRepository } from '../repositories/FactureRepository.js';
import { DeviseService } from './DeviseService.js';

export class PaiementService {
  constructor() {
    this.paiementRepo = new PaiementRepository();
    this.factureRepo = new FactureRepository();
    this.deviseService = new DeviseService();
  }

   async enregistrerPaiement(paiementData) {
  const facture = await this.factureRepo.findByNumero(paiementData.numero_facture);
  
  if (!facture) {
    throw new Error('Facture non trouvée');
  }

  // AJOUTER la date de paiement
  const paiementComplet = {
    ...paiementData,
    date_paiement: paiementData.date_paiement || new Date(), // ← CORRECTION ICI
    devise: facture.devise,
    taux_change: 1
  };

  const paiement = await this.paiementRepo.create(paiementComplet);

  await this.mettreAJourStatutFacture(paiementData.numero_facture);
  return paiement;
}

    async mettreAJourStatutFacture(numero_facture) {
    const totalPaiements = await this.paiementRepo.getTotalPaiementsFacture(numero_facture);
    const facture = await this.factureRepo.findByNumero(numero_facture);

    // Pour l'instant, on garde le statut 'validee' même si payée
    // On pourrait ajouter un champ 'payee' séparé si nécessaire
    let nouveauStatut = facture.statut;
    
    if (totalPaiements >= facture.total_ttc && facture.statut !== 'validee') {
      nouveauStatut = 'validee'; // La facture reste 'validee' même quand payée
    }

    if (nouveauStatut !== facture.statut) {
      await this.factureRepo.update(numero_facture, { statut: nouveauStatut });
    }
  }
  
  async getPaiementsFacture(numero_facture) {
    return this.paiementRepo.findByFacture(numero_facture);
  }
}